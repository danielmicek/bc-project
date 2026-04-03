import express from "express";
import pool from "../database.js";
import getQuestionsBasedOnDifficulty from "../steps/questionsSteps.js";
import {
    addTest,
    calculateTestScore,
    decreaseAiLimit,
    getAiLimit,
    getBestTestScore,
    getCurrentTimestamp,
    getGrade,
    getMedal,
    getRandomElementsFromArray,
    shuffleArray
} from "../steps/testSteps.js";
import 'dotenv/config';
import {ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";

const router = express.Router();

// ------------------GET REQUEST - GET ALL USER's TESTS-----------------------------------------------------------------
// sending back an object of: {all tests, best test score}
router.get("/getAllUsersTests/:userId", (request, response)=> {
    let requestedUserId = request.params.userId;

    const getQuery = "SELECT * FROM \"Tests\" WHERE fk_user_id = $1 ORDER BY timestamp";
    pool.query(getQuery, [requestedUserId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404).send({error: "Žiadne testy", tests: result.rows, bestScore: 0});
            }
            else{
                let foundTests = result.rows.map(test => ({
                    testId: test.test_id,
                    percentage: test.percentage,
                    timestamp: test.timestamp,
                    grade: test.grade,
                    medal: test.medal,
                    structure: test.structure,
                    difficulty: test.difficulty
                }))
                const bestTestScore = getBestTestScore(foundTests)
                response.status(200).send({tests: foundTests, bestScore: bestTestScore});
            }
        })
        .catch((error) => {
            response.status(500).send("Chyba na strane servera");
            console.log(error);
        })
});

// ------------------GET REQUEST - GET TEST BY TEST ID-----------------------------------------------------------------
router.get("/getTestByTestId/:testId/:userId", ClerkExpressRequireAuth(), (request, response)=> {
    let testId = request.params.testId;
    let requestedUserId = request.params.userId;
    const { userId: loggedInUserId } = request.auth;

    // check whether is the user calling for his own tests
    if (loggedInUserId !== requestedUserId) {
        return response.status(403).json("Zakázaná akcia!");
    }

    const getQuery = "SELECT * FROM \"Tests\" WHERE test_id = $1 ORDER BY timestamp";
    pool.query(getQuery, [testId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404).send({error: "Test nenájdený", tests: result.rows, bestScore: 0});
            }
            else{
                response.status(200).send({
                    results: {
                        percentage: result.rows[0].percentage,
                        points: result.rows[0].points,
                        medal: result.rows[0].medal,
                        grade: result.rows[0].grade
                    },
                    structure: result.rows[0].structure
                });
            }
        })
        .catch((error) => {
            response.status(500).send("Chyba na strane servera");
            console.log(error);
        })
});

// ------------------GET REQUEST - GET CERTIFICATE BY ID--------------------------------------------------------------------
router.get("/getCertificateById/:certId", (request, response)=> {
    const certId = request.params.certId;

    const getQuery = "SELECT * FROM \"Certificates\" WHERE certificate_id = $1";
    pool.query(getQuery, [certId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404).send({certificateFound: false});
            }
            else{
                response.status(200).send({certificateFound: true, certificateOwner: result.rows[0].username});
            }
        })
        .catch((error) => {
            response.status(500).send("Chyba na strane servera");
            console.log(error);
        })
});

// -------------------------POST REQUEST - POST CERTIFICATE TO DB----------------------------------------------------
router.post("/postCertificate", ClerkExpressRequireAuth(), async (request, response) => {
    const certId = request.body["certId"];
    const username = request.body["username"];

    const { userId: loggedInUserId } = request.auth;

    //TODO  fixni, ze posles aj userID z frontendu a porovnas to ci sa to rovna s loggedInUserId

    // check whether user who created this certificate is the one logged in
    // preventing such a situation when someone would want to post certificate to other user
    /*if (loggedInUserId !== userId) {
        return response.status(403).send("Zakázaná akcia! Túto akciu môže vykonať iba vlastník profilu.");
    }*/

    const insertQuery = "INSERT INTO \"Certificates\" VALUES ($1, $2)";
    pool.query(insertQuery, [certId, username])
        .then((result) => {
            console.log(result);
            response.status(200).send({message: "CertificateID added successfully."});
        })
        .catch((error) => {
            console.log(error);
            response.status(500).send("Chyba na strane servera")
        })
})

//----------------------------GET REQUEST - CREATE TEST-----------------------------------------------------------------
// create test based on testDifficulty
router.get("/createTest/:testDifficulty", ClerkExpressRequireAuth(), async (request, response)=> {
    //first check if there is enough AI requests left for generation and for evaluation
    const ai_limit = await getAiLimit()
    if(ai_limit <= 1) {
        response.status(429).send("AI limit vyčerpaný, skúste znova neskôr.");
        return
    }

    let testDifficulty = request.params.testDifficulty;
    const EASY = "easy"
    const MEDIUM = "medium"
    const HARD = "hard"
    let easyQuestions
    let mediumQuestions
    let hardQuestions
    let mediumFreeAnswerQuestions
    let hardFreeAnswerQuestions
    let generatedTestQuestions = [];
    let NUM_OF_EASY_QUESTIONS;
    let NUM_OF_MEDIUM_QUESTIONS;
    let NUM_OF_HARD_QUESTIONS;
    let NUM_OF_MEDIUM_FREE_ANSWER_QUESTIONS;
    let NUM_OF_HARD_FREE_ANSWER_QUESTIONS;

    try{
        easyQuestions = await getQuestionsBasedOnDifficulty(EASY, testDifficulty)
        mediumQuestions = await getQuestionsBasedOnDifficulty(MEDIUM, testDifficulty)
        if(testDifficulty === "medium" || testDifficulty === "hard") {
            hardQuestions = await getQuestionsBasedOnDifficulty(HARD, testDifficulty)
            mediumFreeAnswerQuestions = await getQuestionsBasedOnDifficulty(MEDIUM, testDifficulty, true)
            hardFreeAnswerQuestions = await getQuestionsBasedOnDifficulty(HARD, testDifficulty, true)
        }

        switch (testDifficulty) {
            case "easy":
                NUM_OF_EASY_QUESTIONS = 7
                NUM_OF_MEDIUM_QUESTIONS = 3
                break
            case "medium":
                NUM_OF_EASY_QUESTIONS = 5
                NUM_OF_MEDIUM_QUESTIONS = 8
                NUM_OF_HARD_QUESTIONS = 5
                NUM_OF_MEDIUM_FREE_ANSWER_QUESTIONS = 1;
                NUM_OF_HARD_FREE_ANSWER_QUESTIONS = 1;
                break
            case "hard":
                NUM_OF_EASY_QUESTIONS = 5
                NUM_OF_MEDIUM_QUESTIONS = 8
                NUM_OF_HARD_QUESTIONS = 13
                NUM_OF_MEDIUM_FREE_ANSWER_QUESTIONS = 2;
                NUM_OF_HARD_FREE_ANSWER_QUESTIONS = 2;
        }

        // add easy questions
        getRandomElementsFromArray(easyQuestions, generatedTestQuestions, NUM_OF_EASY_QUESTIONS)
        // add medium questions
        getRandomElementsFromArray(mediumQuestions, generatedTestQuestions, NUM_OF_MEDIUM_QUESTIONS)
        // add hard and free_answer questions (medium and hard test)
        if(testDifficulty === "medium" || testDifficulty === "hard") {
            getRandomElementsFromArray(hardQuestions, generatedTestQuestions, NUM_OF_HARD_QUESTIONS)
            getRandomElementsFromArray(mediumFreeAnswerQuestions, generatedTestQuestions, NUM_OF_MEDIUM_FREE_ANSWER_QUESTIONS)
            getRandomElementsFromArray(hardFreeAnswerQuestions, generatedTestQuestions, NUM_OF_HARD_FREE_ANSWER_QUESTIONS)
        }

        //shuffle each question's answers (from a,b,c,d,e to e.g. c,a,d,b,e  -> e is always last)
        for(const question of generatedTestQuestions){
            if(question.free_answer) continue;
            const lastElement = question.answers[question.answers.length - 1]
            const allElementsExceptLast = question.answers.slice(0, -1)

            shuffleArray(allElementsExceptLast)
            question.answers = [...allElementsExceptLast, lastElement];   // the last choice - "neodpovedať" stays last after shuffle
        }
        /*// TODO funguje to, zakomentoval som to aby to nezralo tokeny pri kazdom nacitani stranky
        const aiResponse =
            await getAiResponse(
                "You will receive JSON. Edit it in-place.\n" +
                "GOAL: Paraphrase each item.body and each answers[i].text EXCEPT the last answer in each answers array. Preserve meaning strictly.\n" +
                "OUTPUT (MUST):\n" +
                "- Return ONLY raw JSON (no markdown, no ```).\n" +
                "- Must start with [ or { and end with ] or }.\n" +
                "- Keep EXACT same JSON structure: same keys, nesting, array lengths, and order.\n" +
                "- Do NOT add/remove/rename keys. Do NOT add extra fields or text.\n" +
                "- Do NOT change ids, numbers, names, units, code, punctuation that changes meaning or language (KEEP SLOVAK)\n" +
                "- Leave the last answers element unchanged (answers[answers.length-1]).\n" +
                "INPUT:\n" + JSON.stringify(generatedTestQuestions)
            )

        if(!aiResponse){
            response.status(500).send({errorMessage: "Error during crating the test"});
            return
        }

        try{
            console.log(aiResponse);
            generatedTestQuestions = JSON.parse(aiResponse)
        } catch(err){
            console.log(err);
            return
        }*/

        // decrease ai requests limit
        await decreaseAiLimit()
        console.log("decreased");
        response.status(200).send({createdTest: generatedTestQuestions});
    }
    catch(err){
        console.log("Error during crating the test");
        response.status(500).send("Chyba na strane servera");
    }
})

// -------------------------POST REQUEST - SUBMIT TEST---------------------------------------------------------------
// first calculate TEST SCORE
// then save the test to db
// eventually send the calculated score to frontend
router.post("/submitTest", ClerkExpressRequireAuth(), async (request, response)=> {
    const userId = request.body["userId"];
    const testStructure = request.body["testStructure"];
    const testDifficulty = request.body["testDifficulty"];
    const testId = request.body["testId"];
    const fullPoints = testDifficulty === "easy" ? 13 : testDifficulty === "medium" ? 40 : 70

    const calculatedResult = await calculateTestScore(testStructure, testDifficulty)
    const calculatedResultPercentage = ((calculatedResult/fullPoints) * 100).toFixed(2)
    const grade = getGrade(calculatedResultPercentage)
    const medal = getMedal(grade, testDifficulty)

    try {
        const inserted = await addTest(
            testId,
            calculatedResult,
            calculatedResultPercentage,
            getCurrentTimestamp(),
            grade,
            medal,
            userId,
            testStructure,
            testDifficulty
        );

        if (!inserted) {
            return response.status(500).send("Chyba na strane servera");
        }

        return response.status(200).send({
            results: {
                percentage: calculatedResultPercentage,
                points: calculatedResult,
                medal: medal,
                grade: grade
            },
            structure: testStructure
        });
    }
    catch (error) {
        console.error(error);
        return response.status(500).send("Chyba na strane servera");
    }
});

// ------------------GET REQUEST - GET AI LIMIT OF REMAINING REQUESTS FOR THE DAY---------------------------------------
router.get("/getAiLimit", ClerkExpressRequireAuth(), (request, response)=> {

    const getQuery = "SELECT * FROM \"AI_limit\"";

    pool.query(getQuery)
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(400).send("AI limit nenájdený");
            }
            else{
                const foundLimit = result.rows[0]
                response.status(200).send({
                    aiLimit: foundLimit.ai_limit
                });
            }

        })
        .catch((error) => {
            response.status(500).send("Chyba na strane servera");
            console.log(error);
        })
});

export default router;


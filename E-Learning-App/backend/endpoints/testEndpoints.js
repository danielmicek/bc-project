import express from "express";
import pool from "../database.js";
import getQuestionsBasedOnDifficulty from "../steps/questionsSteps.js";
import {
    addTest,
    calculateTestScore,
    createTestSessionToken,
    decreaseAiLimit,
    getAiLimit,
    getBestTestScore,
    getCurrentTimestamp,
    getGrade,
    getMedal,
    getRandomElementsFromArray,
    getTestLengthMinutes,
    shuffleArray,
    verifyTestSessionToken
} from "../steps/testSteps.js";
import 'dotenv/config';
import {ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";
import {getAiResponse} from "../steps/geminiSteps.js";

const router = express.Router();
const TEST_SESSION_SECRET = process.env.TEST_SESSION_SECRET;

// ------------------GET REQUEST - GET ALL USER's TESTS-----------------------------------------------------------------
// sending back an object of: {all tests, best test score}
router.get("/getAllUsersTests/:userId", (request, response)=> {
    let requestedUserId = request.params.userId;

    const getQuery = "SELECT * FROM \"Tests\" WHERE fk_user_id = $1 ORDER BY timestamp";
    pool.query(getQuery, [requestedUserId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404).send("Žiadne testy");
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

    const getQuery = `SELECT u.username AS username FROM \"Certificates\" c 
                  JOIN \"Users\" u ON c.user_id = u.user_id
                  WHERE certificate_id = $1`;
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
    const userId = request.body["userId"];

    const { userId: loggedInUserId } = request.auth;

    // check whether user who created this certificate is the one logged in
    // preventing such a situation when someone would want to post certificate to other user
    if (loggedInUserId !== userId) {
        return response.status(403).send("Zakázaná akcia! Túto akciu môže vykonať iba vlastník profilu.");
    }

    const insertQuery = "INSERT INTO \"Certificates\" VALUES ($1, $2)";
    pool.query(insertQuery, [certId, userId])
        .then((result) => {
            console.log(result);
            response.status(200).send({message: "Certifikát úspešne pridaný"});
        })
        .catch((error) => {
            console.log(error);
            response.status(500).send("Chyba na strane servera")
        })
})

//----------------------------GET REQUEST - CREATE TEST-----------------------------------------------------------------
// create test based on testDifficulty
router.get("/createTest/:testDifficulty", ClerkExpressRequireAuth(), async (request, response)=> {
    if (!TEST_SESSION_SECRET) {
        return response.status(500).send("Server configuration error");
    }

    //first check if there is enough AI requests left for generation and for evaluation
    const ai_limit = await getAiLimit()
    if(ai_limit <= 1) {
        response.status(429).send("AI limit vyčerpaný, skúste znova neskôr.");
        return
    }

    const testDifficulty = request.params.testDifficulty;
    const testId = request.query.testId;
    const { userId: loggedInUserId } = request.auth;
    const testLengthMinutes = getTestLengthMinutes(testDifficulty);

    if (typeof testId !== "string" || testId.length === 0) {
        response.status(400).send("Chýbajúce testID");
        return
    }

    if (testLengthMinutes === null) {
        response.status(400).send("Neplatná obtiažnosť testu");
        return
    }
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
            response.status(500).send({errorMessage: "Chyba na strane servera"});
            return
        }

        try{
            console.log(aiResponse);
            let cleanedAiResponse = aiResponse.trim();

            if (cleanedAiResponse.startsWith("```json")) {
                cleanedAiResponse = cleanedAiResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "");
            }
            else if (cleanedAiResponse.startsWith("```")) {
                cleanedAiResponse = cleanedAiResponse.replace(/^```\s*/, "").replace(/\s*```$/, "");
            }

            generatedTestQuestions = JSON.parse(cleanedAiResponse)
        } catch(err){
            console.log(err);
            response.status(500).send({errorMessage: "Chyba na strane servera"});
            return
        }

        // decrease ai requests limit
        await decreaseAiLimit()

        const issuedAt = Date.now();
        const expiresAt = issuedAt + (testLengthMinutes * 60 * 1000);
        const testSessionToken = createTestSessionToken({
            userId: loggedInUserId,
            testId,
            testDifficulty,
            issuedAt,
            expiresAt,
        }, TEST_SESSION_SECRET);

        response.status(200).send({
            createdTest: generatedTestQuestions,
            testSessionToken,
            expiresAt,
            testLengthMinutes,
        });
    }
    catch(err){
        console.log("Error during crating the test");
        if(err.status === 503){
            response.status(503).send("Chyba na strane Gemini API");
            return
        }
        response.status(500).send("Chyba na strane servera");
    }
})

// -------------------------POST REQUEST - SUBMIT TEST---------------------------------------------------------------
// first calculate TEST SCORE
// then save the test to db
// eventually send the calculated score to frontend
router.post("/submitTest", ClerkExpressRequireAuth(), async (request, response)=> {
    if (!TEST_SESSION_SECRET) {
        return response.status(500).send("Server configuration error");
    }

    const userId = request.body["userId"];
    const testStructure = request.body["testStructure"];
    const testDifficulty = request.body["testDifficulty"];
    const testId = request.body["testId"];
    const testSessionToken = request.body["testSessionToken"];
    const fullPoints = testDifficulty === "easy" ? 13 : testDifficulty === "medium" ? 40 : 70

    const { userId: loggedInUserId } = request.auth;
    // check whether user calling this endpoint is the one logged in
    if (loggedInUserId !== userId) {
        return response.status(403).send("Zakázaná akcia! Túto akciu môže vykonať iba vlastník profilu.");
    }

    const tokenPayload = verifyTestSessionToken(testSessionToken, TEST_SESSION_SECRET);
    if (!tokenPayload) { // in case something was changed on the frontend
        return response.status(403).send("Neplatný test token");
    }

    if ( // in case something was changed on the frontend
        tokenPayload.userId !== userId ||
        tokenPayload.testId !== testId ||
        tokenPayload.testDifficulty !== testDifficulty
    ) {
        return response.status(403).send("Neplatný test token");
    }

    if (Date.now() > Number(tokenPayload.expiresAt)) { // in case time was changed on the frontend
        return response.status(408).send("Čas na test vypršal");
    }

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

// ------------------PUT REQUEST - RESET AI LIMIT EVERY DAY BY EXTRERNAL PAGE WHICH CALLS THIS ENDPOINT-----------------
router.get("/resetAiLimit", async (req, res) => {
    // validation
    if (req.headers["ai_limit_reset_secret"] !== process.env.AI_LIMIT_RESET_SECRET) {
        return res.status(403).send("Forbidden");
    }

    await pool.query('UPDATE public."AI_limit" SET ai_limit = 20');
    res.status(200).send("AI limit resetnutý");
});

// ------------------GET REQUEST - KEEP BACKEND ALIVE BECAUSE OF SERVER SETTINGS----------------------------------------
// the server turns off the backend after 15 minutes of inactivity, os we need to aritificially keep it alive
router.get("/keepBackendAlive", (request, response)=> {
    response.status(204).send("OK");
});

export default router;


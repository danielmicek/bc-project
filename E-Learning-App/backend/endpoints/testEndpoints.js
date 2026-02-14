import express from "express";
import pool from "../database.js";
import getQuestionsBasedOnDifficulty from "../steps/questionsSteps.js";
import {
    addTest,
    calculateTestScore,
    getBestTestScore,
    getCurrentDate,
    getGrade,
    getMedal,
    getRandomElementsFromArray,
    shuffleArray
} from "../steps/testSteps.js";

const router = express.Router();

// ------------------GET REQUEST - GET ALL USER's TESTS-----------------------------------------------------------------
// sending back an object of: {all tests, best test score}
router.get("/getAllUsersTests/:userId", (request, response)=> {
    let userId = request.params.userId;

    const getQuery = "SELECT * FROM tests WHERE fk_user_id = $1";
    pool.query(getQuery, [userId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404).send("No tests found");
            }
            else{
                let foundTests = result.rows.map(test => ({
                    testId: test.test_id,
                    percentage: test.percentage,
                    date: test.date,
                    grade: test.grade,
                    medal: test.medal,
                    structure: test.structure,
                    difficulty: test.difficulty
                }))
                const bestTestScore = getBestTestScore(foundTests)
                console.log("------------------------------------");
                console.log(bestTestScore);
                console.log(foundTests);
                response.status(200).send({tests: foundTests, bestScore: bestTestScore});
            }
        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});

//----------------------------GET REQUEST - CREATE TEST-----------------------------------------------------------------
// create test based on testDifficulty
router.get("/createTest/:testDifficulty", async (request, response)=> {
    let testDifficulty = request.params.testDifficulty;
    const EASY = "easy"
    const MEDIUM = "medium"
    const HARD = "hard"
    let easyQuestions
    let mediumQuestions
    let hardQuestions
    let generatedTestQuestions = [];
    let NUM_OF_EASY_QUESTIONS;
    let NUM_OF_MEDIUM_QUESTIONS;
    let NUM_OF_HARD_QUESTIONS

    try{
        easyQuestions = await getQuestionsBasedOnDifficulty(EASY, testDifficulty)
        mediumQuestions = await getQuestionsBasedOnDifficulty(MEDIUM, testDifficulty)
        if(testDifficulty === "medium" || testDifficulty === "hard") hardQuestions = await getQuestionsBasedOnDifficulty(HARD, testDifficulty)

        switch (testDifficulty) {
            case "easy":
                NUM_OF_EASY_QUESTIONS = 7
                NUM_OF_MEDIUM_QUESTIONS = 3
                break
            case "medium":
                NUM_OF_EASY_QUESTIONS = 5
                NUM_OF_MEDIUM_QUESTIONS = 10
                NUM_OF_HARD_QUESTIONS = 5
                break
            case "hard":
                NUM_OF_EASY_QUESTIONS = 5
                NUM_OF_MEDIUM_QUESTIONS = 10
                NUM_OF_HARD_QUESTIONS = 15
        }

        // add easy questions
        getRandomElementsFromArray(easyQuestions, generatedTestQuestions, NUM_OF_EASY_QUESTIONS)
        // add medium questions
        getRandomElementsFromArray(mediumQuestions, generatedTestQuestions, NUM_OF_MEDIUM_QUESTIONS)
        // add hard questions (medium and hard test)
        if(testDifficulty === "medium" || testDifficulty === "hard") getRandomElementsFromArray(hardQuestions, generatedTestQuestions, NUM_OF_HARD_QUESTIONS)

        //shuffle each question's answers (from a,b,c,d,e to e.g. c,a,d,b,e  -> e is always last)
        for(const question of generatedTestQuestions){
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

        response.status(200).send({createdTest: generatedTestQuestions});
    }
    catch(err){
        console.log("Error during crating the test");
        response.status(500).send({errorMessage: "Error during crating the test"});
    }
})

// -------------------------POST REQUEST - SUBMIT OF TEST---------------------------------------------------------------
// first calculate TEST SCORE
// then save the test to db
// eventually send the calculated score to frontend
router.post("/submitTest", (request, response)=> {
    const userId = request.body["userId"];
    const testStructure = request.body["testStructure"];
    const testDifficulty = request.body["testDifficulty"];
    const testId = request.body["testId"];
    const fullPoints = testDifficulty === "easy" ? 13 : testDifficulty === "medium" ? 40 : 70
    console.log(testStructure[0].answers);

    const calculatedResult = calculateTestScore(testStructure, testDifficulty)
    const calculatedResultPercentagentage = ((calculatedResult/fullPoints) * 100).toFixed(2)
    const grade = getGrade(calculatedResultPercentagentage)

    if(addTest(testId, calculatedResultPercentagentage, getCurrentDate(), grade, getMedal(grade, testDifficulty), userId, testStructure, testDifficulty) === false){
        response.status(500).send("Error posting test to database.");
    }

    try {
        response.status(200).send({testResult: calculatedResultPercentagentage, testStructure: testStructure});
    }
    catch(error) {
        response.status(500).send("Error during calculating test results.");
    }
});

export default router;
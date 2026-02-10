import express from "express";
import pool from "../database.js";

const router = express.Router();

// ------------------GET REQUEST - GET ALL USER's TESTS---------------------------------------------------------------
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
                    structure: JSON.parse(test.structure),
                    difficulty: test.difficulty
                }))
                response.status(200).send(foundTests);
            }
        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});

// ------------------POST REQUEST - POST TEST TO DBS---------------------------------------------------------------
router.post("/addTest", async (request, response) => {
    const test_id = request.body["testId"];
    const percentage = request.body["percentage"];
    const date = request.body["date"];
    const grade = request.body["grade"];
    const medal = request.body["medal"];
    const fk_user_id = request.body["userId"];
    const structure = request.body["structure"];
    const difficulty = request.body["difficulty"];

    const insertQuery = "INSERT INTO tests (test_id, percentage, date, grade, medal, fk_user_id, structure, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    pool.query(insertQuery, [test_id, percentage, date, grade, medal, fk_user_id, JSON.stringify(structure), difficulty])
        .then((result) => {
            console.log(result);
            response.status(200).send("Test added: " + test_id + "  Status code: " + response.statusCode);
        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
})

// ------------------POST REQUEST - CALCULATION OF TEST SCORE---------------------------------------------------------------
router.post("/calculateTestScore", (request, response)=> {
    const test = request.body["testStructure"];
    const testDifficulty = request.body["testDifficulty"];
    const EASY_QUESTION_POINTS = 3
    const MEDIUM_QUESTION_POINTS = 5
    const HARD_QUESTION_POINTS = 7
    const PENALTY = testDifficulty === "medium" ? 0.2 : testDifficulty === "hard" ? 0.3 : 0.1  // percentage; 0.1 penalty for easy test is used in case when a user does not select all the answers in the given time
    let points = 0

    for(const question of test){ // jednotliva otazka z testu
        if(question.answers.at(-1).selected) continue;  // ak je zvolena moznost "neodpovedat", teda posledna odpoved, nic sa nestane -> pripocita sa 0
        for(const answer of question.answers.slice(0, -1)){  // jednotliva odpoved k otazke - neberieme do uvahy poslednu odpoved, tu vyhodnocujeme samostatne v riadkiu nad tymto
            // EASY QUESTION - SINGLESELECT ONLY
            if(question.difficulty === "easy"){  // single otazka
                if(answer.selected && answer.correct) points += EASY_QUESTION_POINTS;  // ak je otazka odkiknuta a aj spravna => + body
                else if(testDifficulty !== "easy" && answer.selected && !answer.correct) points -= (EASY_QUESTION_POINTS * PENALTY)
            }
            // MEDIUM MULTISELECT QUESTION
            else if(question.difficulty === "medium" && question.multiselect){
                if(answer.selected && answer.correct) points += MEDIUM_QUESTION_POINTS / getNumberOfCorrectAnswers(question.answers);
                else if(testDifficulty !== "easy" && answer.selected && !answer.correct) points -= (MEDIUM_QUESTION_POINTS * PENALTY) / (question.answers.length - 1) // testDifficulty != easy pretoze pri easy testoch sa nestrhavaju boidy za nespravnu oodpoved
            }
            // MEDIUM SINGLESELECT QUESTION
            else if(question.difficulty === "medium" && !question.multiselect){
                if(answer.selected && answer.correct) points += MEDIUM_QUESTION_POINTS
                else if(testDifficulty !== "easy" && answer.selected && !answer.correct) points -= MEDIUM_QUESTION_POINTS * PENALTY
            }
            // HARD MULTISELECT QUESTION
            else if(question.difficulty === "hard" && question.multiselect){
                if(answer.selected && answer.correct) points += HARD_QUESTION_POINTS / getNumberOfCorrectAnswers(question.answers);
                else if(testDifficulty !== "easy" && answer.selected && !answer.correct) points -= (HARD_QUESTION_POINTS * PENALTY) / (question.answers.length - 1)  // minus 1 pretoze neberiem do uvahy poslednu moznost ktora je neodpovedat
            }
            // HARD SINGLESELECT QUESTION
            else if(question.difficulty === "hard" && !question.multiselect){
                if(answer.selected && answer.correct) points += HARD_QUESTION_POINTS;
                else if(testDifficulty !== "easy" && answer.selected && !answer.correct) points -= HARD_QUESTION_POINTS * PENALTY
            }
        }
    }

    if(points < 0) points = 0
    try {
        response.status(200).send({points: points.toFixed(2)});
    }
    catch(error) {
        response.status(500).send("Error during calculating test results.");
    }
});

//             ------HELPER METHOD--------
function getNumberOfCorrectAnswers(answers) {
    return answers.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.correct ? 1 : 0), 0);
}

export default router;
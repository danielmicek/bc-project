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
                    structure: test.structure,
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
async function addTest(test_id, percentage, date, grade, medal, fk_user_id, structure, difficulty) {
    const insertQuery = "INSERT INTO tests (test_id, percentage, date, grade, medal, fk_user_id, structure, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    const result = await pool.query(insertQuery, [test_id, percentage, date, grade, medal, fk_user_id, JSON.stringify(structure), difficulty]);
    return result.rowCount > 0 // if INSERT was succesfull, rows are of length at least 1 (in this case it is = 1)
}

// ------------------POST REQUEST - SUBMIT OF TEST---------------------------------------------------------------
// first calculate TEST SCORE
// then save the test to db
// eventually send the calculated score to frontend
router.post("/submitTest", (request, response)=> {
    const userId = request.body["userId"];
    const testStructure = request.body["testStructure"];
    const testDifficulty = request.body["testDifficulty"];
    const testId = request.body["testId"];
    const fullPoints = testDifficulty === "easy" ? 13 : testDifficulty === "medium" ? 40 : 70

    const calculatedResult = calculateTestScore(testStructure, testDifficulty)
    const calculatedResultPercantage = ((calculatedResult/fullPoints) * 100).toFixed(2)
    const grade = getGrade(calculatedResultPercantage)

    if(addTest(testId, calculatedResultPercantage, getCurrentDate(), grade, getMedal(grade, testDifficulty), userId, testStructure, testDifficulty) === false){
        response.status(500).send("Error posting test to database.");
    }

    try {
        response.status(200).send({testResult: calculatedResultPercantage});
    }
    catch(error) {
        response.status(500).send("Error during calculating test results.");
    }
});

// ------------------POST REQUEST - CALCULATION OF TEST SCORE---------------------------------------------------------------
function calculateTestScore(test, testDifficulty){
    const EASY_QUESTION_POINTS = 1
    const MEDIUM_QUESTION_POINTS = 3
    const HARD_QUESTION_POINTS = 5
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
    return points;
}

//             ------HELPER METHODS--------
function getNumberOfCorrectAnswers(answers) {
    return answers.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.correct ? 1 : 0), 0);
}

function getCurrentDate(){
    return new Date().toJSON().slice(0, 10);
}

function getGrade(testResult){
    if(testResult >= 92) return "A"
    else if(testResult < 92 && testResult >= 83) return "B"
    else if(testResult < 83 && testResult >= 74) return "C"
    else if(testResult < 74 && testResult >= 65) return "D"
    else if(testResult < 65 && testResult >= 56) return "E"
    else return "Fx"
}

function getMedal(grade, testDifficulty){
    if(testDifficulty === "hard" && grade === "A") return "Gold"
    else if(testDifficulty === "medium" && grade === "A") return "Silver"
    else if(testDifficulty === "easy" && grade === "A") return "Bronze"
    else return "None"
}

export default router;
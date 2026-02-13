// -----------------------------CALCULATION OF TEST SCORE---------------------------------------------------------------
import pool from "../database.js";

export function calculateTestScore(test, testDifficulty){
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

// count of correct answers for multiselect question
function getNumberOfCorrectAnswers(answers) {
    return answers.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.correct ? 1 : 0), 0);
}

// post test to db
export async function addTest(test_id, percentage, date, grade, medal, fk_user_id, structure, difficulty) {
    const insertQuery = "INSERT INTO tests (test_id, percentage, date, grade, medal, fk_user_id, structure, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    const result = await pool.query(insertQuery, [test_id, percentage, date, grade, medal, fk_user_id, JSON.stringify(structure), difficulty]);
    return result.rowCount > 0 // if INSERT was successful, rows are of length at least 1 (in this case it is = 1)
}

// get the best score of all user's tests
export function getBestTestScore(tests){
    if(tests.length === 0) return "N/A"
    let bestScore = 0
    for(const test of tests){
        if(test.percentage > bestScore) bestScore = test.percentage
    }
    return bestScore;
}

// select random elements from an array by first shuffling it and then picking the first x elements
export function getRandomElementsFromArray(fromArray, toArray, numberOfElements) {
    shuffleArray(fromArray)
    toArray.push(...fromArray.slice(0, numberOfElements));
}

// shuffle given array
export function shuffleArray(array) {
    let currentIndex = array.length;

    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

// get the current date
export function getCurrentDate(){
    return new Date().toJSON().slice(0, 10);
}

// get grade using FEI STU grade scale
export function getGrade(testResult){
    if(testResult >= 92) return "A"
    else if(testResult < 92 && testResult >= 83) return "B"
    else if(testResult < 83 && testResult >= 74) return "C"
    else if(testResult < 74 && testResult >= 65) return "D"
    else if(testResult < 65 && testResult >= 56) return "E"
    else return "Fx"
}

// get a medal if the grade was A
export function getMedal(grade, testDifficulty){
    if(testDifficulty === "hard" && grade === "A") return "Gold"
    else if(testDifficulty === "medium" && grade === "A") return "Silver"
    else if(testDifficulty === "easy" && grade === "A") return "Bronze"
    else return "None"
}
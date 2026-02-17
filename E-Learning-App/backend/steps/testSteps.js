// -----------------------------CALCULATION OF TEST SCORE---------------------------------------------------------------
import pool from "../database.js";

export function calculateTestScore(test, testDifficulty){
    const EASY_QUESTION_POINTS = 1
    const MEDIUM_QUESTION_POINTS = 3
    const HARD_QUESTION_POINTS = 5
    const PENALTY = testDifficulty === "medium" ? 0.2 : testDifficulty === "hard" ? 0.3 : 0.1  // percentage; 0.1 penalty for easy test is used in case when a user does not select all the answers in the given time
    let points = 0
    let notAnsweredCount = 0

    for(const question of test){ // single question of test
        if(question.answers.at(-1).selected) continue;  // if option "neodpovedat" is selected - the last option, nothing happens -> +0 points
        for(const answer of question.answers.slice(0, -1)){  // single answer of question - not working with the last one, it is handled above
            // EASY QUESTION - SINGLESELECT ONLY
            if(question.difficulty === "easy"){  // single question
                if(answer.selected && answer.correct) points += EASY_QUESTION_POINTS;  // selected and correct => + points
                else if(answer.selected && !answer.correct) points -= (EASY_QUESTION_POINTS * PENALTY) // selected and incorrect
                else if(!answer.selected) notAnsweredCount++
            }
            // MEDIUM MULTISELECT QUESTION
            else if(question.difficulty === "medium" && question.multiselect){
                if(answer.selected && answer.correct) points += MEDIUM_QUESTION_POINTS / getNumberOfCorrectAnswers(question.answers);
                else if(testDifficulty !== "easy" && answer.selected && !answer.correct) points -= (MEDIUM_QUESTION_POINTS * PENALTY) / (question.answers.length - 1) // testDifficulty != easy pretoze pri easy testoch sa nestrhavaju boidy za nespravnu oodpoved
                else if(!answer.selected) notAnsweredCount++
            }
            // MEDIUM SINGLESELECT QUESTION
            else if(question.difficulty === "medium" && !question.multiselect){
                if(answer.selected && answer.correct) points += MEDIUM_QUESTION_POINTS
                else if(testDifficulty !== "easy" && answer.selected && !answer.correct) points -= MEDIUM_QUESTION_POINTS * PENALTY
                else if(!answer.selected) notAnsweredCount++
            }
            // HARD MULTISELECT QUESTION
            else if(question.difficulty === "hard" && question.multiselect){
                if(answer.selected && answer.correct) points += HARD_QUESTION_POINTS / getNumberOfCorrectAnswers(question.answers);
                else if(testDifficulty !== "easy" && answer.selected && !answer.correct) points -= (HARD_QUESTION_POINTS * PENALTY) / (question.answers.length - 1)  // minus 1 pretoze neberiem do uvahy poslednu moznost ktora je neodpovedat
                else if(!answer.selected) notAnsweredCount++
            }
            // HARD SINGLESELECT QUESTION
            else if(question.difficulty === "hard" && !question.multiselect){
                if(answer.selected && answer.correct) points += HARD_QUESTION_POINTS;
                else if(testDifficulty !== "easy" && answer.selected && !answer.correct) points -= HARD_QUESTION_POINTS * PENALTY
                else if(!answer.selected) notAnsweredCount++
            }
        }
        // in case all 5 answers are NOT selected -> - points
        if(notAnsweredCount === 5) points -= question.difficulty === "easy" ? 1 : question.difficulty === "medium" ? 2 : 3
        notAnsweredCount = 0
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
export async function addTest(test_id, points, percentage, timestamp, grade, medal, fk_user_id, structure, difficulty) {
    const insertQuery = "INSERT INTO tests (test_id, points, percentage, timestamp, grade, medal, fk_user_id, structure, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
    const result = await pool.query(insertQuery, [test_id, points, percentage, timestamp, grade, medal, fk_user_id, JSON.stringify(structure), difficulty]);
    return result.rowCount > 0 // if INSERT was successful, rows are of length at least 1 (in this case it is = 1)
}

// get the best score of all user's tests
export function getBestTestScore(tests){
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

// get the current timestamp
export function getCurrentTimestamp(){
    return new Date().toJSON();
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
    else return "none"
}
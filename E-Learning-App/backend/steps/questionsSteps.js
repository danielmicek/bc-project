import pool from "../database.js";


// ------------------GET QUESTIONS & ANSWERS OF SPECIFIC DIFFICULTY-----------------------------------------------------
// first I get all the questions according to difficulty and multiselect (if it is true/false) -> the result1.rows is a list of all those questions
// -> if it is set to true, it can be either singleselect or multiselect, not only multiselect (practically it means that the multiselect is allowed, it is not mandatory)
// then, with id from each row, I find its answers in the answers table and add it to the finalList -> question from questions table + answers from answers table
export default async function getQuestionsBasedOnDifficulty(questionDifficulty, testDifficulty,) {
    const multiselectFlag = testDifficulty !== "easy";
    const finalList = []

    const getQuestionsQuery = "SELECT * FROM questions WHERE difficulty = $1 " + (multiselectFlag === false ? "AND multiselect = false;" : ";")
    const getAnswersQuery = "SELECT * FROM answers WHERE question_id = $1;"

    const result1 = await pool.query(getQuestionsQuery, [questionDifficulty]);
    if (result1.rowCount === 0) return null

    for (let i = 0; i < result1.rows.length; i++) {
        const result2 = await pool.query(getAnswersQuery, [result1.rows[i].id]);
        if (result2.rowCount === 0) return null
        else {
            finalList.push({...result1.rows[i], answers: result2.rows});
        }
    }
    return finalList;
}
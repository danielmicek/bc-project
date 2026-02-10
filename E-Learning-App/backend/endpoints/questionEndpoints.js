import express from "express";
import pool from "../database.js";

const router = express.Router();

// ------------------GET REQUEST - GET QUESTIONS & ANSWERS OF SPECIFIC DIFFICULTY---------------------------------------------------------------

// first I get all the questions according to difficulty and multiselect (if it is true/false) -> the result1.rows is a list of all those questions
// -> if it is set to true, ic can be either singleselect or multiselect, not only multiselect (practically it means that the multiselect is allowed, it is not mandatory)
// then, with id from each row, I find its answers in the answers table and add it to the finalList -> question from questions table + answers from answers table
router.get("/getQuestionsBasedOnDifficulty/:difficulty", (request, response)=> {
    let difficulty = request.params.difficulty;
    const finalList = []

    const getQuestionsQuery = "SELECT * FROM questions WHERE difficulty = $1;"
    const getAnswersQuery = "SELECT * FROM answers WHERE question_id = $1;"

    pool.query(getQuestionsQuery, [difficulty])
        .then(async (result1) => {

            if (result1.rows.length === 0) {
                response.status(404).send("No " + difficulty + " questions found.");
            }
            else{
                for(let i = 0; i < result1.rows.length; i++) {
                    await pool.query(getAnswersQuery, [result1.rows[i].id])
                        .then((result2) => {
                            if (result2.rows.length === 0) {
                                response.status(404).send("Invalid format of question in database.");
                            }
                            else {
                                finalList.push({...result1.rows[i], answers: result2.rows});
                                console.log(finalList);
                            }
                        })
                }

                response.status(200).send(finalList);
            }

        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});

export default router;
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

    const insertQuery = "INSERT INTO tests (test_id, percentage, date, grade, medal, fk_user_id, structure) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    pool.query(insertQuery, [test_id, percentage, date, grade, medal, fk_user_id, JSON.stringify(structure)])
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
router.post("/api/calculateTestScore/testStructure", (request, response)=> {
    // TODO
});

export default router;
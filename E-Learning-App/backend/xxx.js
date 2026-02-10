import jsonQuestions from "./tmp.json" with {type: "json"};
import pool from "./database.js";

import dotenv from 'dotenv';
import express from 'express';

// TODO DELETE THIS FILE
// tento file sluzi iba cisto na naplneni 100 otazok do databazy
// aby si tento file pustil dat do konzoly node xxx.js

dotenv.config(); // Load environment variables from .env file
const PORT = process.env.BACKEND_PORT || 3000;
const app = express();
app.use(express.json());

async function tmp() {
    console.log("aaaa started");
    let a = 1;
    try {
        for (const q of jsonQuestions) {
            // insert question
            const questionResult = await pool.query(
                `INSERT INTO questions (body, multiselect, difficulty, id)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id`,
                [q.body, q.multiselect, q.difficulty, q.id]
            );

            const questionId = questionResult.rows[0].id;
            console.log("questionId: " +  questionId);

            // insert answers
            for (const ans of q.answers) {
                const key = Object.keys(ans).find(k => k !== "correct");
                const text = ans[key];

                await pool.query(
                    `INSERT INTO answers (text, correct, question_id, id)
                     VALUES ($1, $2, $3, $4)`,
                    [text, ans.correct, questionId, a++]
                );
            }
        }


        console.log("✅ Questions inserted successfully");
    } catch (err) {
        console.error("❌ Insert failed:", err);
    }
}

tmp()
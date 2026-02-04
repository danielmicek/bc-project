/* global process */
import dotenv from 'dotenv';
import express from 'express';
import cors from "cors";
import pool from "./database.js";
import {GoogleGenAI} from "@google/genai";

dotenv.config(); // Load environment variables from .env file
const PORT = process.env.BACKEND_PORT || 3000;
const AI_KEY = process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({apiKey: AI_KEY});
const app = express();
const router = express.Router();
app.use(express.json());

//this enables React frontend (running on port 5173) to make API calls to your Express backend (port 3000).
app.use(cors({
    origin: "http://localhost:5173"
}));

// ------------------GET REQUEST - GET USER---------------------------------------------------------------
app.get("/api/getUser/:username", (request, response)=> {
    let username = request.params.username;


    const getQuery = "SELECT user_id, username, email, image_url FROM users WHERE username = $1";

    pool.query(getQuery, [username])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404);
                response.send("user_id: " + username + " not found.  Status code: " + response.statusCode);
            }
            else{
                response.status(200);
                const foundUser = result.rows[0]
                response.send({
                    userId: foundUser.user_id,
                    userName: foundUser.username,
                    userEmail: foundUser.email,
                    imageUrl: foundUser.image_url
                });
            }

        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});


// ------------------POST REQUEST - POST USER TO DBS---------------------------------------------------------------
app.post("/api/addUser", async (request, response) => {
    const user_id = request.body["user_id"];
    const username = request.body["username"];
    const email = request.body["email"];
    const image_url = request.body["image_url"];


    const insertQuery = "INSERT INTO users (user_id, username, email, image_url) VALUES ($1, $2, $3, $4)";
    pool.query(insertQuery, [user_id, username, email, image_url])
        .then((result) => {
        console.log(result);
        response.status(200);
        response.send("User added: " + username + "  Status code: " + response.statusCode);
    })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
})


// ------------------POST REQUEST - POST TEST TO DBS---------------------------------------------------------------
app.post("/api/addTest", async (request, response) => {
    const test_id = request.body["test_id"];
    const points = request.body["points"];
    const date = request.body["date"];
    const grade = request.body["grade"];
    const medal = request.body["medal"];
    const fk_user_id = request.body["fk_user_id"];
    const structure = request.body["structure"];

    const insertQuery = "INSERT INTO tests (test_id, points, date, grade, medal, fk_user_id, structure) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    pool.query(insertQuery, [test_id, points, date, grade, medal, fk_user_id, JSON.stringify(structure)])
        .then((result) => {
            console.log(result);
            response.status(200);
            response.send("Test added: " + test_id + "  Status code: " + response.statusCode);
        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
})


// ------------------POST REQUEST - POST FRIEND_REQUEST TO DBS---------------------------------------------------------------
app.post("/api/friendRequest", async (request, response) => {
    const userUsername = request.body["user_username"];
    const friendUsername = request.body["friend_username"];
    const status = request.body["status"];
    const from = request.body["from"];
    const userId = request.body["user_id"];
    const friendId = request.body["friend_id"];

    if(userUsername === friendUsername) return response.status(400).send("Cannot send friend request to yourself!")

    const insertQuery_user_to_friend = "INSERT INTO friendship (user_username, friend_username, status, from_user_id, user_id, friend_id) VALUES ($1, $2, $3, $4, $5, $6)";
    pool.query(insertQuery_user_to_friend, [userUsername, friendUsername, status, from, userId, friendId])
        .then((result) => {
            console.log(result);
            response.status(200);
            response.send("Friend request sent!");
        })
        .catch((error) => {
            response.status(500);
            response.send("Error sending friend request")
            console.log(error);
        })

    const insertQuery_friend_to_user = "INSERT INTO friendship (friend_username, user_username, status, from_user_id, friend_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)";
    pool.query(insertQuery_friend_to_user, [userUsername, friendUsername, status, from, userId, friendId])
        .then((result) => {
            console.log(result);
            response.status(200);
            response.send("Friend request send to: " + friendUsername + "  Status code: " + response.statusCode);
        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
})


// ------------------GET REQUEST - GET FRIENDSHIP---------------------------------------------------------------
app.get("/api/getFriendship/:userId/:friendId", (request, response)=> {
    const { userId, friendId } = request.params;

    const getQuery = "SELECT status FROM friendship WHERE user_id = $1 AND friend_id = $2";
    pool.query(getQuery, [userId, friendId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404);
                response.send("Friendship among users: " + userId + " and " + friendId + " does not exist.  Status code: " + response.statusCode);
            }
            else{
                response.status(200);
                const foundFrinedshipStatus = result.rows[0]
                response.send({
                    status: foundFrinedshipStatus.status
                });
            }

        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});


// ------------------GET REQUEST - GET ALL USER'S FRIEND REQUESTS---------------------------------------------------------------
app.get("/api/getAllFriendRequests/:userId", (request, response)=> {
    const userId = request.params.userId;
    const getQuery = "SELECT friend_username FROM friendship WHERE user_id = $1 AND from_user_id != $1 AND status = 'PENDING'";
    pool.query(getQuery, [userId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404);
                response.send({}); // just sending empty body, because only .status doesnt send anything, so the response.status is then undefined
            }
            else{
                response.status(200);
                let foundFriends = result.rows.map(row => row.friend_username); // returns an array of user's friend requests
                response.send(foundFriends);
            }

        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});

// ------------------GET REQUEST - GET ALL USER'S FRIENDS---------------------------------------------------------------
// get friend's name from friends table, then join users table and get friends image_url
app.get("/api/getAllFriends/:userId", (request, response)=> {
    const userId = request.params.userId;

    const getQuery = `
      SELECT fr.friend_username, us.image_url, fr.friend_id
      FROM friendship AS fr
      JOIN users AS us
        ON fr.friend_id = us.user_id
      WHERE fr.user_id = $1
        AND fr.status = 'ACCEPTED';
    `;
    pool.query(getQuery, [userId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404);
                response.send({});
            }
            else{
                let foundFriends = result.rows.map(row => ({friendName: row.friend_username, friendId: row.friend_id, imgUrl: row.image_url})); // returns an array of user's friends
                response.status(200);
                response.send(foundFriends);
            }
        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});


// ------------------PATCH REQUEST - UPDATE STATUS PENDING TO ACCEPTED---------------------------------------------------------------
app.patch("/api/getFriendship/:userId/:friendId", (request, response)=> {
    const { userId, friendId } = request.params;

    const getQuery = "UPDATE friendship SET status = 'ACCEPTED' WHERE (user_id = $1 OR user_id = $2) AND (friend_id = $2 OR friend_id = $1) AND status = 'PENDING'";
    pool.query(getQuery, [userId, friendId])
        .then((result) => {
            console.log(result);
            response.status(200);
            response.send(friendId);
        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});

app.put("/api/putUser", (request, response)=> {
    const { user_username, user_email, user_imageUrl, clerk_user_id } = request.body;

    const putQuery = "UPDATE users SET username = $1, email = $2, image_url = $3 WHERE user_id = $4";
    pool.query(putQuery, [user_username, user_email, user_imageUrl, clerk_user_id])
        .then((result) => {
            response.status(200).send("Update successful");
            console.log(result);
        })
        .catch((error) => {
            response.status(500).send("Update failed");
            console.log(error);
        })
});

// ------------------DELETE REQUEST - DELETE FRIEND AFTER DECLINING FRIEND REQUEST OR REMOVING FRIEND FROM THE LIST---------------------
app.delete("/api/deleteFriend/:userId/:friendId", (request, response)=> {
    const { userId, friendId } = request.params;

    const getQuery = "DELETE FROM friendship WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)";
    pool.query(getQuery, [userId, friendId])
        .then((result) => {
            console.log(result);
            response.status(200);
            response.send("User " + friendId + " removed from the list");
        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});

// ------------------POST REQUEST - CALCULATION OF TEST SCORE---------------------------------------------------------------
app.post("/api/calculateTestScore/testStructure", (request, response)=> {
    // TODO
});

// ------------------GET RESPONSE FROM GEMINI-API---------------------------------------------------------------
app.post("/api/ai", async (request, response) => {
    const prompt = request.body["prompt"];
    try {
        const ai_result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        const aiAnswer = ai_result.candidates[0].content.parts[0].text; // all the way to the actual response we need in the RESPONSE object (check JSON parser to understand)
        return response.status(200).send({ result: aiAnswer });
    }
    catch (error) {
        console.error(error);
        return response.status(500).send({ error: "AI request failed" });
    }
});

// ------------------GET REQUEST - GET CHAPTER's NOTION ID---------------------------------------------------------------
app.get("/api/getNotionId/:chapter_number", (request, response)=> {
    const { chapter_number } = request.params;

    const getQuery = 'SELECT notion_page_id FROM chapters WHERE chapter = $1';
    pool.query(getQuery, [chapter_number])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404);
                response.send("Notion ID not found");
            }
            else{
                response.status(200);
                response.send({
                    notionId: result.rows[0].notion_page_id
                });
            }

        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});

// ------------------GET REQUEST - GET ALL CHAPTERS---------------------------------------------------------------
app.get("/api/getAllChapters", (request, response)=> {
    const getQuery = 'SELECT * FROM chapters ORDER BY chapter';
    pool.query(getQuery)
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404).send("No chapters found");
            }
            else{
                let foundChapters = result.rows.map(row => ({
                    chapter: row.chapter,
                    notionPageId: row.notion_page_id,
                    imgPath: row.img_path,
                    description: row.description,
                    estimatedTime: row.estimated_time,
                }));
                response.status(200).send(foundChapters);
            }

        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});

// ------------------GET REQUEST - GET QUESTIONS & ANSWERS OF SPECIFIC DIFFICULTY---------------------------------------------------------------

// first I get all the questions according to difficulty and multiselect (if it is true/false) -> the result1.rows is a list of all those questions
                                                                                 // -> if it is set to true, ic can be either singleselect or multiselect, not only multiselect (practically it means that the multiselect is allowed, it is not mandatory)
// then, with id from each row, I find its answers in the answers table and add it to the finalList -> question from questions table + answers from answers table
app.get("/api/getQuestionsBasedOnDifficulty/:difficulty/:multiselect", (request, response)=> {
    let difficulty = request.params.difficulty;
    let multiselect = request.params.multiselect;
    const finalList = []

    const getQuestionsQuery = "SELECT * FROM questions WHERE difficulty = $1" + (multiselect ? " AND multiselect = $2;" : ";")
    const getAnswersQuery = "SELECT * FROM answers WHERE question_id = $1"

    pool.query(getQuestionsQuery, multiselect ? [difficulty, multiselect] : [difficulty])
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

app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});
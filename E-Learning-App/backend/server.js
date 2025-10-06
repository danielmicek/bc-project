/* global process */
import dotenv from 'dotenv';
import express from 'express';
import cors from "cors";
import pool from "./database.js";

dotenv.config(); // Load environment variables from .env file
const PORT = process.env.BACKEND_PORT || 3000;
const app = express();
app.use(express.json());

//this enables React frontend (running on port 5173) to make API calls to your Express backend (port 3000).
app.use(cors({
    origin: "http://localhost:5173"
}));


// ------------------GET REQUEST - GET USER---------------------------------------------------------------
app.get("/getuser/:user_id", (request, response)=> {
    const user_id_from_request = request.params.user_id;

    const getQuery = "SELECT user_id, username, email FROM users WHERE user_id = $1";
    pool.query(getQuery, [user_id_from_request])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404);
                response.send("user_id: " + user_id_from_request + " not found.  Status code: " + response.statusCode);
            }
            else{
                response.status(200);
                const foundUser = result.rows[0]
                response.send({
                    userId: foundUser.user_id,
                    userName: foundUser.username,
                    userEmail: foundUser.email
                });
            }

        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});


// ------------------POST REQUEST - POST USER TO DBS---------------------------------------------------------------
app.post("/adduser", async (request, response) => {
    const user_id = request.body["user_id"];
    const username = request.body["username"];
    const email = request.body["email"];


    const insertQuery = "INSERT INTO users (user_id, username, email) VALUES ($1, $2, $3)";
    pool.query(insertQuery, [user_id, username, email])
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
app.post("/addtest", async (request, response) => {
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
app.post("/friendRequest", async (request, response) => {
    const user_id = request.body["user_id"];
    const friend_id = request.body["friend_id"];
    const status = request.body["status"];
    const from = request.body["from"];

    const insertQuery_user_to_friend = "INSERT INTO friendship (user_id, friend_id, status, from_user) VALUES ($1, $2, $3, $4)";
    pool.query(insertQuery_user_to_friend, [user_id, friend_id, status, from])
        .then((result) => {
            console.log(result);
            response.status(200);
            response.send("Friend request send to: " + friend_id + "  Status code: " + response.statusCode);
        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })

    const insertQuery_friend_to_user = "INSERT INTO friendship (friend_id, user_id, status, from_user) VALUES ($1, $2, $3, $4)";
    pool.query(insertQuery_friend_to_user, [user_id, friend_id, status, from])
        .then((result) => {
            console.log(result);
            response.status(200);
            response.send("Friend request send to: " + friend_id + "  Status code: " + response.statusCode);
        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
})


// ------------------GET REQUEST - GET FRIENDSHIP---------------------------------------------------------------

app.get("/getFriendship/:userId/:friendId", (request, response)=> {
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
app.get("/getAllFriendRequests/:userId", (request, response)=> {
    const user_id = request.params.userId;
    const getQuery = "SELECT friend_id FROM friendship WHERE user_id = $1 AND from_user != $1 AND status = 'PENDING'";
    pool.query(getQuery, [user_id])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404);
                response.send("No pending friend requests.");
            }
            else{
                response.status(200);
                let foundFriends = result.rows.map(row => row.friend_id); // returns an array of user's friends
                response.send(foundFriends);
            }

        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});


// ------------------PATCH REQUEST - UPDATE STATUS PENDING TO ACCEPTED---------------------------------------------------------------
app.patch("/getFriendship/:userId/:friendId", (request, response)=> {
    const { userId, friendId } = request.params;

    const getQuery = "UPDATE friendship SET status = 'ACCEPTED' WHERE (user_id = $1 OR user_id = $2) AND (friend_id = $2 OR friend_id = $1) AND status = 'PENDING'";
    pool.query(getQuery, [userId, friendId])
        .then((result) => {
            console.log(result);
            response.status(200);
            response.send("Friend request accepted\nStatus code: " + response.statusCode);
        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});







app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});
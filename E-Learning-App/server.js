/* global process */
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import cors from "cors";
import { Server } from 'socket.io';
import pool from "./database.js";

dotenv.config(); // Load environment variables from .env file
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});

//this enables React frontend (running on port 5173) to make API calls to your Express backend (port 3000).
app.use(cors({
    origin: "http://localhost:5173"
}));


// ------------------GET REQUEST - USER---------------------------------------------------------------
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
                response.send({userId: foundUser.user_id,
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
    const first_name = request.body["first_name"];
    const last_name = request.body["last_name"];

    const insertQuery = "INSERT INTO users (user_id, username, email, first_name, last_name) VALUES ($1, $2, $3, $4, $5)";
    pool.query(insertQuery, [user_id, username, email, first_name, last_name])
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

server.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});






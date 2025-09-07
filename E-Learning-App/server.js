/* global process */
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import cors from "cors";
import { Server } from 'socket.io';
import { createClient } from 'redis';
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


// ------------------GET REQUEST---------------------------------------------------------------
app.get("/getuser/:user_id", (request, response)=> {
    const user_id = request.params.user_id;

    const getQuery = "SELECT user_id FROM users WHERE user_id = $1";
    pool.query(getQuery, [user_id])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404);
                response.send("user_id: " + user_id + " not found.  Status code: " + response.statusCode);
            }
            else{
                response.status(200);
                response.send("user_id: " + user_id + " found.  Status code: " + response.statusCode);
            }

        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});


// ------------------POST REQUEST---------------------------------------------------------------
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

server.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});





// Initialize Redis clients
const pubClient = createClient();
const subClient = createClient();
await pubClient.connect();
await subClient.connect();




const users = new Map(); //(id, nickname)

function handleConnection(userId) {
    users.set(userId, "xxxxxxx");
}

function handleDisconnection(userId) {
    users.delete(userId);
}


// Subscribe to the Redis channel for game updates
await subClient.subscribe('game-moves', (message) => {
    gameState = JSON.parse(message);
    io.emit('gameState', gameState);
});

// Define initial game state
let gameState = {
    board: Array(9).fill(null),
    xIsNext: true,
};

// Function to reset the game
function resetGame() {
    gameState = {
        board: Array(9).fill(null),
        xIsNext: true,
    };
    users.clear();
}

io.on('connection', (socket) => {
    console.log("-----------------------------------");
    console.log('New client connected:', socket.id);
    console.log(users.size)
    handleConnection(socket.id);
    console.log(users.size);
    // Send the current game state to the newly connected client
    socket.emit('gameState', gameState);

    socket.emit('nameChange', Array.from(users.entries()));

    // Handle player moves
    socket.on('makeMove', (index) => {
        // Prevent making a move if cell is already taken or game is over
        if (gameState.board[index] || calculateWinner(gameState.board)) return;

        // Update the board and switch turns
        gameState.board[index] = gameState.xIsNext ? 'X' : 'O';
        gameState.xIsNext = !gameState.xIsNext;

        // Publish the updated game state to Redis
        pubClient.publish('game-moves', JSON.stringify(gameState));
        io.emit('gameState', gameState);

        // Handle game restarts
        socket.on('restartGame', () => {
            resetGame();
            console.log('Game restarted');
            io.emit('gameState', gameState);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            handleDisconnection(socket.id);
        });
    });
})


// Function to check if there's a winner
function calculateWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}





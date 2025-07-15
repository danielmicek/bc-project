/* global process */
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';

dotenv.config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
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


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});



/* global process */
import dotenv from 'dotenv';
import express from 'express';
import cors from "cors";

import friendsRouter from "./endpoints/friendshipEndpoints.js"
import userRouter from "./endpoints/userEndpoints.js"
import testRouter from "./endpoints/testEndpoints.js"
import chapterRouter from "./endpoints/chapterEndpoints.js"

dotenv.config(); // Load environment variables from .env file
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:8080",
    "https://eleonore-ry00.onrender.com"
];

// Enables React frontend (dev/prod local ports) to make API calls to Express backend.
app.use(cors({
    origin: allowedOrigins
}));

// ------------------FRIENDS API----------------------------------------------------------------------------------------
app.use("/api/friendship", friendsRouter)

// ------------------USER API-------------------------------------------------------------------------------------------
app.use("/api/user", userRouter)

// ------------------TEST API-------------------------------------------------------------------------------------------
app.use("/api/test", testRouter)

// ------------------CHAPTER API----------------------------------------------------------------------------------------
app.use("/api/chapters", chapterRouter)


// ------------------UNAUTHENTICATED USER ERROR HANDLER-----------------------------------------------------------------
app.use((err, req, res, next) => {
    res.status(401).send('Neprihlásený používateľ.');
});


app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});

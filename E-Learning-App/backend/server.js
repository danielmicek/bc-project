/* global process */
import dotenv from 'dotenv';
import express from 'express';
import cors from "cors";

import friendsRouter from "./endpoints/friendshipEndpoints.js"
import userRouter from "./endpoints/userEndpoints.js"
import testRouter from "./endpoints/testEndpoints.js"
import chapterRouter from "./endpoints/chapterEndpoints.js"

dotenv.config(); // Load environment variables from .env file
const PORT = process.env.BACKEND_PORT || 3000;
const app = express();
app.use(express.json());

//this enables React frontend (running on port 5173) to make API calls to your Express backend (port 3000).
app.use(cors({
    origin: "http://localhost:5173"
}));

// ------------------FRIENDS API----------------------------------------------------------------------------------------
app.use("/api/friendship", friendsRouter)

// ------------------USER API-------------------------------------------------------------------------------------------
app.use("/api/user", userRouter)

// ------------------TEST API-------------------------------------------------------------------------------------------
app.use("/api/test", testRouter)

// ------------------CHAPTER API-----------------------------------------------------------------------------------------
app.use("/api/chapters", chapterRouter)


app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});
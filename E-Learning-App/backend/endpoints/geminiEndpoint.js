import express from "express";
import dotenv from 'dotenv';
import {GoogleGenAI} from "@google/genai";

dotenv.config(); // Load environment variables from .env file
const AI_KEY = process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({apiKey: AI_KEY});
const router = express.Router();

// ------------------GET RESPONSE FROM GEMINI-API---------------------------------------------------------------
router.post("/rephrase", async (request, response) => {
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

export default router;
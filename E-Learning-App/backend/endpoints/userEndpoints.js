import express from "express";
import pool from "../database.js";
import {ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";

const router = express.Router();

// ------------------GET REQUEST - GET USER---------------------------------------------------------------
router.get("/getUser/:username", (request, response)=> {
    let username = request.params.username;

    const getQuery = "SELECT user_id, username, email, image_url FROM \"Users\" WHERE username = $1";

    pool.query(getQuery, [username])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404).send("Používateľ nenájdený");
            }
            else{
                const foundUser = result.rows[0]
                response.status(200).send({
                    userId: foundUser.user_id,
                    userName: foundUser.username,
                    userEmail: foundUser.email,
                    imageUrl: foundUser.image_url
                });
            }

        })
        .catch((error) => {
            response.status(500).send("Chyba na strane servera");
            console.log(error);
        })
});

// ------------------GET REQUEST - GET USER's SCORE -> SUM OF TESTS POINTS----------------------------------------------
router.get("/getUserScore/:userId", (request, response)=> {
    let userId = request.params.userId;

    const getQuery = `
        SELECT SUM(ts.points)
        FROM "Users" AS us
        LEFT JOIN "Tests" AS ts
          ON us.user_id = ts.fk_user_id
        WHERE us.user_id = $1;
    `;

    pool.query(getQuery, [userId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404).send("Používateľské skkóre nenájdené");
            }
            else{
                const foundScore = result.rows[0]
                console.log("foundScore = " + foundScore);
                response.status(200).send({
                    score: foundScore.sum === null ? 0 : parseInt(foundScore.sum)
                });
            }

        })
        .catch((error) => {
            response.status(500).send("Chyba na strane servera");
            console.log(error);
        })
});

// ------------------POST REQUEST - POST USER TO DBS---------------------------------------------------------------
router.post("/addUser", ClerkExpressRequireAuth(), async (request, response) => {
    const user_id = request.body["user_id"];
    const username = request.body["username"];
    const email = request.body["email"];
    const image_url = request.body["image_url"];

    const { userId: loggedInUserId } = request.auth;

    // check whether user calling this endpoint is the one logged in
    if (loggedInUserId !== user_id) {
        return response.status(403).json("Zakázaná akcia");
    }


    const insertQuery = "INSERT INTO \"Users\" (user_id, username, email, image_url) VALUES ($1, $2, $3, $4)";
    pool.query(insertQuery, [user_id, username, email, image_url])
        .then((result) => {
            console.log(result);
            response.status(200).send("User added: " + username + "  Status code: " + response.statusCode);
        })
        .catch((error) => {
            response.status(500).send("Chyba na strane servera");
            console.log(error);
        })
})

// ------------------PUT REQUEST - SAVE ALL USER's INFO TO DB AFTER HE CHANGES IT--------------------------------------------------
router.put("/putUser", ClerkExpressRequireAuth(), (request, response)=> {
    const { user_username, user_email, user_imageUrl, clerk_user_id } = request.body;

    const { userId: loggedInUserId } = request.auth;

    // check whether user calling this endpoint is the one logged in
    // preventing such a situation when someone else would want to change user's information
    if (loggedInUserId !== clerk_user_id) {
        return response.status(403).json("Zakázaná akcia!");
    }

    const putQuery = "UPDATE \"Users\" SET username = $1, email = $2, image_url = $3 WHERE user_id = $4";
    pool.query(putQuery, [user_username, user_email, user_imageUrl, clerk_user_id])
        .then((result) => {
            response.status(200).send("Dáta úspešne zmenené");
            console.log(result);
        })
        .catch((error) => {
            response.status(500).send("Chyba na strane servera");
            console.log(error);
        })
});

export default router;

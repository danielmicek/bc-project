import express from "express";
import pool from "../database.js";
import {ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";

const router = express.Router();

// ------------------GET REQUEST - GET ALL USER'S FRIENDS---------------------------------------------------------------
// get friend's name from friends table, then join users table and get friends image_url
router.get("/getAllFriends/:userId", ClerkExpressRequireAuth(), (request, response)=> {
    const userId = request.params.userId;

    const { userId: loggedInUserId } = request.auth;

    // check whether user calling this endpoint is the one logged in
    if (loggedInUserId !== userId) {
        return response.status(403).send("Zakázaná akcia! Túto akciu môže vykonať iba vlastník profilu.");
    }

    const getQuery = `
        WITH relations AS (
            SELECT
                CASE
                    WHEN fr.user_id = $1 THEN fr.friend_id
                    ELSE fr.user_id
                END AS friend_id
            FROM "Friendships" AS fr
            WHERE fr.user_id = $1 OR fr.friend_id = $1
        )
        SELECT
            r.friend_id,
            us.username AS friend_name,
            us.image_url,
            us.email,
            COALESCE(SUM(ts.points), 0) AS score
        FROM relations AS r
                 JOIN "Users" AS us
                      ON us.user_id = r.friend_id
                 LEFT JOIN "Tests" AS ts
                           ON ts.fk_user_id = r.friend_id
        GROUP BY r.friend_id, us.username, us.image_url, us.email;
    `;
    pool.query(getQuery, [userId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                return response.status(200).send([]);
            }
            else{
                let foundFriends = result.rows.map(row => ({
                    friendName: row.friend_name,
                    friendId: row.friend_id,
                    imgUrl: row.image_url,
                    email: row.email,
                    score: row.score === null ? 0 : parseInt(row.score)
                })); // returns an array of user's friends
                return response.status(200).send(foundFriends);
            }
        })
        .catch((error) => {
            console.log(error);
            return response.status(500).send("Chyba na strane servera");
        })
});

// ------------------POST REQUEST - ACCEPT FR --------------------------------------------------------------------------
// remove FR from Friend_requests
// add FR to Friendships
router.post("/acceptFriendRequest/:userId/:friendId", ClerkExpressRequireAuth(), (request, response)=> {
    const { userId, friendId } = request.params;

    const { userId: loggedInUserId } = request.auth;

    // check whether user calling this endpoint is the one logged in
    if (loggedInUserId !== userId) {
        return response.status(403).send("Zakázaná akcia! Túto akciu môže vykonať iba vlastník profilu.");
    }

    const deleteQuery = "DELETE FROM \"Friend_requests\" WHERE (to_user_id = $1 OR from_user_id = $2)";
    const deleteResult = pool.query(deleteQuery, [userId, friendId]);
    if (deleteResult.rowCount === 0) return response.status(404).send("Priateľstvo nenájdené!");

    const insertQuery = "INSERT INTO \"Friendships\" (user_id, friend_id) VALUES ($1, $2)";
    pool.query(insertQuery, [userId, friendId])
        .then((result) => {
            console.log(result);
            return response.status(200).send("Žiadosť akceptovaná!");
        })
        .catch((error) => {
            console.log(error);
            return response.status(500).send("Chyba na strane servera");
        })
});

// ------------------DELETE FR - DELETE FR AFTER DECLINING --------------- ---------------------------------------------
router.delete("/deleteFriendRequest/:userId/:friendId", ClerkExpressRequireAuth(), (request, response)=> {
    const { userId, friendId } = request.params;

    const { userId: loggedInUserId } = request.auth;

    // check whether user calling this endpoint is the one logged in
    if (loggedInUserId !== userId) {
        return response.status(403).send("Zakázaná akcia! Túto akciu môže vykonať iba vlastník profilu.");
    }

    const getQuery = "DELETE FROM \"Friend_requests\" WHERE (to_user_id = $1 AND from_user_id = $2)";
    pool.query(getQuery, [userId, friendId])
        .then((result) => {
            console.log(result);
            return response.status(200).send("Akcia prebehla úspešne");
        })
        .catch((error) => {
            console.log(error);
            return response.status(500).send("Chyba na strane servera");
        })
});

// ------------------ DELETE FRIENDSHIP --------------------------------------------------------------------------------
router.delete("/deleteFriendship/:userId/:friendId", ClerkExpressRequireAuth(), (request, response)=> {
    const { userId, friendId } = request.params;

    const { userId: loggedInUserId } = request.auth;

    // check whether user calling this endpoint is the one logged in
    if (loggedInUserId !== userId) {
        return response.status(403).send("Zakázaná akcia! Túto akciu môže vykonať iba vlastník profilu.");
    }

    const getQuery = "DELETE FROM \"Friendships\" WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)";
    pool.query(getQuery, [userId, friendId])
        .then((result) => {
            console.log(result);
            return response.status(200).send("Priateľstvo ukončené!");
        })
        .catch((error) => {
            console.log(error);
            return response.status(500).send("Chyba na strane servera");
        })
});

// ------------------GET REQUEST - GET ALL USER'S FRIEND REQUESTS---------------------------------------------------------------
router.get("/getAllFriendRequests/:userId", ClerkExpressRequireAuth(), (request, response)=> {
    const userId = request.params.userId;

    const { userId: loggedInUserId } = request.auth;

    // check whether user calling this endpoint is the one logged in
    if (loggedInUserId !== userId) {
        return response.status(403).send("Zakázaná akcia! Túto akciu môže vykonať iba vlastník profilu.");
    }
    const getQuery = `
        SELECT u.username AS friend_username, u.user_id AS friend_id, u.image_url, u.email
        FROM "Friend_requests" AS fr
                 JOIN "Users" AS u
                      ON fr.from_user_id = u.user_id
        WHERE fr.to_user_id = $1
    `;
    pool.query(getQuery, [userId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                return response.status(200).send([]);
            }
            else{
                let foundFriends = result.rows.map(row => ({
                    friendName: row.friend_username,
                    friendId: row.friend_id,
                    imgUrl: row.image_url,
                    email: row.email
                })); // returns an array of user's friend requests
                return response.status(200).send(foundFriends);
            }

        })
        .catch((error) => {
            console.log(error);
            return response.status(500).send("Chyba na strane servera");
        })
});

// ------------------GET REQUEST - GET FRIENDSHIP---------------------------------------------------------------
router.get("/getFriendship/:userId/:friendId", ClerkExpressRequireAuth(), (request, response)=> {
    const { userId, friendId } = request.params;

    const { userId: loggedInUserId } = request.auth;

    // check whether user calling this endpoint is the one logged in
    if (loggedInUserId !== userId) {
        return response.status(403).send("Zakázaná akcia! Túto akciu môže vykonať iba vlastník profilu.");
    }

    const getQuery = "SELECT * FROM \"Friendships\" WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)";
    pool.query(getQuery, [userId, friendId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                return response.status(400).send("Žiadosť úspešne odoslaná!");
            }
            else{
                return response.status(200).send("Priateľstvo už existuje!");
            }

        })
        .catch((error) => {
            console.log(error);
            return response.status(500).send("Chyba na strane servera");
        })
});

// ------------------POST REQUEST - POST FRIEND_REQUEST TO DBS---------------------------------------------------------------
router.post("/sendFriendRequest", ClerkExpressRequireAuth(), async (request, response) => {
    const from = request.body["from"];
    const to = request.body["friend_id"];

    const { userId: loggedInUserId } = request.auth;

    // check whether user calling this endpoint is the one logged in
    if (loggedInUserId !== from) {
        return response.status(403).send("Zakázaná akcia! Túto akciu môže vykonať iba vlastník profilu.");
    }


    if(from === to) return response.status(400).send("Zakázaná akcia!")

    try{
        const insertQuery = "INSERT INTO \"Friend_requests\" (from_user_id, to_user_id) VALUES ($1, $2)";
        await pool.query(insertQuery, [from, to])

        return response.status(200).send("Žiadosť odoslaná");
    }
    catch (error) {
        console.log(error);
        return response.status(500).send("Chyba na strane servera");
    }
})

export default router;


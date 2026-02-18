import express from "express";
import pool from "../database.js";

const router = express.Router();

// ------------------GET REQUEST - GET ALL USER'S FRIENDS---------------------------------------------------------------
// get friend's name from friends table, then join users table and get friends image_url
router.get("/getAllFriends/:userId", (request, response)=> {
    const userId = request.params.userId;

    const getQuery = `
        SELECT fr.friend_username, us.image_url, fr.friend_id, SUM(ts.points), us.email
        FROM friendship AS fr
        LEFT JOIN tests AS ts
          ON fr.friend_id = ts.fk_user_id
        JOIN users AS us
          ON fr.friend_id = us.user_id
        WHERE fr.user_id = $1
          AND fr.status = 'ACCEPTED'
        GROUP BY fr.friend_id, us.image_url, fr.friend_username, us.email;
    `;
    pool.query(getQuery, [userId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                return response.status(404).send({});
            }
            else{
                let foundFriends = result.rows.map(row => ({
                    friendName: row.friend_username,
                    friendId: row.friend_id,
                    imgUrl: row.image_url,
                    email: row.email,
                    score: row.sum === null ? 0 : parseInt(row.sum)
                })); // returns an array of user's friends
                response.status(200).send(foundFriends);
            }
        })
        .catch((error) => {
            response.status(500).send({error: "error"});
            console.log(error);
        })
});

// ------------------PATCH REQUEST - UPDATE STATUS PENDING TO ACCEPTED--------------------------------------------------
router.patch("/getFriendship/:userId/:friendId", (request, response)=> {
    const { userId, friendId } = request.params;

    const getQuery = "UPDATE friendship SET status = 'ACCEPTED' WHERE (user_id = $1 OR user_id = $2) AND (friend_id = $2 OR friend_id = $1) AND status = 'PENDING'";
    pool.query(getQuery, [userId, friendId])
        .then((result) => {
            console.log(result);
            response.status(200).send(friendId);
        })
        .catch((error) => {
            response.status(500).send({error: "error"});
            console.log(error);
        })
});

// ------------------DELETE REQUEST - DELETE FRIEND AFTER DECLINING FRIEND REQUEST OR REMOVING FRIEND FROM THE LIST---------------------
router.delete("/deleteFriend/:userId/:friendId", (request, response)=> {
    const { userId, friendId } = request.params;

    const getQuery = "DELETE FROM friendship WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)";
    pool.query(getQuery, [userId, friendId])
        .then((result) => {
            console.log(result);
            response.status(200).send("Priateľstvo ukončené");
        })
        .catch((error) => {
            response.status(500).send({error: "error"});
            console.log(error);
        })
});

// ------------------GET REQUEST - GET ALL USER'S FRIEND REQUESTS---------------------------------------------------------------
router.get("/getAllFriendRequests/:userId", (request, response)=> {
    const userId = request.params.userId;
    const getQuery = "SELECT friend_username FROM friendship WHERE user_id = $1 AND from_user_id != $1 AND status = 'PENDING'";
    pool.query(getQuery, [userId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404).send("No friend requests"); // .status doesnt send anything, so the response.status is then undefined
            }
            else{
                let foundFriends = result.rows.map(row => row.friend_username); // returns an array of user's friend requests
                response.status(200).send(foundFriends);
            }

        })
        .catch((error) => {
            response.status(500).send({error: "error"});
            console.log(error);
        })
});

// ------------------GET REQUEST - GET FRIENDSHIP---------------------------------------------------------------
router.get("/:userId/:friendId", (request, response)=> {
    const { userId, friendId } = request.params;

    const getQuery = "SELECT status FROM friendship WHERE user_id = $1 AND friend_id = $2";
    pool.query(getQuery, [userId, friendId])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404).send("Friendship among users: " + userId + " and " + friendId + " does not exist.  Status code: " + response.statusCode);
            }
            else{
                const foundFrinedshipStatus = result.rows[0]
                response.status(200).send({
                    status: foundFrinedshipStatus.status
                });
            }

        })
        .catch((error) => {
            response.status(500).send({error: "error"});
            console.log(error);
        })
});

// ------------------POST REQUEST - POST FRIEND_REQUEST TO DBS---------------------------------------------------------------
router.post("/sendFriendRequest", async (request, response) => {
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
            response.status(200).send("Žiadosť odoslaná");
        })
        .catch((error) => {
            response.status(500).send("Error. Skús znova neskôr")
            console.log(error);
        })

    const insertQuery_friend_to_user = "INSERT INTO friendship (friend_username, user_username, status, from_user_id, friend_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)";
    pool.query(insertQuery_friend_to_user, [userUsername, friendUsername, status, from, userId, friendId])
        .then((result) => {
            console.log(result);
            response.status(200).send("Friend request send to: " + friendUsername + "  Status code: " + response.statusCode);
        })
        .catch((error) => {
            response.status(500).send({error: "error"});
            console.log(error);
        })
})

export default router;
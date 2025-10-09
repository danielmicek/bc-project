import {
    GET_allFriendRequests,
    GET_friendship,
    GET_user,
    PATCH_acceptFriendRequest,
    POST_friendship,
    POST_user
} from "./fetchMethods.jsx";

export async function getUser_info(userId, user){ // only find if user exist
    const responseObject = await GET_user(userId);
    if(responseObject.status === 200){
        console.log("User already exists in the database. GET status code: " + responseObject.status);
        console.log(await responseObject.json());
    }
    else{
        console.log("User does not exist in the database, GET status code: " + responseObject.status + ". Creating POST request... " );
        await POST_user(user.id, user.emailAddresses[0].emailAddress, user.firstName, user.lastName, user.username);
        console.log("POST request sent. GET status code: " + responseObject.status)
    }
}

export async function getUser_object(userId){ //async funkcia vzdy vracia promise - return the actual user object
    const responseObject = await GET_user(userId);
    const responseJson = await responseObject.json();
    return({userId: responseJson.userId,
        userName: responseJson.userName,
        userEmail: responseJson.userEmail
    });
}

// friendUrl is the url of userPage
// friendId is userId from url query parameter
export async function sendFriendRequest(userId, friendUrl){
    const url = new URL(friendUrl);
    const friendId = url.searchParams.get("userId");
    let responseObject = await GET_user(friendId);

    if(responseObject.status !== 200){  // first check if friend exists
        console.log("User " + friendId + " not found");
        return;
    }

    responseObject = await GET_friendship(userId, friendId)
    if(responseObject.status === 200){
        console.log("Friendship already exists. GET status code: " + responseObject.status);
    }
    else{
        console.log(await responseObject.text() + "\nCreating POST request...");
        POST_friendship(userId, friendId);
    }
}

export async function acceptFriendRequest(userId){
    const responseObject = await GET_allFriendRequests(userId);

    if(responseObject.status === 404){ // no friend requests
        console.log(await responseObject.text());
        return;
    }

    // else if response.status === 200
    const arrayOfFriendshipRequests = await responseObject.json();
    let arrayOfAcceptedFriendRequests = [];
    let friendshipResponseObject;
    for(let friendId of arrayOfFriendshipRequests){ // for each friend from friend requeest
        friendshipResponseObject = await PATCH_acceptFriendRequest(userId, friendId);
        console.log("Friend request accepted with: " + await friendshipResponseObject.text());
        arrayOfAcceptedFriendRequests.push(friendId);
    }
    console.log("Friend requests accepted: " + arrayOfAcceptedFriendRequests);
    return arrayOfAcceptedFriendRequests;
}

let RIGHT_ANSWER_POINTS;
let WRONG_ANSWER_POINTS;
let DONT_ANSWER_POINTS
let totalPoints;

export function calculateTestResult({test}){
    totalPoints = 0;
    switch (test.difficulty) {
        case "easy":
            RIGHT_ANSWER_POINTS
    }
    for(let question of test){
        for(let answer of question){
            if(answer.selected && answer.correct){
                totalPoints += RIGHT_ANSWER_POINTS;
            }
        }
    }
}
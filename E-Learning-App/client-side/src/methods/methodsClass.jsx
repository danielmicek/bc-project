import {
    getRequest_allFriendRequests,
    getRequest_friendship,
    getRequest_user, patchRequest_allFriendRequests,
    postRequest_friendship,
    postRequest_user
} from "./fetchMethods.jsx";

export async function getUser(userId, user){ //async funkcia vzdy vracia promise
    const responseObject = await getRequest_user(userId);
    if(responseObject.status === 200){
        console.log("User already exists in the database. GET status code: " + responseObject.status);
        console.log(await responseObject.json());
    }
    else{
        console.log("User does not exist in the database, GET status code: " + responseObject.status + ". Creating POST request... " );
        await postRequest_user(user.id, user.emailAddresses[0].emailAddress, user.firstName, user.lastName, user.username);
        console.log("POST request sent. GET status code: " + responseObject.status)
    }
}

// friendUrl is the url of userPage
// friendId is userId from url query parameter
export async function sendFriendRequest(userId, friendUrl){
    const url = new URL(friendUrl);
    const friendId = url.searchParams.get("userId");
    let responseObject = await getRequest_user(friendId);

    if(responseObject.status !== 200){  // first check if friend exists
        console.log("User " + friendId + " not found");
        return;
    }

    responseObject = await getRequest_friendship(userId, friendId)
    if(responseObject.status === 200){
        console.log("Friendship already exists. GET status code: " + responseObject.status);
    }
    else{
        console.log(await responseObject.text() + "\nCreating POST request...");
        postRequest_friendship(userId, friendId);
    }
}

export async function acceptFriendRequest(userId){
    const responseObject = await getRequest_allFriendRequests(userId);

    if(responseObject.status === 404){
        const arrayOfFriendshipRequests = await responseObject.text();
        console.log(arrayOfFriendshipRequests);
        return;
    }

    // else if response.status === 200
    const arrayOfFriendshipRequests = await responseObject.json();
    let friendshipResponseObject;
    for(let friendId of arrayOfFriendshipRequests){ // for each friend from friend requeest
        friendshipResponseObject = await patchRequest_allFriendRequests(userId, friendId);
        console.log(await friendshipResponseObject.text());
    }
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
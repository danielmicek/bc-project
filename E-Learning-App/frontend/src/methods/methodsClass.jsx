import {
    DELETE_deleteFriend,
    GET_friendship,
    GET_user,
    PATCH_acceptFriendRequest,
    POST_friendship,
    POST_user
} from "./fetchMethods.jsx";


export async function getUser_info(user){ // only find if a user exists
    const responseObject = await GET_user(user.username);
    if(responseObject.status === 200){
        console.log("User already exists in the database. GET status code: " + responseObject.status);
        console.log(await responseObject.json());
    }
    else{
        console.log("User does not exist in the database, GET status code: " + responseObject.status + ". Creating POST request... " );
        await POST_user(user.id, user.emailAddresses[0].emailAddress, user.firstName, user.lastName, user.username, user.imageUrl);
        console.log("POST request sent. GET status code: " + responseObject.status)
    }
}

export async function getUser_object(username){ //async funkcia vzdy vracia promise - return the actual user object
    const responseObject = await GET_user(username);
    if(responseObject.status !== 200){
        return responseObject.status;
    }
    const responseJson = await responseObject.json();
    return({userId: responseJson.userId,
        userName: responseJson.userName,
        userEmail: responseJson.userEmail,
        userImgUrl: responseJson.imageUrl
    });
}

// friendUniqueIdentifier is the url of his userPage or username
// first we check if the uid is url or username,
// then we find out if the user we want to send the FR even exists,
// then we find out if the friendship relation between the 2 users exists already
// if no, we call POST request and create the friendship relation => send post-request to friend
export async function sendFriendRequest(userUsername, friendUniqueIdentifier){

    let friendUsername;

    try{ // if userUid is userPage url
        const url = new URL(friendUniqueIdentifier);
        const params = new URLSearchParams(url.search);
        friendUsername = params.get("username");
    }
    catch{
        friendUsername = friendUniqueIdentifier;
    }

    let responseObject = await GET_user(friendUsername);
    console.log("GET status code: " + responseObject.status);
    if(responseObject.status === 404){
        console.log("User " + friendUsername + " not found");
        return;
    }

    responseObject = await GET_friendship(userUsername, friendUsername)
    if(responseObject.status === 200){
        console.log("Friendship already exists. GET status code: " + responseObject.status);
    }
    else{
        console.log(await responseObject.text() + "\nSending friend request ...");
        POST_friendship(userUsername, friendUsername);
    }

    // todo: pridaj okno ktore povie ze sa odoslal FR / ze user sa user nenasiel v db
}


// accept the friend-request from friend_username user
export async function acceptFriendRequest(user_username, friend_username, setUserFriendsList, setUserFriendRequestList, imgUrl){

    let friendshipResponseObject = await PATCH_acceptFriendRequest(user_username, friend_username); // update friendship status to "ACCEPTED"

    if(friendshipResponseObject.status === 200){
        console.log("Friend request from " + friend_username + " accepted");

        setUserFriendsList(prevList => { // add friend to friendsList
            if(!prevList.includes(friend_username)){
                return [...prevList, {friendName: friend_username, imgUrl: imgUrl}];
            }
            else return prevList;
        })
        setUserFriendRequestList((prevList) => prevList.filter((friend) => friend.friendName !== friend_username)); // remove from the friend request list
        //return friendshipResponseObject;
    }
    else{
        console.log("Error during friend request acceptance. GET status code: " + friendshipResponseObject.status);
        //return null;
    }
}

// decline the friend-request from friend_username user
// flag: FR = "friend request" => delete friend request from db and update userFriendRequestList
//       F = "friend" => delete friend from db and update userFriendList"
export async function deleteFriend(flag, user_username, friend_username, setUserFriendList, setUserFriendRequestList){

    let friendshipResponseObject = await DELETE_deleteFriend(user_username, friend_username);

    if(friendshipResponseObject.status === 200){
        console.log(await friendshipResponseObject.text());
        if(flag === "FR"){
            setUserFriendRequestList((prevList) => prevList.filter((friend) => friend.friendName !== friend_username)); //creates a copy of the list and removes the accepted FR from it
        }
        else if(flag === "F"){
            setUserFriendList((prevList) => prevList.filter((friend) => friend.friendName !== friend_username));
        }
        else{
            console.log("Error during friend deletion. Flag is not set to 'FR' or 'F'. Flag: " + flag);
        }
    }
    else{
        console.log("Error during friend deletion. GET status code: " + friendshipResponseObject.status);
        return null;
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
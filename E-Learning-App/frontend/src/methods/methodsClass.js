import {
    DELETE_deleteFriendRequest,
    DELETE_deleteFriendship,
    GET_allFriendRequests,
    GET_allFriends,
    GET_friendship,
    GET_user,
    POST_acceptFriendRequest,
    POST_friendship,
    POST_user
} from "./fetchMethods.js";
import {toast} from "react-hot-toast";

/**
 *
 * @typedef {Object} user
 * @property {Array} emailAddresses
 * @property {String} emailAddress
 *
 */

export async function getUser_info(user, getToken){ // only find if a user exists
    try {
        const foundUser = await GET_user(user.username, getToken);
        if (!foundUser) {
            await POST_user(user.id, user.emailAddresses[0].emailAddress, user.username, user.imageUrl, getToken);
        }
    } catch (error) {
        if (error.status === 401) return error.status;
        throw error;
    }
}

export async function getUser_object(username, getToken){ //async function always returns promise -> this function returns the actual user object
    const responseJson = await GET_user(username, getToken);
    if(!responseJson){
        return 400;
    }
    return({
        userId: responseJson.userId,
        userName: responseJson.userName,
        userEmail: responseJson.userEmail,
        userImgUrl: responseJson.imageUrl,
        userScore: responseJson.score,
    });
}

// friendUniqueIdentifier is the url of his userPage or username
// first we check if the uid is url or username,
// then we find out if the user we want to send the FR even exists,
// then we find out if the friendship relation between the 2 users exists already
// if no, we call POST request and create the friendship relation => send post-request to friend
export async function sendFriendRequest(userUsername, user_id, friendUniqueIdentifier, getToken){

    let friendUsername;

    try{ // if userUid is userPage url
        const url = new URL(friendUniqueIdentifier);
        const params = new URLSearchParams(url.search);
        friendUsername = params.get("username");
    }
    catch{ // if userUid is actual uid - not url
        friendUsername = friendUniqueIdentifier;
    }

    const responseObject = await GET_user(friendUsername, getToken);
    if(!responseObject){
        toast.error("Používateľ nenájdený");
        return;
    }

    const friend_id = responseObject.userId;

    const friendshipExists = await GET_friendship(user_id, friend_id, getToken);
    if(friendshipExists){
        toast.success("Priateľstvo už existuje!");
    }
    else{ // does not exist
        try {
            await toast.promise(
                POST_friendship(userUsername, friendUsername, user_id, friend_id, getToken),
                {
                    loading: "Odosielanie žiadosti...",
                    success: (responseText) => responseText,
                    error: (responseErrorText) => responseErrorText.message,
                }
            );
        } catch (e) {}
    }
}

// accept the friend-request from friend_username user
export async function acceptFriendRequest(user_username, friend_username, userId, friendId, setUserFriendsList, setUserFriendRequestList, imgUrl, getToken){
    try{
        const responseText = await POST_acceptFriendRequest(userId, friendId, getToken); // update friendship status to "ACCEPTED"
        setUserFriendsList(prevList => { // add friend to friendsList
            if(!prevList.includes(friend_username)){
                return [...prevList, {friendName: friend_username, imgUrl: imgUrl}];
            }
            else return prevList;
        });
        setUserFriendRequestList((prevList) => prevList.filter((friend) => friend.friendName !== friend_username)); // remove from the friend request list
        toast.success(responseText);
    }
    catch(error){
        toast.error(error.message);
    }
}

// reject the friend-request
export async function deleteFriendRequest(user_username, friend_username, userId, friendId, setUserFriendList, setUserFriendRequestList, getToken){
    try{
        const responseText = await DELETE_deleteFriendRequest(userId, friendId, getToken);
        setUserFriendRequestList((prevList) => prevList.filter((friend) => friend.friendName !== friend_username)); //creates a copy of the list and removes the accepted FR from it

        toast(responseText, {
            icon: "🗑️",
        });
    }
    catch{
        return null;
    }
}

// delete an existing friendship
export async function deleteFriendship(user_username, friend_username, userId, friendId, setUserFriendList, setUserFriendRequestList, getToken){
    try{
        const responseText = await DELETE_deleteFriendship(userId, friendId, getToken);
        setUserFriendList((prevList) => prevList.filter((friend) => friend.friendName !== friend_username));
        toast(responseText, {
            icon: "🗑️",
        });
    }
    catch{
        return null;
    }
}

export async function friendRequestListLoader(userId, setFriendRequestList, getToken){
    const friendRequests = await GET_allFriendRequests(userId, getToken);
    // first ↑ we get all friend-requests from the database, then we add each FR to the list so we can display it on the page
    if(!friendRequests || friendRequests.length === 0){
        setFriendRequestList([]);
        return;
    }
    setFriendRequestList([]); // reset the list so everytime we get fresh FR from the db
    for(const friendName of friendRequests){
        getUser_object(friendName, getToken).then(result => {
            setFriendRequestList(prevList => [...prevList, {
                friendName: friendName,
                friendId: result.userId,
                imgUrl: result.userImgUrl,
                email: result.userEmail
            }]);
        });
    }
}

export async function friendListLoader(userId, setFriendList, getToken){
    const friends = await GET_allFriends(userId, getToken);
    // first ↑ we get all friends from the database, then we add each FRIEND to the list so we can display it on the page
    if(!friends || friends.length === 0){
        setFriendList([]);
        return;
    }
    setFriendList([]);
    setFriendList(friends); // different than method friendRequestListLoader, because this endpoint returns an object of users, the friendRequestListLoader returns an array of usernames
}

export function getUniqueTestID(prefix) {
    return prefix + "-" + crypto.randomUUID();
}

function setParams(testID, testDifficulty, readOnly){
    return "?" + new URLSearchParams({testID, testDifficulty, readOnly}).toString();
}

export function goToPage(path, navigate, readOnly = null, difficulty = null){
    navigate({
        pathname: path,
        search: difficulty ? setParams(getUniqueTestID("EL"), difficulty, readOnly) : undefined
    });
}

// filter tests by difficulty
export function filterTestsByDifficulty(tests, difficulty){
    return tests.filter((test) => test.difficulty === difficulty);
}

// get medal count
export function getMedalCount(tests, medalType){
    return tests.filter((test) => test.medal.toLowerCase() === medalType).length;
}

// get most often grade
export function getAvgGrade(tests){
    let count = 0;

    for(const test of tests){
        count += parseInt(test.percentage);
    }
    return (count/tests.length).toFixed(2);
}

// get A-streak - how many times in a row a user got A from a test
export function getAStreak(tests){
    let bestStreak = 0;
    let currentStreak = 0;

    for(const test of tests){
        if(test.grade === "A") {
            currentStreak ++;
        }
        else{
            if(currentStreak > bestStreak) bestStreak = currentStreak;
            currentStreak = 0;
        }
    }
    if(currentStreak > bestStreak) bestStreak = currentStreak; // need to add this for this case [C, A, A]
    return bestStreak;
}

// get test length in minutes based on difficulty
export function getTestLength(difficulty){
    switch(difficulty){
        case "easy": return 20;
        case "medium": return 4;
        case "hard": return 60;
    }
}

// find if a gold medal exists
// get the highest percentage of the test with a gold medal reward
export function findGoldMedal(tests){
    let highestPercentage = 0;

    for(const test of tests){
        if(test.difficulty === "hard" && test.medal === "gold"){
            if(test.percentage > highestPercentage) highestPercentage = test.percentage;
        }
    }
    return {enabled: highestPercentage !== 0, percentage: highestPercentage};
}

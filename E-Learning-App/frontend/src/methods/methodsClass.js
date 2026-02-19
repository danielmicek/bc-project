import {
    DELETE_deleteFriend,
    GET_allFriendRequests,
    GET_allFriends,
    GET_friendship,
    GET_user,
    PATCH_acceptFriendRequest,
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

export async function getUser_info(user){ // only find if a user exists
    const responseObject = await GET_user(user.username);
    if(responseObject.status !== 200){
        await POST_user(user.id, user.emailAddresses[0].emailAddress, user.username, user.imageUrl);
    }
}

export async function getUser_object(username){ //async function always returns promise -> this function returns the actual user object
    const responseObject = await GET_user(username);
    if(responseObject.status !== 200){
        return responseObject.status;
    }
    const responseJson = await responseObject.json();
    return({
        userId: responseJson.userId,
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
export async function sendFriendRequest(userUsername, user_id, friendUniqueIdentifier){

    let friendUsername;

    try{ // if userUid is userPage url
        const url = new URL(friendUniqueIdentifier);
        const params = new URLSearchParams(url.search);
        friendUsername = params.get("username");
    }
    catch{ // if userUid is actual uid - not url
        friendUsername = friendUniqueIdentifier;
    }

    let responseObject = await GET_user(friendUsername);
    if(responseObject.status === 404){
        toast.error("User not found");
        return;
    }

    const friend_id = (await responseObject.json()).userId;

    responseObject = await GET_friendship(user_id, friend_id)
    if(responseObject.status === 200){
        toast.success("Friendship already exists");
    }
    else{
        try {
            await toast.promise(
                POST_friendship(userUsername, friendUsername, user_id, friend_id),
                {
                    loading: "Sending friend request...",
                    success: (responseText) => responseText,
                    error: (responseErrorText) => responseErrorText.message,
                }
            );
        } catch (e) {}
    }
}

// accept the friend-request from friend_username user
export async function acceptFriendRequest(user_username, friend_username, userId, friendId, setUserFriendsList, setUserFriendRequestList, imgUrl){

    let friendshipResponseObject = await PATCH_acceptFriendRequest(userId, friendId); // update friendship status to "ACCEPTED"

    if(friendshipResponseObject.status === 200){
        setUserFriendsList(prevList => { // add friend to friendsList
            if(!prevList.includes(friend_username)){
                return [...prevList, {friendName: friend_username, imgUrl: imgUrl}];
            }
            else return prevList;
        })
        setUserFriendRequestList((prevList) => prevList.filter((friend) => friend.friendName !== friend_username)); // remove from the friend request list
        toast.success("Friend request accepted");
    }
    else{
        toast.error("Error during friend request acceptance");
        //return null;
    }
}

// reject the friend-request from friend_username user
// flag: FR = "friend request" => delete friend request from db and update userFriendRequestList
//       F = "friend" => delete friend from db and update userFriendList"
export async function deleteFriend(flag, user_username, friend_username, userId, friendId, setUserFriendList, setUserFriendRequestList){
    let friendshipResponseObject = await DELETE_deleteFriend(userId, friendId);

    if(friendshipResponseObject.status === 200){
        if(flag === "FR"){
            setUserFriendRequestList((prevList) => prevList.filter((friend) => friend.friendName !== friend_username)); //creates a copy of the list and removes the accepted FR from it
        }
        else if(flag === "F"){
            setUserFriendList((prevList) => prevList.filter((friend) => friend.friendName !== friend_username));
        }

        toast(await friendshipResponseObject.text(), {
            icon: '🗑️',
        });
    }
    else{
        return null;
    }
}

export async function friendRequestListLoader(userId, setFriendRequestList, setIsLoading){
    const result = await GET_allFriendRequests(userId, setIsLoading)
    // first ↑ we get all friend-requests from the database, then we add each FR to the list so we can display it on the page
    if(result.status === 404){
        setFriendRequestList([]);
        return;
    }
    const friendRequests = await result.json();
    setFriendRequestList([]); // reset the list so everytime we get fresh FR from the db
    for(let friendName of friendRequests){
        getUser_object(friendName).then(result => {
            setFriendRequestList(prevList => [...prevList, {friendName: friendName, friendId: result.userId, imgUrl: result.userImgUrl, email: result.userEmail}]);
        })
    }
    //toast.success('Friend requests loaded!');
}

export async function friendListLoader(userId, setFriendList, setIsLoading){
    const result = await GET_allFriends(userId, setIsLoading)
    // first ↑ we get all friends from the database, then we add each FRIEND to the list so we can display it on the page
    if(result.status === 404){
        setFriendList([])
        toast.error('Žiadne novinky');
        return;
    }
    setFriendList([])
    setFriendList(await result.json()); // different than method friendRequestListLoader, because this endpoint returns an object of users, the friendRequestListLoader returns an array of usernames
}

export function getUniqueTestID(prefix) {
    return prefix + "-" + crypto.randomUUID();
}

function setParams(testID, testDifficulty, readOnly){
    return "?" + new URLSearchParams({testID, testDifficulty, readOnly}).toString()
}

export function goToPage(path, navigate, readOnly = null, difficulty = null){
    navigate({
        pathname: path,
        search: difficulty ? setParams(getUniqueTestID("EL"), difficulty, readOnly) : undefined
    });
}

// filter tests by difficulty
export function filterTestsByDifficulty(tests, difficulty){
    return tests.filter((test) => test.difficulty === difficulty)
}

// get medal count
export function getMedalCount(tests, medalType){
    return tests.filter((test) => test.medal.toLowerCase() === medalType).length
}

// get most often grade
export function getAvgGrade(tests){
    let count = 0

    for(const test of tests){
        count += parseInt(test.percentage)
    }
    return (count/tests.length).toFixed(2)
}

// get A-streak - how many times in a row a user got A from a test
export function getAStreak(tests){
    let bestStreak = 0
    let currentStreak = 0

    for(const test of tests){
        if(test.grade === "A") {
            currentStreak ++
        }
        else{
            if(currentStreak > bestStreak) bestStreak = currentStreak
            currentStreak = 0
        }
    }
    if(currentStreak > bestStreak) bestStreak = currentStreak // need to add this for this case [C, A, A]
    return bestStreak
}
// get test length in minutes based on difficulty
export function getTestLength(difficulty){
    switch(difficulty){
        case "easy": return 20
        case "medium": return 30
        case "hard": return 40
    }
}

// find if a gold medal exists
// get the highest percentage of the test with a gold medal reward
export function findGoldMedal(tests){
    let highestPercentage = 0

    for(const test of tests){
        if(test.difficulty === "hard" && test.medal === "gold"){
            if(test.percentage > highestPercentage) highestPercentage = test.percentage
        }
    }
    return {enabled: highestPercentage !== 0, percentage: highestPercentage}
}
/*-------------USER API CALLS----------------------------------------------------------------*/
export async function POST_user(clerk_id, email, username, imageUrl) {

    const x = await fetch(`http://localhost:3000/api/user/addUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: clerk_id,
            username: username,
            email: email, //"test" + randn(2) + "@gmail.com"
            image_url: imageUrl
        })
    })
        console.log(await x.text());
}

export async function GET_user(username){
    return await fetch(`http://localhost:3000/api/user/getUser/${username}`, {
        method: "GET"
    })
}

export async function PUT_user(username, email, imageUrl, userId){
    const response = await fetch(`http://localhost:3000/api/user/putUser`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_username: username,
            user_email: email,
            user_imageUrl: imageUrl,
            clerk_user_id: userId
        })
    })

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.text();
}

export async function GET_UserScore(userId){
    //setIsLoading(true);
    const response = await fetch(`http://localhost:3000/api/user/getUserScore/${userId}`, {
        method: "GET",
        cache: "no-store"
    })
    //setIsLoading(false);
    return await response.json();
}
/*----------------------------------------------------------------------------------------------*/

/*-------------FRIENDSHIP API CALLS----------------------------------------------------------------*/
export async function POST_friendship(userUsername, friendUsername, userId, friendId) {
    const response = await fetch(`http://localhost:3000/api/friendship/sendFriendRequest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_username: userUsername,
            friend_username: friendUsername,
            status: "PENDING",
            from: userId,
            user_id: userId,
            friend_id: friendId
        })
    })

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.text();
}

export async function GET_friendship(user_id, friend_id){         // check if friendship with particular user exists (the state does not matter)
    return await fetch(`http://localhost:3000/api/friendship/getFriendship/${user_id}/${friend_id}`, {
        method: "GET"
    })
}

export async function GET_allFriendRequests(userId, setIsLoading){
    setIsLoading(true);
    const response = await fetch(`http://localhost:3000/api/friendship/getAllFriendRequests/${userId}`, {
        method: "GET",
        cache: "no-store"
    })
    setIsLoading(false);
    return response;
}

export async function GET_allFriends(userId, setIsLoading){
    setIsLoading(true);
    const response = await fetch(`http://localhost:3000/api/friendship/getAllFriends/${userId}`, {
        method: "GET",
        cache: "no-store"
    })
    setIsLoading(false);
    return response;
}

export async function PATCH_acceptFriendRequest(userId, friendId){    // accepting frined request by updating status PENDING to ACCEPTED
    return await fetch(`http://localhost:3000/api/friendship/getFriendship/${userId}/${friendId}`, {
        method: "PATCH"
    })
}

export async function DELETE_deleteFriend(userId, friendId){
    return await fetch(`http://localhost:3000/api/friendship/deleteFriend/${userId}/${friendId}`, {
        method: "DELETE"
    })
}
/*----------------------------------------------------------------------------------------------*/

/*-------------TEST API CALLS----------------------------------------------------------------*/
// POST because we are sending body - recommended not to do so in GET requests
export async function POST_getBestTestScore(tests) {
    const response = await fetch(`http://localhost:3000/api/test/getBestTestScore`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tests: tests
        })
    })
    return await response.text();
}

export async function GET_getTestByTestId(testId){
    //setIsLoading(true);
    const response = await fetch(`http://localhost:3000/api/test/getTestByTestId/${testId}`, {
        method: "GET",
        cache: "no-store"
    })
    //setIsLoading(false);
    return await response.json();
}

export async function POST_submitTest(testStructure, testDifficulty, userId, testId, setIsLoading) {
    setIsLoading(true);
    console.log(testStructure);
    const response = await fetch(`http://localhost:3000/api/test/submitTest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: userId,
            testId: testId,
            testStructure: testStructure,
            testDifficulty: testDifficulty
        })
    })
    setIsLoading(false)
    return await response.json();
}

export async function GET_allUsersTests(userId){
    //setIsLoading(true);
    const response = await fetch(`http://localhost:3000/api/test/getAllUsersTests/${userId}`, {
        method: "GET",
        cache: "no-store"
    })
    //setIsLoading(false);
    return await response.json();
}

export async function GET_createdTest(testDifficulty) {
    const response = await fetch(`http://localhost:3000/api/test/createTest/${testDifficulty}`, {
        method: "GET",
        cache: "no-store"
    })
    if(!response.ok) {
        throw new Error("AI request failed");
    }
    return await response.json();
}
/*----------------------------------------------------------------------------------------------*/

/*-------------GET NOTION ID CALL----------------------------------------------------------------*/
export async function GET_notionId(chapter) {
    const response = await fetch(`http://localhost:3000/api/chapters/getNotionId/${chapter}`, {
        method: "GET",
        cache: "no-store"
    })
    return await response.json();
}
/*----------------------------------------------------------------------------------------------*/

/*-------------GET ALL CHAPTERS----------------------------------------------------------------*/
export async function GET_allChapters() {
    const response = await fetch(`http://localhost:3000/api/chapters/getAllChapters`, {
        method: "GET",
        cache: "no-store"
    })
    return await response.json();
}
/*----------------------------------------------------------------------------------------------*/
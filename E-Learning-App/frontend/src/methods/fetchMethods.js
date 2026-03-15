/*-------------USER API CALLS----------------------------------------------------------------*/
const buildAuthHeaders = async (getToken, extraHeaders = {}) => {
    const token = await getToken();
    return {
        ...extraHeaders,
        Authorization: `Bearer ${token}`,
    };
};

export async function POST_user(clerk_id, email, username, imageUrl, getToken) {

    const headers = await buildAuthHeaders(getToken, {"Content-Type": "application/json"});
    const x = await fetch(`http://localhost:3000/api/user/addUser`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            user_id: clerk_id,
            username: username,
            email: email,
            image_url: imageUrl
        })
    })
}

export async function GET_user(username, getToken){
    const headers = await buildAuthHeaders(getToken);
    return await fetch(`http://localhost:3000/api/user/getUser/${username}`, {
        method: "GET",
        headers
    })
}

export async function PUT_user(username, email, imageUrl, userId, getToken){
    const headers = await buildAuthHeaders(getToken, {"Content-Type": "application/json"});
    const response = await fetch(`http://localhost:3000/api/user/putUser`, {
        method: "PUT",
        headers,
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

export async function GET_UserScore(userId, getToken){
    const headers = await buildAuthHeaders(getToken);
    const response = await fetch(`http://localhost:3000/api/user/getUserScore/${userId}`, {
        method: "GET",
        headers,
        cache: "no-store"
    })
    return await response.json();
}
/*----------------------------------------------------------------------------------------------*/

/*-------------FRIENDSHIP API CALLS----------------------------------------------------------------*/
export async function POST_friendship(userUsername, friendUsername, userId, friendId, getToken) {
    const headers = await buildAuthHeaders(getToken, {"Content-Type": "application/json"});
    const response = await fetch(`http://localhost:3000/api/friendship/sendFriendRequest`, {
        method: "POST",
        headers,
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

export async function GET_friendship(user_id, friend_id, getToken){         // check if friendship with a particular user exists (the state does not matter)
    const headers = await buildAuthHeaders(getToken);
    return await fetch(`http://localhost:3000/api/friendship/getFriendship/${user_id}/${friend_id}`, {
        method: "GET",
        headers
    })
}

export async function GET_allFriendRequests(userId, getToken){
    const headers = await buildAuthHeaders(getToken);
    return await fetch(`http://localhost:3000/api/friendship/getAllFriendRequests/${userId}`, {
        method: "GET",
        headers,
        cache: "no-store"
    });
}

export async function GET_allFriends(userId, getToken){
    const headers = await buildAuthHeaders(getToken);
    return await fetch(`http://localhost:3000/api/friendship/getAllFriends/${userId}`, {
        method: "GET",
        headers,
        cache: "no-store"
    });
}

export async function PATCH_acceptFriendRequest(userId, friendId, getToken){    // accepting a friend request by updating status PENDING to ACCEPTED
    const headers = await buildAuthHeaders(getToken);
    return await fetch(`http://localhost:3000/api/friendship/acceptFriendRequest/${userId}/${friendId}`, {
        method: "PATCH",
        headers
    })
}

export async function DELETE_deleteFriend(userId, friendId, getToken){
    const headers = await buildAuthHeaders(getToken);
    return await fetch(`http://localhost:3000/api/friendship/deleteFriend/${userId}/${friendId}`, {
        method: "DELETE",
        headers
    })
}
/*----------------------------------------------------------------------------------------------*/

/*-------------TEST API CALLS----------------------------------------------------------------*/
// POST because we are sending body - recommended not to do so in GET requests
export async function POST_getBestTestScore(tests, getToken) {
    const headers = await buildAuthHeaders(getToken, {"Content-Type": "application/json"});
    const response = await fetch(`http://localhost:3000/api/test/getBestTestScore`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            tests: tests
        })
    })
    return await response.text();
}

export async function GET_getTestByTestId(testId, getToken){
    const headers = await buildAuthHeaders(getToken);
    const response = await fetch(`http://localhost:3000/api/test/getTestByTestId/${testId}`, {
        method: "GET",
        headers,
        cache: "no-store"
    })
    return await response.json();
}

export async function POST_submitTest(testStructure, testDifficulty, userId, testId, setIsLoading, getToken) {
    setIsLoading(true);
    const headers = await buildAuthHeaders(getToken, {"Content-Type": "application/json"});
    const response = await fetch(`http://localhost:3000/api/test/submitTest`, {
        method: "POST",
        headers,
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

export async function getCertificateById(certId, getToken){
    const headers = await buildAuthHeaders(getToken);
    const response = await fetch(`http://localhost:3000/api/test/getCertificateById/${certId}`, {
        method: "GET",
        headers,
        cache: "no-store"
    })
    return await response.json();
}

export async function POST_postCertificate(certId, username, getToken) {
    const headers = await buildAuthHeaders(getToken, {"Content-Type": "application/json"});
    const response = await fetch(`http://localhost:3000/api/test/postCertificate`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            certId: certId,
            username: username
        })
    })
    return await response.json();
}

export async function GET_allUsersTests(userId, getToken){
    const headers = await buildAuthHeaders(getToken);
    const response = await fetch(`http://localhost:3000/api/test/getAllUsersTests/${userId}`, {
        method: "GET",
        headers,
        cache: "no-store"
    })
    return await response.json();
}

export async function GET_createdTest(testDifficulty, getToken) {
    const headers = await buildAuthHeaders(getToken);
    const response = await fetch(`http://localhost:3000/api/test/createTest/${testDifficulty}`, {
        headers,
        method: "GET",
        cache: "no-store"
    })
    if(!response.ok) {
        throw new Error("AI request failed");
    }
    return await response.json();
}
/*----------------------------------------------------------------------------------------------*/

/*-------------GET NOTION-ID C------------------------------------------------------------------*/
export async function GET_notionId(chapter, getToken) {
    const headers = await buildAuthHeaders(getToken);
    const response = await fetch(`http://localhost:3000/api/chapters/getNotionId/${chapter}`, {
        method: "GET",
        headers,
        cache: "no-store"
    })
    return await response.json();
}
/*---------------------------------------------------------------------------------------------*/

/*-------------GET ALL CHAPTERS----------------------------------------------------------------*/
export async function GET_allChapters(getToken) {
    const headers = await buildAuthHeaders(getToken);
    const response = await fetch(`http://localhost:3000/api/chapters/getAllChapters`, {
        method: "GET",
        headers,
        cache: "no-store"
    })
    return await response.json();
}
/*---------------------------------------------------------------------------------------------*/
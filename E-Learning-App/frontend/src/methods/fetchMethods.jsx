/*-------------USER API CALLS----------------------------------------------------------------*/
export async function POST_user(clerk_id, email, username, imageUrl) {

    const x = await fetch(`http://localhost:3000/api/addUser`, {
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
    return await fetch(`http://localhost:3000/api/getUser/${username}`, {
        method: "GET"
    })
}

export async function PUT_user(username, email, imageUrl, userId){
    const response = await fetch(`http://localhost:3000/api/putUser`, {
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
/*----------------------------------------------------------------------------------------------*/

/*-------------FRIENDSHIP API CALLS----------------------------------------------------------------*/
export async function POST_friendship(userUsername, friendUsername, userId, friendId) {
    const response = await fetch(`http://localhost:3000/api/friendRequest`, {
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
    return await fetch(`http://localhost:3000/api/getFriendship/${user_id}/${friend_id}`, {
        method: "GET"
    })
}

export async function GET_allFriendRequests(userId, setIsLoading){
    setIsLoading(true);
    const response = await fetch(`http://localhost:3000/api/getAllFriendRequests/${userId}`, {
        method: "GET",
        cache: "no-store"
    })
    setIsLoading(false);
    return response;
}

export async function GET_allFriends(userId, setIsLoading){
    setIsLoading(true);
    const response = await fetch(`http://localhost:3000/api/getAllFriends/${userId}`, {
        method: "GET",
        cache: "no-store"
    })
    setIsLoading(false);
    return response;
}

export async function PATCH_acceptFriendRequest(userId, friendId){    // accepting frined request by updating status PENDING to ACCEPTED
    return await fetch(`http://localhost:3000/api/getFriendship/${userId}/${friendId}`, {
        method: "PATCH"
    })
}

export async function DELETE_deleteFriend(userId, friendId){
    return await fetch(`http://localhost:3000/api/deleteFriend/${userId}/${friendId}`, {
        method: "DELETE"
    })
}
/*----------------------------------------------------------------------------------------------*/

/*-------------TEST API CALLS----------------------------------------------------------------*/
export async function POST_test(testID, points, date, grade, medal, username, structure) {
    const x = await fetch(`http://localhost:3000/api/addTest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            test_id: testID,
            points: points,
            date: date,
            grade: grade,
            medal: medal,
            fk_username: username,
            structure: structure
        })
    })
    console.log(await x.text());
}
/*----------------------------------------------------------------------------------------------*/

/*-------------AI API CALLS----------------------------------------------------------------*/
export async function GET_ai_response(prompt) {
    const response = await fetch(`http://localhost:3000/api/ai`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: prompt
        })
    })

    if (!response.ok) {
        throw new Error("AI request failed");
    }

    return await response.json()
}
/*----------------------------------------------------------------------------------------------*/

/*-------------GET NOTION ID CALL----------------------------------------------------------------*/
export async function GET_notionId(chapter) {
    const response = await fetch(`http://localhost:3000/api/getNotionId/${chapter}`, {
        method: "GET",
        cache: "no-store"
    })
    return await response.json();
}
/*----------------------------------------------------------------------------------------------*/

/*-------------GET ALL CHAPTERS----------------------------------------------------------------*/
export async function GET_allChapters() {
    const response = await fetch(`http://localhost:3000/api/getAllChapters`, {
        method: "GET",
        cache: "no-store"
    })
    return await response.json();
}
/*----------------------------------------------------------------------------------------------*/

/*-------------GET ALL QUESTIONS OF SPECIFIC DIFFICULTY----------------------------------------------------------------*/
export async function GET_Questions(difficulty) {
    const response = await fetch(`http://localhost:3000/api/getQuestionsBasedOnDifficulty/${difficulty}`, {
        method: "GET",
        cache: "no-store"
    })
    return await response.json();
}
/*----------------------------------------------------------------------------------------------*/
/*-------------USER API CALLS----------------------------------------------------------------*/
export async function postRequest_user(clerk_id, email, first_name, last_name, username) {

    const x = await fetch(`http://localhost:3000/api/addUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: clerk_id,
            username: username,
            email: email //"test" + randn(2) + "@gmail.com",
        })
    })
        console.log(await x.text());
}

export async function getRequest_user(userId){
    return await fetch(`http://localhost:3000/api/getUser/${userId}`, {
        method: "GET"
    })
}
/*----------------------------------------------------------------------------------------------*/

/*-------------FRIENDSHIP_REQUEST API CALLS----------------------------------------------------------------*/
export async function postRequest_friendship(userId, friendId) {
    const x = await fetch(`http://localhost:3000/api/friendRequest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: userId,
            friend_id: friendId,
            status: "PENDING",
            from: userId
        })
    })
    console.log(await x.text());
}

export async function getRequest_friendship(userId, friendId){         // check if friendship with particular user exists (the state does not matter)
    return await fetch(`http://localhost:3000/api/getFriendship/${userId}/${friendId}`, {
        method: "GET"
    })
}

export async function getRequest_allFriendRequests(userId){
    return await fetch(`http://localhost:3000/api/getAllFriendRequests/${userId}`, {
        method: "GET"
    })
}

export async function patchRequest_allFriendRequests(userId, friendId){    // accepting frined request by updating status PENDING to ACCEPTED
    return await fetch(`http://localhost:3000/api/getFriendship/${userId}/${friendId}`, {
        method: "PATCH"
    })
}
/*----------------------------------------------------------------------------------------------*/

/*-------------TEST API CALLS----------------------------------------------------------------*/
export async function postRequest_test(testID, points, date, grade, medal, userID, structure) {
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
            fk_user_id: userID,
            structure: structure
        })
    })
    console.log(await x.text());
}
/*----------------------------------------------------------------------------------------------*/
/*-------------USER API CALLS----------------------------------------------------------------*/
export async function POST_user(clerk_id, email, first_name, last_name, username, imageUrl) {

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
/*----------------------------------------------------------------------------------------------*/

/*-------------FRIENDSHIP API CALLS----------------------------------------------------------------*/
export async function POST_friendship(userUsername, friendUsername) {

    const x = await fetch(`http://localhost:3000/api/friendRequest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_username: userUsername,
            friend_username: friendUsername,
            status: "PENDING",
            from: userUsername
        })
    })
    console.log(await x.text());
}

export async function GET_friendship(userUsername, friendUsername){         // check if friendship with particular user exists (the state does not matter)
    return await fetch(`http://localhost:3000/api/getFriendship/${userUsername}/${friendUsername}`, {
        method: "GET"
    })
}

export async function GET_allFriendRequests(username){
    return await fetch(`http://localhost:3000/api/getAllFriendRequests/${username}`, {
        method: "GET"
    })
}

export async function GET_allFriends(username){
    return await fetch(`http://localhost:3000/api/getAllFriends/${username}`, {
        method: "GET"
    })
}

export async function PATCH_acceptFriendRequest(userUsername, friendUsername){    // accepting frined request by updating status PENDING to ACCEPTED
    return await fetch(`http://localhost:3000/api/getFriendship/${userUsername}/${friendUsername}`, {
        method: "PATCH"
    })
}

export async function DELETE_deleteFriend(userUsername, friendUsername){
    return await fetch(`http://localhost:3000/api/deleteFriend/${userUsername}/${friendUsername}`, {
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
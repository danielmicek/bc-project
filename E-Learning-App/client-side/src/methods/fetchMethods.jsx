/*-------------USER API CALLS----------------------------------------------------------------*/
export async function postRequest_user(clerk_id, email, first_name, last_name, username) {

    const x = await fetch(`http://localhost:3000/adduser`, {
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
    return await fetch(`http://localhost:3000/getuser/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

}
/*----------------------------------------------------------------------------------------------*/

/*-------------TEST API CALLS----------------------------------------------------------------*/
export async function postRequest_test(testID, points, date, grade, medal, userID, structure) {
    const x = await fetch(`http://localhost:3000/addtest`, {
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
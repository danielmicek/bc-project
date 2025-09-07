export async function postRequest(clerk_id, email, first_name, last_name) {
    const x = await fetch(`http://localhost:3000/adduser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: clerk_id,
            username: first_name + " " + last_name,
            email: email,//"test" + randn(2) + "@gmail.com",
            first_name: first_name,
            last_name: last_name
        })
    })
        console.log(await x.text());
}

export async function getRequest(userId){
    return await fetch(`http://localhost:3000/getuser/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

}
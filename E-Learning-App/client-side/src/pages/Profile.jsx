import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from "@clerk/clerk-react";
import TypingAnimatedText from "../components/TypingAnimatedText.jsx";
import '../styles/ProfileStyles/ProfileStyle.css';
import {getRequest, postRequest} from "../fetchMethods.jsx";
import React, {useEffect, useState} from "react";
import randn from "randn"


async function getUser(userId, user){ //async funkcia vzdy vracia promise
    var responseObject = await getRequest(userId);
    if(responseObject.status === 200){
        console.log("User already exists in the database. GET status code: " + responseObject.status);
    }
    else{
        console.log("User does not exist in the database, GET status code: " + responseObject.status + ". Creating POST request... " );
        postRequest(user.id, user.emailAddresses[0].emailAddress, user.firstName, user.lastName);

    }
}


export function Profile(){
    const {isSignedIn, user, isLoaded } = useUser();

    // Call the postRequest function when the user state changes
    useEffect(() => {
        if (isSignedIn && user) {
            getUser(user.id, user);
        }
    }, [isSignedIn, user]);


    // Wait until the user state is fully loaded
    if (!isLoaded) {
        console.log("Clerk is loading the user.");
        return <div>Loading...</div>;
    }



    return <>

            <SignedIn>
                <UserButton
                    appearance={{
                        elements: {
                            userButtonAvatarBox: "profileImg", // Apply your custom CSS class
                        },
                    }}
                />
            </SignedIn>


        {isSignedIn ?
            <div className = "loggedScreen">
                {user.firstName + " " + user.lastName + " is logged"}


            </div> :
            <>
                <div className= "circle">
                    <p className= "gridItem circleBigText">Not signed yet?</p>
                    <p className= "gridItem doItNow">Do it now!</p>
                    <SignedOut>
                        <SignInButton className = "gridItem signInButton" mode={"modal"}/>
                    </SignedOut>
                </div>
                <div className = "grid-container2">
                    <div className="gridItem2 item-a"><TypingAnimatedText /></div>
                    <div className="gridItem2 item-b">Study materials</div>
                    <div className="gridItem2 item-c">Test yourself</div>
                    <div className="gridItem2 item-d">See results</div>
                    <div className="gridItem2 item-e">Get certificate</div>
                </div></>
        }

        <button className = "createUser" onClick = {() =>
            postRequest("Jonatan", "test" + randn(2) + "@gmail.com")}> Create user in  dbs </button>

    </>

}
import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from "@clerk/clerk-react";
import TypingAnimatedText from "../components/TypingAnimatedText.jsx";
import '../styles/ProfileStyles/ProfileStyle.css';
import React from "react";


export function Profile(){
    const {isSignedIn, user, isLoaded } = useUser();
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

    </>

}
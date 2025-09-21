import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from "@clerk/clerk-react";
import TypingAnimatedText from "../components/TypingAnimatedText.jsx";
import SignedInProfilePage from "../components/SignedInProfilePage.jsx";
import '../styles/ProfileStyles/ProfileStyle.css';
import {getRequest, postRequest} from "../methods/fetchMethods.jsx";
import React, {useEffect} from "react";
import randn from "randn"
import { clerkClient } from '@clerk/express'
import CircularIndeterminate from "../components/Loader.jsx";
import {getUser} from "../methods/methodsClass.jsx";





export function Profile(){

    useEffect(() => { // Add the backgroundImage class to the body element so I can have different background image on each page
        document.body.classList.add("backgroundImage");
        return () => {
            document.body.classList.remove("backgroundImage");
        };
    }, []);

    const {isSignedIn, user, isLoaded } = useUser();
    if(isSignedIn && user){
        if(user.username === null || user.username === undefined){
            user.username = user.firstName + " " + user.lastName;
        }
    }
    // Call the postRequest function when the user state changes
    useEffect(() => {
        if (isSignedIn && user) {
            getUser(user.id, user);
        }
    }, [isSignedIn, user]);


    // Wait until the user state is fully loaded
    if (!isLoaded) {
        console.log("Clerk is loading the user.");
        return <CircularIndeterminate/>;
    }




    return <>

            <SignedIn>
                <UserButton className = "profileImg"
                            appearance={{
                                elements: {
                                    rootBox: "userButtonRoot",            // wrapper box
                                    userButtonAvatarBox: "profileImg",    // user avatar
                                },
                            }}/>
            </SignedIn>


        {isSignedIn ?
            <div className = "loggedScreen">
                <SignedInProfilePage uid = {user.id} userName = {user.username}/>

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
        <button className = "deleteUser" onClick = {() =>
            clerkClient.users.deleteUser("123")}> Delete user from Clerk </button>
        {/*<Link to = {`/userPage/${user.id}`} className="buttonLink">*/}
        {/*    <button className="customButton">user profile</button>*/}
        {/*</Link>*/}


    </>
}
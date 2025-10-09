import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from "@clerk/clerk-react";
import TypingAnimatedText from "../components/TypingAnimatedText.jsx";
import SignedInProfilePage from "../components/SignedInProfilePage.jsx";
import '../styles/ProfileStyles/ProfileStyle.css';
import React, {useEffect, useState} from "react";
import CircularIndeterminate from "../components/Loader.jsx";
import {acceptFriendRequest, getUser_info, sendFriendRequest} from "../methods/methodsClass.jsx";


export function Profile(){

    const [userImgUrlArray, setUserImgUrlArray] = useState([]);

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
            getUser_info(user.id, user);
        }
    }, [isSignedIn, user]);


    // Wait until the user state is fully loaded
    if (!isLoaded) {
        console.log("Clerk is loading the user.");
        return <CircularIndeterminate/>;
    }


    //console.log(userImgUrlArray);

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

        <button className = "customButton" onClick={() => {
            sendFriendRequest(user.id, "http://localhost:5173/userPage/?userId=user_33ZF02HSM9FeYH1cD8GRpXTlMuZ")
        }}>Send FR</button>

        <button className = "customButton" onClick={() => {
            acceptFriendRequest(user.id)
                .then(arrayOfAcceptedFriends => setUserImgUrlArray(arrayOfAcceptedFriends));

        }}>Accept FR</button>






        {isSignedIn ?

            <SignedInProfilePage uid = {user.id} userName = {user.username}/>

             :
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
        {/*<Link to = {`/userPage/${user.id}`} className="buttonLink">*/}
        {/*    <button className="customButton">user profile</button>*/}
        {/*</Link>*/}


    </>
}
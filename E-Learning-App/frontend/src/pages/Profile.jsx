import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from "@clerk/clerk-react";
import TypingAnimatedText from "../components/TypingAnimatedText.jsx";
import SignedInProfilePage from "../components/SignedInProfilePage.jsx";
import '../styles/ProfileStyles/ProfileStyle.css';
import React, {useEffect, useRef, useState} from "react";
import CircularIndeterminate from "../components/Loader.jsx";
import {acceptFriendRequest, getUser_info, sendFriendRequest} from "../methods/methodsClass.jsx";
import {GET_allFriendRequests} from "../methods/fetchMethods.jsx";


export function Profile(){

    const [userFriendRequestsArray, setUserFriendRequestsArray] = useState([]);
    const [userFriendsArray, setUserFriendsArray] = useState([]);
    const inputRef = useRef(null);

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
    // Call the postRequest function when the user state changes to save the user's information to the database
    useEffect(() => {
        if (isSignedIn && user) {
            getUser_info(user);
        }
    }, [isSignedIn, user]);


    // Wait until the user state is fully loaded
    if (!isLoaded) {
        console.log("Clerk is loading the user.");
        return <CircularIndeterminate/>;
    }


    console.log("friends: " + userFriendsArray);
    console.log("friend requests: " + userFriendRequestsArray);

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
            acceptFriendRequest(user.username, "sandor", setUserFriendsArray);
        }}>Accept FR</button>

        <button className = "customButton" onClick={() => {
            GET_allFriendRequests(user.username).then(result => async function () {
                // first ↑ we get all friend-requests from the database, then we add each FR to array so we can display it on the page
                if(result.status === 404){
                    console.log(await result.text());
                    return;
                }
                const friendRequests = await result.json();
                setUserFriendRequestsArray([]); // reset the array so everytime we get fresh FR from the db
                for(let friendRequest of friendRequests){
                    setUserFriendRequestsArray(prevArray => [...prevArray, friendRequest]);
                }
            }())
        }}>Show FR</button>

        <form
            onSubmit = {(event) => {
                event.preventDefault();
                sendFriendRequest(user.username, inputRef.current.value);
            }}
        >
            <input className = "userUidInput"
                ref = {inputRef}
                type = "text"
                placeholder = "Enter username or user's URL"
                pattern = "^([a-zA-Z0-9\-_\s]{4,15}|https?:\/\/.+)$" //regex for either being string of length č-15 or url address which i validate in sendFriendRequest
                onInvalid = {() => console.log("Invalid input")}
                required // when present, it specifies that an input field must be filled out before submitting the form
            />
            <button type="submit" className="customButton">Send FR</button>
        </form>


        {isSignedIn ?

            <SignedInProfilePage/>

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
import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from "@clerk/clerk-react";
import TypingAnimatedText from "../components/TypingAnimatedText.jsx";
import SignedInProfilePage from "../components/SignedInProfilePage.jsx";
import '../styles/ProfileStyles/ProfileStyle.css';
import React, {useEffect, useRef, useState} from "react";
import {
    acceptFriendRequest,
    deleteFriend,
    getUser_info,
    getUser_object,
    sendFriendRequest
} from "../methods/methodsClass.jsx";
import {GET_allFriendRequests, GET_allFriends} from "../methods/fetchMethods.jsx";
import FriendList from "../components/FriendList.jsx";
import CircularIndeterminate from "../components/Loader.jsx";


// initialize both friendList and list of FR by calling endpoints to get all friends and another one to get all FR
async function listInitializer(username, setFriendList, setFriendRequestList){
    let response = await GET_allFriends(username);
    if(response.status === 200){
        setFriendList((await response.json()));
    }

    response = await GET_allFriendRequests(username);
    if(response.status === 200){
        setFriendRequestList((await response.json()));
    }
}

export function Profile(){

    const [friendRequestsList, setFriendRequestList] = useState([]);
    const [userFriendList, setUserFriendList] = useState([]);
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

    // only call this when user is signed, isLoaded changes and user already exists
    useEffect(() => {
        if(isSignedIn && user !== undefined) listInitializer(user.username, setUserFriendList, setFriendRequestList)
    }, [isLoaded]);

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

        <button className = "customButton" onClick={() => {
            GET_allFriendRequests(user.username).then(result => async function () {
                // first ↑ we get all friend-requests from the database, then we add each FR to the list so we can display it on the page
                if(result.status === 404){
                    return;
                }
                const friendRequests = await result.json();
                setFriendRequestList([]); // reset the list so everytime we get fresh FR from the db
                for(let friendName of friendRequests){
                    getUser_object(friendName).then(result => {
                        setFriendRequestList(prevList => [...prevList, {friendName: friendName, imgUrl: result.userImgUrl}]);
                    })
                }
            }())
        }}>Reload FR</button>

        <form
            onSubmit = {(event) => {
                event.preventDefault(); // prevent page reload
                sendFriendRequest(user.username, inputRef.current.value);
            }}
        >
            <input className = "userUidInput"
                ref = {inputRef}
                type = "text"
                placeholder = "Enter username or user's URL"
                pattern = "^([a-zA-Z0-9\-_\s]{4,15}|https?:\/\/.+)$" // regex for either being string of length 4-15 or url address which is validated in sendFriendRequest
                onInvalid = {() => console.log("Invalid input")} //todo create small popup instead of console.log
                required  // when present, it specifies that the input field must be filled out before submitting the form
            />
            <button type="submit" className="customButton">Send FR</button>
        </form>


        {isSignedIn ?
            <>
                <SignedInProfilePage/>

                <FriendList classname = "friendRequestList"
                            list = {friendRequestsList}
                            setRequestList = {setFriendRequestList}
                            setFriendsList = {setUserFriendList}
                            accept = {acceptFriendRequest}
                            deletee = {deleteFriend}
                            userUsername = {user.username}
                />

                <FriendList classname = "friendList"
                            list = {userFriendList}
                            setRequestList = {setFriendRequestList}
                            setFriendsList = {setUserFriendList}
                            accept = {acceptFriendRequest}
                            deletee = {deleteFriend}
                            userUsername = {user.username}
                />
            </>
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
    </>
}
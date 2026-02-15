import {useUser} from "@clerk/clerk-react";
import SignedInProfilePage from "./SignedInProfilePage.jsx";
import '../styles/styles.css';
import React, {useEffect, useRef, useState} from "react";
import {friendListLoader, friendRequestListLoader, getUser_info} from "../methods/methodsClass.jsx";
import {Toaster} from "react-hot-toast";
import TypingAnimatedText from "../components/TypingAnimatedText.jsx";
import SlidingCircle from "../components/SlidingCircle.jsx";
import Loader from "../components/Loader.jsx";


// initialize both friendList and list of FR by calling endpoints to get all friends and another one to get all FR
// Promise.all() is resolving both promises at the same time - parallel execution
async function listInitializer(userId,
                               setFriendList,
                               setFriendRequestList,
                               setIsLoading) {
    await Promise.all([
        friendRequestListLoader(userId, setFriendRequestList, setIsLoading),
        friendListLoader(userId, setFriendList, setIsLoading)
    ]);
}

export function Profile() {
    const [friendRequestsList, setFriendRequestList] = useState([]);
    const [userFriendList, setUserFriendList] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // these two ↓ are for loader to be displayed during fetching data from db

    const inputRef = useRef(null);
    useEffect(() => { // Add the backgroundImage class to the body element, so I can have different background image on each page
        document.body.classList.add("backgroundImage");
        return () => {
            document.body.classList.remove("backgroundImage");
        };
    }, []);

    const {isSignedIn, user, isLoaded} = useUser();
    if (isSignedIn && user) {
        if (user.username === null || user.username === undefined) {
            user.username = user.firstName + " " + user.lastName;
        }
    }
    // Call the postRequest function when the user state changes to save the user's information to the database
    useEffect(() => {
        if (isSignedIn && user) {
            void getUser_info(user);
        }
    }, [isSignedIn, user]);

    // only call this when the user is signed, isLoaded changes, and the user already exists
    useEffect(() => {
        if (isSignedIn && user !== undefined) void listInitializer(user.id, setUserFriendList, setFriendRequestList, setIsLoading)
    }, [isLoaded]);

    // Wait until the user state is fully loaded
    if (!isLoaded) {
        console.log("Clerk is loading the user.");
        return <Loader/>;
    }

    return <div id="BLACK_BACKGROUND" className="flex flex-col w-full h-fit justify-center border-2 shadow-xl relative overflow-hidden"
                style={{backgroundColor: "#050505"}}>
        <div>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
        </div>

        {isSignedIn ?
            <>
                <SignedInProfilePage userFriendList = {userFriendList}
                                     friendRequestsList = {friendRequestsList}
                                     setUserFriendList = {setUserFriendList}
                                     setFriendRequestList = {setFriendRequestList}
                />
            </>
            :
            <>{/*left-[-50vh] md:left-[-60vh]*/}
                <SlidingCircle/>
                <div id = "GRID_CONTAINER" className="absolute right-[10%] grid h-auto w-[40%] gap-[50px] grid-cols-[50%_50%] grid-rows-[80px_80px_80px] [grid-template-areas:'zero_zero''first-left_first-right''sec-left_sec-right''last-left_last-right'] justify-center">
                    <div className="flex items-center justify-center text-white font-bold text-2xl border-2 border-white rounded-lg shadow-[5px_10px_30px_rgba(255,255,255,0.5)] hover:shadow-[5px_15px_35px_rgba(255,255,255,0.5)] [grid-area:zero]"><TypingAnimatedText/></div>
                    <div className="flex items-center justify-center text-white font-bold text-2xl border-2 border-white rounded-lg shadow-[5px_10px_30px_rgba(255,255,255,0.5)] hover:shadow-[5px_15px_35px_rgba(255,255,255,0.5)] [grid-area:first-left]">Study materials</div>
                    <div className="flex items-center justify-center text-white font-bold text-2xl border-2 border-white rounded-lg shadow-[5px_10px_30px_rgba(255,255,255,0.5)] hover:shadow-[5px_15px_35px_rgba(255,255,255,0.5)] [grid-area:first-right]">Test yourself</div>
                    <div className="flex items-center justify-center text-white font-bold text-2xl border-2 border-white rounded-lg shadow-[5px_10px_30px_rgba(255,255,255,0.5)] hover:shadow-[5px_15px_35px_rgba(255,255,255,0.5)] [grid-area:sec-left]">See results</div>
                    <div className="flex items-center justify-center text-white font-bold text-2xl border-2 border-white rounded-lg shadow-[5px_10px_30px_rgba(255,255,255,0.5)] hover:shadow-[5px_15px_35px_rgba(255,255,255,0.5)] [grid-area:sec-right]">Get certificate</div>
                </div>
            </>
        }
    </div>
}
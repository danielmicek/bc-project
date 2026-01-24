import React, {useRef, useState} from "react";
import ClickToCopy from "./ClickToCopy.jsx";
import {SignedIn, UserAvatar, useUser} from "@clerk/clerk-react";
import '../styles/index.css';
import {
    acceptFriendRequest,
    deleteFriend,
    friendRequestListLoader,
    sendFriendRequest
} from "../methods/methodsClass.jsx";
import FriendList from "./FriendList.jsx";


export default function SignedInProfilePage(){
    const [friendRequestsList, setFriendRequestList] = useState([]);
    const [userFriendList, setUserFriendList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    const {user} = useUser();
    return(<>
        <div id = "MAIN_CONTAINER_WITH_PROFILE_PIC" className="flex min-[900px]:flex-row max-[900px]:justify-center max-[900px]:pt-5 max-[480px]:px-3 flex-col items-center min-[900px]:flex-row min-[900px]:pl-20 h-fit sm:mx-[80px] mx-[30px] mt-[50px] pb-5 rounded-3xl bg-white flex shadow-xl relative">
            <SignedIn>
                <UserAvatar/>
            </SignedIn>
            <div id = "GRID_CONTAINER_LOGGED_PROFILE_PAGE" className="flex flex-col relative min-[900px]:ml-[80px] mt-[50px]">

                <div id = "USERNAME" className = "sm:text-4xl text-3xl font-bold mb-[15px] text-shadow-md max-[900px]:text-center">{user.username}</div>
                <div id = "EMAIL" className = "relative sm:text-xl text-lg text-[#888] max-[900px]:text-center">{user.primaryEmailAddress.emailAddress}</div>
                <div id = "MEMBER_SICNE" className = "relative sm:text-lg text-mf text-[#888] max-[900px]:text-center">Member since: 15.06.2025</div>
                <div className="flex relative mt-[25px]">
                    <ClickToCopy username = {user.username}/>
                </div>
                <div id = "SQUARES" className="flex flex-row relative justify-between mt-[25px] sm:gap-5 gap-3">
                    <div id = "FRIENDS" className = "flex text-center justify-center text-[var(--main-color-red)] font-bold border-[var(--main-color-red)] border items-center bg-[#fce1e4] sm:w-[100px] w-[90px] aspect-square rounded-3xl">Friends:<br/>2</div>
                    <div id = "FINISHED_TESTS" className = "flex text-center text-[var(--main-color-red)] font-bold border-[var(--main-color-red)] border items-center bg-[#fce1e4] px-2 w-fit rounded-3xl">Finished tests:<br/>4</div>
                    <div id = "BEST_TEST" className = "flex text-center text-[var(--main-color-red)] font-bold border-[var(--main-color-red)] border items-center bg-[#fce1e4] px-2 w-fit rounded-3xl">Best test score:<br/>92%</div>
                </div>
                {/*
                todo done tests*/}
            </div>
        </div>

        <div className="flex min-[900px]:flex-row flex-col items-center h-fit sm:mx-[80px] mx-[30px] mt-20 flex relative min-[900px]:gap-30 gap-10">
            <FriendList type="friendList"
                        list={userFriendList}
                        setRequestList={setFriendRequestList}
                        setFriendsList={setUserFriendList}
                        accept={acceptFriendRequest}
                        deletee={deleteFriend}
                        userUsername={user.username}
                        isLoading={isLoading}
            />

            <FriendList type="friendRequestList"
                        list={friendRequestsList}
                        setRequestList={setFriendRequestList}
                        setFriendsList={setUserFriendList}
                        accept={acceptFriendRequest}
                        deletee={deleteFriend}
                        userUsername={user.username}
                        isLoading={isLoading}
            />
        </div>

        <button className="customButton mt-50"
                onClick={() => friendRequestListLoader(user.username, setFriendRequestList, setIsLoading)}>Refresh FR
        </button>

        <form
            onSubmit={(event) => {
                event.preventDefault(); // prevent page reload
                sendFriendRequest(user.username, inputRef.current.value);
            }}
        >
            <input className="userUidInput"
                   ref={inputRef}
                   type="text"
                   placeholder="Enter username or user's URL"
                   pattern="^([a-zA-Z0-9\-_\s]{4,15}|https?:\/\/.+)$" // regex for either being string of length 4-15 or url address which is validated in sendFriendRequest
                   onInvalid={(event) => {
                       event.preventDefault();
                       toast.error("Invalid input\nMust be either name or user's URL")
                   }} // show error message when input is invalid
                   required  // when present, it specifies that the input field must be filled out before submitting the form
            />
            <button type="submit" className="customButton">Send FR</button>
        </form>
    </>)
}
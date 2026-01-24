import React, {useRef, useState} from "react";
import {SignedIn, UserAvatar, useUser} from "@clerk/clerk-react";
import '../styles/index.css';
import {
    acceptFriendRequest,
    deleteFriend,
    friendRequestListLoader,
    sendFriendRequest
} from "../methods/methodsClass.jsx";
import FriendList from "./FriendList.jsx";
import StatCard from "./StatCard.jsx";
import ClickToCopy from "./ClickToCopy.jsx";
import {Button} from "@heroui/react";


export default function SignedInProfilePage(){
    const [friendRequestsList, setFriendRequestList] = useState([]);
    const [userFriendList, setUserFriendList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    const {user} = useUser();
    return(<>
        <div id="MAIN_CONTAINER_WITH_PROFILE_PIC" className="shadow-[5px_10px_30px_rgba(252,147,40,0.5)] flex flex-col min-[900px]:flex-row items-center max-[900px]:justify-center max-[900px]:pt-5 max-[480px]:px-3 min-[900px]:pl-20 h-fit sm:mx-[80px] md:mx-[50px] mx-[30px] my-[50px] rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border-2 border-[var(--main-color-orange)] relative">
        <SignedIn>
                <UserAvatar/>
            </SignedIn>
            <div id = "GRID_CONTAINER_LOGGED_PROFILE_PAGE" className="flex flex-col relative min-[900px]:ml-[80px] my-[50px] min-[900px]:border-l-3 min-[900px]:border-l-[var(--main-color-orange)] min-[900px]:pl-20 max-[900px]:border-t-3 max-[900px]:border-t-[var(--main-color-orange)] max-[900px]:pt-20">

                <div id = "USERNAME" className = "sm:text-4xl text-3xl font-bold mb-[15px] text-shadow-md max-[900px]:text-center text-white">{user.username}</div>
                <div id = "EMAIL" className = "relative sm:text-xl text-lg text-[#BFBBBB] max-[900px]:text-center">{user.primaryEmailAddress.emailAddress}</div>
                <div id = "MEMBER_SICNE" className = "relative sm:text-lg text-mf text-[#BFBBBB] max-[900px]:text-center">Member since: 15.06.2025</div>

                <div id = "SQUARES" className="flex min-[700px]:flex-row flex-col items-center min-[700px]:flex-wrap min-[700px]:items-start justify-start mt-[25px] gap-3 sm:gap-5 min-[1000px]:pr-5 pt-10">
                    <StatCard text="Friends" imgPath="/friends.png" number={2}/>
                    <StatCard text="Finished tests" imgPath="/test.png" number={4}/>
                    <StatCard text="Best score %" imgPath="/score.png" number={92}/>
                </div>
                {/*
                todo done tests*/}
            </div>
        </div>

        <div id = "SEND_FR_AND_COPY_PROFILE_LINK_CONTAINER" className = "flex min-[800px]:flex-row flex-col gap-3 mt-[25px] items-center sm:mx-[80px] md:mx-[50px] mx-[30px]">
            <div className="flex relativ min-[1100px]:w-[50%] w-full">
                <ClickToCopy username = {user.username}/>
            </div>

            <form className="flex h-[55px] min-[1100px]:w-[50%] w-full"
                onSubmit={(event) => {
                    event.preventDefault(); // prevent page reload
                    sendFriendRequest(user.username, inputRef.current.value);
                }}
            >
                <input className="col-span-6 flex w-full rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-4 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
                <Button type = "submit" variant="light" className="bg-[var(--main-color-orange)] font-bold h-[55px] ml-2">
                    Send FR
                </Button>
            </form>
        </div>

        <div className="flex min-[900px]:flex-row flex-col items-center h-fit sm:mx-[80px] md:mx-[50px] mx-[30px] mt-20 flex relative min-[900px]:gap-30 gap-10">
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
    </>)
}
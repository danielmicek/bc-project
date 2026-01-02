import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from "@clerk/clerk-react";
import TypingAnimatedText from "../components/TypingAnimatedText.jsx";
import SignedInProfilePage from "../components/SignedInProfilePage.jsx";
import '../styles/styles.css';
import React, {useEffect, useRef, useState} from "react";
import {
    acceptFriendRequest,
    deleteFriend,
    friendRequestListLoader,
    getUser_info,
    sendFriendRequest
} from "../methods/methodsClass.jsx";
import {GET_allFriends} from "../methods/fetchMethods.jsx";
import FriendList from "../components/FriendList.jsx";
import CircularIndeterminate from "../components/Loader.jsx";
import {toast, Toaster} from "react-hot-toast";


// initialize both friendList and list of FR by calling endpoints to get all friends and another one to get all FR
// Promise.all() is resolving both promises at the same time - parallel execution
async function listInitializer(username,
                               setFriendList,
                               setFriendRequestList,
                               setIsLoading){
    await Promise.all([
        friendRequestListLoader(username, setFriendRequestList, setIsLoading),
        (async () => {
            let response = await GET_allFriends(username, setIsLoading);
            if(response.status === 200){
                setFriendList((await response.json()));
            }
            else if(response.status === 404){
                setIsLoading(false);
            }

        })() //immediate execution
    ]);
}

export function Profile(){

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

    // only call this when the user is signed, isLoaded changes, and the user already exists
    useEffect(() => {
        if(isSignedIn && user !== undefined) listInitializer(user.username, setUserFriendList, setFriendRequestList,
                                                setIsLoading)
    }, [isLoaded]);

    // Wait until the user state is fully loaded
    if (!isLoaded) {
        console.log("Clerk is loading the user.");
        return <CircularIndeterminate/>;
    }

    return <>

        <button
            className="">Click
            me
        </button>
        <SignedIn>
            <UserButton className="absolute rounded-full h-[40vh] w-[40vh] mt-[85vh] border-[5px] border-white"
                        appearance={{
                            elements: {
                                rootBox: "userButtonRoot",            // wrapper box
                                userButtonAvatarBox: "profileImg",    // user avatar
                            },
                        }}/>
        </SignedIn>

        <div>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
        </div>

        <button className="customButton"
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


        {isSignedIn ?
            <>
                <SignedInProfilePage/>

                <FriendList classname="friendRequestList"
                            list={friendRequestsList}
                            setRequestList={setFriendRequestList}
                            setFriendsList={setUserFriendList}
                            accept={acceptFriendRequest}
                            deletee={deleteFriend}
                            userUsername={user.username}
                            isLoading={isLoading}
                />

                <FriendList classname="friendList"
                            list={userFriendList}
                            setRequestList={setFriendRequestList}
                            setFriendsList={setUserFriendList}
                            accept={acceptFriendRequest}
                            deletee={deleteFriend}
                            userUsername={user.username}
                            isLoading={isLoading}
                />
            </>
            :
            <>
                <div ID = "CIRCLE" className="hover:left-0 relative z-10 grid grid-cols-2 grid-rows-4 [grid-template-areas:'._._''doItNow_circleBigText''signInButton_circleBigText''._._'] border-[15px] border-[#F7374F] border-l-0 rounded-tr-[1000%] rounded-br-[1000%]
                                h-[calc(100vh-70px)] w-[100vh] left-[-60vh] bg-white transition-[left,background-color] duration-[800ms] ease-in-out max-[900px]:w-[80vh] max-[900px]:left-[-45vh]">
                    <p id = "NOT_SIGNED_YET" className="flex items-center justify-center flex relative left-[20px] text-[2rem] font-medium [grid-area:circleBigText]">Not signed yet?</p>
                    <p id = "DO_IT_NOW" className="flex items-center justify-center text-[2rem] font-[1000] [grid-area:doItNow]">Do it now!</p>
                    <SignedOut>
                        <SignInButton className="customButton flex items-center justify-center" mode={"modal"}/>
                    </SignedOut>
                </div>
                <div id = "GRID_CONTAINER" className="absolute top-[40vh] left-[50vw] grid h-auto w-[13cm] gap-[5px] grid-cols-[50%_50%] grid-rows-[50px_50px_50px_50px] [grid-template-areas:'zero_zero''first-left_first-right''sec-left_sec-right''last-left_last-right'] justify-center">
                    <div className="flex items-center justify-center text-white border border-[#F7374F] rounded-[16px] transition-transform duration-300 ease-hover hover:scale-[1.05] hover:bg-[#F7374F] [grid-area:zero]"><TypingAnimatedText/></div>
                    <div className="flex items-center justify-center text-white border border-[#F7374F] rounded-[16px] transition-transform duration-300 ease-hover hover:scale-[1.05] hover:bg-[#F7374F] [grid-area:first-left]">Study materials</div>
                    <div className="flex items-center justify-center text-white border border-[#F7374F] rounded-[16px] transition-transform duration-300 ease-hover hover:scale-[1.05] hover:bg-[#F7374F] [grid-area:first-right]">Test yourself</div>
                    <div className="flex items-center justify-center text-white border border-[#F7374F] rounded-[16px] transition-transform duration-300 ease-hover hover:scale-[1.05] hover:bg-[#F7374F] [grid-area:sec-left]">See results</div>
                    <div className="flex items-center justify-center text-white border border-[#F7374F] rounded-[16px] transition-transform duration-300 ease-hover hover:scale-[1.05] hover:bg-[#F7374F] [grid-area:sec-right]">Get certificate</div>
                </div>
            </>
        }
    </>
}
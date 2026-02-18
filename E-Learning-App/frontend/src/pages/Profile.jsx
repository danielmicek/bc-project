import {useUser} from "@clerk/clerk-react";
import SignedInProfilePage from "./SignedInProfilePage.jsx";
import '../styles/styles.css';
import React, {useEffect} from "react";
import {getUser_info} from "../methods/methodsClass.js";
import {Toaster} from "react-hot-toast";
import TypingAnimatedText from "../components/TypingAnimatedText.jsx";
import SlidingCircle from "../components/SlidingCircle.jsx";
import Loader from "../components/Loader.jsx";


export function Profile() {

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

    return <div id="BLACK_BACKGROUND" className="flex flex-col w-full min-h-screen justify-center border-2 shadow-xl relative overflow-hidden"
                style={{backgroundColor: "#050505"}}>
        <div>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
        </div>

        {!isLoaded ? <Loader/>
        :
            isSignedIn ?
                    <>
                        <SignedInProfilePage/>
                    </>
                    :
                    <>
                        <SlidingCircle/>
                        <div id = "GRID_CONTAINER" className="absolute right-[10%] grid h-auto w-[40%] gap-[50px] grid-cols-[50%_50%] grid-rows-[80px_80px_80px] [grid-template-areas:'zero''first-left_first-right''sec-left_sec-right''last-left_last-right'] justify-center">
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
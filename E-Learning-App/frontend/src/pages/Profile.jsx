import {useUser} from "@clerk/clerk-react";
import SignedInProfilePage from "./SignedInProfilePage.jsx";
import '../styles/styles.css';
import React, {useEffect} from "react";
import {getUser_info} from "../methods/methodsClass.js";
import {Toaster} from "react-hot-toast";
import TypingAnimatedText from "../components/TypingAnimatedText.jsx";
import SlidingCircle from "../components/SlidingCircle.jsx";
import Loader from "../components/Loader.jsx";
import LightRays from "@/components/LightRays.jsx";


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

    // remove scrolling on the non-signed-in page
    useEffect(() => {
        if (window.location.pathname.includes("/profile") && !isSignedIn) {
            document.body.classList.add("overflow-hidden", "no-scrollbar");
        } else {
            document.body.classList.remove("overflow-hidden", "no-scrollbar");
        }

        return () => {
            document.body.classList.remove("overflow-hidden", "no-scrollbar");
        };
    }, [isSignedIn]);

    return <div id="BLACK_BACKGROUND" className={`flex flex-col bg-black justify-center overflow-y-hidden items-center shadow-xl relative ${isSignedIn ? "min-h-screen" : ""}`}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className ={`container relative flex flex-col items-center justify-center ${isSignedIn ? "" : "h-[100vh]"}`}>
            {!isLoaded ? <Loader/>
                :
                isSignedIn ?
                    <>
                        <SignedInProfilePage/>
                    </>
                    :
                    <>
                        <div className="absolute top-0 w-screen md:h-[30cm] h-[15cm]">
                            <LightRays
                                raysOrigin="top-center"
                                raysColor="#ffffff"
                                raysSpeed={1.3}
                                lightSpread={0.5}
                                rayLength={3}
                                followMouse={true}
                                mouseInfluence={0.1}
                                noiseAmount={0}
                                distortion={0}
                                className="custom-rays"
                                pulsating={false}
                                fadeDistance={1}
                                saturation={1}
                            />
                        </div>
                        <SlidingCircle/>
                        <div id = "GRID_CONTAINER" className="relative grid gap-10 px-10 md:mb-30 mt-10 pt-10 md:mt-0 md:pb-10 pb-[30vh] overflow-auto grid-cols-1 md:grid-cols-2">
                            <div className="profilePageGridElement flex items-center justify-center text-white font-bold text-2xl gap-5 md:col-span-2">
                                <TypingAnimatedText words={["Tvoja cesta", "začína tu", "a teraz."]}/>
                            </div>
                            <div className= "profilePageGridElement gap-5">
                                <img src="/learning-icon.png" alt="learning-icon" className="justify-self-center h-8"/>
                                Študuj materiály
                            </div>
                            <div className= "profilePageGridElement gap-5">
                                <img src="/test-white.png" alt="test" className="justify-self-center h-8"/>
                                Otestuj svoje vedomosti
                            </div>
                            <div className= "profilePageGridElement gap-5">
                                <img src="/progress.png" alt="progress" className="justify-self-center h-8"/>
                                Sleduj svoj progres
                            </div>
                            <div className= "profilePageGridElement gap-5">
                                <img src="/stats.png" alt="stats" className="justify-self-center h-8"/>
                                Sleduj štatistiky
                            </div>
                            <div className= "profilePageGridElement gap-5">
                                <img src="/certificate.png" alt="certificate" className="justify-self-center h-8"/>
                                Získaj certifikát
                            </div>
                            <div className= "profilePageGridElement gap-5">
                                <img src="/friends-white.png" alt="friends-white" className="justify-self-center h-8"/>
                                Pridávaj si priateľov
                            </div>
                        </div>
                    </>
            }
        </div>
        <div>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
        </div>




    </div>
}
import React, {useEffect} from 'react';
import '../styles/styles.css';
import {Button} from "@heroui/react";
import {SignedOut, SignInButton} from "@clerk/clerk-react";
import BigStatCard from "../components/BigStatCard.jsx";
import {Link} from "react-router-dom";
import LightRays from "../components/LightRays.jsx";

function Home() {

    /*window.addEventListener("popstate", () => {  kliknutie na backbutton v browseri
        console.log("popstate");
    });*/
    useEffect(() => { // Add the backgroundImage class to the body element so I can have different background image on each page
        document.body.classList.add("backgroundImageHomePage");
        return () => {
            document.body.classList.remove("backgroundImageHomePage");
        };
    }, []);

    return (
        <>
            <div id = "BLACK_BACKGROUND" className="flex flex-col w-full min-h-[300px] LightRays mt-0 shadow-xl relative"
                 style={{backgroundColor: "#050505"}}>

                <div className="container pb-20 flex flex-col items-center relative">
                    <div className="absolute w-screen md:h-[30cm] h-[15cm]">
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

                    <div className= "text-center mt-30 z-5">
                        <h1 className="font-[1000] text-7xl text-white pb-4">eleonore</h1>
                        <h2 className = "text-gray-500 relative">“Any fool can know.<br/>The point is to understand.”
                        </h2>
                    </div>

                    <div className="flex gap-10 items-end h-fit z-5">
                        <Link to="/courseInfoPage">

                        </Link>
                        <SignedOut>
                            <SignInButton className = "bg-(--main-color-orange) font-bold" mode={"modal"}>
                                <Button className = "w-full h-full">Sign in</Button>
                            </SignInButton>
                        </SignedOut>
                    </div>

                    <div id = "WHAT_IS_ELEONORE" className = "shadow-[5px_10px_30px_rgba(255,255,255,0.5)] z-5 flex flex-col items-center border-2 my-50 mx-20 text-white rounded-lg p-10">
                        <div className=" flex sm:gap-8 gap-3 w-full justify-center items-center">
                            <img src = "/question.png" className= "w-[45px] h-[45px]" alt = "question mark"/>
                            <h1 className="font-extrabold sm:text-4xl text-3xl w-fit sm:pr-0 pr-8">What is eleonore</h1>
                        </div>
                        <p className="text-gray-300 text-lg mt-3 text-center">
                            Eleonore is a focused learning environment built for people who want to understand, not rush.<br/>No distractions. No pressure. Just clear progress.</p>
                    </div>

                    <div id = "STAT_CARD_CONTAINER" className="flex flex-row gap-10 flex-wrap justify-center z-5">
                        <BigStatCard iconPath="/learning-icon.png"
                                     mainText="Practice what you learn"
                                     secondText={"Learn at your own depth, then test real understanding.\nGet certificate and export it as PDF."}
                        />
                        <BigStatCard iconPath="/ai.png"
                                     mainText="AI"
                                     secondText="Implemented AI to make each test unique, interesting and more effective."
                        />
                        <BigStatCard iconPath="/stats.png"
                                     mainText="Statistics"
                                     secondText="See your test history with results that show how your understanding improves over time."
                        />
                        <BigStatCard iconPath="/friends-white.png"
                                     mainText="Friends"
                                     secondText="Connect with friends, see their results and compare to stay motivated."
                        />

                    </div>
                    <div className="flex md:flex-row flex-col items-center justify-center z-5 mt-40 w-[100%] pr-10">
                        <img src="/laptop.png" alt="laptop" className="md:w-[500px] min-[1300px]:w-[800px] lg:w-[700px] w-[450px]"/>
                        <ul className="list-disc flex flex-col list-inside text-white mt-10 md:mt-0 pl-10">
                            <li className="mb-8 font-extrabold text-gray-400 text-xl">Get medal after passing the test</li>
                            <li className="mb-8 font-extrabold text-gray-400 text-xl">AI to rephrase the questions and answers</li>
                            <li className="mb-8 font-extrabold text-gray-400 text-xl">Focus on understanding, not memorization</li>
                            <li className="mb-8 font-extrabold text-gray-400 text-xl">A unique test every time</li>
                        </ul>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Home;
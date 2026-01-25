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
        <div id = "BLACK_BACKGROUND" className="flex flex-col w-full h-fit justify-center shadow-xl relative"
             style={{backgroundColor: "#050505"}}>
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
            <div className = "container pb-20 h-full flex flex-col items-center">

                <div className= "text-center mt-30 z-5">
                    <h1 className="font-[1000] text-7xl text-white pb-4">eleonore</h1>
                    <h2 className = "text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit, <br/> sed do eiusmod</h2>
                </div>

                <div className="flex gap-10 items-end h-fit z-5">
                    <Link to="/courseInfoPage">
                        <Button variant="light" className="bg-(--main-color-orange) font-bold w-fit mt-15">
                            See the course
                        </Button>
                    </Link>
                    <SignedOut>
                        <Button className = "bg-(--main-color-orange) font-bold">
                            <SignInButton className = "w-full h-full" mode={"modal"}/>
                        </Button>
                    </SignedOut>
                </div>

                <div id = "WHAT_IS_ELEONORE" className = "shadow-[5px_10px_30px_rgba(255,255,255,0.5)] z-5 flex flex-col items-center border-2 my-50 text-white rounded-lg p-10">
                    <div className="flex flex-row gap-8">
                        <img src = "/question.png" className= "w-[45px] h-[45px]" alt = "question mark"/>
                        <h1 className="font-extrabold text-4xl w-fit">What is eleonore</h1>
                    </div>
                    <p className="text-gray-300 text-lg  mt-3 text-center">
                        Eleonore is a focused learning environment built for people who want to understand, not rush.<br/>No distractions. No pressure. Just clear progress.</p>
                </div>

                <div id = "STAT_CARD_CONTAINER" className="flex flex-row gap-10 flex-wrap justify-center z-5">
                    <BigStatCard iconPath="/learning-icon.png"
                                 mainText="Practice what you learn"
                                 secondText="Learn at your own depth, then test real understanding."
                    />
                    <BigStatCard iconPath="/certificate.png"
                                 mainText="Get certificate"
                                 secondText="After successfully passing the test, you will receive a certificate you can export as PDF"
                    />
                    <BigStatCard iconPath="/stats.png"
                                 mainText="Statistics"
                                 secondText="See your test history with results that show how your understanding improves over time."
                    />
                    <BigStatCard iconPath="/friends-white.png"
                                 mainText="Friends"
                                 secondText="Connect with friends, see their results and compare results to stay motivated"
                    />
                </div>
                <img src="/laptop.png" alt="laptop" className="lg:w-[800px] md:w-[700px] w-[450px] mt-40 z-5"/>
            </div>
        </div>

    );
}

export default Home;
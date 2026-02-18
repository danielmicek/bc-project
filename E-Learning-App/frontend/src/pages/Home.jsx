import React from 'react';
import '../styles/styles.css';
import {Button, useDisclosure} from "@heroui/react";
import {SignedOut, SignInButton} from "@clerk/clerk-react";
import BigStatCard from "../components/BigStatCard.jsx";
import {Link} from "react-router-dom";
import LightRays from "../components/LightRays.jsx";
import VerifyCertificateModal from "../components/VerifyCertificateModal.jsx";

function Home() {

    /*window.addEventListener("popstate", () => {  kliknutie na backbutton v browseri
        console.log("popstate");
    });*/
    const {isOpen: isOpenVerifyCertModal, onOpen: onOpenVerifyCertModal, onClose: onCloseVerifyCertModal} = useDisclosure();

    return (
        <>
            {/*VERIFY CERTIFICATE MODAL*/}
            <VerifyCertificateModal title={"Overenie pravosti certifikátu"}
                                    isOpen={isOpenVerifyCertModal}
                                    onClose={onCloseVerifyCertModal}
            />

            <div id = "BLACK_BACKGROUND" className="flex flex-col w-full min-h-[300px] LightRays mt-0 shadow-xl relative overflow-hidden"
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
                                <Button className = "w-full h-full">Prihlásiť sa</Button>
                            </SignInButton>
                        </SignedOut>
                    </div>

                    <div id = "WHAT_IS_ELEONORE" className = "shadow-[5px_10px_30px_rgba(255,255,255,0.5)] z-5 flex flex-col items-center border-2 my-50 mx-20 text-white rounded-lg p-10">
                        <div className=" flex sm:gap-8 gap-3 w-full justify-center items-center">
                            <img src = "/question.png" className= "w-[45px] h-[45px]" alt = "question mark"/>
                            <h1 className="font-extrabold sm:text-4xl text-3xl w-fit sm:pr-0 pr-8">Čo je eleonore</h1>
                        </div>
                        <p className="text-gray-300 text-lg mt-8 text-center">
                            Eleonore je prostredie pre sústredené učenie určené pre tých, ktorí chcú skutočne pochopiť, nie sa len rýchlo presunúť ďalej.<br/>
                            Bez rozptýlení. Bez tlaku. Iba jasný a merateľný pokrok.</p>
                    </div>

                    <div id = "STAT_CARD_CONTAINER" className="flex flex-row gap-10 flex-wrap justify-center z-5 px-8">
                        <BigStatCard iconPath="/learning-icon.png"
                                     mainText="Získanie vedomostí"
                                     secondText={"Uč sa vlastným tempom a otestuj si skutočné vedomosti.\nZískaj certifikát a exportuj ho ako PDF."}
                        >
                        </BigStatCard>
                        <BigStatCard iconPath="/ai.png"
                                     mainText="AI"
                                     secondText="Implementované AI na vytvorenie unikátnych, zaujímavých a viac efektívnych testov."
                        />
                        <BigStatCard iconPath="/stats.png"
                                     mainText="Štatistiky"
                                     secondText="Sleduj históriu svojich testov a výsledky, ktoré ukazujú, ako sa tvoje vedomosti postupne zlepšujú."
                        />
                        <BigStatCard iconPath="/friends-white.png"
                                     mainText="Priatelia"
                                     secondText="Spoj sa s priateľmi, porovnaj si výsledky a motivujte sa navzájom k lepším výkonom."
                        />

                    </div>
                    <div className="flex md:flex-row flex-col items-center justify-center z-5 mt-40 w-[100%] pr-10">
                        <img src="/laptop.png" alt="laptop" className="md:w-[500px] min-[1300px]:w-[800px] lg:w-[700px] w-[450px]"/>
                        <ul className="list-disc flex flex-col list-inside text-white mt-10 md:mt-0 pl-10">
                            <li className="mb-8 font-extrabold text-gray-400 text-xl">Získaj medailu po úspechu v teste</li>
                            <li className="mb-8 font-extrabold text-gray-400 text-xl">AI na prefrázovanie otázok a odpovedí</li>
                            <li className="mb-8 font-extrabold text-gray-400 text-xl">Sústreď sa na pochopenie, nie memorizáciu</li>
                            <li className="mb-8 font-extrabold text-gray-400 text-xl">Unikátny test pri každom pokuse</li>
                            <Button variant="light" className="bg-(--main-color-orange) font-bold w-fit"
                                    onPress={onOpenVerifyCertModal}>
                                Overiť certifikát
                            </Button>
                        </ul>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Home;
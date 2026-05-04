import {useAuth, useUser} from "@clerk/clerk-react";
import SignedInProfilePage from "./SignedInProfilePage.jsx";
import '../styles/styles.css';
import {useEffect} from "react";
import {getUser_info} from "../methods/methodsClass.js";
import TypingAnimatedText from "../components/TypingAnimatedText.jsx";
import RegistrationComponent from "../components/RegistrationComponent.jsx";
import Loader from "../components/Loader.jsx";
import LightRays from "@/components/LightRays.jsx";


export function Profile() {

    const {isSignedIn, user, isLoaded} = useUser();
    const { getToken } = useAuth();
    const profileFeatures = [
        {
            title: "Študuj materiály",
            description: "Prechádzaj kapitoly v jasnom poradí a vráť sa k téme kedykoľvek.",
            iconPath: "/learning-icon.png",
        },
        {
            title: "Otestuj vedomosti",
            description: "Rýchlo si over, čo už vieš a kde máš ešte medzery",
            iconPath: "/test-white.png",
        },
        {
            title: "Sleduj progres",
            description: "Maj prehľad o hotových častiach, skóre a ďalšom kroku.",
            iconPath: "/progress.png",
        },
        {
            title: "Pozri štatistiky",
            description: "Výsledky, aktivita a trendy sú pokope v prehľadnom profile.",
            iconPath: "/stats.png",
        },
        {
            title: "Získaj certifikát",
            description: "Po úspešnom zvládnutí kurzu máš možnosť exportovať svoj certifikát.",
            iconPath: "/certificate.png",
        },
        {
            title: "Pridávaj priateľov",
            description: "Porovnávaj progres a uč sa spolu s ľuďmi, ktorí ťa posúvajú vpred.",
            iconPath: "/friends-white.png",
        },
    ];

    // Call the postRequest function when the user state changes to save the user's information to the database
    useEffect(() => {
        if (isSignedIn && user) {
            void getUser_info(user, getToken);
        }
    }, [isSignedIn, user]);

    // Keep profile scrollable so the global footer remains reachable.
    useEffect(() => {
        document.body.classList.remove("overflow-hidden", "no-scrollbar");

        return () => {
            document.body.classList.remove("overflow-hidden", "no-scrollbar");
        };
    }, []);

    return <div id="BLACK_BACKGROUND" className="flex min-h-screen flex-col bg-black justify-center overflow-hidden items-center shadow-xl relative">
        <div className="absolute inset-0 bg-black/70"></div>
        <div className ={`container relative flex flex-col items-center justify-center ${isSignedIn ? "" : "min-h-screen"}`}>
            {!isLoaded ? <Loader/>
                :
                isSignedIn ?
                    <>
                        <SignedInProfilePage/>
                    </>
                    :
                    <>
                        <div className="absolute top-0 w-screen md:h-[30cm] h-screen">
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
                        <section
                            id="GRID_CONTAINER"
                            className="relative z-10 grid min-h-screen w-full max-w-7xl grid-cols-1 items-start gap-8 px-5 pt-8 pb-12 sm:px-8 md:pt-10 md:pb-14 lg:min-h-[calc(100vh-120px)] lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:px-10 xl:gap-12"
                        >
                            <div className="flex min-w-0 flex-col gap-7">
                                <div className="max-w-3xl space-y-4 text-center lg:text-left">
                                    <h1 className="text-balance text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                                        <TypingAnimatedText words={["Tvoja cesta", "začína tu", "a teraz."]}/>
                                    </h1>
                                    <p className="mx-auto max-w-2xl text-base leading-7 text-white/70 sm:text-lg lg:mx-0">
                                        Vytvor si účet a odomkni si osobný priestor na učenie, testy,
                                        štatistiky, certifikáty aj prehľadný progres.
                                    </p>
                                </div>

                                <div className="lg:hidden">
                                    <RegistrationComponent/>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {profileFeatures.map(({title, description, iconPath}) => (
                                        <article
                                            key={title}
                                            className="group min-h-[150px] rounded-lg border border-white/10 bg-white/[0.07] p-4 text-left shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[var(--main-color-orange)]/60 hover:bg-white/[0.1]"
                                        >
                                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--main-color-orange)]/15 text-[var(--main-color-orange)] ring-1 ring-[var(--main-color-orange)]/25 transition group-hover:bg-[var(--main-color-orange)] group-hover:text-black">
                                                <img src={iconPath} alt="" className="h-6 w-6 object-contain"/>
                                            </div>
                                            <h2 className="text-lg font-bold text-white">{title}</h2>
                                            <p className="mt-2 text-sm leading-6 text-white/62">{description}</p>
                                        </article>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden lg:block">
                                <RegistrationComponent/>
                            </div>
                        </section>
                    </>
            }
        </div>
    </div>
}

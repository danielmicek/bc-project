import {useEffect, useRef, useState} from "react";
import {SignedOut, SignInButton} from "@clerk/clerk-react";
import {Button} from "@heroui/react";


export default function SlidingCircle() {
    const [screenWidth, setScreenWidth] = useState(0);
    const ref = useRef(null)
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);

        handleResize(); // initial value
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (screenWidth < 768) {
        return (
            <div id="CIRCLE1" ref = {ref} className="relative z-10 grid grid-cols-3 grid-rows-3
        border-[6px] border-(--main-color-orange) border-l-0
        rounded-tr-[1000%] rounded-tl-[1000%]
        shadow-[5px_10px_30px_rgba(252,147,40,0.5)]
        h-[calc(100vh-65px)] w-[30cm] top-[75vh] self-center
        bg-white transition-[top,background-color]
        duration-800 ease-in-out"  style={{ top: isOpen ? "5vh" : "75vh" }}>
                <div className="absolute justify-self-center h-10 z-100 text-black text-5xl" onClick={prev => setIsOpen(prev => !prev)}>
                    <img src="/arrow.png" alt="arrow" className="w-15 aspect-square" style={{rotate: isOpen ? "180deg" : "0deg"}}/>
                </div>
                <p id="NOT_SIGNED_YET" className="flex items-center justify-center relative left-5 text-[2rem] font-medium col-start-2 mb-20 row-start-1">Nový používateľ?</p>

                <div id="DO_IT_NOW" className="flex flex-col items-center justify-end text-[2rem] font-[1000] col-start-2 row-start-2">
                    <span>Vytvor si účet!</span>
                    <span id="GET_ACCESS" className="flex items-center justify-center font-light text-base text-gray-500">A získaj prístup k prémiovým funkciám</span>
                </div>

                <SignedOut>
                    <SignInButton mode="modal" asChild>
                        <Button className="w-[150px] justify-self-center self-start mt-5 font-bold bg-(--main-color-orange) col-start-2 row-start-3">Registrácia</Button>
                    </SignInButton>
                </SignedOut>
            </div>
        );
    }

    return (
        <div id="CIRCLE" className="hover:left-0 relative z-10 grid grid-cols-2 grid-rows-5
        border-[6px] border-(--main-color-orange) border-l-0
        rounded-tr-[1000%] rounded-br-[1000%]
        shadow-[5px_10px_30px_rgba(252,147,40,0.5)]
        h-[calc(100vh-65px)] w-[100vh] left-[-60vh]
        bg-white transition-[left,background-color]
        duration-800 ease-in-out">
            <p id="NOT_SIGNED_YET" className="flex items-center justify-center relative left-[30px] text-[2rem] font-medium col-start-2 row-start-3">Nový používateľ?
            </p>

            <div id="DO_IT_NOW" className="flex flex-col items-center justify-end text-[2rem] font-[1000] col-start-1 row-start-2">
                <span>Vytvor si účet!</span>
                <span id="GET_ACCESS" className="flex items-center justify-center font-light text-base text-gray-500 pt-3">A získaj prístup k prémiovým funkciám</span>
            </div>

            <SignedOut>
                <SignInButton mode="modal" asChild>
                    <Button className="w-[150px] justify-self-center self-center font-bold bg-(--main-color-orange) col-start-1 row-start-3">Registrácia</Button>
                </SignInButton>
            </SignedOut>
        </div>
    );
}

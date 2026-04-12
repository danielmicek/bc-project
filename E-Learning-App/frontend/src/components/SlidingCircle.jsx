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

    // remove scrolling listeners
    useEffect(() => {
        const preventScroll = (e) => {
            e.preventDefault();
        };

        const element = ref.current;

        element.addEventListener("wheel", preventScroll, { passive: false });
        element.addEventListener("touchmove", preventScroll, { passive: false });

        return () => {
            element.removeEventListener("wheel", preventScroll);
            element.removeEventListener("touchmove", preventScroll);
        };
    }, []);


    return (
        <div id="CIRCLE" ref = {ref} className="absolute top-0 z-10 grid grid-cols-3 grid-rows-3
    border-[6px] border-(--main-color-orange) border-b-none
    rounded-tr-[1000%] rounded-tl-[1000%]
    shadow-[0px_-10px_30px_rgba(252,147,40,0.5)]
    h-[calc(100vh-65px)] w-[30cm] top-[75vh] self-center
    bg-white transition-[top,background-color]
    duration-800 ease-in-out"  style={{ top: isOpen ? "10vh" : "75vh" }}>
            <img src="/tap.png" alt="tap" className="absolute top-3 justify-self-center h-8 z-100 text-black text-5xl hover:scale-110 transition-transform duration-200"
                 onClick={prev => setIsOpen(prev => !prev)}/>
            <p id="NOT_SIGNED_YET" className="flex items-center justify-center relative left-5 text-[2rem] font-medium col-start-2 mb-23 row-start-1">Nový používateľ?</p>

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

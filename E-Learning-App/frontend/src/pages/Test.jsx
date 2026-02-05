import React, {useEffect, useRef, useState} from "react";
import EndTestYesOrNo from "../components/EndTestYesOrNo.jsx";
import Timer from "../components/Timer.jsx";
import {useUser} from "@clerk/clerk-react";
import {useSearchParams} from "react-router-dom";
import {POST_test} from "../methods/fetchMethods.jsx";
import SwiperComponent from "../components/Swiper.jsx";
import {Button} from "@heroui/react";
import {showOrHidePopup} from "../methods/methodsClass.jsx";
import {testMaker} from "../methods/testMethods.jsx";
import Loader from "../components/Loader.jsx";

function getCurrentDate(){
    return new Date().toJSON().slice(0, 10);
}

export default function Test() {
    const {user} = useUser();
    const [questions, setQuestions] = useState( []);
    const [isLoading, setIsLoading] = useState( true);
    const [searchParams] = useSearchParams();
    const TEST_DIFFICULTY = searchParams.get("testDifficulty")
    const [testStarted, setTestStarted] = useState(true);
    const refForEnd = useRef(null);
    const [openedEndTestPopup, setOpenedEndTestPopup] = useState(false);

    useEffect(() => {
        async function loadQuestions() {
            try{
                const tmp = await testMaker(TEST_DIFFICULTY)
                setQuestions(tmp)
            }
            finally {
                setIsLoading(false)
            }
        }
        loadQuestions()
    }, [])


    return <>
        <div id = "BLACK_BACKGROUND" className="flex flex-col min-h-screen justify-center shadow-xl relative"
             style={{backgroundColor: "#050505"}}>
            {isLoading ? <Loader/> :
            <>
                <EndTestYesOrNo refForEnd = {refForEnd} showOrHidePopup={showOrHidePopup} setTestStarted = {setTestStarted}
                                openedEndPopup = {openedEndTestPopup} setOpenedEndPopup = {setOpenedEndTestPopup}/>
                <div className = "container pb-20 h-full flex flex-col items-center">
                    {/*
                    <div id = "ELEONORE_TEST_TEXT" className = "absolute w-[10cm] self-start pl-10 pt-10 text-[3rem] font-bold text-white" ref={ref}>eleonore test</div>
                    */}
                    <Timer minutes = {30}/>

                    {testStarted && !openedEndTestPopup &&
                        <>
                            <div id = "BUTTON_CONTAINER" className = "flex max-[750px]:justify-center gap-10">
                                <Button id = "SUBMIT_TEST_BUTTON" className="bg-(--main-color-orange) font-bold" onPress={() => POST_test(searchParams.get("testID"), 50, getCurrentDate(), "C", "Silver", user.id, JSON.stringify(questions))}>
                                    Potvrdiť test
                                </Button>

                                <Button id = "QUIT_TEST_BUTTON" className="bg-gray-600 font-bold" onPress={() => {
                                    showOrHidePopup(refForEnd, openedEndTestPopup, setOpenedEndTestPopup);
                                }}>
                                    Ukončiť test
                                </Button>
                            </div>

                        </>}

                            <SwiperComponent questions = {questions}
                                             setQuestions = {setQuestions}
                            />
                        </div>
                    </>
            }
        </div>
    </>
}
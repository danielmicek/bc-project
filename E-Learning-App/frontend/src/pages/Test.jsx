import React, {useRef, useState} from "react";
import EndTestYesOrNo from "../components/EndTestYesOrNo.jsx";
import {QUESTIONS} from "../questions.js";
import Timer from "../components/Timer.jsx";
import {useUser} from "@clerk/clerk-react";
import {useSearchParams} from "react-router-dom";
import {POST_test} from "../methods/fetchMethods.jsx";
import SwiperComponent from "../components/Swiper.jsx";


function getRandomElementsFromArray(array, numberOfElements, questionsForTest) {
    const shuffledArray = array.sort(() => 0.5 - Math.random());
    questionsForTest.push(...shuffledArray.slice(0, numberOfElements));
}

function testMaker(testDifficulty){
    let questionsForTest = [];
    let NUM_OF_EASY_QUESTIONS;
    let NUM_OF_MEDIUM_QUESTIONS;
    let NUM_OF_HARD_QUESTIONS;

    switch (testDifficulty) {
        case "Easy":
            NUM_OF_EASY_QUESTIONS = 5;
            NUM_OF_MEDIUM_QUESTIONS = 5;
            break;
        case "Medium":
            NUM_OF_EASY_QUESTIONS = 7;
            NUM_OF_MEDIUM_QUESTIONS = 7;
            NUM_OF_HARD_QUESTIONS = 6
            break;
        case "Hard":
            NUM_OF_EASY_QUESTIONS = 10;
            NUM_OF_MEDIUM_QUESTIONS = 10;
            NUM_OF_HARD_QUESTIONS = 10;
            break;
    }

    //add easy questions
    let easyQuestionsForTest = QUESTIONS.filter(function(question){
        return question.difficulty === "easy";
    });
    getRandomElementsFromArray(easyQuestionsForTest, NUM_OF_EASY_QUESTIONS, questionsForTest);

    //add medium questions
    let mediumQuestionsForTest = QUESTIONS.filter(function(question){
        return question.difficulty === "medium";
    });
    getRandomElementsFromArray(mediumQuestionsForTest, NUM_OF_MEDIUM_QUESTIONS, questionsForTest);

    //add hard questions
    if(testDifficulty !== "Easy"){ //for medium and hard tests only
        let hardQuestionsForTest = QUESTIONS.filter(function(question){
            return question.difficulty === "hard";
        });
        getRandomElementsFromArray(hardQuestionsForTest, NUM_OF_HARD_QUESTIONS, questionsForTest);
    }

    return questionsForTest;
}

function getCurrentDate(){
    return new Date().toJSON().slice(0, 10);
}

export default function Test({showOrHidePopup}) {
    const {user} = useUser();
    const [searchParams] = useSearchParams();
    const [testStarted, setTestStarted] = useState(true);
    const ref = useRef(null);
    const refForEnd = useRef(null);
    const refForEndButton = useRef(null);
    const [openedEndTestPopup, setOpenedEndTestPopup] = useState(false);

    //create a random set of test questions, from each difficulty level select random 2 questions
    //its in useState hook to ensure it is ready to use right after first render
    const [testQuestions, setTestQuestions] = useState(testMaker(searchParams.get("testDifficulty")));


    addEventListener("beforeunload", (event) => {
        if(window.location.href.startsWith("http://localhost:5173/test?testID=EL-")){
            event.preventDefault(); //zabrani refreshu
        } //so the beforeunload event is triggered only when the user is on the test page
    })

    return <>

        <div id = "FLAG" className = "bg-[var(--main-color-blue)] rounded-tr-[20px] rounded-br-[20px] w-[10cm] mt-[50px] pl-[10px] text-[3rem] font-bold text-white" ref={ref}>eleonore test</div>
        <Timer minutes = {2}/>

        {testStarted && !openedEndTestPopup &&
            <>
                <div id = "BUTTON_CONTAINER" className = "flex mr-[30px] max-[750px]:justify-center">
                    <button id = "SUBMIT_TEST_BUTTON" className = "relative w-[120px] mt-0 mr-[10px] mb-[20px] ml-[25px] z-[999] customButton"
                            onClick={() => POST_test(searchParams.get("testID"), 50, getCurrentDate(), "C", "Silver", user.username, testQuestions)}
                    >Submit test</button>

                    <button className="relative z-999 customButton" ref = {refForEndButton}
                            onClick={() => {
                                showOrHidePopup(refForEnd, openedEndTestPopup, setOpenedEndTestPopup);
                            }}>Quit test</button>
                </div>


                <SwiperComponent testQuestions = {testQuestions}/>
            </>
        }
        <EndTestYesOrNo refForEnd = {refForEnd} showOrHidePopup={showOrHidePopup} setTestStarted = {setTestStarted}
                        openedEndPopup = {openedEndTestPopup} setOpenedEndPopup = {setOpenedEndTestPopup}/>

    </>
}
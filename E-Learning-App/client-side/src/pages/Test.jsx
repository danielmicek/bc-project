import "../styles/CourseStyles/TestStyle.css"
import React, {useState, useRef} from "react";
import EndTestYesOrNo from "../components/EndTestYesOrNo.jsx";
import { QUESTIONS } from "../questions.js";
import Timer from "../components/Timer.jsx";
import {useUser} from "@clerk/clerk-react";
import {useParams, useSearchParams} from "react-router-dom";
import {postRequest_test} from "../methods/fetchMethods.jsx";
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
        <Timer minutes = {2}/>
        <div className = "flag" ref={ref}>eleonore test</div>


        {testStarted && !openedEndTestPopup &&
            <>
                <button className = "submitTest_button customButton"
                        onClick={() => postRequest_test(searchParams.get("testID"), 50, getCurrentDate(), "C", "Silver", user.id, testQuestions)}
                >Submit test</button>

                <button className="quitTest_button customButton" ref = {refForEndButton}
                onClick={() => {
                    showOrHidePopup(refForEnd, openedEndTestPopup, setOpenedEndTestPopup);
                }}>Quit test</button>


                <SwiperComponent testQuestions = {testQuestions}/>
            </>
        }
        <EndTestYesOrNo refForEnd = {refForEnd} showOrHidePopup={showOrHidePopup} setTestStarted = {setTestStarted}
                        openedEndPopup = {openedEndTestPopup} setOpenedEndPopup = {setOpenedEndTestPopup}/>
        </>



}
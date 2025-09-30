import "../styles/CourseStyles/TestStyle.css"
import React, {useState, useRef, useEffect} from "react";
import StartTestPopup from "../components/StartTestPopup.jsx";
import EndTestYesOrNo from "../components/EndTestYesOrNo.jsx";
import Question from "../components/Question.jsx";
import { QUESTIONS } from "../questions.js";
import Timer from "../components/Timer.jsx";
import {useUser} from "@clerk/clerk-react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {postRequest_test} from "../methods/fetchMethods.jsx";
import SwiperComponent from "../components/Swiper.jsx";



function getRandomElementsFromArray(array, numberOfElements, questionsForTest) {
    const shuffledArray = array.sort(() => 0.5 - Math.random());
    questionsForTest.push(...shuffledArray.slice(0, numberOfElements));
}

function testMaker(){
    let questionsForTest = [];

    //add easy questions
    let easyQuestionsForTest = QUESTIONS.filter(function(question){
        return question.difficulty === "easy";
    });
    getRandomElementsFromArray(easyQuestionsForTest, 2, questionsForTest);

    //add medium questions
    let mediumQuestionsForTest = QUESTIONS.filter(function(question){
        return question.difficulty === "medium";
    });
    getRandomElementsFromArray(mediumQuestionsForTest, 2, questionsForTest);

    //add hard questions
    let hardQuestionsForTest = QUESTIONS.filter(function(question){
        return question.difficulty === "hard";
    });
    getRandomElementsFromArray(hardQuestionsForTest, 2, questionsForTest);

    return questionsForTest;
}

function getCurrentDate(){
    return new Date().toJSON().slice(0, 10);
}

export default function Test({showOrHidePopup}) {
    const {user} = useUser();
    const params = useParams();


    const [testStarted, setTestStarted] = useState(true);

    const ref = useRef(null);

    const refForEnd = useRef(null);
    const refForEndButton = useRef(null);

    const [openedEndTestPopup, setOpenedEndTestPopup] = useState(false);

    //create a random set of test questions, from each difficulty level select random 2 questions
    //its in useState hook to ensure it is ready to use right after first render
    const [testQuestions, setTestQuestions] = useState(testMaker());


    addEventListener("beforeunload", (event) => {
        event.preventDefault(); //zabrani refreshu
    })


    return <>
        <Timer minutes = {2}/>
        <div className = "flag" ref={ref}>eleonore test</div>


        {testStarted && !openedEndTestPopup &&
            <>
                <button className = "submitTest_button customButton"
                        onClick={() => postRequest_test(params.testID, 50, getCurrentDate(), "C", "Silver", user.id, testQuestions)}
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
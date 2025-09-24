import "../styles/CourseStyles/TestStyle.css"
import React, {useState, useRef} from "react";
import StartTestYesOrNo from "../components/StartTestYesOrNo.jsx";
import EndTestYesOrNo from "../components/EndTestYesOrNo.jsx";
import Question from "../components/Question.jsx";
import { QUESTIONS } from "../questions.js";
import QuestionsContainer from "../components/QuestionsContainer.jsx";



function showOrHidePopup(ref, openedPopup, setOpenedPopup) {
    openedPopup === true ? ref.current.style.display = "none" : ref.current.style.display = "grid";
    setOpenedPopup((boolean_value) => !boolean_value);
}


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


export default function Test() {
    const refForStart = useRef(null);
    const refForEnd = useRef(null);
    const refForEndButton = useRef(null);

    const [testStarted, setTestStarted] = useState(false);
    const [openedStartTestPopup, setOpenedStartTestPopup] = useState(true);
    const [openedEndTestPopup, setOpenedEndTestPopup] = useState(false);

    //create a random set of test questions, from each difficulty level select random 2 questions
    //its in useState hook to ensure it is ready to use right after first render
    const [testQuestions, setTestQuestions] = useState(testMaker());
    return <>
        <div className = "flag">eleonore</div>
        <StartTestYesOrNo refForStart = {refForStart} showOrHidePopup={showOrHidePopup} setTestStarted = {setTestStarted}
                          openedStartPopup = {openedStartTestPopup} setOpenedStartPopup = {setOpenedStartTestPopup}/>


        {testStarted && !openedEndTestPopup &&
            <>
                <button className="customButton" ref = {refForEndButton}
                onClick={() => {
                    showOrHidePopup(refForEnd, openedEndTestPopup, setOpenedEndTestPopup);
                }}>End test</button>
                <QuestionsContainer testQuestions = {testQuestions}/>
                <Question question = {testQuestions[0]}/>
                <button className = "nextQuestionButton">next question</button>
            </>
        }
        <EndTestYesOrNo refForEnd = {refForEnd} showOrHidePopup={showOrHidePopup} setTestStarted = {setTestStarted}
                        openedEndPopup = {openedEndTestPopup} setOpenedEndPopup = {setOpenedEndTestPopup}/>
        </>



}
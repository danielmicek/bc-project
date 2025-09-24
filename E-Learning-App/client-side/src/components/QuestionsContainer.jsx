import React from "react";
import "../styles/CourseStyles/QuestionsContainerStyle.css"
import {QUESTIONS} from "../questions.js";
import Question from "./Question.jsx";

export default function QuestionsContainer({testQuestions}) {

    return <>
        <div className = "questionsContainer">


            {testQuestions.map((question, index) => {

                return <Question question = {question} key = {index}/>

            })}


        </div>
    </>
}
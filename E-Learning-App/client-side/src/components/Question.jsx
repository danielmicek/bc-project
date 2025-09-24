import { QUESTIONS } from "../questions.js";
import "../styles/CourseStyles/QuestionStyle.css"


export default function Question({question}) {
    return <>
        <div className="question">
            <div className="title">{question.title}</div>
            <div className="body">{question.body}</div>
            <div className="points">{question.points}</div>
            <div className="sideText">eleonore</div>
            <div className="questionNumber">{question.questionNumber}</div>
        </div>
        {/*<div className="">
            {QUESTIONS[0].body}
        </div>*/}
    </>
}
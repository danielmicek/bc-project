import { QUESTIONS } from "../questions.js";
import "../styles/CourseStyles/QuestionStyle.css"


export default function Question({question}) {
    return <>
        <div className="question">
            <div className="title">{question.title}</div>
            <div className="body">{question.body}</div>
            <div className="points">{question.points}</div>
            <div className="sideText">eleonore</div>
            <div className="questionNumber"></div>
        </div>
        <ul className="answers">
            <li className = "a"><button className = "answerButton" onClick = {() => {console.log("clicked")}}>{question.answers[0].answer}</button></li>
            <li className = "b">{question.answers[1].answer}</li>
            <li className = "c">{question.answers[2].answer}</li>
        </ul>
        {/*<div className="">
            {QUESTIONS[0].body}
        </div>*/}
    </>
}
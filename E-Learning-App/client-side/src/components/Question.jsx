import "../styles/CourseStyles/QuestionStyle.css"
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

function getNumberOfCorrectAnswers(answers) {
    return answers.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.correct ? 1 : 0), 0);
}

function handleClick(selectedArray, setSelectedArray, index, difficulty, answers) {
    if(index === 4){
        setSelectedArray(prevSelectedArray => {
            const newSelectedArray = [...prevSelectedArray];
            for(let i = 0; i < selectedArray.length-1; i++){
                if(selectedArray[i] === true){
                    newSelectedArray[i] = false;
                }
            }
            newSelectedArray[index] = !newSelectedArray[index];
            return newSelectedArray;
        })
    }
    else{
        setSelectedArray(prevSelectedArray => {
            const newSelectedArray = [...prevSelectedArray];
            newSelectedArray[index] = !newSelectedArray[index];
            if((difficulty === "Easy" || difficulty === "Medium") && getNumberOfCorrectAnswers(answers) === 1){
                return newSelectedArray.map((value, i) => {
                    return i === index; // return true if the index is selected, false otherwise
                });
            }
            newSelectedArray[newSelectedArray.length-1] = false;
            return newSelectedArray;
        })
    }
}

function styleSetter(selectedArray, index){

    return(selectedArray[index] === true ?
            { backgroundColor: "var(--main-color-pink)", borderColor: "var(--main-color-blue)" }
            :
            { backgroundColor: "var(--main-color-blue)", borderColor: "var(--main-color-pink)" }
    )
}

export default function Question({activeIndex, question}) {
    const[selectedArray, setSelectedArray] = useState([false, false, false, false, false]);
    const [searchParams] = useSearchParams();
    const testDifficulty = searchParams.get("testDifficulty")

    useEffect(() => {
        for(let i = 0; i < selectedArray.length; i++){
            question.answers[i].selected = selectedArray[i];
        }
    }, [activeIndex]); //pri zmene strany ulozim zaznacene odpovede do skutocnej struktury testu (cely JSON -> cely vygenerovany test)

    return <>
        <div className="question">
            {testDifficulty === "Medium" && <div className="selectionType" title="SS - Single-select | MM - Multi-select">
                {getNumberOfCorrectAnswers(question.answers) > 1 ? "MS" : "SS"}</div>}
            <div className="title">{question.title}</div>
            <div className="body">{question.body}</div>
            <div title = "points" className="points">{question.points}</div>
            <div className="sideText">eleonore</div>
            <div className="questionNumber"></div>
        </div>
        <ul className="answers">
            <li className = "ans a" style = {styleSetter(selectedArray, 0)}
            onClick={() => {handleClick(selectedArray, setSelectedArray, 0, testDifficulty, question.answers)}}>{question.answers[0].answer}
            </li>

            <li className = "ans b" style = {styleSetter(selectedArray, 1)}
                onClick={() => {handleClick(selectedArray, setSelectedArray, 1, testDifficulty, question.answers)}}>{question.answers[1].answer}
            </li>

            <li className = "ans c" style = {styleSetter(selectedArray, 2)}
                onClick={() => {handleClick(selectedArray, setSelectedArray, 2, testDifficulty, question.answers)}}>{question.answers[2].answer}
            </li>

            <li className = "ans d" style = {styleSetter(selectedArray, 3)}
                onClick={() => {handleClick(selectedArray, setSelectedArray, 3, testDifficulty, question.answers)}}>{question.answers[3].answer}
            </li>

            <li className = "ans e" style = {styleSetter(selectedArray, 4)}
                onClick = {() => {handleClick(selectedArray, setSelectedArray, 4, testDifficulty, question.answers)}}>{question.answers[4].answer}
            </li>
        </ul>
        {/*<button onClick={() => {
            if (confirm('Are you sure you want to save this thing into the database?')) {
                // Save it!
                console.log('Thing was saved to the database.');
            } else {
                // Do nothing!
                console.log('Thing was not saved to the database.');
            }
        }}></button>*/}
    </>
}
import "../styles/CourseStyles/QuestionStyle.css"
import {useEffect, useState} from "react";

function handleClick(selectedArray, setSelectedArray, index) {
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



    useEffect(() => {
        for(let i = 0; i < selectedArray.length; i++){
            question.answers[i].selected = selectedArray[i];
        }
    }, [activeIndex]); //pri zmene strany ulozim zaznacene odpovede do skutocnej struktury testu (cely JSON -> cely vygenerovany test)

    return <>
        <div className="question">
            <div className="title">{question.title}</div>
            <div className="body">{question.body}</div>
            <div className="points">{question.points}</div>
            <div className="sideText">eleonore</div>
            <div className="questionNumber"></div>
        </div>
        <ul className="answers">
            <li className = "ans a" style = {styleSetter(selectedArray, 0)}
            onClick={() => {handleClick(selectedArray, setSelectedArray, 0)}}>{question.answers[0].answer}
            </li>

            <li className = "ans b" style = {styleSetter(selectedArray, 1)}
                onClick={() => {handleClick(selectedArray, setSelectedArray, 1)}}>{question.answers[1].answer}
            </li>

            <li className = "ans c" style = {styleSetter(selectedArray, 2)}
                onClick={() => {handleClick(selectedArray, setSelectedArray, 2)}}>{question.answers[2].answer}
            </li>

            <li className = "ans d" style = {styleSetter(selectedArray, 3)}
                onClick={() => {handleClick(selectedArray, setSelectedArray, 3)}}>{question.answers[3].answer}
            </li>

            <li className = "ans e" style = {styleSetter(selectedArray, 4)}
                onClick = {() => {handleClick(selectedArray, setSelectedArray, 4)}}>{question.answers[4].answer}
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
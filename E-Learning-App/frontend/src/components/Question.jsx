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
            { backgroundColor: "var(--main-color-orange)", borderColor: "rgb(55 65 81)" }
            :
            { backgroundColor: "rgb(55 65 81)", borderColor: "var(--main-color-orange)" }
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

    console.log("xx: " + getNumberOfCorrectAnswers(question.answers))
    return <>
        <div className="pb-8 justify-self-center self-center flex flex-col gap-0 overflow-hidden max-[750px]:w-[70vw]  mb-5">

            <div id = "BODY" className="flex items-center justify-center text-center text-white font-bold text-xl w-[600px] pb-3">{question.body}</div>
            {<p className="text-sm font-light text-gray-500">{question.points} points {testDifficulty === "Medium" ? (getNumberOfCorrectAnswers(question.answers) > 1 ? "| Multi-select" : "| Single-select") : "| Single-select"}</p>}


            {/*<div id = "QUESTION_NUMBER" className="grid place-items-center [grid-area:1_/_1_/_2_/_2]"></div>*/}
        </div>
        <ul id = "ANSWERS" className="relative flex flex-col gap-[20px] mb-[50px] justify-self-center self-center w-[550px] h-fit text-white max-[750px]:w-[60vw] mt-3 ml-20">
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
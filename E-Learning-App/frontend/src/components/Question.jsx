import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";


function handleClick(selectedArray, setSelectedArray, index, difficulty, answers, multiselect) {
    // neodpovedat
    if(index === 4){
        setSelectedArray(prevSelectedArray => {
            const newSelectedArray = [...prevSelectedArray];
            // set all to false
            for(let i = 0; i < selectedArray.length-1; i++){
                newSelectedArray[i] = false;
            }
            // only the last one to true
            newSelectedArray[index] = true;
            return newSelectedArray;
        })
    }
    //
    else{
        setSelectedArray(prevSelectedArray => {
            const newSelectedArray = [...prevSelectedArray];
            newSelectedArray[index] = !newSelectedArray[index];
            // single-select
            if(multiselect === false){
                return newSelectedArray.map((value, i) => {
                    return i === index; // return true if the index is selected, false otherwise
                });
            }
            // if i change the answer from "neodpovedať" to any else, the "neodpovedať is unmarked
            newSelectedArray[newSelectedArray.length-1] = false;
            return newSelectedArray;
        })
    }
}

function styleSetter(selectedArray, index){

    return(selectedArray[index] === true ?
            { backgroundColor: "var(--main-color-orange)", borderColor: "rgb(55 65 81)", color: "black", fontWeight: "bold" }
            :
            { backgroundColor: "rgb(55 65 81)", borderColor: "var(--main-color-orange)" }
    )
}

function getPoints(difficulty){
    if(difficulty === "easy") return 1;
    else if(difficulty === "medium") return 3;
    return 5
}

function saveSelectedAnswersIntoTest(selectedArray, setQuestions, activeIndex){
    console.log(activeIndex);

    setQuestions(prevQuestions => {
        const newAnswersArray =  [...prevQuestions]
        newAnswersArray[activeIndex] = {
            ...newAnswersArray[activeIndex],
            answers: newAnswersArray[activeIndex].answers.map((answer, ansIndex) => ({
                ...answer,
                selected: selectedArray[ansIndex]
            }))
        }
        /*console.log("..................................................");
        console.log(newAnswersArray);*/
        return newAnswersArray
    });
}

// the active index is the swiper page
export default function Question({activeIndex, question, setQuestions}) {
    const[selectedArray, setSelectedArray] = useState([false, false, false, false, false]);
    const [searchParams] = useSearchParams();
    const testDifficulty = searchParams.get("testDifficulty")
    const points = getPoints(question.difficulty)

    useEffect(() => {
        saveSelectedAnswersIntoTest(selectedArray, setQuestions, activeIndex)
    }, [selectedArray]); //pri zmene strany ulozim zaznacene odpovede do skutocnej struktury testu (cely JSON -> cely vygenerovany test)

    //console.log("xx: " + getNumberOfCorrectAnswers(question.answers))
    return <>
        <div className="pb-8 justify-self-center self-center flex flex-col gap-0 overflow-hidden max-[750px]:w-[70vw]  mb-5">

            <div id = "BODY" className="flex items-center justify-center text-center text-white font-bold text-xl w-[600px] pb-3">{question.body}</div>
            {<p className="text-sm font-light text-gray-500">
                 Body: {points} {testDifficulty !== "easy" ? (question.multiselect === true ? "| Multi-select" : "| Single-select") : "| Single-select"}</p>}


            {/*<div id = "QUESTION_NUMBER" className="grid place-items-center [grid-area:1_/_1_/_2_/_2]"></div>*/}
        </div>
        <ul id = "ANSWERS" className="relative flex flex-col gap-[20px] mb-[50px] justify-self-center self-center w-[550px] h-fit text-white max-[750px]:w-[60vw] mt-3 ">
            <li className = "ans a" style = {styleSetter(selectedArray, 0)}
            onClick={() => {handleClick(selectedArray, setSelectedArray, 0, testDifficulty, question.answers, question.multiselect)}}>{question.answers[0].text}
            </li>

            <li className = "ans b" style = {styleSetter(selectedArray, 1)}
                onClick={() => {handleClick(selectedArray, setSelectedArray, 1, testDifficulty, question.answers, question.multiselect)}}>{question.answers[1].text}
            </li>

            <li className = "ans c" style = {styleSetter(selectedArray, 2)}
                onClick={() => {handleClick(selectedArray, setSelectedArray, 2, testDifficulty, question.answers, question.multiselect)}}>{question.answers[2].text}
            </li>

            <li className = "ans d" style = {styleSetter(selectedArray, 3)}
                onClick={() => {handleClick(selectedArray, setSelectedArray, 3, testDifficulty, question.answers, question.multiselect)}}>{question.answers[3].text}
            </li>

            <li className = "ans e" style = {styleSetter(selectedArray, 4)}
                onClick = {() => {handleClick(selectedArray, setSelectedArray, 4, testDifficulty, question.answers, question.multiselect)}}>{question.answers[4].text}
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
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
    // other options
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
            // if I change the answer from "neodpovedať" to any else, the "neodpovedať is unmarked
            newSelectedArray[newSelectedArray.length-1] = false;
            return newSelectedArray;
        })
    }
}

function styleSetter(selectedArray, index, readOnly, answer, question){
    //console.log(question);
    if(readOnly){
        // correctly selected answer
        if(answer.selected === true && answer.correct === true){
            return { backgroundColor: "green", borderColor: "green", color: "black", fontWeight: "bold" }
        }
        // the correct answer
        if(answer.selected === false && answer.correct === true){
            return { backgroundColor: "green", borderColor: "green", color: "black", fontWeight: "bold" }
        }
        // "neodpovedať" answer
        if(answer.selected === true && answer.correct === null){
            return { backgroundColor: "var(--main-color-orange)", borderColor: "var(--main-color-orange)", color: "black", fontWeight: "bold" }
        }
        // incorrectly selected answer
        if(answer.selected === true && answer.correct === false){
            return { backgroundColor: "red", borderColor: "red", color: "black", fontWeight: "bold" }
        }
    }

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
    // deep copy of both - questions array itself, inner question and its asnwers
    setQuestions(prevQuestions => {
        const newAnswersArray =  [...prevQuestions]
        newAnswersArray[activeIndex] = {
            ...newAnswersArray[activeIndex],
            answers: newAnswersArray[activeIndex].answers.map((answer, ansIndex) => ({
                ...answer,
                selected: selectedArray[ansIndex]
            }))
        }
        //console.log("----------------");
        //console.log(newAnswersArray);
        return newAnswersArray
    });
}

// the active index is the swiper page
export default function Question({activeIndex, question, setQuestions}) {
    const[selectedArray, setSelectedArray] = useState([false, false, false, false, false]);
    const [searchParams] = useSearchParams();
    const testDifficulty = searchParams.get("testDifficulty")
    const READ_ONLY = searchParams.get("readOnly") === "true"
    const points = getPoints(question.difficulty)

    useEffect(() => {
        if(READ_ONLY) return
        saveSelectedAnswersIntoTest(selectedArray, setQuestions, activeIndex)
    }, [selectedArray]); //pri zakliknuti odpovede ulozim zaznacene odpovede do skutocnej struktury testu (cely JSON -> cely vygenerovany test)

    //console.log("xx: " + getNumberOfCorrectAnswers(question.answers))
    let i = 0
    return <>
        <div className="pb-8 justify-self-center self-center flex flex-col gap-0 overflow-hidden max-[750px]:w-[70vw]  mb-5">

            <div id = "BODY" className="flex items-center justify-center text-center text-white font-bold text-xl w-[600px] pb-3">{question.body}</div>
            {<p className="text-sm font-light text-gray-500">
                 Body: {points} {testDifficulty === "medium" ? (question.multiselect === true ? "| Multi-select" : "| Single-select") : ""}</p>}


            {/*<div id = "QUESTION_NUMBER" className="grid place-items-center [grid-area:1_/_1_/_2_/_2]"></div>*/}
        </div>
        <ul id = "ANSWERS" className="relative flex flex-col gap-[20px] mb-[50px] justify-self-center self-center w-[550px] h-fit text-white max-[750px]:w-[60vw] mt-3 ">
            {question.answers.map((answer, i) => (
                    <li key = {i} className = "ans a"
                        style = {styleSetter(selectedArray, i, READ_ONLY, answer, question)}
                        onClick={() => READ_ONLY ? undefined : handleClick(selectedArray, setSelectedArray, i, testDifficulty, question.answers, question.multiselect)}>{question.answers[i].text}
                    </li>
                )
            )}

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
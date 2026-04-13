import {useEffect, useMemo, useState} from "react";
import {useAuth} from "@clerk/clerk-react";
import {useSearchParams} from "react-router-dom";
import {GET_keepBackendAlive} from "@/methods/fetchMethods.js";


function handleClick(selectedArray, setSelectedArray, index, difficulty, multiselect, dontAnswerIndex, isFreeAnswerQuestion, setFreeAnswerText) {
    // neodpovedat
    if(index === dontAnswerIndex){
        setSelectedArray(prevSelectedArray => {
            const newSelectedArray = new Array(prevSelectedArray.length).fill(false);
            newSelectedArray[index] = true;
            return newSelectedArray;
        })

        if (isFreeAnswerQuestion) {
            setFreeAnswerText("");
        }
    }
    // other options
    else{
        setSelectedArray(prevSelectedArray => {
            const newSelectedArray = [...prevSelectedArray];
            newSelectedArray[index] = !newSelectedArray[index];

            // single-select
            if(difficulty !== "hard" && multiselect === false){ // in hard test all the questions can be selected regardless of the multiselect
                return newSelectedArray.map((value, i) => {
                    return i === index; // return true if the index is selected, false otherwise
                });
            }

            // if I change the answer from "neodpovedat" to any else, the "neodpovedat" is unmarked
            newSelectedArray[dontAnswerIndex] = false;
            return newSelectedArray;
        })
    }
}

function styleSetter(selectedArray, index, readOnly, answer){

    if(readOnly){
        // correctly selected answer
        if(answer.selected === true && answer.correct === true){
            return { backgroundColor: "green", borderColor: "green", color: "black", fontWeight: "bold" }
        }
        // the correct answer
        if(answer.selected === false && answer.correct === true){
            return { backgroundColor: "green", borderColor: "green", color: "black", fontWeight: "bold" }
        }
        // "neodpovedat" answer
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

function getFreeAnswerTextAreaStyle(readOnly, aiResponse){
    if(readOnly && aiResponse === true){
        return {
            backgroundColor: "green",
            borderColor: "green",
            color: "black",
            fontWeight: "bold"
        }
    }

    if(readOnly && aiResponse === false){
        return {
            backgroundColor: "red",
            borderColor: "red",
            color: "black",
            fontWeight: "bold"
        }
    }

    return {
        backgroundColor: "rgb(55 65 81)",
        borderColor: "rgb(75 85 99)",
        color: "white"
    }
}

function saveQuestionStateIntoTest(selectedArray, freeAnswerText, setQuestions, questionIndex, isFreeAnswerQuestion){
    // deep copy of both - questions array itself, inner question and its answers
    setQuestions(prevQuestions => {
        const newAnswersArray =  [...prevQuestions]
        if (newAnswersArray[questionIndex] === undefined) return prevQuestions;

        newAnswersArray[questionIndex] = {
            ...newAnswersArray[questionIndex],
            free_answer_text: isFreeAnswerQuestion ? freeAnswerText : (newAnswersArray[questionIndex].free_answer_text ?? ""),
            answers: newAnswersArray[questionIndex].answers.map((answer, ansIndex) => ({
                ...answer,
                selected: selectedArray[ansIndex]
            }))
        }
        return newAnswersArray
    });
}

// questionIndex is the index in test structure
export default function Question({activeIndex, questionIndex, question, setQuestions}) {
    if(!question || !question.answers) return null;

    const [searchParams] = useSearchParams();
    const testDifficulty = searchParams.get("testDifficulty")
    const READ_ONLY = searchParams.get("readOnly") === "true"
    const points = getPoints(question.difficulty)
    const dontAnswerIndex = useMemo(() => question.answers.length - 1, [question.answers.length]);
    const isFreeAnswerQuestion = question.free_answer === true;
    const indexToSave = questionIndex ?? activeIndex;
    const { getToken } = useAuth()

    const[selectedArray, setSelectedArray] = useState(() =>
        question.answers.map((answer) => Boolean(answer.selected))
    );
    const [freeAnswerText, setFreeAnswerText] = useState(() => question.free_answer_text ?? "");

    // load data from the test structure of the particular question
    // and call the keepBackendAlive button to keep it alive because of server settings which turn off the backend
    // after 15 minutes of inactivity
    useEffect(() => {
        setSelectedArray(question.answers.map((answer) => Boolean(answer.selected)));
        setFreeAnswerText(question.free_answer_text ?? "");

        GET_keepBackendAlive(getToken).then()
    }, [question.id]);

    // save answers into the test structure after each click on any answer
    useEffect(() => {
        if(READ_ONLY || indexToSave === undefined) return
        saveQuestionStateIntoTest(selectedArray, freeAnswerText, setQuestions, indexToSave, isFreeAnswerQuestion)
    }, [selectedArray, freeAnswerText]);

    return <div className="flex flex-col justify-center items-center">
        <div className="pb-8 self-center flex flex-col gap-0 overflow-hidden max-[750px]:w-[70vw] mb-5">

            <div id = "BODY" className="flex items-center justify-center text-center text-white font-bold text-xl w-full pb-3 ">{question.body}</div>
            {<p className="text-sm font-light text-gray-500">
                 Body: {points} {testDifficulty === "medium" ? (question.multiselect === true ? "| Multi-select" : "| Single-select") : ""}</p>}

        </div>

        {isFreeAnswerQuestion && (
            <div className="justify-self-center self-center w-[550px] max-[750px]:w-[60vw] mb-4">
                <textarea
                    value={freeAnswerText}
                    readOnly={READ_ONLY}
                    placeholder="Tvoja odpoveď..."
                    className="w-full min-h-[120px] rounded-xl p-3 border outline-none focus:border-(--main-color-orange)"
                    style={getFreeAnswerTextAreaStyle(READ_ONLY, question.aiResponse)}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setFreeAnswerText(newValue);

                        if (newValue.trim().length > 0) {
                            setSelectedArray(prevSelectedArray => {
                                const newSelectedArray = [...prevSelectedArray];
                                newSelectedArray[dontAnswerIndex] = false;
                                return newSelectedArray;
                            })
                        }
                    }}
                />
            </div>
        )}

        <ul id = "ANSWERS" className="relative flex flex-col gap-[20px] justify-self-center self-center md:w-[550px] h-fit text-white w-[70vw] mt-3">
            {question.answers.map((answer, i) => (
                    <li key = {i} className = "ans a"
                        style = {styleSetter(selectedArray, i, READ_ONLY, answer)}
                        onClick={() => READ_ONLY ? undefined : handleClick(selectedArray, setSelectedArray, i, testDifficulty, question.multiselect, dontAnswerIndex, isFreeAnswerQuestion, setFreeAnswerText)}>{question.answers[i].text}
                    </li>
                )
            )}

        </ul>
    </div>
}

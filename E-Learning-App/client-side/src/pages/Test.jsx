import "../styles/CourseStyles/TestStyle.css"
import React, {useState} from "react";
import StartTestYesOrNo from "../components/StartTestYesOrNo.jsx";
import EndTestYesOrNo from "../components/EndTestYesOrNo.jsx";


export default function Test() {
    const [testStarted, setTestStarted] = useState(false);
    const [openedPopup, setOpenedPopup] = useState(false);
    console.log("openedPopup: " + openedPopup);
    console.log("testStarted: " + testStarted)

    return <>
        <div className = "flag">eleonore</div>
        {testStarted ? <>TODO</> : <StartTestYesOrNo setter={setTestStarted}/>}
        <button className = "customButton" onClick = {() => {setOpenedPopup(true)}}>End test</button>
        {openedPopup === true ? <EndTestYesOrNo setter={setOpenedPopup}/> : <></>}
        </>

}
import "../styles/CourseStyles/TestStyle.css"
import React, {useState, useRef} from "react";
import StartTestYesOrNo from "../components/StartTestYesOrNo.jsx";
import EndTestYesOrNo from "../components/EndTestYesOrNo.jsx";



function showOrHidePopup(ref, openedPopup, setOpenedPopup) {
    openedPopup === true ? ref.current.style.display = "none" : ref.current.style.display = "grid";
    setOpenedPopup((boolean_value) => !boolean_value);
}


export default function Test() {
    const refForStart = useRef(null);
    const refForEnd = useRef(null);
    const refForEndButton = useRef(null);

    const [testStarted, setTestStarted] = useState(false);
    const [openedStartTestPopup, setOpenedStartTestPopup] = useState(true);
    const [openedEndTestPopup, setOpenedEndTestPopup] = useState(false);

    return <>
        <div className = "flag">eleonore</div>
        <StartTestYesOrNo refForStart = {refForStart} showOrHidePopup={showOrHidePopup} setTestStarted = {setTestStarted}
                          openedStartPopup = {openedStartTestPopup} setOpenedStartPopup = {setOpenedStartTestPopup}/>
        {testStarted && !openedEndTestPopup &&
            <>
                <button className="customButton" ref = {refForEndButton}
                onClick={() => {
                    showOrHidePopup(refForEnd, openedEndTestPopup, setOpenedEndTestPopup);
                }}>End test</button>
                <div style = {{color: "white"}}>ongoing test</div>
            </>
        }
        <EndTestYesOrNo refForEnd = {refForEnd} showOrHidePopup={showOrHidePopup} setTestStarted = {setTestStarted}
                        openedEndPopup = {openedEndTestPopup} setOpenedEndPopup = {setOpenedEndTestPopup}/>
        </>

}
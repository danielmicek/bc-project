import {Link} from "react-router-dom";
import React from "react";



export default function StartTestYesOrNo({showOrHidePopup, refForStart, openedStartPopup, setOpenedStartPopup, setTestStarted}) {
    return <>
        <div className = "testYesOrNoContainer" ref = {refForStart}>
            <p className = "readyText">Ready to start the test?</p>
            <button className = "customButton yesButton" onClick={() => {
                showOrHidePopup(refForStart, openedStartPopup, setOpenedStartPopup);
                setTestStarted(true);
                }
            }>Yes</button>
            <Link to = "/courseInfoPage" className="buttonLink">
                <button className = "customButton noButton" >No</button>
            </Link>

        </div>
    </>
}
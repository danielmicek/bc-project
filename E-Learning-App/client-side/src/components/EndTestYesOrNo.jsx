import {Link} from "react-router-dom";
import React from "react";



export default function EndTestYesOrNo({showOrHidePopup, refForEnd, openedEndPopup, setOpenedEndPopup, setTestStarted}) {
    return <>
        <div className = "testYesOrNoContainer noContainer" ref = {refForEnd}>
            <p className = "readyText">Sure you want to end?</p>

            <button className = "customButton noButton" onClick={() => {
                showOrHidePopup(refForEnd, openedEndPopup, setOpenedEndPopup);
            }}>No</button>
            <Link to = "/courseInfoPage" className="buttonLink">
                <button className = "customButton yesButton" onClick={() => setTestStarted(false)}>Yes</button>
            </Link>
        </div>
    </>
}
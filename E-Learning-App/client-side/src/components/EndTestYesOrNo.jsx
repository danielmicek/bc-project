import {Link} from "react-router-dom";
import React from "react";



export default function EndTestYesOrNo({showOrHidePopup, refForEnd, openedEndPopup, setOpenedEndPopup, setTestStarted}) {
    return <>
        <div className = "popupContainer noContainer" ref = {refForEnd}>
            <h2 className = "upperText">Sure you want to quit?</h2>
            <h3 className = "bottomText">Entire progress will be lost</h3>

            <button className = "customButton noButton" onClick={() => {
                showOrHidePopup(refForEnd, openedEndPopup, setOpenedEndPopup);
            }}>No</button>
            <Link to = "/courseInfoPage" className="buttonLink">
                <button className = "customButton yesButton" onClick={() => setTestStarted(false)}>Yes</button>
            </Link>
        </div>
    </>
}
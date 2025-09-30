import {Link} from "react-router-dom";
import React, {useState} from "react";

function getUniqueTestID(difficulty) {
    switch (difficulty) {
        case "Easy":
            return "ET-" + crypto.randomUUID();
        case "Medium":
            return "MT-" + crypto.randomUUID();
        case "Hard":
            return "HT-" + crypto.randomUUID();
    }
}


export default function StartTestPopup({difficulty, refForStartPopup, showOrHidePopup, openedStartPopup, setOpenedStartPopup}) {

    const [testStarted, setTestStarted] = useState(false);

    return <>
        <div className = "popupContainer" ref = {refForStartPopup}>
            <h2 className = "upperText">Ready to start the test?</h2>
            <h3 className = "bottomText">Test will begin immediately</h3>

            <button className = "customButton noButton" onClick={() => {
                showOrHidePopup(refForStartPopup, openedStartPopup, setOpenedStartPopup);
                }
            }>No</button>
            <Link to = {`/test/${getUniqueTestID(difficulty)}`} className="buttonLink">
                <button className = "customButton yesButton" >Yes</button>
            </Link>
        </div>
    </>
}
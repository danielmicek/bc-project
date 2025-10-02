import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";

function getUniqueTestID() {
    return "EL-" + crypto.randomUUID();
}

function setParams(testID, testDifficulty){
    return "?" + new URLSearchParams({testID, testDifficulty }).toString()
}

export default function StartTestPopup({difficulty, refForStartPopup, showOrHidePopup, openedStartPopup, setOpenedStartPopup}) {
    const navigate = useNavigate();
    const [testStarted, setTestStarted] = useState(false);

    const goToPage = () =>
        navigate({
            pathname: `/test`,
            search: setParams(getUniqueTestID(), difficulty)
        });

    return <>
        <div className = "popupContainer" ref = {refForStartPopup}>
            <h2 className = "upperText">Ready to start the test?</h2>
            <h3 className = "bottomText">Test will begin immediately</h3>

            <button className = "customButton noButton" onClick={() => {
                showOrHidePopup(refForStartPopup, openedStartPopup, setOpenedStartPopup);
                }
            }>No</button>
            {/*<Link to = {`/test/${getUniqueTestID()}`} className="buttonLink">
                <button className = "customButton yesButton" >Yes</button>
            </Link>*/}
            <button onClick = {goToPage} className = "customButton yesButton" >Yes</button>
        </div>
    </>
}
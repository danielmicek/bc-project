import {Link} from "react-router-dom";
import React from "react";



export default function StartTestYesOrNo({setter}) {
    return <>
        <div className = "questionContainer">
            <p className = "readyText">Ready to start the test?</p>
            <button className = "customButton yesButton" onClick={() => setter(true)}>Yes</button>
            <Link to = "/courseInfoPage" className="buttonLink">
                <button className = "customButton noButton" >No</button>
            </Link>

        </div>
    </>
}
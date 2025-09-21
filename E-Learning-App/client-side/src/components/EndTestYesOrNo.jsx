import {Link} from "react-router-dom";
import React from "react";



export default function EndTestYesOrNo({setter}) {
    return <>
        <div className = "questionContainer">
            <p className = "readyText">Sure you want to end?</p>

            <button className = "customButton noButton" onClick={() => setter(false)}>No</button>
            <Link to = "/courseInfoPage" className="buttonLink">
                <button className = "customButton yesButton" >Yes</button>
            </Link>
        </div>
    </>
}
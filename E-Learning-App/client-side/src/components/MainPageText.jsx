import {Link} from "react-router-dom";
import React from "react";


export function MainPageText(){
    return(
        <div className= "mainPageTextContainer">
            <div className="imgContainer"></div>
            <h1 className = "welcomeText">Welcome to <span style={{fontFamily: "'Qwitcher Grypen', cursive", fontSize: "3.5rem", color: "#F8F2DE"}}>eleonore</span></h1>
            <p className="mainPageText">Your journey to knowledge starts here.
                Interactive lessons. Real results.</p>
            <Link to = "/whyus" className="buttonLink">
                <button className="whyUsbButton">Why us</button>
            </Link>
        </div>
    )
}
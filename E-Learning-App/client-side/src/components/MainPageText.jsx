import {Link} from "react-router-dom";
import React from "react";
import '../styles/HomeStyles/WelcomeTextStyle.css';


export function MainPageText(){
    return(
        <div className= "mainPageTextContainer">
            <div className="imgContainer"></div>
            <div className = "textContainer">
                <h1 className = "welcomeText">Welcome to <span style={{fontFamily: "'Qwitcher Grypen', cursive", fontSize: "3.5rem"}}>eleonore</span></h1>
                <p className="mainPageText">Your journey to knowledge starts here.<br/>Interactive lessons.<br/>Real results.</p>
            </div>

            <Link to = "/whyus" className="buttonLink">
                <button className="whyUsbButton">Why us</button>
            </Link>
        </div>
    )
}
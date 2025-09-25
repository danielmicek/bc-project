import {Link} from "react-router-dom";
import React from "react";
import "../styles/CourseStyles/CourseInfoPageStyle.css"


export function CourseInfoPage(){
    return(
        <>
            {/*<Link to = "/test" className="buttonLink">
                <button className= "customButton" style = {{width: "fit-content"}}>Test yourself!</button>
            </Link>*/}

            <div className = "columnContainer">
                <div className = "learnColumn testColumnCommon">
                    <h2>Learn for test!</h2>
                    <h3>Time: unlimited</h3>
                    <ul className = "learnColumnList">
                        <li className = "learnColumnListEl">Learn for test easily</li>
                        <li className = "learnColumnListEl">See the answers and explanations</li>
                        <li className = "learnColumnListEl">Take your time, there is no rush</li>
                    </ul>
                </div>
                <div className = "easyTestColumn testColumnCommon">
                    2
                </div>
                <div className = "mediumTestColumn testColumnCommon">
                    3
                </div>
                <div className = "hardTestColumn testColumnCommon">
                    4
                </div>
            </div>
        </>
    )
}
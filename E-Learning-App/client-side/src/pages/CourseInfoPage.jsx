import {Link} from "react-router-dom";
import React from "react";
import "../styles/CourseStyles/CourseInfoPageStyle.css"


export function CourseInfoPage(){
    return(
        <>
            {/*<Link to = "/test" className="buttonLink">
                <button className= "customButton" style = {{width: "fit-content"}}>Test yourself!</button>
            </Link>*/}

            <Link to = "/test" className = " testColumnCommon">

            </Link>

            <div className = "columnContainer">
                <Link to = "/test" className = "learnColumn testColumnCommon">
                    <h2>Learn for test!</h2>
                    <h4 style={{color: "grey"}}>Time: unlimited</h4>
                    <ul className = "learnColumnList">
                        <div className = "pinkBackgroundFiller"></div>

                        <li className = "learnColumnListEl liCommonStyle">Learn for test easily</li>
                        <li className = "learnColumnListEl liCommonStyle">See the answers and explanations</li>
                        <li className = "learnColumnListEl liCommonStyle">Take your time, there is no rush</li>
                    </ul>
                </Link>

                <Link to = "/test" className = "easyTestColumn testColumnCommon">
                    <h2>Test yourself - Bronze test
                        <img className = "medal" src = "/bronze_medal.png" alt="Description" width={40} height={40}/>
                    </h2>
                    <h3 style={{color: "grey"}}>Time: 20min</h3>
                    <h4 style={{color: "grey"}}>Difficulty: Easy</h4>
                    <ul className = "easyTestList">
                        <div className = "brownBackgroundFiller"></div>

                        <li className = "easyTestListEl liCommonStyle">Get bronze medal</li>
                        <li className = "easyTestListEl liCommonStyle">10 questions</li>
                        <li className = "easyTestListEl liCommonStyle">Easy and medium questions only</li>
                        <li className = "easyTestListEl liCommonStyle">Get your grade</li>
                        <li className = "easyTestListEl liCommonStyle">Export certificate as pdf</li>
                    </ul>
                </Link>

                <Link to = "/test" className = "mediumTestColumn testColumnCommon">
                    <h2>Test yourself - Silver test
                        <img className = "medal" src = "/silver_medal.png" alt="Description" width={40} height={40}/>
                    </h2>
                    <h3 style={{color: "grey"}}>Time: 40min</h3>
                    <h4 style={{color: "grey"}}>Difficulty: Medium</h4>
                    <ul className = "mediumTestList">
                        <div className = "whiteBackgroundFiller"></div>

                        <li className = "mediumTestListEl liCommonStyle">Get silver medal</li>
                        <li className = "mediumTestListEl liCommonStyle">20 questions</li>
                        <li className = "mediumTestListEl liCommonStyle">Easy and medium and few hard questions</li>
                        <li className = "mediumTestListEl liCommonStyle">Get your grade</li>
                        <li className = "mediumTestListEl liCommonStyle">Export certificate as pdf</li>
                    </ul>
                </Link>

                <Link to = "/test" className = "hardTestColumn testColumnCommon">
                    <h2>Test yourself - Gold test
                        <img className = "medal" src = "/gold_medal.png" alt="Description" width={40} height={40}/>
                    </h2>
                    <h3 style={{color: "grey"}}>Time: 60min</h3>
                    <h4 style={{color: "grey"}}>Difficulty: Hard</h4>
                    <ul className = "hardTestList">
                        <div className = "blueBackgroundFiller"></div>

                        <li className = "hardTestListEl liCommonStyle">Get respect</li>
                        <li className = "hardTestListEl liCommonStyle">Get gold medal</li>
                        <li className = "hardTestListEl liCommonStyle">30 questions</li>
                        <li className = "hardTestListEl liCommonStyle">Easy, medium and hard questions</li>
                        <li className = "hardTestListEl liCommonStyle">Get your grade</li>
                        <li className = "hardTestListEl liCommonStyle">Export certificate as pdf</li>
                    </ul>
                </Link>
            </div>
        </>
    )
}
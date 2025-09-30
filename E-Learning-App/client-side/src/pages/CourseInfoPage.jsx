import {Link} from "react-router-dom";
import "../styles/CourseStyles/CourseInfoPageStyle.css"
import TestComponentVersion from "../components/TestComponentVersion.jsx";



export function CourseInfoPage({showOrHidePopup}){

    return(
        <>
            {/*TODO this learningColumn will be probably changed*/}
            <div className = "columnContainer">
                <Link to = "/test" className = "learnColumn testColumnCommon">
                    <h2>Learn for test!</h2>
                    <h4 style={{color: "grey"}}>Time: unlimited</h4>
                    <ul className = "learnColumnList">
                        <div className = "pinkBackgroundFiller"></div>

                        <li className = "learnColumnListEl liCommonStyle">Learn for test easily</li>
                        <li className = "learnColumnListEl liCommonStyle">Registration not needed</li>
                        <li className = "learnColumnListEl liCommonStyle">See the answers and explanations</li>
                        <li className = "learnColumnListEl liCommonStyle">Take your time, there is no rush</li>
                    </ul>
                </Link>

                <TestComponentVersion   testColumn = "easyTestColumn"
                                        testMedal = "Bronze"
                                        medalImgSrc = "/bronze_medal.png"
                                        time = "20min"
                                        difficulty = "Easy"
                                        ulClassName = "easyTestList"
                                        backgroundFillerClassName = "brownBackgroundFiller"
                                        liClassName = "easyTestListEl"
                                        showOrHidePopup={showOrHidePopup}
                />

                <TestComponentVersion testColumn = "mediumTestColumn"
                                      testMedal = "Silver"
                                      medalImgSrc = "/silver_medal.png"
                                      time = "40min"
                                      difficulty = "Medium"
                                      ulClassName = "mediumTestList"
                                      backgroundFillerClassName = "whiteBackgroundFiller"
                                      liClassName = "mediumTestListEl"
                                      showOrHidePopup={showOrHidePopup}
                />

                <TestComponentVersion testColumn = "hardTestColumn"
                                      testMedal = "Gold"
                                      medalImgSrc = "/gold_medal.png"
                                      time = "60min"
                                      difficulty = "Hard"
                                      ulClassName = "hardTestList"
                                      backgroundFillerClassName = "blueBackgroundFiller"
                                      liClassName = "hardTestListEl"
                                      showOrHidePopup={showOrHidePopup}
                />
            </div>
        </>
    )
}
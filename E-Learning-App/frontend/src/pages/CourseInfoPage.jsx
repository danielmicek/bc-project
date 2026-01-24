import CardComponent from "../components/CardComponent.jsx";
import React from "react";

export function CourseInfoPage({showOrHidePopup}){
    return(
        <div id = "BLUE_BACKGROUND" className="flex flex-col p-5 w-full h-fit justify-center border-500-red border-2 shadow-xl relative"
             style={{backgroundColor: "var(--main-color-blue)"}}>
            {/*TODO this learningColumn will be probably changed*/}
            <div className = "columnContainer">
                {/*<Link to = "/test" className = "learnColumn testColumnCommon">
                    <h2 className="font-bold text-3xl pt-4 ">Learn for test!</h2>
                    <h4 style={{color: "grey"}}>Time: unlimited</h4>
                    <ul className = "learnColumnList pt-7">
                        <li className = "learnColumnListEl liCommonStyle">Learn for test easily</li>
                        <li className = "learnColumnListEl liCommonStyle">Registration not needed</li>
                        <li className = "learnColumnListEl liCommonStyle">See the answers and explanations</li>
                        <li className = "learnColumnListEl liCommonStyle">Take your time, there is no rush</li>
                    </ul>
                </Link>*/}
                <CardComponent type = "Learning"
                               description = "Learn the theory before putting your skills to the test."
                               difficulty = "None"
                               questions ={0}
                               time = {0}
                               imgSrc = "/book.png"
                               testColumn = "learnColumn"
                />
                <CardComponent type = "Bronze"
                               description = "Warm-up quiz to test your fundamentals."
                               difficulty = "Easy"
                               questions ={10}
                               time = {20}
                               imgSrc = "/bronze_medal.png"
                               testColumn = "easyTestColumn"
                />

                <CardComponent type = "Silver"
                               description = "Intermediate challenge to deepen your understanding."
                               difficulty = "Medium"
                               questions ={20}
                               time = {40}
                               imgSrc = "/silver_medal.png"
                               testColumn = "mediumTestColumn"
                />

                <CardComponent type = "Gold"
                               description = "Advanced test to push your limits and mastery."
                               difficulty = "Hard"
                               questions ={30}
                               time = {60}
                               imgSrc = "/gold_medal.png"
                               testColumn = "hardTestColumn"
                />
{/*
                <TestComponentVersion   testColumn = "easyTestColumn"
                                        testMedal = "Bronze"
                                        medalImgSrc = "/bronze_medal.png"
                                        time = "20min"
                                        difficulty = "Easy"
                                        showOrHidePopup={showOrHidePopup}
                />

                <TestComponentVersion testColumn = "mediumTestColumn"
                                      testMedal = "Silver"
                                      medalImgSrc = "/silver_medal.png"
                                      time = "40min"
                                      difficulty = "Medium"
                                      showOrHidePopup={showOrHidePopup}
                />

                <TestComponentVersion testColumn = "hardTestColumn"
                                      testMedal = "Gold"
                                      medalImgSrc = "/gold_medal.png"
                                      time = "60min"
                                      difficulty = "Hard"
                                      showOrHidePopup={showOrHidePopup}
                />*/}
            </div>
        </div>
    )
}
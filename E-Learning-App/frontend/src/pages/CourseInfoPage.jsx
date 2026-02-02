import React from "react";
import CardComponent from "../components/CardComponent.jsx";

export function CourseInfoPage(){
    return(
        <div id = "BLACK_BACKGROUND" className="flex flex-col p-5 w-full h-fit justify-center border-500-red border-2 shadow-xl relative"
             style={{backgroundColor: "#050505"}}>
            {/*TODO this learningColumn will be probably changed*/}
            <div className = "container pb-20 h-full flex flex-col items-center mt-20">
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
                    <CardComponent title = "Študovanie"
                                   notionNotesId = "33601a1e5b5e4612a2c36f6f03d9308e"
                                   imgPath = "/book.png"
                                   description = "Learn the theory before putting your skills to the test."
                                   type = "Learning"
                                   testColumn = "learnColumn"
                    />

                    <CardComponent title = "Bronze test"
                                   notionNotesId = ""
                                   imgPath = "/bronze_medal.png"
                                   description = "Warm-up quiz to test your fundamentals."
                                   type = "Test"
                                   testColumn = "easyTestColumn"
                                   difficulty = "Ľahký"
                                   questions = {10}
                                   time = {20}
                    />

                    <CardComponent title = "Silver test"
                                   notionNotesId = ""
                                   imgPath = "/silver_medal.png"
                                   description = "Intermediate challenge to deepen your understanding."
                                   type = "Test"
                                   testColumn = "mediumTestColumn"
                                   difficulty = "Stredný"
                                   questions ={20}
                                   time = {40}
                    />

                    <CardComponent title = "Gold test"
                                   notionNotesId = ""
                                   imgPath = "/gold_medal.png"
                                   description = "Advanced test to push your limits and mastery."
                                   type = "Test"
                                   testColumn = "hardTestColumn"
                                   difficulty = "Ťažký"
                                   questions ={30}
                                   time = {60}
                    />
                </div>
            </div>
        </div>
    )
}
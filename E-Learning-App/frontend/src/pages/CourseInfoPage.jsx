import React from "react";
import CardComponent from "../components/CardComponent.jsx";

export function CourseInfoPage(){

    return(
        <div id = "BLACK_BACKGROUND" className="flex flex-col p-5 w-full h-fit justify-center border-500-red border-2 shadow-xl relative"
             style={{backgroundColor: "#050505"}}>
            <div className = "container pb-20 h-full flex flex-col items-center mt-20">
                <div className = "columnContainer">
                    <CardComponent title = "Študovanie"
                                   imgPath = "/book.png"
                                   description = "Osvoj si teóriu a až potom si prever svoje schopnosti v teste."
                                   type = "Learning"
                                   time = {0}
                                   testColumn = "learnColumn"
                    />

                    <CardComponent title = "Bronze test"
                                   imgPath = "/bronze_medal.png"
                                   description = "Zahrievací test na overenie základov."
                                   type = "Test"
                                   time = {20}
                                   testColumn = "easyTestColumn"
                                   difficulty = "Ľahký"
                                   questions = {10}
                    />

                    <CardComponent title = "Silver test"
                                   imgPath = "/silver_medal.png"
                                   description = "Pokročilá výzva pre hlbšie pochopenie."
                                   type = "Test"
                                   time = {40}
                                   testColumn = "mediumTestColumn"
                                   difficulty = "Stredný"
                                   questions ={20}
                    />

                    <CardComponent title = "Gold test"
                                   imgPath = "/gold_medal.png"
                                   description = "Posuň svoje hranice a ukáž svoje majstrovstvo."
                                   type = "Test"
                                   time = {60}
                                   testColumn = "hardTestColumn"
                                   difficulty = "Ťažký"
                                   questions ={30}
                    />
                </div>
            </div>
        </div>
    )
}
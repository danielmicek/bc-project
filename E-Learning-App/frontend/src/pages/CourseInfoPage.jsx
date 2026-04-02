import React, {useEffect, useState} from "react";
import CardComponent from "../components/CardComponent.jsx";
import {useAuth, useUser} from "@clerk/clerk-react";
import {GET_aiLimit} from "@/methods/fetchMethods.js";

export function CourseInfoPage(){
    const [aiLimit, setAiLimit] = useState(0);

    const {isSignedIn} = useUser();
    const { getToken } = useAuth();

    // get aiLimit
    useEffect(() => {
        async function loadAiLimit() {
            const tmp = await GET_aiLimit(getToken);
            console.log(tmp);
            setAiLimit(tmp.aiLimit);
        }

        void loadAiLimit();
    }, []);

    return(
        <>

            <div id = "BLACK_BACKGROUND" className="flex flex-col p-5 w-full h-fit justify-center shadow-xl relative"
                 style={{backgroundColor: "#050505"}}>
                <div className = "container relative h-fit pb-40 flex flex-col items-center pt-23">
                    {isSignedIn && <p className="text-gray-400 font-bold text-xl absolute top-5 right-2">
                        Počet testov na dnes: {Math.floor(aiLimit / 2)}</p>}
                    <div className = "columnContainer">
                        <CardComponent title = "Študovanie"
                                       imgPath = "/book.png"
                                       description = "Osvoj si teóriu, až potom si prever svoje schopnosti v teste."
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
                                       aiLimit = {aiLimit}
                        />

                        <CardComponent title = "Silver test"
                                       imgPath = "/silver_medal.png"
                                       description = "Pokročilá výzva pre hlbšie pochopenie."
                                       type = "Test"
                                       time = {40}
                                       testColumn = "mediumTestColumn"
                                       difficulty = "Stredný"
                                       questions ={20}
                                       aiLimit = {aiLimit}
                        />

                        <CardComponent title = "Gold test"
                                       imgPath = "/gold_medal.png"
                                       description = "Posuň svoje hranice a ukáž svoje majstrovstvo."
                                       type = "Test"
                                       time = {60}
                                       testColumn = "hardTestColumn"
                                       difficulty = "Ťažký"
                                       questions ={30}
                                       aiLimit = {aiLimit}
                        />
                    </div>
                </div>
            </div>
        </>

    )
}

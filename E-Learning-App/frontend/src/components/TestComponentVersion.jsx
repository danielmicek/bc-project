import React, {useRef, useState} from "react";
import StartTestPopup from "./StartTestPopup.jsx";
import {useUser} from "@clerk/clerk-react";
import NotSignedInPopup from "./NotSignedInPopup.jsx";

const liTextArray = {
    easy: ["Get bronze medal", "10 questions", "Single-select", "Easy and medium questions only"],
    medium: ["Get silver medal", "20 questions", "Single or multi-select (marked)", "Easy, medium and few hard questions"],
    hard: ["Get gold medal", "30 questions", "Single or multi-select", "Easy, medium and hard questions", "Only for he best ones"]
};


function getLiTextAccordingToTestDifficulty(difficulty) {
    switch (difficulty) {
        case "Easy":
            return liTextArray.easy;
        case "Medium":
            return liTextArray.medium;
        case "Hard":
            return liTextArray.hard;
    }
}

export default function TestComponentVersion(   {testColumn,
                                                 testMedal,
                                                 medalImgSrc,
                                                 time,
                                                 difficulty,
                                                 ulClassName,
                                                 backgroundFillerClassName,
                                                 liClassName,
                                                 showOrHidePopup}) {
    const refForStartPopup = useRef(null);
    const refForSignedIntPopup = useRef(null);

    const {isSignedIn} = useUser();
    const [openedNotSignedInPopup, setOpenedNotSignedInPopup] = useState(false);
    const [openedStartTestPopup, setOpenedStartTestPopup] = useState(false);

    return(
        <>
            {isSignedIn ?
                <StartTestPopup difficulty = {difficulty}
                                refForStartPopup = {refForStartPopup}
                                showOrHidePopup={showOrHidePopup}
                                openedStartPopup = {openedStartTestPopup}
                                setOpenedStartPopup = {setOpenedStartTestPopup}
                />
                :
                <NotSignedInPopup refForSignedIntPopup = {refForSignedIntPopup}
                                  showOrHidePopup={showOrHidePopup}
                                  openedNotSignedInPopup = {openedNotSignedInPopup}
                                  setOpenedNotSignedInPopup = {setOpenedNotSignedInPopup}
                />
            }


            <div className ={testColumn + " testColumnCommon"} onClick={() => {
                isSignedIn ?
                    showOrHidePopup(refForStartPopup, openedStartTestPopup, setOpenedStartTestPopup)
                    :
                    showOrHidePopup(refForSignedIntPopup, openedNotSignedInPopup, setOpenedNotSignedInPopup)
            }}>
                <h2 className="font-bold text-2xl pt-3">{"Test yourself - " + testMedal + " test"}
                    <img className = "medal" src ={medalImgSrc} alt="Medal" width={40} height={40}/>
                </h2>
                <h3 className="text-gray-500 pt-10">{"Time: " + time}</h3>
                <h4 className="text-gray-500 pb-6">{"Difficulty: " + difficulty}</h4>
                <ul className ={ulClassName}>
                    <div className ={backgroundFillerClassName}></div>

                    {difficulty === "Hard" && <li className ={liClassName + " liCommonStyle"}>{getLiTextAccordingToTestDifficulty(difficulty)[3]}</li>}
                    <li className ={liClassName + " liCommonStyle"}>{getLiTextAccordingToTestDifficulty(difficulty)[0]}</li>
                    <li className ={liClassName + " liCommonStyle"}>{getLiTextAccordingToTestDifficulty(difficulty)[1]}</li>
                    <li className ={liClassName + " liCommonStyle"}>{getLiTextAccordingToTestDifficulty(difficulty)[2]}</li>
                    <li className ={liClassName + " liCommonStyle"}>{getLiTextAccordingToTestDifficulty(difficulty)[3]}</li>
                    <li className ={liClassName + " liCommonStyle"}>Get your grade</li>
                    <li className ={liClassName + " liCommonStyle"}>Export certificate as pdf</li>
                </ul>
            </div>
        </>

    )
}
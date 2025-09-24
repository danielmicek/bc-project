import TypingAnimatedText from "./TypingAnimatedText.jsx";
import React from "react";
import ClickToCopy from "./ClickToCopy.jsx";


export default function SignedInProfilePage({uid, userName}){
    return(<>

        <div className="grid-container-logged-profile-page">
            <div className="gclpp userInfo" title = {"click to edit user info"}></div>
            <div className="gclpp welcomeUser">
                <TypingAnimatedText words={["Welcome " + userName + "!"]} delayBetweenWords={12000}/></div>
            <div className="gclpp testYourself" title = {"click to see test"}>testYourself</div>
            <div className="gclpp seeResults" title = {"click to see results"}>seeResults</div>
            <div className="gclpp getCertificate" title = {"click to get certificate"}>getCertificate</div>
        </div>
        <ClickToCopy className = "clickToCopy" userId = {uid}/>

    </>)
}
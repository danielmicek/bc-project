import React from "react";
import ClickToCopy from "./ClickToCopy.jsx";
import {useUser} from "@clerk/clerk-react";


export default function SignedInProfilePage({uid, userName}){
    const {user} = useUser();
    return(<>

        <div className="grid-container-logged-profile-page">
            {/*<div className="gclpp userInfo" title = {"click to edit user info"}></div>
            <div className="gclpp welcomeUser">
                <TypingAnimatedText words={["Welcome " + userName + "!"]} delayBetweenWords={12000}/></div>
            <div className="gclpp testYourself" title = {"click to see test"}>testYourself</div>
            <div className="gclpp seeResults" title = {"click to see results"}>seeResults</div>
            <div className="gclpp getCertificate" title = {"click to get certificate"}>getCertificate</div>*/}
            <div className = "username">{user.username}</div>
            <div className = "email">Email: {user.primaryEmailAddress.emailAddress}</div>
            <div className = "memberSince">Member since: TBA</div>
            <div className = "doneTests">Number of done tests: TBA</div>
            <div className = "bestTest">Best test score: TBA</div>
            {/*todo done tests*/}
        </div>
        <ClickToCopy className = "clickToCopy" userId = {uid}/>

    </>)
}
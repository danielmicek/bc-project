import React from "react";
import ClickToCopy from "./ClickToCopy.jsx";
import {useUser} from "@clerk/clerk-react";


export default function SignedInProfilePage(){
    const {user} = useUser();
    return(<>

        <div id = "GRID_CONTAINER_LOGGED_PROFILE_PAGE" className="absolute grid border-[5px] border-[var(--main-color-brown)] gap-[5px] rounded-[20px] w-[25cm] h-[10cm] top-[170px] right-[5cm] grid-cols-[50%_50%] grid-rows-[50px_50px_50px_50px]
                                                                 grid-flow-row [grid-template-areas:'welcome_welcome''userInfo_testYourself''userInfo_seeResults''userInfo_getCertificate']">
            {/*<div className="gclpp userInfo" title = {"click to edit user info"}></div>
            <div className="gclpp welcomeUser">
                <TypingAnimatedText words={["Welcome " + userName + "!"]} delayBetweenWords={12000}/></div>
            <div className="gclpp testYourself" title = {"click to see test"}>testYourself</div>
            <div className="gclpp seeResults" title = {"click to see results"}>seeResults</div>
            <div className="gclpp getCertificate" title = {"click to get certificate"}>getCertificate</div>*/}
            <div id = "USERNAME">{user.username}</div>
            <div id = "EMAIL">Email: {user.primaryEmailAddress.emailAddress}</div>
            <div id = "MEMBER_SICNE">Member since: TBA</div>
            <div id = "FINISHED_TESTS">Number of finished tests: TBA</div>
            <div id = "BEST_TEST">Best test score: TBA</div>
            {/*todo done tests*/}
        </div>
        <ClickToCopy className = "block w-fit" username = {user.username}/>

    </>)
}
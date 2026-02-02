import React from "react";
import {SignedOut, SignInButton} from "@clerk/clerk-react";
import '../styles/styles.css';
import {showOrHidePopup} from "../methods/methodsClass.jsx";

export default function NotSignedInPopup({refForSignedIntPopup, openedNotSignedInPopup, setOpenedNotSignedInPopup}) {
    return <>
        <div className = "bg-white text-xl border-3 w-[350px] h-[200px] fixed m-0 p-3 top-1/2 left-1/2 -translate-x-1/2 transition-transform -translate-y-1/2 rounded-[20px] overflow-hidden z-1004 justify-center flex flex-col"
             ref = {refForSignedIntPopup}
             style={{
                 display: openedNotSignedInPopup ? 'grid' : 'none',
                 gridTemplateAreas: `"upperText upperText" 
                                     "bottomText bottomText"
                                     "yesButton noButton"`
             }}>
            <h2 className="UPPER_TEXT text-center self-center font-bold" style={{ gridArea: 'upperText' }}>To start a test you need to be registered</h2>
            <h3 className = "BOTTOM_TEXT text-center self-center" style={{ gridArea: 'bottomText' }}>Click to Sign-in/Register</h3>
            <div id = "line1" className="absolute top-[110px] w-full border border-black "></div>

            <button className = "NO_BUTTON customButton bg-red-500 w-[150px] h-[50px]" style={{ gridArea: 'noButton' }} onClick={() => {
                showOrHidePopup(refForSignedIntPopup, openedNotSignedInPopup, setOpenedNotSignedInPopup);
            }
            }>Cancel</button>
            <SignedOut>
                <SignInButton className = "customButton w-[150px] h-[50px]" mode={"modal"}/>
            </SignedOut>
        </div>
    </>
}
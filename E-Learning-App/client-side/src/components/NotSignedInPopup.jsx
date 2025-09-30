import React, {useState} from "react";
import {Link} from "react-router-dom";
import {SignedOut, SignInButton} from "@clerk/clerk-react";

export default function NotSignedInPopup({refForSignedIntPopup, showOrHidePopup, openedNotSignedInPopup, setOpenedNotSignedInPopup}) {
    return <>
        <div className = "popupContainer" ref = {refForSignedIntPopup}>
            <h2 className = "upperText">To start a test you need to be registered</h2>
            <h3 className = "bottomText">Test will begin immediately</h3>

            <button className = "customButton noButton" onClick={() => {
                showOrHidePopup(refForSignedIntPopup, openedNotSignedInPopup, setOpenedNotSignedInPopup);
            }
            }>Cancel</button>
            <SignedOut>
                <SignInButton className = "customButton" mode={"modal"}/>
            </SignedOut>
        </div>
    </>
}
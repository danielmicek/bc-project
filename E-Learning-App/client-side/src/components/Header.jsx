import {Link, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import '../styles/HeaderStyle.css';
import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from "@clerk/clerk-react";
import {getUser} from "../methods/methodsClass.jsx";
import DropdownButton from "./DropdownButton.jsx";


export default function Header(){

    let location = useLocation();


    const {isSignedIn, user, isLoaded } = useUser();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (isSignedIn && user) {
            getUser(user.id, user);
        }
    }, [isSignedIn, user]);

    return !location.pathname.startsWith("/test/") ? <div className = "header" >

            <Link to = "/" className= "eleonoreText">
                <h1>eleonore</h1>
            </Link>

            {windowWidth > 630 ?
            <>
                <Link to = "/" className="buttonLink">
                    <button className="customButton">Home</button>
                </Link>

                <Link to = "/courseInfoPage" className="buttonLink">
                    <button className="customButton">Course</button>
                </Link>

                <Link to = "/profile" className="buttonLink">
                    <button className="customButton">Profile</button>
                </Link>

                <SignedOut>
                    <SignInButton className = "customButton" mode={"modal"}/>
                </SignedOut>

                <SignedIn>
                    <UserButton className = "profileImg"
                                appearance={{
                                    elements: {
                                        rootBox: "userButtonRoot",            // wrapper box
                                        userButtonAvatarBox: "profileImgInHeader",    // user avatar
                                    },
                                }}/>
                </SignedIn>
            </>
                :
                <DropdownButton/>
            }
        </div>
        :
        <></>






}
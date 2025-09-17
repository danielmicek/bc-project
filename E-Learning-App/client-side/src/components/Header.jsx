import {Link} from "react-router-dom";
import React, {useEffect} from "react";
import '../styles/HeaderStyle.css';
import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from "@clerk/clerk-react";
import {getUser} from "../methods/methodsClass.jsx";


export default function Header(){

    const {isSignedIn, user, isLoaded } = useUser();

    useEffect(() => {
        if (isSignedIn && user) {
            getUser(user.id, user);
        }
    }, [isSignedIn, user]);

    return (
        <div className = "header" >

            <Link to = "/" className= "eleonoreText">
                <h1>eleonore</h1>
            </Link>

            <Link to = "/" className="buttonLink">
                <button className="headerButton">Home</button>
            </Link>
            <Link to = "/course" className="buttonLink">
                <button className="headerButton">Course</button>
            </Link>

            <Link to = "/profile" className="buttonLink">
                <button className="headerButton">Profile</button>
            </Link>

            <SignedOut>
                <SignInButton className = "headerButton" mode={"modal"}/>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
        )



}
import {Link} from "react-router-dom";
import React from "react";
import '../styles/HeaderStyle.css';
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/clerk-react";


export default function Header(){
    return (
        <div className = "header" >

            <Link to = "/" className= "eleonoreText">
                <h1 >eleonore</h1>
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
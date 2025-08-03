import {Link} from "react-router-dom";
import React from "react";
import '../styles/HeaderStyle.css';


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
        </div>
        )



}
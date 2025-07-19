import {Link} from "react-router-dom";
import React from "react";


export default function Header(){
    return (
        <div className = "header" >
            <h1 className= "eleonoreText">eleonore</h1>
            <Link to = "/course" className="buttonLink">
                <button className="headerButton">Course</button>
            </Link>

            <Link to = "/profile" className="buttonLink">
                <button className="headerButton">Profile</button>
            </Link>
        </div>
        )



}
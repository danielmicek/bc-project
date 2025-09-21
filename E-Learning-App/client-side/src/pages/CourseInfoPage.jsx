import {Link} from "react-router-dom";
import React from "react";
import "../styles/CourseStyles/CourseInfoPageStyle.css"


export function CourseInfoPage(){
    return(
        <>
            <Link to = "/test" className="buttonLink">
                <button className= "customButton" style = {{width: "fit-content"}}>Test yourself!</button>
            </Link>
        </>
    )
}
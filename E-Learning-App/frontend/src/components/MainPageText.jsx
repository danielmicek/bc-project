import {Link} from "react-router-dom";
import React from "react";


export function MainPageText(){
    return(
        <div id = "MAIN_PAGE_TEXT_CONTAINER" className= "flex relative mx-auto top-[100px] border-[5px] border-[var(--main-color-red)] rounded-[20px] bg-[var(--main-color-blue)] w-[98vw] h-[60vh] drop-shadow-[15px_10px_8px_#6a6969]">
            <div id = "IMG_CONTAINER" className="relative z-[5] h-[400px] w-[400px] border-[5px] border-[var(--main-color-red)] rounded-full bg-[url('/pc.jpg')] bg-cover bg-right bg-no-repeat"></div>
            <div id = "TEXT_CONTAINER" className = "absolute bg-white border-[5px] border-[var(--main-color-red)] rounded-[20px] text-black w-[500px] h-fit top-[30px] right-[10vw] p-[10px]">
                <h1 id = "WELCOME_TEXT">Welcome to <span style={{fontFamily: "'Qwitcher Grypen', cursive", fontSize: "3.5rem"}}>eleonore</span></h1>
                <p id = "MAIN_PAGE_TEXT" className="font-medium text-[2rem] text-black">Your journey to knowledge starts here.<br/>Interactive lessons.<br/>Real results.</p>
            </div>

            <Link to = "/whyus">
                <button className="customButton absolute right-[7px] bottom-[7px] font-medium text-[1rem] rounded-br-[10px]">Why us</button>
            </Link>
        </div>
    )
}
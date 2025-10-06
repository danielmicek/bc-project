import React, { useEffect} from 'react';
import '../styles/HomeStyles/HomeStyle.css';
import {MainPageText} from "../components/MainPageText.jsx";


function Home() {

    /*window.addEventListener("popstate", () => {  kliknutie na backbutton v browseri
        console.log("popstate");
    });*/
    useEffect(() => { // Add the backgroundImage class to the body element so I can have different background image on each page
        document.body.classList.add("backgroundImageHomePage");
        return () => {
            document.body.classList.remove("backgroundImageHomePage");
        };
    }, []);

    return (
        <>
            <MainPageText/>
        </>

    );
}

export default Home;
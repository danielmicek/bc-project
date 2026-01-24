import React, {useEffect} from 'react';


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
        <div id = "BLACK_BACKGROUND" className="flex flex-col w-full h-screen justify-center border-2 shadow-xl relative"
             style={{backgroundColor: "#050505"}}>

        </div>

    );
}

export default Home;
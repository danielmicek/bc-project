import React, {useEffect, useState} from "react";
import {useAuth} from "@clerk/clerk-react";
import {GET_notionId} from "../methods/fetchMethods.js";
import {Button} from "@heroui/react";
import {Link} from "react-router-dom";

export default function Chapter() {
    const [notionPageId, setNotionPageId] = useState([]);
    const { getToken } = useAuth();
    const chapter = location.pathname.split('/')[2]

    useEffect(() => {
        async function loadChapter() {
            const data = await GET_notionId(chapter, getToken);
            setNotionPageId(data.notionId);
        }
        void loadChapter();
    }, [])

    // vyskusaj za par dni, ako to nepojde urob to, ze na tejto stranke  https://app.super.so/site/a359faf4-54b9-41fd-86af-719c1b536a2f
    // si pridaj vsetky kapitoly, potom do databazuy miesto notionId pridaj tu url a daj ju do iframe src

    return(
        <div id = "BLACK_BACKGROUND" className="flex flex-col p-5 w-full h-screen justify-center shadow-xl relative"
             style={{backgroundColor: "#050505"}}>
            <Link to = "/learning">
                <Button variant="light" className="bg-(--main-color-orange) font-bold absolute left-3 top-3">Späť na rozpis kapitol</Button>
            </Link>
            <div className="container pb-20 h-full flex flex-col items-center mt-20 relative">
                <iframe src={`https://kapitola-1.super.site/`}
                        width="100%" height="800px" allowFullScreen/>
            </div>
        </div>
    )
}

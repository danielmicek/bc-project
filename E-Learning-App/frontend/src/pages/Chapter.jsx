import React, {useEffect, useState} from "react";
import {GET_notionId} from "../methods/fetchMethods.jsx";
import {Button} from "@heroui/react";
import {Link} from "react-router-dom";

export default function Chapter() {
    const [notionPageId, setNotionPageId] = useState([]);
    const chapter = location.pathname.split('/')[2]

    useEffect(() => {
        async function loadChapter() {
            const data = await GET_notionId(chapter);
            setNotionPageId(data.notionId);
        }
        loadChapter();
    }, [])

    return(
        <div id = "BLACK_BACKGROUND" className="flex flex-col p-5 w-full h-screen justify-center shadow-xl relative"
             style={{backgroundColor: "#050505"}}>
            <Link to = "/learning">
                <Button variant="light" className="bg-(--main-color-orange) font-bold absolute left-3 top-3">Späť na rozpis kapitol</Button>
            </Link>
            <div className="container pb-20 h-full flex flex-col items-center mt-20 relative">
                <iframe src={`https://brash-sweatpants-9cd.notion.site/ebd//${notionPageId}`}
                        width="100%" height="800px" allowFullScreen/>
            </div>
        </div>
    )
}
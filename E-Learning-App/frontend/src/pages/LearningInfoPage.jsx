import React, {useEffect, useState} from "react";
import CardComponent from "../components/CardComponent.jsx";
import {Button} from "@heroui/react";
import {Link} from "react-router-dom";
import {GET_allChapters} from "../methods/fetchMethods.js";

export default function LearningInfoPage() {
    const [notionPages, setNotionPages] = useState([]);

    useEffect(() => {
        async function loadChapters() {
            const data = await GET_allChapters();
            setNotionPages(data);
        }
        void loadChapters();
    }, [])

    return (
        <div id = "BLACK_BACKGROUND" className="flex flex-col p-5 w-full h-fit justify-center shadow-xl relative"
             style={{backgroundColor: "#050505"}}>
            <Link to = "/courseInfoPage">
                <Button variant="light" className="bg-(--main-color-orange) font-bold absolute left-5 top-5">Späť na stránku kurzu</Button>
            </Link>
            <div className = "container pb-20 h-fit flex flex-col items-center mt-20 relative">
                <div id = "CARDS_CONTAINER" className="flex flex-wrap justify-center gap-15">
                    {notionPages.map(page => {
                        return (
                            <CardComponent title={"Kapitola " + page.chapter}
                                           notionNotesId={page.notionPageId}
                                           imgPath={page.imgPath}
                                           description={page.description}
                                           time = {page.estimatedTime}
                                           type = {"Chapter"}
                            />
                        )
                    })}

                </div>
            </div>
        </div>
    )
}
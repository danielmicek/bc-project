import React, {useEffect, useState} from "react";
import {useAuth} from "@clerk/clerk-react";
import CardComponent from "../components/CardComponent.jsx";
import {Button} from "@heroui/react";
import {Link, useNavigate} from "react-router-dom";
import {GET_allChapters} from "../methods/fetchMethods.js";
import Loader from "@/components/Loader.jsx";
import ModalComponent from "@/components/ModalComponent.jsx";

export default function LearningInfoPage() {
    const [notionPages, setNotionPages] = useState(null);
    const [authError, setAuthError] = useState(false);
    const { getToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        async function loadChapters() {
            try {
                const data = await GET_allChapters(getToken);
                setNotionPages(data);
            } catch (error) {
                if (error.status === 401) {
                    setAuthError(true);
                }
            }
        }
        void loadChapters();
    }, [])

    return (
        <div id = "BLACK_BACKGROUND" className="flex flex-col p-5 w-full min-h-screen h-fit justify-center shadow-xl relative"
             style={{backgroundColor: "#050505"}}>
            <ModalComponent title={"Nie si prihlásený"}
                            mainText={"Na zobrazenie kapitol musíš byť prihlásený."}
                            isOpen={authError}
                            onClose={() => navigate("/courseInfoPage")}
                            confirmButtonText={"Návrat do menu"}
                            confirmButtonclickHandler={() => navigate("/courseInfoPage")}
            />
            {authError ? null : notionPages === null ? <Loader/>
                :
            <>
                <Link to = "/courseInfoPage">
                    <Button variant="light" className="bg-(--main-color-orange) font-bold absolute left-5 top-5">Späť na stránku kurzu</Button>
                </Link>
                <div className = "container pb-20 h-fit flex flex-col items-center mt-20 relative">
                    <div id = "CARDS_CONTAINER" className="flex flex-wrap justify-center gap-10">
                        {notionPages.map(page => {
                            return (
                                <CardComponent key={page.notionPageId}
                                               title={"Kapitola " + page.chapter}
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
            </>
            }
        </div>
    )
}

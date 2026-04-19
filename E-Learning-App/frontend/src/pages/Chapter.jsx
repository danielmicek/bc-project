import React, {useEffect, useState} from "react";
import {useAuth} from "@clerk/clerk-react";
import {GET_notionId} from "../methods/fetchMethods.js";
import {Button} from "@heroui/react";
import {Link, useNavigate} from "react-router-dom";
import ModalComponent from "@/components/ModalComponent.jsx";

export default function Chapter() {
    const [notionPageId, setNotionPageId] = useState(null);
    const [authError, setAuthError] = useState(false);
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const chapter = location.pathname.split('/')[2];

    useEffect(() => {
        async function loadChapter() {
            try {
                const data = await GET_notionId(chapter, getToken);
                setNotionPageId(data.notionId);
            } catch (error) {
                if (error.status === 401) {
                    setAuthError(true);
                }
            }
        }
        void loadChapter();
    }, []);

    return(
        <div id="BLACK_BACKGROUND" className="flex flex-col p-5 w-full h-screen justify-center shadow-xl relative"
             style={{backgroundColor: "#050505"}}>
            <ModalComponent title={"Nie si prihlásený"}
                            mainText={"Na zobrazenie kapitoly musíš byť prihlásený."}
                            isOpen={authError}
                            onClose={() => navigate("/courseInfoPage")}
                            confirmButtonText={"Návrat do menu"}
                            confirmButtonclickHandler={() => navigate("/courseInfoPage")}
            />
            <Link to="/learning">
                <Button variant="light" className="bg-(--main-color-orange) font-bold absolute left-3 top-3">Späť na rozpis kapitol</Button>
            </Link>
            <div className="container mb-20 h-full flex flex-col items-center mt-20 relative">
                {notionPageId && (
                    <iframe src={`https://brash-sweatpants-9cd.notion.site/ebd//${notionPageId}`}
                            width="100%" height="100%" frameBorder="0" allowFullScreen/>
                )}
            </div>
        </div>
    )
}

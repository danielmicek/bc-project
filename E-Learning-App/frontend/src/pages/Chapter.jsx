import React, {useEffect, useState} from "react";
import {useAuth} from "@clerk/clerk-react";
import {GET_notionId} from "../methods/fetchMethods.js";
import {Button} from "@heroui/react";
import {Link} from "react-router-dom";
import ModalComponent from "@/components/ModalComponent.jsx";
import {useDisclosure} from "@heroui/use-disclosure";

export default function Chapter() {
    const [notionPageId, setNotionPageId] = useState(null);
    const { getToken } = useAuth();
    const {isOpen: isOpenTest_NotLoggedIn_Modal, onOpen: onOpenTest_NotLoggedIn_Modal, onClose: onCloseTest_NotLoggedIn_Modal} = useDisclosure();
    const chapter = location.pathname.split('/')[2];

    useEffect(() => {
        async function loadChapter() {
            try{
                const data = await GET_notionId(chapter, getToken);
                setNotionPageId(data.notionId);
            }
            catch (error) {
                onOpenTest_NotLoggedIn_Modal()
            }
        }
        void loadChapter();
    }, [])

    return(
        <>
            <ModalComponent title={"Nie si prihlásený"}
                            mainText={"Na zobrazenie tejto sekcie je potrebné byt prihlásený."}
                            isOpen={isOpenTest_NotLoggedIn_Modal}
                            onClose={onCloseTest_NotLoggedIn_Modal}
                            signInFlag={true}
                            confirmButtonText = {"Prihlásiť sa"}
                            declineButtonText = {"Neskôr"}
            />

            <div id="BLACK_BACKGROUND" className="flex flex-col p-5 w-full h-screen justify-center shadow-xl relative"
                 style={{backgroundColor: "#050505"}}>
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
        </>
    )
}

import React, {useEffect, useState} from "react";
import {useAuth} from "@clerk/clerk-react";
import CardComponent from "../components/CardComponent.jsx";
import {Button} from "@heroui/react";
import {Link} from "react-router-dom";
import {GET_allChapters} from "../methods/fetchMethods.js";
import Loader from "@/components/Loader.jsx";
import ModalComponent from "@/components/ModalComponent.jsx";
import {useDisclosure} from "@heroui/use-disclosure";

export default function LearningInfoPage() {
    const [notionPages, setNotionPages] = useState(null);
    const { getToken } = useAuth();
    const {isOpen: isOpenTest_NotLoggedIn_Modal, onOpen: onOpenTest_NotLoggedIn_Modal, onClose: onCloseTest_NotLoggedIn_Modal} = useDisclosure();

    useEffect(() => {
        async function loadChapters() {
            try{
                const data = await GET_allChapters(getToken);
                setNotionPages(data);
            }
            catch (error) {
                onOpenTest_NotLoggedIn_Modal()
            }
        }
        void loadChapters();
    }, [])

    return (
        <>
            <ModalComponent title={"Nie si prihlásený"}
                            mainText={"Na zobrazenie tejto sekcie je potrebné byt prihlásený."}
                            isOpen={isOpenTest_NotLoggedIn_Modal}
                            onClose={onCloseTest_NotLoggedIn_Modal}
                            signInFlag={true}
                            confirmButtonText = {"Prihlásiť sa"}
                            declineButtonText = {"Neskôr"}
            />

            <div id = "BLACK_BACKGROUND" className="flex flex-col p-5 w-full min-h-screen h-fit justify-center shadow-xl relative"
                 style={{backgroundColor: "#050505"}}>
                {notionPages === null ? <Loader/>
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
        </>

    )
}

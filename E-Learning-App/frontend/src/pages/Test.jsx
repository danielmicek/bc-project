import React, {useEffect, useState} from "react";
import Timer from "../components/Timer.jsx";
import {useUser} from "@clerk/clerk-react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {GET_createTest, POST_submitTest} from "../methods/fetchMethods.jsx";
import SwiperComponent from "../components/Swiper.jsx";
import {Button, useDisclosure} from "@heroui/react";
import Loader from "../components/Loader.jsx";
import ModalComponent from "../components/ModalComponent.jsx";
import {goToPage} from "../methods/methodsClass.jsx";


export default function Test() {
    const {user, isLoaded: userIsLoaded} = useUser();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [questions, setQuestions] = useState( []);
    const [isLoading, setIsLoading] = useState( true);
    const [timerGoing, setTimerGoing] = useState( false);
    const [testStatus, setTestStatus] = useState("ongoing"); // "ongoing" / "paused" / "submitted" / "ended"
    const {isOpen: isOpenEndTestModal, onOpen: onOpenEndTestModal, onClose: onCloseEndTestModal} = useDisclosure();
    const {isOpen: isOpenSubmitTestModal, onOpen: onOpenSubmitTestModal, onClose: onCloseSubmitTestModal} = useDisclosure();
    const {isOpen: isOpenTestResultsModal, onOpen: onOpenTestResultsModal, onClose: onCloseTestResultsModal} = useDisclosure();
    const TEST_DIFFICULTY = searchParams.get("testDifficulty")
    const TEST_ID = searchParams.get("testID")

    // create test
    useEffect(() => {
        async function loadQuestions() {
            try{
                const tmp = await GET_createTest(TEST_DIFFICULTY)
                setQuestions(tmp.createdTest)
            }
            catch (error) {
                console.log(error);
            }
            finally {
                setIsLoading(false)
                setTimerGoing(true)
            }
        }
        void loadQuestions()
    }, [])

    // stop the timer when modal is opened
    useEffect(() => {
        setTimerGoing(prev => !prev)
    }, [isOpenEndTestModal])




    return <>
        {/*END TEST MODAL*/}
        <ModalComponent title={"Naozaj chceš ukončiť test?"}
                        mainText={"Zaznačené odpovede budú stratené a v teste nebude možné pokračovať."}
                        isOpen={isOpenEndTestModal}
                        onClose={onCloseEndTestModal}
                        confirmButtonText = {"Áno"}
                        declineButtonText = {"Nie"}
                        confirmButtonclickHandler={() => navigate("/courseInfoPage")}
        />
        {/*SUBMIT TEST MODAL*/}
        <ModalComponent title={"Naozaj chceš potvrdiť test?"}
                        mainText={"Zaznačené odpovede nebude možné zmeniť."}
                        secondaryText={"Po potvrdení sa test odošle na vyhodnotenie."}
                        isOpen={isOpenSubmitTestModal}
                        onClose={onCloseSubmitTestModal}
                        confirmButtonText = {"Áno"}
                        declineButtonText = {"Nie"}
                        confirmButtonclickHandler={async () => {
                            console.log(questions);
                            const result = await POST_submitTest(questions, TEST_DIFFICULTY, user.id, TEST_ID, setIsLoading)
                            onCloseSubmitTestModal()
                            onOpenTestResultsModal()
                            setTestStatus("submitted")

                        }}
        />

        <div id = "BLACK_BACKGROUND" className="flex flex-col min-h-screen justify-center shadow-xl relative"
             style={{backgroundColor: "#050505"}}>
            {isLoading && userIsLoaded ? <Loader/> :
                testStatus === "ongoing" ?
                    <>
                        <div className = "container pb-20 h-full flex flex-col items-center">
                            <Timer minutes = {1}
                                   timerGoing={timerGoing}
                                   setTimerGoing = {setTimerGoing}
                                   completeHandler = {() => {}}
                            />

                                <>
                                    <div id = "BUTTON_CONTAINER" className = "flex max-[750px]:justify-center gap-10">
                                        <Button id = "SUBMIT_TEST_BUTTON" className="bg-(--main-color-orange) font-bold" onPress={onOpenSubmitTestModal}>
                                            Potvrdiť test
                                        </Button>

                                        <Button id = "QUIT_TEST_BUTTON"  className="bg-gray-400 font-bold" onPress={onOpenEndTestModal}>
                                            Ukončiť test
                                        </Button>
                                    </div>

                                </>

                            <SwiperComponent questions = {questions} setQuestions = {setQuestions}/>
                        </div>
                    </>
                : testStatus === "submitted" ?
                    <div className="mt-10">
                        {/*TEST RESULTS MODAL*/}
                        <ModalComponent title={"Výsledky"}
                                        mainText={"xxx"}
                                        secondaryText={"yyy"}
                                        isOpen={isOpenTestResultsModal}
                                        onClose={onCloseTestResultsModal}
                                        confirmButtonText = {"Pozrieť vyhodnotený test"}
                                        declineButtonText = {"Späť do menu"}
                                        confirmButtonclickHandler = {onCloseTestResultsModal}
                                        declineButtonclickHandler = {() => goToPage("/courseInfoPage", navigate)}
                        />
                        <Link to="/courseInfoPage">
                            <Button variant="light" className="bg-(--main-color-orange) font-bold absolute top-7 left-7">
                                Späť do menu
                            </Button>
                        </Link>
                        <SwiperComponent questions={questions} readOnly={true}/>
                    </div>
                : // testStatus === "submitted" -> timer ended
                        <div className="mt-10">
                            {/*TEST RESULTS MODAL*/}
                            <ModalComponent title={"Čas vypršal"}
                                            mainText={"Zaznačené odpovede boli vyhodnotené,za nezaznačené boli strhnuté body."}
                                            secondaryText={"yyy"}
                                            isOpen={isOpenTestResultsModal}
                                            onClose={onCloseTestResultsModal}
                                            confirmButtonText = {"Pozrieť vyhodnotený test"}
                                            declineButtonText = {"Späť do menu"}
                                            confirmButtonclickHandler = {onCloseTestResultsModal}
                                            declineButtonclickHandler = {() => goToPage("/courseInfoPage", navigate)}
                            />
                            <Link to="/courseInfoPage">
                                <Button variant="light" className="bg-(--main-color-orange) font-bold absolute top-7 left-7">
                                    Späť do menu
                                </Button>
                            </Link>
                            <SwiperComponent questions={questions} readOnly={true}/>
                        </div>
            }
        </div>
    </>
}
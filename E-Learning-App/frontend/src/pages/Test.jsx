import React, {useEffect, useState} from "react";
import Timer from "../components/Timer.jsx";
import {useUser} from "@clerk/clerk-react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {GET_createdTest, GET_getTestByTestId, POST_submitTest} from "../methods/fetchMethods.js";
import SwiperComponent from "../components/Swiper.jsx";
import {Button, useDisclosure} from "@heroui/react";
import Loader from "../components/Loader.jsx";
import ModalComponent from "../components/ModalComponent.jsx";
import {getTestLength, goToPage} from "../methods/methodsClass.js";


export default function Test() {
    const {user, isLoaded: userIsLoaded} = useUser();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [questions, setQuestions] = useState( []);
    const [isLoading, setIsLoading] = useState( true);
    const [timerGoing, setTimerGoing] = useState( false);
    const [testStatus, setTestStatus] = useState("ongoing"); // "ongoing" / "paused" / "submitted" / "ended"
    const {isOpen: isOpenEndTestModal, onOpen: onOpenEndTestModal, onClose: onCloseEndTestModal} = useDisclosure();
    const {isOpen: isOpenSubmitTestModal, onOpen: onOpenSubmitTestModal, onClose: onCloseSubmitTestModal} = useDisclosure();
    const {isOpen: isOpenTestResultsModal, onOpen: onOpenTestResultsModal, onClose: onCloseTestResultsModal} = useDisclosure();
    const TEST_DIFFICULTY = searchParams.get("testDifficulty")
    const TEST_ID = searchParams.get("testID")
    const READ_ONLY = searchParams.get("readOnly") === "true"

    // if READ_ONLY = false -> create test
    // if READ_ONLY = true -> get test from db
    // READ_ONLY is true only when the test is done -> either after submitting or after viewing it from Profile
    // both cases have the same behavior
    useEffect(() => {
        async function loadQuestions() {
            try{
                const tmp = READ_ONLY ? await GET_getTestByTestId(TEST_ID) : await GET_createdTest(TEST_DIFFICULTY)
                setQuestions(READ_ONLY ? tmp.test.structure : tmp.createdTest)
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

    // stop/resume the timer when modal is opened/closed
    useEffect(() => {
        setTimerGoing(prev => !prev)
    }, [isOpenSubmitTestModal, isOpenEndTestModal])


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
                            const result = await POST_submitTest(questions, TEST_DIFFICULTY, user.id, TEST_ID, setIsLoading)
                            setQuestions(result.testStructure)
                            onCloseSubmitTestModal()
                            onOpenTestResultsModal()
                            setTestStatus("submitted")
                            setSearchParams({ readOnly: "true" });
                        }}
        />

        <div id = "BLACK_BACKGROUND" className="flex flex-col min-h-screen justify-center shadow-xl relative"
             style={{backgroundColor: "#050505"}}>
            {isLoading && userIsLoaded ? <Loader/> :
                testStatus === "ongoing" && !READ_ONLY ?
                    <>
                        <div className = "container pb-20 h-full flex flex-col items-center">
                            <Timer minutes = {getTestLength(TEST_DIFFICULTY)}
                                   timerGoing={timerGoing}
                                   setTimerGoing = {setTimerGoing}
                                   completeHandler = {() => {}}
                                   TEST_DIFFICULTY = {TEST_DIFFICULTY}
                                   TEST_ID = {TEST_ID}
                                   questions = {questions}
                                   userId = {user.id}
                                   setQuestions = {setQuestions}
                                   setIsLoading = {setIsLoading}
                                   onCloseSubmitTestModal = {onCloseSubmitTestModal}
                                   onOpenTestResultsModal = {onOpenTestResultsModal}
                                   setTestStatus = {setTestStatus}
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
                        <SwiperComponent questions={questions}/>
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
                            <SwiperComponent questions={questions}/>
                        </div>
            }
        </div>
    </>
}
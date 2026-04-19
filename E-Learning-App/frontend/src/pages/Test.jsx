import React, {useEffect, useState} from "react";
import Timer from "../components/Timer.jsx";
import {useAuth, useUser} from "@clerk/clerk-react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {GET_createdTest, GET_getTestByTestId, POST_submitTest} from "../methods/fetchMethods.js";
import SwiperComponent from "../components/Swiper.jsx";
import {Button} from "@heroui/react";
import {useDisclosure} from "@heroui/use-disclosure";
import Loader from "../components/Loader.jsx";
import ModalComponent from "../components/ModalComponent.jsx";
import {goToPage} from "../methods/methodsClass.js";


export default function Test() {
    const {user, isLoaded: userIsLoaded} = useUser();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [questions, setQuestions] = useState( []);
    const [testResults, setTestResults] = useState(null);
    const [isLoading, setIsLoading] = useState( true);
    const [testLengthMinutes, setTestLengthMinutes] = useState(null);
    const [testSessionToken, setTestSessionToken] = useState(null);
    const [timerGoing, setTimerGoing] = useState( false);
    const [blockedByAi, setBlockedByAi] = useState( false);
    const [testStatus, setTestStatus] = useState("ongoing"); // "ongoing" / "paused" / "submitted" / "ended"
    const {isOpen: isOpenEndTestModal, onOpen: onOpenEndTestModal, onClose: onCloseEndTestModal} = useDisclosure();
    const {isOpen: isOpenSubmitTestModal, onOpen: onOpenSubmitTestModal, onClose: onCloseSubmitTestModal} = useDisclosure();
    const {isOpen: isOpenTestResultsModal, onOpen: onOpenTestResultsModal, onClose: onCloseTestResultsModal} = useDisclosure();
    const {isOpen: isOpenLeavePageModal, onOpen: onOpenLeavePageModal, onClose: onCloseLeavePageModal} = useDisclosure();
    const {isOpen: isOpenAiLimitModal, onOpen: onOpenAiLimitModal, onClose: onCloseAiLimitModal} = useDisclosure();
    const {isOpen: isOpenAiHighDemandModal, onOpen: onOpenAiHighDemandModal, onClose: onCloseAiHighDemandModal} = useDisclosure();
    const {isOpen: isOpenSubmitErrorModal, onOpen: onOpenSubmitErrorModal, onClose: onCloseSubmitErrorModal} = useDisclosure();
    const {isOpen: isOpenErrorModal, onOpen: onOpenErrorModal, onClose: onCloseErrorModal} = useDisclosure();
    const TEST_DIFFICULTY = searchParams.get("testDifficulty")
    const [TEST_ID] = useState(() => searchParams.get("testID"));
    const READ_ONLY = searchParams.get("readOnly") === "true"
    const { getToken } = useAuth()

    // browser back button
    useEffect(() => {
        const handlePopState = () => {

            if (READ_ONLY) {
                navigate("/courseInfoPage");
                return;
            }

            window.history.pushState(null, "", window.location.href);
            onOpenLeavePageModal();
        };

        window.history.pushState(null, "", window.location.href);

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };

    }, [READ_ONLY, navigate, onOpenLeavePageModal]);

    // browser refresh button
    useEffect(() => {
        if (READ_ONLY) return;

        const onBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [READ_ONLY]);


    // if READ_ONLY = false -> create test
    // if READ_ONLY = true -> get test from db
    // READ_ONLY is true only when the test is done -> either after submitting or after viewing it from Profile
    // both cases have the same behavior
    useEffect(() => {
        async function loadQuestions() {
            try{
                const tmp = READ_ONLY
                    ? await GET_getTestByTestId(TEST_ID, getToken, user.id)
                    : await GET_createdTest(TEST_DIFFICULTY, TEST_ID, getToken);
                setQuestions(READ_ONLY ? tmp.structure : tmp.createdTest)
                if(READ_ONLY) setTestResults(tmp.results)
                if(!READ_ONLY){
                    setTestLengthMinutes(tmp.testLengthMinutes);
                    setTestSessionToken(tmp.testSessionToken);
                }

                setIsLoading(false)
                setTimerGoing(true)
            }
            catch (error) {
                setIsLoading(false)
                setBlockedByAi(true)
                if(error.status === 503) onOpenAiHighDemandModal()
                else if(error.status === 429) onOpenAiLimitModal()
                else onOpenErrorModal()

            }
        }
        void loadQuestions()

    }, [userIsLoaded])

    // stop/resume the timer when modal is opened/closed
    useEffect(() => {
        setTimerGoing(prev => !prev)
    }, [isOpenSubmitTestModal, isOpenEndTestModal, isOpenLeavePageModal])

    return <>
        {/*AI LIMIT LOW*/}
        <ModalComponent title={"AI limit vyčerpaný"}
                        mainText={"Na dnešný deň boli vyčerpané všetky AI requesty, otestuj sa znova zajtra."}
                        secondaryText1={"Medzičasom si oddýchni alebo študuj materiály!"}
                        isOpen={isOpenAiLimitModal}
                        onClose={onCloseAiLimitModal}
                        confirmButtonText = {"Študovať materiály"}
                        declineButtonText = {"Späť do menu"}
                        confirmButtonclickHandler = {() => {
                            onCloseAiLimitModal()
                            navigate("/learning");
                        }}
                        declineButtonclickHandler = {() => {
                            onCloseAiLimitModal()
                            navigate("/courseInfoPage");
                        }}
        />
        {/*AI HIGH DEMANT*/}
        <ModalComponent title={"Vysoký dopyt na AI model"}
                        mainText={"Model AI zaznamenal vysoký dopyt na requesty a potrebuje si oddýchnuť."}
                        secondaryText1={"Oddýchni si aj ty alebo medzičasom študuj materiály!"}
                        isOpen={isOpenAiHighDemandModal}
                        onClose={onCloseAiHighDemandModal}
                        confirmButtonText = {"Študovať materiály"}
                        declineButtonText = {"Oddychovať v menu"}
                        confirmButtonclickHandler = {() => {
                            onCloseAiHighDemandModal()
                            navigate("/learning");
                        }}
                        declineButtonclickHandler = {() => {
                            onCloseAiHighDemandModal()
                            navigate("/courseInfoPage");
                        }}
        />
        {/*TEST RESULTS MODAL*/}
        <ModalComponent title={"Výsledky"}
                        mainText={"Dosiahnutý počet bodov: " + Number(testResults?.points ?? 0).toFixed(2)}
                        secondaryText1={"Výsledok v % : " + testResults?.percentage}
                        secondaryText2={"Známka: " + testResults?.grade}
                        secondaryText3={"Medaila: " + (testResults?.medal === "None" ? "Žiadna" : testResults?.medal)}
                        isOpen={isOpenTestResultsModal}
                        onClose={onCloseTestResultsModal}
                        confirmButtonText = {"Pozrieť vyhodnotený test"}
                        declineButtonText = {"Späť do menu"}
                        confirmButtonclickHandler={async () => {
                            const tmp = await GET_getTestByTestId(TEST_ID, getToken, user.id);
                            setQuestions(tmp.structure);
                            onCloseTestResultsModal();
                        }}
                        declineButtonclickHandler = {() => goToPage("/courseInfoPage", navigate)}
        />
        {/*SUBMIT_TEST ERROR MODAL*/}
        <ModalComponent title={"Chyba pri vyhodnocovaní testu"}
                        mainText={"Je nám ľúto, no poočas vyhodnocovania testu nastala chyba."}
                        secondaryText1={"Naber sily a sku to znova pri ďalšom teste!"}
                        isOpen={isOpenSubmitErrorModal}
                        onClose={onCloseSubmitErrorModal}
                        confirmButtonText = {"Študovať materiály"}
                        declineButtonText = {"Späť do menu"}
                        confirmButtonclickHandler = {() => {
                            onCloseSubmitErrorModal()
                            goToPage("/learning", navigate)
                        }}
                        declineButtonclickHandler = {() => onCloseSubmitErrorModal()}
        />
        {/*CREATE_TEST ERROR MODAL*/}
        <ModalComponent title={"Chyba pri generovaní testu"}
                        mainText={"Použivateľ nie je prihlásený alebo boli zadané nesprávne údaje potrebné na generovanie testu"}
                        secondaryText1={"Test nebolo možné vygenerovať!"}
                        isOpen={isOpenErrorModal}
                        onClose={onCloseErrorModal}
                        confirmButtonText = {"Späť do menu"}
                        declineButtonText = {"Študovať materiály"}
                        confirmButtonclickHandler = {() => {
                            onCloseErrorModal()
                            navigate("/courseInfoPage")
                        }}
                        declineButtonclickHandler = {() => {
                            onCloseErrorModal()
                            navigate("/learning");
                        }}
        />
        {/*LEAVE/REFRESH PAGE (BROWSER BACK/REFRESH -BUTTON) MODAL*/}
        <ModalComponent
            title={"Naozaj chceš vykonať požadovanú akciu??"}
            mainText={"Doterajší progres bude stratený"}
            isOpen={isOpenLeavePageModal}
            onClose={onCloseLeavePageModal}
            confirmButtonText={"Áno"}
            declineButtonText={"Nie"}
            confirmButtonclickHandler={() => {
                onCloseLeavePageModal();
                navigate("/courseInfoPage", { replace: true });
            }}
        />
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
                            onCloseSubmitTestModal()
                            try{
                                const result = await POST_submitTest(
                                    questions,
                                    TEST_DIFFICULTY,
                                    user.id,
                                    TEST_ID,
                                    testSessionToken,
                                    setIsLoading,
                                    getToken,
                                )
                                setQuestions(result.structure)
                                setTestResults(result.results);
                                onOpenTestResultsModal()
                                setTestStatus("submitted")
                                setSearchParams({testID: TEST_ID, testDifficulty: TEST_DIFFICULTY, readOnly: "true" });
                            } catch (error) {
                                onOpenSubmitErrorModal()
                            }
                        }}
        />

        <div id = "BLACK_BACKGROUND" className="flex flex-col min-h-screen justify-center shadow-xl relative"
             style={{backgroundColor: "#050505"}}>
            {blockedByAi ? null : (isLoading || !userIsLoaded || !questions ? <Loader/> :
                testStatus === "ongoing" && !READ_ONLY ?
                    <> {/*TEST ONGOING*/}
                        <div className = " pb-20 h-full flex flex-col items-center">
                            <Timer minutes = {testLengthMinutes ?? 0}
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
                                   testSessionToken = {testSessionToken}
                                   getToken = {getToken}
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
                :
                    <div className="mt-20"> {/*TEST NOT ONGOING*/}
                        <Link to="/courseInfoPage">
                            <Button variant="light" className="bg-(--main-color-orange) font-bold absolute top-7 left-7">
                                Späť do menu
                            </Button>
                        </Link>
                        <Button variant="light" className="bg-gray-500 px-8 font-bold absolute md:top-20 top-7 md:left-7 max-[768px]:right-7" onPress={onOpenTestResultsModal}>
                            Výsledky
                        </Button>
                        <SwiperComponent questions={questions}/>
                    </div>
            )}
        </div>
    </>
}

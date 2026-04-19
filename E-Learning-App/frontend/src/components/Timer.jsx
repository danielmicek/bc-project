import React from "react";
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import {POST_submitTest} from "../methods/fetchMethods.js";
import {useNavigate, useSearchParams} from "react-router-dom";
import ModalComponent from "@/components/ModalComponent.jsx";
import {goToPage} from "@/methods/methodsClass.js";
import {useDisclosure} from "@heroui/use-disclosure";

const renderTime = (dimension, time) => {
    return (
        <div className="time-wrapper">
            <div className="time">{time}</div>
            <div>{dimension}</div>
        </div>
    );
};

export default function Timer({
                                  minutes,
                                  timerGoing,
                                  TEST_DIFFICULTY,
                                  TEST_ID,
                                  questions,
                                  setQuestions,
                                  userId,
                                  setIsLoading,
                                  onCloseSubmitTestModal,
                                  onOpenTestResultsModal,
                                  setTestStatus,
                                  testSessionToken,
                                  getToken}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const {isOpen: isOpenSubmitErrorModal, onOpen: onOpenSubmitErrorModal, onClose: onCloseSubmitErrorModal} = useDisclosure();
    const navigate = useNavigate();

    return (
        <div className="flex w-fit m-[20px] mt-15 gap-[10px] max-[750px]:justify-self-center">

            {/*SUBMIT_TEST ERROR MODAL*/}
            <ModalComponent title={"Chyba pri vyhodnocovaní testu"}
                            mainText={"e nám ľúto, no poočas vyhodnocovania testu nastala chyba."}
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

            <CountdownCircleTimer /*MINUTES*/
                isPlaying={timerGoing}
                size={120}
                strokeWidth={6}
                colors="var(--main-color-orange)"
                duration={minutes*60}
                initialRemainingTime={minutes*60-1}
                onComplete={async (totalElapsedTime) => {
                    try {
                        const result = await POST_submitTest(
                            questions,
                            TEST_DIFFICULTY,
                            userId,
                            TEST_ID,
                            testSessionToken,
                            setIsLoading,
                            getToken,
                        )

                        setQuestions(result.structure)
                        onCloseSubmitTestModal()
                        onOpenTestResultsModal()
                        setTestStatus("submitted")
                        setSearchParams({testID: TEST_ID, testDifficulty: TEST_DIFFICULTY, readOnly: "true"});
                        return { shouldRepeat: false }
                    } catch (error) {
                        onOpenSubmitErrorModal()
                        return { shouldRepeat: false }
                    }

                }}
            >
                {({ remainingTime, color }) => (
                    <span style={{ color }}>{renderTime("minutes", Math.floor(remainingTime/60))}</span>
                )}
            </CountdownCircleTimer>


            <CountdownCircleTimer  /*SECONDS*/
                isPlaying={timerGoing}
                size={120}
                strokeWidth={6}
                colors="var(--main-color-orange)"
                duration={60}
                initialRemainingTime={minutes*60-1}
                onComplete={() => {
                    return { shouldRepeat: false }
                }}
            >
                {({ remainingTime, color }) => (
                    <span style={{ color }}>{renderTime("seconds", Math.floor(remainingTime%60))}</span>
                )}
            </CountdownCircleTimer>
        </div>
    );
}

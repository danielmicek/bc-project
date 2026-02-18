import {Button, Card, CardBody, CardFooter, CardHeader, Divider, Image, useDisclosure} from "@heroui/react";
import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useUser} from "@clerk/clerk-react";
import ModalComponent from "./ModalComponent.jsx";
import {goToPage} from "../methods/methodsClass.js";
import DetailsModal from "./DetailsModal.jsx";
import {chaptersDetails, testsAndLearningDetails} from "../methods/details.jsx";

// renders the orange button in each CardComponent according to its type
// Learning -> "Zobraziť kapitoly" button
// Test -> "Začať test" button
// default = Chapter -> "Začať kapitolu" button
function switchRender(type,
                      chapter = null,
                      isSignedIn,
                      onOpen) {

    switch (type) {
        case "Learning":
            return (
                // after clicking on the "Zobraziť kapitoly" button, it either tells us to sign in or directly opens a new page with all chapters
                isSignedIn ?
                    <Link to="/learning">
                        <Button variant="light" className="bg-(--main-color-orange) font-bold">
                            Zobraziť kapitoly
                        </Button>
                    </Link>
                        :
                        <Button variant="light" className="bg-(--main-color-orange) font-bold" onPress={onOpen}>
                            Zobraziť kapitoly
                        </Button>
                )
        case "Test":
            return (
                <Button variant="light" className="bg-(--main-color-orange) font-bold" onPress={onOpen}>
                    Začať test
                </Button>
            )
        default: // for CardComponets on /learning url -> chapters
            return (
                <Link to={`/learning/${chapter}`}>
                    <Button variant="light" className="bg-(--main-color-orange) font-bold">Začať kapitolu</Button>
                </Link>
            )
    }
}

const difficultyStyles = {
    "N/A": "bg-white text-black border-gray-300",
    Ľahký: "bg-green-100 text-green-700 border-green-300",
    Stredný: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Ťažký: "bg-red-100 text-red-700 border-red-300",
};

const difficultyTransformation = {
    Ľahký: "easy",
    Stredný: "medium",
    Ťažký: "hard",
};

export default function CardComponent({
                                          title,
                                          imgPath,
                                          description,
                                          difficulty = "N/A",
                                          questions = 0,
                                          type,
                                          time,
                                          testColumn = null
                                      }) {
    const {isSignedIn} = useUser();
    const navigate = useNavigate();
    const {isOpen: isOpenTest_Chapter_Modal, onOpen: onOpenTest_Chapter_Modal, onClose: onCloseTest_Chapter_Modal} = useDisclosure();
    const {isOpen: isOpenDetailModal, onOpen: onOpenDetailModal, onClose: onCloseDetailModal} = useDisclosure();

    return (
        <>
            <DetailsModal textArray={type === "Chapter" ? chaptersDetails[title] : testsAndLearningDetails[difficulty]}
                          isOpen = {isOpenDetailModal}
                          onClose = {onCloseDetailModal}
            />

            {isSignedIn ?
                <ModalComponent title={"Si pripravený začať test?"}
                                mainText={"Test sa začne v momente kliknutia na tlačidlo Áno"}
                                isOpen={isOpenTest_Chapter_Modal}
                                onClose={onCloseTest_Chapter_Modal}
                                confirmButtonText = {"Áno"}
                                declineButtonText = {"Neskôr"}
                                confirmButtonclickHandler={() => goToPage("/test", navigate, false, difficultyTransformation[difficulty])}
                />
                :
                <ModalComponent title={"Nie si prihlásený"}
                                mainText={"Na otestovanie sa je potrebné byt prihlásený."}
                                isOpen={isOpenTest_Chapter_Modal}
                                onClose={onCloseTest_Chapter_Modal}
                                signInFlag={true}
                                confirmButtonText = {"Prihlásiť sa"}
                                declineButtonText = {"Neskôr"}
                />
            }

            <Card className={`${testColumn} ${type === "Chapter" ? "sm:w-[400px] w-full" : "w-full"} h-[230px] pt-3 px-3 rounded-lg shadow-[5px_10px_30px_rgba(252,147,40,0.5)]
            bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border-2 border-(--main-color-orange)`}>
                <CardHeader className="flex gap-3">
                    <Image
                        alt="heroui logo"
                        height={40}
                        radius="sm"
                        src={imgPath}
                        width={40}
                    />
                    <div className="flex flex-col">
                        <p className="flex ml-4 text-xl font-bold text-white">{title}</p>
                        {/* META INFO */}
                        <div className="mt-4 flex gap-4 text-sm text-foreground/70 items-center">
                      <span>
                        <b className="text-gray-400">{questions === 0 ? "" : `${questions} otázok`}</b>
                      </span>
                            <span>
                            {type === "Chapter" && <b className="text-gray-400">Odhadovaný čas: {time} hod</b>}
                                {type !== "Chapter" &&
                                    <b className="text-gray-400">{time === 0 ? "Neobmedzený čas" : `${time} min`}</b>}
                        </span>
                            {/* DIFFICULTY BADGE */}
                            <span
                                className={`rounded-full text-center border px-3 py-1 text-xs font-semibold ${difficultyStyles[difficulty]}`}>
                        {difficulty}
                    </span>
                        </div>
                    </div>
                </CardHeader>

                <Divider className="bg-gray-500"/>

                <CardBody className="flex justify-center h-fit overflow-hidden">
                    <p className="text-white whitespace-pre-line ">{description}</p>
                </CardBody>

                <Divider className="bg-gray-500"/>

                <CardFooter>
                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="light" className="bg-gray-500 font-bold" onPress={onOpenDetailModal}>
                            Detaily
                        </Button>
                        {// orange button
                        switchRender(
                            type,
                            title.split(" ")[1],  // chapter number
                            isSignedIn,
                            onOpenTest_Chapter_Modal)
                        }
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}

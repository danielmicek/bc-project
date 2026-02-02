import {Button, Card, CardBody, CardFooter, CardHeader, Divider, Image} from "@heroui/react";
import React, {useRef, useState} from "react";
import {Link} from "react-router-dom";
import {useUser} from "@clerk/clerk-react";
import {showOrHidePopup} from "../methods/methodsClass.jsx";
import StartTestPopup from "./StartTestPopup.jsx";
import NotSignedInPopup from "./NotSignedInPopup.jsx";

function switchRender(type,
                      chapter = null,
                      isSignedIn,
                      refForStartPopup,
                      openedStartTestPopup,
                      setOpenedStartTestPopup,
                      refForSignedIntPopup,
                      openedNotSignedInPopup,
                      setOpenedNotSignedInPopup){
    switch (type){
        case "Learning": return (
            <Link to = "/learning">
                <Button variant="light" className="bg-(--main-color-orange) font-bold">Zobraziť kapitoly</Button>
            </Link>
        )
        case "Test": return (
            <Button variant="light" className="bg-(--main-color-orange) font-bold" onPress={() => {
                isSignedIn ?
                    showOrHidePopup(refForStartPopup, openedStartTestPopup, setOpenedStartTestPopup)
                    :
                    showOrHidePopup(refForSignedIntPopup, openedNotSignedInPopup, setOpenedNotSignedInPopup)
            }}>
                Začať test
            </Button>
        )
        default: return(
            <Link to ={`/learning/${chapter}`}>
                <Button variant="light" className="bg-(--main-color-orange) font-bold">Začať kapitolu</Button>
            </Link>
        )
    }
}

export default function CardComponent({
                                        title,
                                        imgPath,
                                        description,
                                        difficulty = "Neuvedený",
                                        questions = 0,
                                        time = 0,
                                        onDetails,
                                        type,
                                        testColumn = null
                                    }) {
    const {isSignedIn} = useUser();
    const [openedNotSignedInPopup, setOpenedNotSignedInPopup] = useState(false);
    const [openedStartTestPopup, setOpenedStartTestPopup] = useState(false);
    const refForStartPopup = useRef(null);
    const refForSignedIntPopup = useRef(null);

    const difficultyStyles = {
        Neuvedený: "bg-white text-black border-gray-300",
        Ľahký: "bg-green-100 text-green-700 border-green-300",
        Stredný: "bg-yellow-100 text-yellow-800 border-yellow-300",
        Ťažký: "bg-red-100 text-red-700 border-red-300",
    };

    return (
        <>
            {isSignedIn ?
                <StartTestPopup difficulty = {difficulty}
                                refForStartPopup = {refForStartPopup}
                                showOrHidePopup={showOrHidePopup}
                                openedStartPopup = {openedStartTestPopup}
                                setOpenedStartPopup = {setOpenedStartTestPopup}
                />
                :
                <NotSignedInPopup refForSignedIntPopup = {refForSignedIntPopup}
                                  showOrHidePopup={showOrHidePopup}
                                  openedNotSignedInPopup = {openedNotSignedInPopup}
                                  setOpenedNotSignedInPopup = {setOpenedNotSignedInPopup}
                />
            }

            <Card className= {`${testColumn} w-max-[400px] h-[230px] pt-3 px-3 rounded-lg shadow-[5px_10px_30px_rgba(252,147,40,0.5)] bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border-2 border-(--main-color-orange)`}>
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
                            {type === "Chapter" && <b className="text-gray-400">Odhadovaný čas: {time}</b>}
                                {type !== "Chapter" && <b className="text-gray-400">{time === 0 ? "Neobmedzený čas" : `${time} min`}</b>}
                        </span>
                            {/* DIFFICULTY BADGE */}
                            <span className={`rounded-full text-center border px-3 py-1 text-xs font-semibold ${difficultyStyles[difficulty]}`}>
                        {difficulty}
                    </span>
                        </div>
                    </div>
                </CardHeader>

                <Divider className="bg-gray-500"/>

                <CardBody className="flex justify-center">
                    <p className="text-white">{description}</p>
                </CardBody>

                <Divider className="bg-gray-500"/>

                <CardFooter>
                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="light" className="bg-gray-500 font-bold" onPress={onDetails}>
                            Detaiy
                        </Button>
                        {   // orange button
                            switchRender(
                                type,
                                "1",
                                isSignedIn,
                                refForStartPopup,
                                openedStartTestPopup,
                                setOpenedStartTestPopup,
                                refForSignedIntPopup,
                                openedNotSignedInPopup,
                                setOpenedNotSignedInPopup)
                        }
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}

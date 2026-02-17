import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {getUser_object} from "../methods/methodsClass.js";
import Loader from "../components/Loader.jsx";
import Stats from "../components/Stats.jsx";
import {Divider} from "@heroui/react";
import PieChartComponent from "../components/PieChartComponent.jsx";
import BarChartComponent from "../components/BarChartComponent.jsx";
import BasicSparkLineComponent from "../components/SparkLineChartComponent.jsx";


// a page with statistics of a particular user
// can be seen by other users by sharing the profile url or by adding them as friends
export default function UserPage() {
    const [searchParams] = useSearchParams();
    const username = searchParams.get("username")

    // funguje to nasledovne: v useEffect volam funkciu outterGetUser(), v ktorej volam getUser, ten vracia JSON objekt, tato hodnota sa zapise do foundUser a nastane rerender
    // musi to byt v useEffect pretoze potrebujem mat dependenciu, ktora ked sa zmeni ak sa vykona telo useEffect -> tam je useState ktory ulozi hodnotu vrateneho JSON objektu
    // setTimeout je tam kvoli tomu, aby sa po kratkej chvili zmenila hodnota premennej tempValue a mohol nastat rerender
    const [foundUser, setFoundUser] = useState(null);
    const [tempValue, setTempValue] = useState(0);

    useEffect(() => {
        async function outterGetUser() {
            const data = await getUser_object(username);
            setFoundUser(data);
        }
        void outterGetUser();
    }, [tempValue]);

    setTimeout(function() {
        setTempValue(1);
    }, 100);
    return( !foundUser ? <Loader/> :
            <div id = "BLACK_BACKGROUND" className="relative flex flex-col min-h-screen justify-center shadow-xl bg-[#050505]">

                <div id = "STATS_CONTAINER" className="flex min-[900px]:flex-row flex-col items-center justify-center h-fit w-[90%] mt-30 lg:pt-0 pt-15 mb-25 relative min-[900px]:gap-30 gap-5">
                    <h1 className = "absolute top-0 left-0 text-white font-bold text-5xl">Štatistiky</h1>

                    <Stats userTests = {userTests}
                           userScore = {userScore}
                    />
                    <Divider orientation="vertical" className="bg-gray-500 h-130 mt-10 hidden min-[900px]:block"/>

                    <div className="flex flex-col gap-10 items-center mt-5 min-[900px]:w-[50%] w-[100%] lg:mt-0 mt-15">
                        <PieChartComponent title = {"Graf počtu testov"}
                                           easyTests = {easyTests}
                                           mediumTests = {mediumTests}
                                           hardTests = {hardTests}
                        />

                        <Divider className="bg-gray-500"/>

                        <BarChartComponent title = {"Graf úspešnosti testov"}
                                           easyTests = {easyTests}
                                           mediumTests = {mediumTests}
                                           hardTests = {hardTests}
                        />
                    </div>
                </div>

                <Divider className="bg-gray-500 w-[70%] mb-25"/>

                <BasicSparkLineComponent title = {"Graf progresu v čase"} tests={userTests.tests}/>
            </div>
    )


}

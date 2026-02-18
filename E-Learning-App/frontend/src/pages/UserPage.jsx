import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {filterTestsByDifficulty, getUser_object} from "../methods/methodsClass.js";
import Loader from "../components/Loader.jsx";
import Stats from "../components/Stats.jsx";
import {Divider} from "@heroui/react";
import PieChartComponent from "../components/PieChartComponent.jsx";
import BarChartComponent from "../components/BarChartComponent.jsx";
import BasicSparkLineComponent from "../components/SparkLineChartComponent.jsx";
import {GET_allUsersTests, GET_UserScore} from "../methods/fetchMethods.js";


// a page with statistics of a particular user
// can be seen by other users by sharing the profile url or by adding them as friends
export default function UserPage() {
    const [searchParams] = useSearchParams();
    const [easyTests, setEasyTests] = useState([]);
    const [mediumTests, setMediumTests] = useState([]);
    const [hardTests, setHardTests] = useState([]);
    const [userTests, setUserTests] = useState(null);  // userTests look like this - {tests, bestScore}
    const [userScore, setUserScore] = useState(0);
    const username = searchParams.get("username")
    const [user, setUser] = useState(null);

    // load user
    useEffect(() => {
        async function outterGetUser() {
            const tmp = await getUser_object(username);
            setUser(tmp);
        }

        void outterGetUser();
    }, []);

    // load userScore
    useEffect(() => {
        async function loadUserScore() {
            const tmp = await GET_UserScore(user.userId)
            setUserScore(tmp.score);
        }

        if(user) void loadUserScore();
    }, [user ? user.userId : undefined])

    // load all user's tests
    useEffect(() => {
        async function load() {
            const tests = await GET_allUsersTests(user.userId)
            setUserTests(tests)
        }

        if(user) void load()
    }, [user ? user.userId : undefined])

    // load easy tests
    useEffect(() => {
        function loadEasyTests() {
            setEasyTests(filterTestsByDifficulty(userTests.tests, "easy"))
        }

        if (userTests !== null) loadEasyTests()
    }, [userTests])

    // load medium tests
    useEffect(() => {
        function loadMediumTests() {
            setMediumTests(filterTestsByDifficulty(userTests.tests, "medium"))
        }

        if (userTests !== null) loadMediumTests()
    }, [userTests])

    // load hard tests
    useEffect(() => {
        function loadHardTests() {
            setHardTests(filterTestsByDifficulty(userTests.tests, "hard"))
        }

        if (userTests !== null) loadHardTests()
    }, [userTests])

    return( !user || !userTests ? <Loader/> :
            <div id = "BLACK_BACKGROUND" className="relative flex flex-col min-h-screen justify-center shadow-xl bg-[#050505]">
                <div className="container pb-20 h-full flex flex-col items-center mt-20">
                    <h1 className = "lg:mr-auto px-15 text-center text-white font-bold text-5xl">Štatistiky používateľa <span className="text-[var(--main-color-orange)]">{user.userName}</span></h1>
                    <div id = "STATS_CONTAINER" className="flex min-[900px]:flex-row flex-col items-center justify-center h-fit w-[90%] mt-30 lg:pt-0 pt-15 mb-25 relative min-[900px]:gap-30 gap-5">

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

            </div>
    )


}

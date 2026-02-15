import React, {useEffect, useRef, useState} from "react";
import {SignedIn, UserAvatar, useUser} from "@clerk/clerk-react";
import '../styles/index.css';
import {
    filterTestsByDifficulty,
    friendListLoader,
    friendRequestListLoader,
    sendFriendRequest
} from "../methods/methodsClass.jsx";
import FriendList from "../components/FriendList.jsx";
import StatCard from "../components/StatCard.jsx";
import ClickToCopy from "../components/ClickToCopy.jsx";
import {Button, Divider} from "@heroui/react";
import {GET_allUsersTests, GET_UserScore, PUT_user} from "../methods/fetchMethods.jsx";
import {toast, Toaster} from "react-hot-toast";
import Stats from "../components/Stats.jsx";
import TestHistory from "../components/TestHistory.jsx";
import ListComponent from "../components/ListComponent.jsx";
import BarChartComponent from "../components/BarChartComponent.jsx";
import PieChartComponent from "../components/PieChartComponent.jsx";
import BasicSparkLineComponent from "../components/SparkLineChartComponent.jsx";

export default function SignedInProfilePage({   userFriendList,
                                                friendRequestsList,
                                                setUserFriendList,
                                                setFriendRequestList}){
    const [isLoading, setIsLoading] = useState(false);
    const [easyTests, setEasyTests] = useState([]);
    const [mediumTests, setMediumTests] = useState([]);
    const [hardTests, setHardTests] = useState([]);
    const [userTests, setUserTests] = useState(null);  // userTests look like this - {tests, bestScore}
    const inputRef = useRef(null);
    const {user} = useUser();
    const [userScore, setUserScore] = useState(0);

    // load userScore
    useEffect(() => {
        async function loadUserScore() {
            const tmp = await GET_UserScore(user.id)
            setUserScore(tmp.score);
        }
        void loadUserScore();
    }, [])

    // save user's info such as img url, name or email to db after he changes it
    useEffect(() => {
        async function run(){
            try {
                await toast.promise(
                    PUT_user(user.username, user.emailAddresses[0].emailAddress, user.imageUrl, user.id),
                    {
                        loading: "Updating profile...",
                        success: (responseText) => responseText,
                        error: (responseErrorText) => responseErrorText.message,
                    }
                );
            } catch (e) {}
        }
        void run()
    }, [user.username, user.emailAddresses[0].emailAddress, user.imageUrl])

    // load all user's tests
    useEffect(() => {
        async function load(){
            const tests = await GET_allUsersTests(user.id)
            console.log(tests); // todo remove
            setUserTests(tests)
        }
        void load()
    }, [])

    // load easy tests
    useEffect(() => {
        function loadEasyTests(){
            setEasyTests(filterTestsByDifficulty(userTests.tests, "easy"))
        }
        if(userTests !== null) loadEasyTests()
    }, [userTests])

    // load medium tests
    useEffect(() => {
        function loadMediumTests(){
            setMediumTests(filterTestsByDifficulty(userTests.tests, "medium"))
        }
        if(userTests !== null) loadMediumTests()
    }, [userTests])

    // load hard tests
    useEffect(() => {
        function loadHardTests(){
            setHardTests(filterTestsByDifficulty(userTests.tests, "hard"))
        }
        if(userTests !== null) loadHardTests()
    }, [userTests])

    return(<>
        <Toaster
            position="bottom-center"
            reverseOrder={false}
        />
        <div id = "BLACK_BACKGROUND" className="relative flex flex-col min-h-screen justify-center shadow-xl bg-[#050505]">
            {userTests === null ? <></> :
                <div className = "container pb-20 h-full flex flex-col items-center mt-20">
                    <div id="MAIN_CONTAINER_WITH_PROFILE_PIC" className="shadow-[5px_10px_30px_rgba(255,255,255,0.5)] w-[90%] flex flex-col min-[900px]:flex-row items-center max-[900px]:justify-center max-[900px]:pt-5 max-[480px]:px-3 min-[900px]:pl-20 h-fit rounded-lg bg-linear-to-br from-[#2a2a2a] to-[#1f1f1f] border-2 border-white relative">
                        <SignedIn>
                            <UserAvatar/>
                        </SignedIn>
                        <div id = "GRID_CONTAINER_LOGGED_PROFILE_PAGE" className="flex flex-col relative min-[900px]:ml-20 my-12.5 min-[900px]:border-l-2 min-[900px]:border-l-[#545454] items-center max-[900px]:border-t-2 max-[900px]:border-t-gray-[#545454] max-[900px]:pt-20 lg:pl-10">

                            <div id = "USERNAME" className = "sm:text-4xl text-3xl font-bold mb-3.75 text-shadow-md max-[900px]:text-center text-white">{user.username}</div>
                            <div id = "EMAIL" className = "relative sm:text-xl text-lg text-[#BFBBBB] max-[900px]:text-center">{user.primaryEmailAddress.emailAddress}</div>
                            <div id = "MEMBER_SICNE" className = "relative sm:text-lg text-mf text-[#BFBBBB] max-[900px]:text-center">Member since: 15.06.2025</div>

                            <div id = "SQUARES" className="flex items-center flex-wrap min-[700px]:items-start justify-center mt-[25px] sm:gap-5 pt-10">
                                <StatCard text="Priatelia" imgPath="/friends.png" value={userFriendList.length}/>
                                <StatCard text="Testy" imgPath="/test.png" value={userTests.tests.length}/>
                                <StatCard text="Celkové body" imgPath="/score.png" value={userScore}/>
                            </div>
                            {/*todo done tests*/}
                        </div>
                    </div>

                    <div id = "SEND_FR_AND_COPY_PROFILE_LINK_CONTAINER" className = "flex min-[800px]:flex-row flex-col gap-3 mt-[25px] items-center w-[90%]">
                        <div className="flex relativ min-[1100px]:w-[50%] w-full">
                            <ClickToCopy username = {user.username}/>
                        </div>

                        <form className="flex h-[55px] min-[1100px]:w-[50%] w-full"
                              onSubmit={(event) => {
                                  event.preventDefault(); // prevent page reload
                                  void sendFriendRequest(user.username, user.id, inputRef.current.value);
                                  inputRef.current.value = "";
                              }}
                        >
                            <input className="col-span-6 flex w-full rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-4 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                   ref={inputRef}
                                   type="text"
                                   placeholder="Enter username or user's URL"
                                   pattern="^([a-zA-Z0-9\-_\s]{4,15}|https?:\/\/.+)$" // regex for either being string of length 4-15 or url address which is validated in sendFriendRequest
                                   onInvalid={(event) => {
                                       event.preventDefault();
                                       toast.error("Must be either name or user's URL")
                                   }} // show error message when input is invalid
                                   required  // when present, it specifies that the input field must be filled out before submitting the form
                            />
                            <Button type = "submit" variant="light" className="bg-(--main-color-orange) font-bold h-[55px] ml-2">
                                Send FR
                            </Button>
                        </form>
                    </div>

                    <div className="flex min-[900px]:flex-row flex-col items-center h-fit w-[90%] mt-40 relative min-[900px]:gap-30 gap-10 pb-18 ">
                        <FriendList type="friendList"
                                    list={userFriendList}
                                    setRequestList={setFriendRequestList}
                                    setFriendsList={setUserFriendList}
                                    userUsername={user.username}
                                    userId={user.id}
                                    isLoading={isLoading}
                        />

                        <FriendList type="friendRequestList"
                                    list={friendRequestsList}
                                    setRequestList={setFriendRequestList}
                                    setFriendsList={setUserFriendList}
                                    userUsername={user.username}
                                    userId={user.id}
                                    isLoading={isLoading}
                        />

                        <Button className = "bg-(--main-color-orange) font-bold absolute bottom-0 right-0" onPress={async() => {
                            await Promise.all([
                                friendRequestListLoader(user.id, setFriendRequestList, setIsLoading),
                                friendListLoader(user.id, setUserFriendList, setIsLoading)
                            ]);
                        }}>Refresh tables ⟳</Button>
                    </div>



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

                    <TestHistory/>

                    <ListComponent title = {"Rebríček priateľov"}
                                   friends = {userFriendList}
                                   user = {user}
                                   userScore = {userScore}
                    />
                </div>
            }
        </div>

    </>)
}
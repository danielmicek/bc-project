import * as React from 'react';
import {useEffect, useState} from 'react';
import {getAStreak, getAvgGrade} from "../methods/methodsClass.jsx";
import Loader from "./Loader.jsx";
import StatCard from "./StatCard.jsx";


export default function Stats({userTests, userScore}) {

    const [isLoading, setIsLoading] = useState(false);
    const [avgGrade, setAvgGrade] = useState("N/A");
    const [aStreak, setAStreak] = useState(0);

    // load avg grade
    useEffect(() => {
        function loadAvgGrade(){
            setAvgGrade(getAvgGrade(userTests.tests))
        }
        if(userTests.tests.length > 0) loadAvgGrade()
    }, [userTests]);

    // load A-streak
    useEffect(() => {
        function loadAStreak(){
            setAStreak(getAStreak(userTests.tests))
        }
        if(userTests.tests.length > 0) loadAStreak()
    }, [userTests]);

    return (
        isLoading ? <Loader/>
            :
        <>
            <div id = "SQUARES" className="grid grid-cols-2 gap-3 sm:gap-5 pt-10">
                <StatCard text="Počet testov" imgPath="/test.png" value={userTests.tests.length}/>
                <StatCard text="Naj. skóre %" imgPath="/best.png" value={userTests.bestScore}/>
                <StatCard text="Posl. skóre %" imgPath="/score.png" value={userTests.tests[userTests.tests.length-1].percentage}/>
                <StatCard text="Celkové skóre" imgPath="/total-score.png" value={userScore}/>
                <StatCard text="Priemerné %" imgPath="/grade.png" value={avgGrade}/>
                <StatCard text="A-streak" imgPath="/streak.png" value={aStreak}/>
            </div>
        </>
    );
}
import React from "react";
import {CountdownCircleTimer} from "react-countdown-circle-timer";


const timerProps = {
    isPlaying: true,
    size: 120,
    strokeWidth: 6
};

const renderTime = (dimension, time) => {
    return (
        <div className="time-wrapper">
            <div className="time">{time}</div>
            <div>{dimension}</div>
        </div>
    );
};


export default function Timer({minutes}) {

    return (
        <div className="flex w-fit m-[20px] mt-15 gap-[10px] max-[750px]:justify-self-center">

            <CountdownCircleTimer /*MINUTES*/
                isPlaying={true}
                size={120}
                strokeWidth={6}
                colors="var(--main-color-orange)"
                duration={minutes*60}
                initialRemainingTime={minutes*60-1}
                onComplete={(totalElapsedTime) => {
                    console.log("completed");
                    if(totalElapsedTime === minutes*60){
                        return {shouldRepeat:true}
                    }
                }}
            >
                {({ remainingTime, color }) => (
                    <span style={{ color }}>{renderTime("minutes", Math.floor(remainingTime/60))}</span>
                )}
            </CountdownCircleTimer>


            <CountdownCircleTimer  /*SECONDS*/
                isPlaying={true}
                size={120}
                strokeWidth={6}
                colors="var(--main-color-orange)"
                duration={60}
                initialRemainingTime={minutes*60-1}
                onComplete={(totalElapsedTime) => {
                    return {shouldRepeat: totalElapsedTime === minutes*60}
                }}
            >
                {({ remainingTime, color }) => (
                    <span style={{ color }}>{renderTime("seconds", Math.floor(remainingTime%60))}</span>
                )}
            </CountdownCircleTimer>
        </div>
    );
}

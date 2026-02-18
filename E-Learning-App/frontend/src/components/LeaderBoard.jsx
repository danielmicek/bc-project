import {Divider} from "@heroui/react";
import * as React from "react";


export default function LeaderBoard({title, friends, user, userScore}){
    // sort users by points descending
    const users = [...friends, {
        friendName: user.username,
        friendId: user.id,
        imgUrl: user.imageUrl,
        score: userScore
    }]
    users.sort((a, b) => b.score - a.score);

    return (
        <ul className="relative list h-[300px] bg-base-100 rounded-box shadow-md w-[80%] mt-30 overflow-auto">

            <li className="p-4 pb-2 text-4xl font-bold opacity-60 tracking-wide">{title}</li>
            <Divider className="bg-gray-300"/>

            {friends.length === 0 ?
                <div className = "absolute inset-0 pt-10 flex h-full w-full items-center justify-center text-center
                    text-gray-400 font-bold text-xl">
                    Žiadny priatelia
                </div>
                :
                users.map((user, i) => {
                return (
                    <li className="list-row" key = {i}>
                        <div className="text-4xl font-thin opacity-30 tabular-nums">{String(i+1).padStart(2, "0")}</div>
                        <div><img className="size-10 rounded-box" src={user.imgUrl} alt = {"avatar"}/></div>
                        <div className="list-col-grow flex items-center">
                            <div>{user.friendName}</div>
                        </div>
                        <p className="flex items-center text-xl font-thin opacity-30 tabular-nums ml-8">{user.score}</p>
                    </li>
                )

            })}
        </ul>
    )
}
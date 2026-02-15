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
        <ul className="list bg-base-100 rounded-box shadow-md w-[70%]">

            <li className="p-4 pb-2 text-4xl font-bold opacity-60 tracking-wide">{title}</li>
            <Divider className="bg-gray-300"/>

            {users.map((user, i) => {
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
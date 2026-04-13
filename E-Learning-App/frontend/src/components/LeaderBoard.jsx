import {Divider} from "@heroui/react";
import * as React from "react";

export default function LeaderBoard({title, friends, user, userScore}) {
    const users = [...friends, {
        friendName: user.username,
        friendId: user.id,
        imgUrl: user.imageUrl,
        score: userScore
    }];

    users.sort((a, b) => b.score - a.score);

    return (
        <div id="LEADERBOARD" className="relative flex h-[280px] w-full flex-col overflow-hidden rounded-[10px]
                                         bg-base-100 lg:h-[420px] lg:w-[320px] md:flex-none shadow-[5px_10px_30px_rgba(255,255,255,0.5)]">
            <h1 className="p-4 pb-2 text-4xl font-bold tracking-wide opacity-60">{title}</h1>
            <Divider className="bg-gray-300"/>

            {friends.length === 0 ? (
                <div className="flex flex-1 items-center justify-center px-6 text-center text-xl font-bold text-gray-400">
                    Žiadni priatelia
                </div>
            ) : (
                <ul className="list min-h-0 flex-1 overflow-auto">
                    {users.map((currentUser, i) => (
                        <li className="list-row" key={i}>
                            <div className="text-4xl font-thin tabular-nums opacity-30">{String(i + 1).padStart(2, "0")}</div>
                            <div><img className="size-10 rounded-box" src={currentUser.imgUrl} alt="avatar"/></div>
                            <div className="list-col-grow flex items-center">
                                <div>{currentUser.friendName}</div>
                            </div>
                            <p className="ml-8 flex items-center text-xl font-thin tabular-nums opacity-30">{currentUser.score}</p>
                        </li>
                    ))}

                </ul>
            )}
        </div>
    );
}

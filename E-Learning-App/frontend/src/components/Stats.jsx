import * as React from 'react';
import {useEffect, useState} from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';
import {acceptFriendRequest, deleteFriend, getAStreak, getAvgGrade} from "../methods/methodsClass.jsx";
import {Link} from "react-router-dom";
import Loader from "./Loader.jsx";
import StatCard from "./StatCard.jsx";


function handleClick({
                     decision,
                     type,
                     setRequestList,
                     userUsername,
                     userId,
                     friendName,
                     friendId,
                     setFriendsList,
                     imgUrl}) {

    if (decision === "accept") {
        acceptFriendRequest(userUsername, friendName, userId, friendId, setFriendsList, setRequestList, imgUrl);
    } else {
        deleteFriend(type === "friendRequestList"? "FR" : "F", userUsername, friendName, userId, friendId, setFriendsList, setRequestList);
    }
}

function generateList({
                          type,
                          list,
                          setRequestList,
                          userUsername,
                          userId,
                          setFriendsList
                      }) {

    return list.map((friend) =>

        React.cloneElement(
            <ListItem
                sx={{
                    backgroundColor: "white",
                    borderRadius: 2,
                    mb: 1,
                }}
                secondaryAction={
                    <>
                        {type === "friendRequestList" ? //show only in the friend_requests table
                            <IconButton edge="end" aria-label="accept"
                                        onClick={() => handleClick({
                                            decision: "accept",
                                            type,
                                            setRequestList,
                                            userUsername,
                                            userId,
                                            friendName: friend.friendName,
                                            friendId: friend.friendId,
                                            setFriendsList,
                                            imgUrl: friend.imgUrl
                                        })
                                        }>
                                <CheckCircleIcon/>
                            </IconButton>
                            :
                            <Link to = {`/userPage/?username=${friend.friendName}`}>
                                <IconButton edge="end" aria-label="accept">
                                    <EqualizerOutlinedIcon/>
                                </IconButton>
                            </Link>
                        }

                        <IconButton edge="end" aria-label="delete" color = "warning"
                                    onClick={() => handleClick({
                                        decision: "reject_or_delete",
                                        type: type === "friendRequestList" ? "friendRequestList" : "friendList",
                                        setRequestList,
                                        userUsername,
                                        userId,
                                        friendName: friend.friendName,
                                        friendId: friend.friendId,
                                        setFriendsList,
                                        imgUrl: friend.imgUrl
                                    })
                                    }>
                            <DeleteIcon/>
                        </IconButton>
                    </>
                }
            >
                <ListItemAvatar>
                    <Avatar src={friend.imgUrl} alt="Avatar"/>
                </ListItemAvatar>
                <ListItemText
                    primary={friend.friendName}
                />
            </ListItem>, {
                key: friend.friendName,
            }),
    );
}


export default function Stats({
                                  userTests,
                                  userScore
                                   }) {

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
import * as React from 'react';
import {useState} from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';
import {acceptFriendRequest, deleteFriend} from "../methods/methodsClass.jsx";
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
                                  userTests
                                   }) {

    const [isLoading, setIsLoading] = useState(false);

    return (

        <div className="flex relative flex-col min-h-[400px] max-[900px]:min-h-[200px] min-[900px]:w-[50%] w-full px-5 border-2 border-(--main-color-orange)">
            {isLoading ? <Loader/>
                :
            <>
                <div id = "SQUARES" className="flex min-[700px]:flex-row items-center min-[700px]:flex-wrap min-[700px]:items-start justify-start mt-[25px] gap-3 sm:gap-5 min-[1000px]:pr-5 pt-10">
                    <StatCard text="Bronz test" imgPath="/bronze_medal.png" number={1}/>
                    <StatCard text="Silver test" imgPath="/silver_medal.png" number={2}/>
                    <StatCard text="Gold test" imgPath="/gold_medal.png" number={3}/>
                    <StatCard text="Naj. skóre %" imgPath="/score.png" number={userTests.bestScore}/>
                    <StatCard text="Posl. skóre %" imgPath="/score.png" number={userTests.bestScore}/>
                </div>
            </>
            }
        </div>
    );
}
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';
import {acceptFriendRequest, deleteFriend} from "../methods/methodsClass.js";
import {Link} from "react-router-dom";
import Loader from "./Loader.jsx";
import {Divider} from "@heroui/react";


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
        void acceptFriendRequest(userUsername, friendName, userId, friendId, setFriendsList, setRequestList, imgUrl);
    } else {
        void deleteFriend(type === "friendRequestList"? "FR" : "F", userUsername, friendName, userId, friendId, setFriendsList, setRequestList);
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

    return list.map((friend) => {
        return React.cloneElement(
            <ListItem
                key = {userId}
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
                            // show only in the friends table
                            <Link to={`/userPage/?username=${friend.friendName}`}>
                                <IconButton edge="end" aria-label="accept">
                                    <EqualizerOutlinedIcon/>
                                </IconButton>
                            </Link>
                        }

                        <IconButton edge="end" aria-label="delete" color="warning"
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
                    secondary={friend.email}
                />
            </ListItem>, {
                key: friend.friendName,
            })
    });
}


export default function FriendList({
                                       type,
                                       list,
                                       setRequestList,
                                       setFriendsList,
                                       userUsername,
                                       userId,
                                       isLoading
                                   }) {
    const title = type === "friendList" ? "Priatelia" : "Žiadosti";

    return (

        <div className="flex relative flex-col h-[400px] max-[900px]:h-[300px] min-[900px]:w-[50%] w-full rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] pt-10 px-5 shadow-[5px_10px_30px_rgba(255,255,255,0.5)] border-2 border-white">
            <div className = "flex relative w-full gap-5 items-center mb-3 pb-3">
                <img className="shrink-0 w-[40px] h-[40px] aspect-square relative" src ={type === "friendList" ? "/friends-white.png" : "/add-user-white.png"} alt = {title}/>
                <h1 className = "font-bold min-w-0 max-[500px]:text-3xl text-4xl text-white">{title}</h1>
            </div>

            <Divider className="bg-gray-500"/>

            {isLoading ? <Loader/>
                :
            <div className="overflow-y-scroll no-scrollbar rounded-lg">
                {list.length === 0 ?
                    <h3 className = "absolute inset-0 mt-10 flex h-full w-full items-center justify-center text-center
                    text-gray-400 font-bold text-xl">
                        {type === "friendList" ? "Žiadny priatelia" : "Žiadne žiadosti o priateľstvo"}
                    </h3>
                    :
                    <List dense={false}>
                        {generateList(
                            {
                                type,
                                list,
                                setRequestList,
                                userUsername,
                                userId,
                                setFriendsList
                            }
                        )}
                    </List>
                }
            </div>
            }
        </div>
    );
}
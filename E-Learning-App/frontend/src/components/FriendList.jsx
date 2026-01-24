import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularIndeterminate from "./Loader.jsx";


function handleClick({
                     decision,
                     type,
                     setRequestList,
                     accept,
                     deletee,
                     userUsername,
                     friendName,
                     setFriendsList,
                     imgUrl}) {

    if (decision === "accept") {
        accept(userUsername, friendName, setFriendsList, setRequestList, imgUrl);
    } else {
        deletee(type === "friendRequestList"? "FR" : "F", userUsername, friendName, setFriendsList, setRequestList);
    }
}

function generateList({
                          type,
                          list,
                          setRequestList,
                          accept,
                          userUsername,
                          deletee,
                          setFriendsList
                      }) {

    return list.map((friend) =>
        React.cloneElement(

            <ListItem
                secondaryAction={
                    <>
                        {type === "friendRequestList" && //show only in the friend_requests table
                            <IconButton edge="end" aria-label="accept"
                                        onClick={() => handleClick({
                                            decision: "accept",
                                            type,
                                            setRequestList,
                                            accept,
                                            deletee,
                                            userUsername,
                                            friendName: friend.friendName,
                                            setFriendsList,
                                            imgUrl: friend.imgUrl
                                        })
                                        }>
                                <CheckCircleIcon/>
                            </IconButton>
                        }

                        <IconButton edge="end" aria-label="delete"
                                    onClick={() => handleClick({
                                        decision: "decline",
                                        classname,
                                        setRequestList,
                                        accept,
                                        deletee,
                                        userUsername,
                                        friendName: friend.friendName,
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


export default function FriendList({
                                       type,
                                       list,
                                       setRequestList,
                                       accept,
                                       userUsername,
                                       deletee,
                                       setFriendsList,
                                       isLoading
                                   }) {
    const title = type === "friendList" ? "Friends" : "Friend requests";
    return (

        <div className="flex relative flex-col min-h-[400px] max-[900px]:min-h-[200px] min-[900px]:w-[50%] w-full rounded-3xl bg-white flex shadow-xl relative pt-10">
            <div className = "flex relative w-full gap-5">
                <img className="ml-10 w-[40px] h-[40px] aspect-square" src ={type === "friendList" ? "/friends.png" : "/add-user.png"} alt = "friends"/>
                <h1 className = "font-bold min-w-0 max-[500px]:text-3xl text-4xl justify-center">{title}</h1>
            </div>

            {isLoading ? <CircularIndeterminate/>
                :
            <>
                {type === "friendList" && list.length === 0 && <div className = "absolute flex h-full w-full items-center justify-center text-center text-gray-400 font-bold text-xl">No friends yet</div>}
                {type === "friendRequestList" && list.length === 0 && <div className = "absolute flex h-full w-full items-center justify-center text-center text-gray-400 font-bold text-xl">No friend requests</div>}
                {list.length !== 0 &&
                    <List dense={false}>
                        {generateList(
                            {
                                type,
                                list,
                                setRequestList,
                                accept,
                                deletee,
                                userUsername,
                                setFriendsList
                            }
                        )}
                    </List>
                }
            </>
            }
        </div>

    );
}
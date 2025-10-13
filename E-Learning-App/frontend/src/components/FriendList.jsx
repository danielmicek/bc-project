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
                     classname,
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
        deletee(classname === "friendRequestList"? "FR" : "F", userUsername, friendName, setFriendsList, setRequestList);
    }
}

function generateList({
                          classname,
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
                        {classname === "friendRequestList" && //show only in the friend_requests table
                            <IconButton edge="end" aria-label="accept"
                                        onClick={() => handleClick({
                                            decision: "accept",
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
                                       classname,
                                       list,
                                       setRequestList,
                                       accept,
                                       userUsername,
                                       deletee,
                                       setFriendsList,
                                       isLoading
                                   }) {
    const title = classname === "friendList" ? "Friends:" : "Friend requests:";
    return (

        <div className = {classname}>
            <h2>{title}</h2>
            {isLoading ? <CircularIndeterminate/>
                :
            <>
                {classname === "friendList" && list.length === 0 && <p>No friends yet</p>}
                {classname === "friendRequestList" && list.length === 0 && <p>No friend requests</p>}
                {list.length !== 0 &&
                    <List dense={false}>
                        {generateList(
                            {
                                classname,
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
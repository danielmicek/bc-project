import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'
import io from 'socket.io-client';
import '../styles/Home.css';
import Player from "../components/Player.jsx";
import Header from "../components/Header.jsx";
import {Link} from "react-router-dom";
import { ClerkProvider, useUser } from '@clerk/clerk-react'
import {MainPageText} from "../components/MainPageText.jsx";

let socket = io.connect('http://localhost:3000');

function fromArrayToMap(users, usersFromServerSide, setUsers) {
    console.log("CLICKED!!!" + socket.id)
    users.set(usersFromServerSide[0][0], usersFromServerSide[0][1]);
    setUsers(users);
}




function Home() {

    const {isSignedIn, user, isLoaded } = useUser();




    const [users, setUsers] = useState(new Map());



    return (
        <>

            <MainPageText/>

            <Player fromArrayToMap = {fromArrayToMap} nameFromAppComponent = {socket.id}/>


            <button onClick={() => {
                console.log(isSignedIn);
            }
            } >User signed in?</button>

        </>

    );
}

export default Home;
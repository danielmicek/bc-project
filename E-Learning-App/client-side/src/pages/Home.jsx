import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'
import io from 'socket.io-client';
import '../styles/Home.css';
import Player from "../components/Player.jsx";
import Header from "../components/Header.jsx";
import {Link} from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react'
import {MainPageText} from "../components/MainPageText.jsx";

let socket = io.connect('http://localhost:3000');

function fromArrayToMap(users, usersFromServerSide, setUsers) {
    console.log("CLICKED!!!" + socket.id)
    users.set(usersFromServerSide[0][0], usersFromServerSide[0][1]);
    setUsers(users);
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
console.log(PUBLISHABLE_KEY);
console.log(import.meta.env);
if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}


function Home() {


    const [connected, setConnected] = useState(socket.connected)


    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
            setConnected(true)
        });

        socket.on('nameChange', (usersFromServerSide) => {
            fromArrayToMap(users, usersFromServerSide, setUsers)
        })
    }, [])





    const [users, setUsers] = useState(new Map());



    return ( connected === false ? <div>Loading...</div> :
        <>

            <MainPageText/>




            <Player fromArrayToMap = {fromArrayToMap} nameFromAppComponent = {socket.id}/>


            <button onClick={() => {
                setUsers(new Map());
                console.log(users.size);
                }
            }
            >Restart Game</button>

        </>

    );
}

export default Home;
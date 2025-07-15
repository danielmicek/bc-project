import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Player from "./components/Player.jsx";

let socket = io.connect('http://localhost:3000');

function fromArrayToMap(users, usersFromServerSide, setUsers) {
    console.log("CLICKED!!!" + socket.id)
    users.set(usersFromServerSide[0][0], usersFromServerSide[0][1]);
    setUsers(users);
}

function App() {

    const [connected, setConnected] = useState(socket.connected)
    //todo create the name and setName for socket.id here, lift the state up from Player component
    // and do all the logic of changing name here in this component, glhf

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
            setConnected(true)
        });

        socket.on('nameChange', (usersFromServerSide) => {
            fromArrayToMap(users, usersFromServerSide, setUsers)
            console.log(usersFromServerSide, "from app component");
        })
    }, [])





    const [users, setUsers] = useState(new Map());



    return ( connected === false ? <div>Loading...</div> :
        <div>
            <h1>Multiplayer Tic-Tac-Toe</h1>

            <Player fromArrayToMap = {fromArrayToMap} nameFromAppComponent = {socket.id}/>


            <button onClick={() => {
                setUsers(new Map());
                console.log(users.size);
                }
            }
            >Restart Game</button>

        </div>

    );
}

export default App;
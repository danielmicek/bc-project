import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Player from "./components/User.jsx";

const socket = io('http://localhost:3000');

function App() {



    return (
        <div>
            <h1>Multiplayer Tic-Tac-Toe</h1>
            <Player/>

            <button onClick={() =>
                socket.emit('restartGame')}>Restart Game</button>
        </div>
    );
}

export default App;
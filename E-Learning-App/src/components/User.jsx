import {useState} from "react"


export default function Player(){
    const [playerName, setPlayerName] = useState(name);

    return(
        <div>
            <input type="text" value={playerName}/>
        </div>
    )
}
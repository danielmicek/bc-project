import {useState, useEffect} from "react"


export default function Player({fromArrayToMap, nameFromAppComponent}){

    useEffect(() => {
        setName(nameFromAppComponent);
    }, [nameFromAppComponent]);

    console.log("-->> ", nameFromAppComponent);

    const [name, setName] = useState(nameFromAppComponent);


    const handleChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(event);
        fromArrayToMap();
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="text" value={name} onChange={handleChange}/>
                </label>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}
import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import CircularIndeterminate from "../components/Loader.jsx";
import DividerVariants from "../components/DividerVariants.jsx";
import {getUser_object} from "../methods/methodsClass.jsx";


export default function UserPage() {

    useEffect(() => { // Add the backgroundImage class to the body element so I can have different background image on each page
        document.body.classList.add("backgroundImage");
        return () => {
            document.body.classList.remove("backgroundImage");
        };
    }, []);

    const [searchParams] = useSearchParams();
    const username = searchParams.get("username")

    //funguje to nasledovne: v useEffect volam funkciu outterGetUser(), v ktorej volam getUser, ten vracia JSON objekt, tato hodnota sa zapise do foundUser a nastane rerender
    //musi to byt v useEffect pretoze potrebujem mat dependenciu, ktora ked sa zmeni ak sa vykona telo useEffect -> tam je useState ktory ulozi hodnotu vrateneho JSON objektu
    //setTimeout je tam kvoli tomu, aby sa po kratkej chvili zmenila hodnota premennej tempValue a mohol nastat rerender
    const [foundUser, setFoundUser] = useState(null);
    const [tempValue, setTempValue] = useState(0);

    useEffect(() => {
        async function outterGetUser() {
            const data = await getUser_object(username);
            setFoundUser(data);
        }
        outterGetUser();
        console.log(foundUser);
    }, [tempValue]);

    setTimeout(function() {
        setTempValue(1);
    }, 100);
    return( foundUser ? <>
            <DividerVariants name ={foundUser.userName} email = {foundUser.userEmail} uid = {foundUser.userId}/>
        </> : <CircularIndeterminate/>)


}

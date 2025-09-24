import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'
import io from 'socket.io-client';
import '../styles/HomeStyles/HomeStyle.css';
import Player from "../components/Player.jsx";
import Header from "../components/Header.jsx";
import {Link} from "react-router-dom";
import { ClerkProvider, useUser } from '@clerk/clerk-react'
import {MainPageText} from "../components/MainPageText.jsx";
import StaggeredMenu from "../components/StaggeredMenu.jsx";

let socket = io.connect('http://localhost:3000');

function fromArrayToMap(users, usersFromServerSide, setUsers) {
    console.log("CLICKED!!!" + socket.id)
    users.set(usersFromServerSide[0][0], usersFromServerSide[0][1]);
    setUsers(users);
}


const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];


function Home() {

    const {isSignedIn, user, isLoaded } = useUser();

    useEffect(() => { // Add the backgroundImage class to the body element so I can have different background image on each page
        document.body.classList.add("backgroundImageHomePage");
        return () => {
            document.body.classList.remove("backgroundImageHomePage");
        };
    }, []);



    return (
        <>

            <MainPageText/>
        </>

    );
}

export default Home;
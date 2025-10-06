import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import {Link} from "react-router-dom";
import React from "react";
import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from "@clerk/clerk-react";

export default function DropdownButton() {
    const {isSignedIn, user, isLoaded } = useUser();

    return (
        <Dropdown className = "dropdown-container">
            <DropdownTrigger >
                <Button className = "customButton v2" variant="solid" ></Button>
            </DropdownTrigger>


                {isSignedIn ?
                    <DropdownMenu className = "dropdown-menu" textValue = "aaa">
                        <DropdownItem className = "dropdownItem" textValue="Avatar" style = {{margin: "5px 0 15px 37px"}}>
                                <Link to = "/profile" className="buttonLink">
                                    <button className="avatarButton"> <img className="avatarButton" src = {user.imageUrl} alt = "user avatar"/> </button>
                                </Link>

                        </DropdownItem>

                        <DropdownItem className = "dropdownItem" textValue="Home">
                            <Link to = "/" className="buttonLink">
                                <button className="customButton">Home</button>
                            </Link>
                        </DropdownItem>

                        <DropdownItem className = "dropdownItem" textValue="Course">
                            <Link to = "/courseInfoPage" className="buttonLink">
                                <button className="customButton">Course</button>
                            </Link>
                        </DropdownItem>

                        <DropdownItem className = "dropdownItem" textValue="Profile">
                            <Link to = "/profile" className="buttonLink">
                                <button className="customButton">Profile</button>
                            </Link>
                        </DropdownItem>
                    </DropdownMenu>
                    :
                    <DropdownMenu className = "dropdown-menu" textValue = "aaa">
                        <DropdownItem className = "dropdownItem" textValue="Home">
                            <Link to = "/" className="buttonLink">
                                <button className="customButton">Home</button>
                            </Link>
                        </DropdownItem>

                        <DropdownItem className = "dropdownItem" textValue="Course">
                            <Link to = "/courseInfoPage" className="buttonLink">
                                <button className="customButton">Course</button>
                            </Link>
                        </DropdownItem>

                        <DropdownItem className = "dropdownItem" textValue="Profile">
                            <Link to = "/profile" className="buttonLink">
                                <button className="customButton">Profile</button>
                            </Link>
                        </DropdownItem>


                        <DropdownItem className = "dropdownItem" textValue="Sign in">
                            <SignedOut>
                                <SignInButton className = "customButton" mode={"modal"} style={{backgroundColor: "#ed4258", color: "black"}}/>
                            </SignedOut>
                        </DropdownItem>
                    </DropdownMenu>}
        </Dropdown>
    );
}

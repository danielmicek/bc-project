import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import {Link} from "react-router-dom";
import React from "react";
import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from "@clerk/clerk-react";

export default function DropdownButton() {
    const {isSignedIn, user, isLoaded } = useUser();

    return (
        <Dropdown className = "dropdown-container" >
            <DropdownTrigger >
                <Button className = "headerButton v2" variant="solid" ></Button>
            </DropdownTrigger>


                {isSignedIn ?
                    <DropdownMenu className = "dropdown-menu" textValue = "aaa">
                        <DropdownItem className = "dropdownItem" textValue="Avatar" style = {{margin: "5px 0 15px 37px"}}>
                            <SignedIn>
                                <UserButton/>
                            </SignedIn>
                        </DropdownItem>

                        <DropdownItem className = "dropdownItem" textValue="Home">
                            <Link to = "/" className="buttonLink">
                                <button className="headerButton">Home</button>
                            </Link>
                        </DropdownItem>

                        <DropdownItem className = "dropdownItem" textValue="Course">
                            <Link to = "/course" className="buttonLink">
                                <button className="headerButton">Course</button>
                            </Link>
                        </DropdownItem>

                        <DropdownItem className = "dropdownItem" textValue="Profile">
                            <Link to = "/profile" className="buttonLink">
                                <button className="headerButton">Profile</button>
                            </Link>
                        </DropdownItem>
                    </DropdownMenu>
                    :
                    <DropdownMenu className = "dropdown-menu" textValue = "aaa">
                        <DropdownItem className = "dropdownItem" textValue="Home">
                            <Link to = "/" className="buttonLink">
                                <button className="headerButton">Home</button>
                            </Link>
                        </DropdownItem>

                        <DropdownItem className = "dropdownItem" textValue="Course">
                            <Link to = "/course" className="buttonLink">
                                <button className="headerButton">Course</button>
                            </Link>
                        </DropdownItem>

                        <DropdownItem className = "dropdownItem" textValue="Profile">
                            <Link to = "/profile" className="buttonLink">
                                <button className="headerButton">Profile</button>
                            </Link>
                        </DropdownItem>


                        <DropdownItem className = "dropdownItem" textValue="Sign in">
                            <SignedOut>
                                <SignInButton className = "headerButton" mode={"modal"} style={{backgroundColor: "#ed4258", color: "black"}}/>
                            </SignedOut>
                        </DropdownItem>
                    </DropdownMenu>}
        </Dropdown>
    );
}

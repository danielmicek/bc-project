import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/react";
import {Link} from "react-router-dom";
import React from "react";
import {SignedOut, SignInButton, useUser} from "@clerk/clerk-react";

export default function DropdownButton() {
    const {isSignedIn, user, isLoaded } = useUser();

    return (
        <Dropdown className = "dropdown-container">
            <DropdownTrigger >
                <Button className = "customButton w-[1cm] h-[1cm] text-white bg-[url('/dropdownMenu_icon.png')] bg-contain bg-no-repeat" variant="solid" ></Button>
            </DropdownTrigger>


                {isSignedIn ?
                    <DropdownMenu className = "dropdown-menu" textValue = "aaa">
                        <DropdownItem className = "dropdownItem" textValue="Avatar" style = {{margin: "5px 0 15px 37px"}}>
                                <Link to = "/profile" className="buttonLink">
                                    <button className="relative top-[3px] right-[5px] w-[1cm] h-[1cm] rounded-full border-0 hover:shadow-[rgba(45,35,66,0.4)_0_4px_8px,rgba(45,35,66,0.3)_0_7px_13px_-3px,#D6D6E7_0_-3px_0_inset] hover:-translate-y-[2px]">
                                        <img className="relative top-[3px] right-[5px] w-[1cm] h-[1cm] rounded-full border-0 hover:shadow-[rgba(45,35,66,0.4)_0_4px_8px,rgba(45,35,66,0.3)_0_7px_13px_-3px,#D6D6E7_0_-3px_0_inset] hover:-translate-y-[2px]"
                                             src = {user.imageUrl} alt = "user avatar"/> </button>
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

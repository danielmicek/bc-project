import React from "react";
import {Link, useLocation} from "react-router-dom";
import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from "@heroui/react";

import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/clerk-react";

export const AcmeLogo = () => {
    return (
        <Link to = "/" className= "text-color-black text-4xl">
            <h1 className="font-bold">eleonore</h1>
        </Link>
    );
};

export default function TheNavbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();

    const menuItems = [
        "Home",
        "Course",
        "Profile",
    ];
    return (
        <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <AcmeLogo />
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem className="data-[active=true]:text-(--main-color-orange) data-[active=true]:font-bold text-xl" isActive={location.pathname === "/"}>
                    <Link to="/" color="foreground">
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem className="data-[active=true]:text-(--main-color-orange) data-[active=true]:font-bold text-xl" isActive={location.pathname === "/courseInfoPage"}>
                    <Link to ="/courseInfoPage">
                        Course
                    </Link>
                </NavbarItem>
                <NavbarItem className="data-[active=true]:text-(--main-color-orange) data-[active=true]:font-bold text-xl" isActive={location.pathname === "/profile"}>
                    <Link to = "/profile" color="foreground">
                        Profile
                    </Link>
                </NavbarItem>

            </NavbarContent>


            <NavbarContent justify="end">
                <NavbarItem>
                    <SignedOut>
                        <Button className = "bg-(--main-color-orange) font-bold">
                            <SignInButton className = "w-full h-full" mode={"modal"}/>
                        </Button>
                    </SignedOut>
                </NavbarItem>
                <NavbarItem>
                    <SignedIn>
                        <UserButton className = "absolute rounded-full h-[40vh] w-[40vh] mt-[85vh] border-[5px] border-white"
                                    appearance={{
                                        elements: {
                                            rootBox: "userButtonRoot",            // wrapper box
                                            userButtonAvatarBox: "profileImgInHeader",    // user avatar
                                        },
                                    }}/>
                    </SignedIn>
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`} className="data-[active=true]:text-[var(--main-color-orange)] data-[active=true]:font-bold text-xl" isActive={location.pathname === getPagePathnameFromPageName(item)}>
                        <Link
                            className="w-full"
                            color={
                                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                            }
                            to={getPagePathnameFromPageName(item)}
                            size="lg"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}

function getPagePathnameFromPageName(pageName) {
    if(pageName === "Home") return "/";
    else if(pageName === "Course") return "/courseInfoPage";
    return "/" + pageName.toLowerCase();
}


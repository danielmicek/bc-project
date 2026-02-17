import * as React from "react";
import {useEffect, useState} from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import {Link} from "react-router-dom";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {Divider} from "@heroui/react";
import ListItemText from "@mui/material/ListItemText";

function generateHistory(tests, screenWidth) {

    return tests.map((test, i) =>

        React.cloneElement(
            <ListItem key={i}
                sx={{
                    backgroundColor: "white",
                    borderRadius: 2,
                    mb: 1,
                }}
                secondaryAction={
                    <>
                        <Link to = {`/test?testID=${test.testId}&readOnly=true`}>
                            <IconButton edge="end" aria-label="accept" color = "warning">
                                <VisibilityOutlinedIcon/>
                            </IconButton>
                        </Link>

                    </>
                }
            >
                {/*<ListItemText
                    primary={String(i+1).padStart(2, "0")}
                />
                <Divider orientation="vertical" className="bg-(--main-color-orange) h-10 mr-8"/>
                <ListItemText
                    primary={"%"}
                    secondary={test.percentage}
                />
                <ListItemText
                    primary = {"Známka"}
                    secondary={test.grade}
                />
                <ListItemText
                    primary = {"Medaila"}
                    secondary={test.medal}
                />
                <ListItemText
                    primary = {"Dátum"}
                    secondary={new Date(test.timestamp).toLocaleString()}
                />*/}

                <ListItemText
                    primary={String(i+1).padStart(2, "0")}
                />

                <Divider orientation="vertical" className="h-10 mr-8 ml-3 sm:ml-0"/>

                <ListItemText
                    primary={"%"}
                    secondary={test.percentage}
                    sx={{
                        color: 'var(--main-color-orange)',
                        marginRight: screenWidth < 640 ? "30px" : "0"
                    }}
                />
                {screenWidth >= 640 && <ListItemText
                    primary = {"Známka"}
                    secondary={test.grade}
                    sx={{
                        color: 'var(--main-color-orange)',
                    }}
                />}
                {screenWidth >= 640 && <ListItemText
                    primary={"Medaila"}
                    secondary={test.medal}
                    sx={{
                        color: 'var(--main-color-orange)',
                    }}
                />}
                <ListItemText
                    primary={"Dátum"}
                    secondary={new Date(test.timestamp).toLocaleString()}
                    sx={{
                        color: 'var(--main-color-orange)',
                    }}
                />

            </ListItem>, {
                key: test.id,
            }),
    );
}

export default function TestHistory({userTests}) {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        setScreenWidth(window.innerWidth);
        function resizeHandler() {
            setScreenWidth(window.innerWidth);
        }
        window.addEventListener("resize", resizeHandler);
        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    })


    return (

        <div className="flex relative flex-col h-[400px] max-[900px]:h-[300px] w-[80%]
        rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] pt-10 mt-50 px-5 shadow-[5px_10px_30px_rgba(252,255,255,0.5)]
        border-2 border-white">

            <div className = "flex relative w-full gap-5 items-center mb-3 pb-3">
                <img className="shrink-0 w-[40px] h-[40px] aspect-square relative" src ={"/history.png"} alt = {"test history"}/>
                <h1 className = "font-bold min-w-0 max-[500px]:text-3xl text-4xl text-white">História testov</h1>
            </div>

            <Divider className="bg-gray-500"/>

            <div className="overflow-y-scroll no-scrollbar rounded-lg">
                {userTests.length === 0 ?
                    <div className="absolute inset-0 mt-10 flex h-full w-full items-center justify-center
                    text-center text-gray-400 font-bold text-xl">Žiadne testy
                    </div>
                :
                    <List dense={false}>
                        {generateHistory(userTests, screenWidth)}
                    </List>
                }
            </div>

        </div>
    );
}
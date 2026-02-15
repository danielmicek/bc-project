import * as React from "react";
import {useState} from "react";
import Loader from "./Loader.jsx";

export default function TestHistory({
                                  userTests
                              }) {

    const [isLoading, setIsLoading] = useState(false);

    return (

        <div className="flex relative flex-col min-h-[400px] max-[900px]:min-h-[200px] min-[900px]:w-[50%] w-full rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] pt-10 mt-40 px-5 shadow-[5px_10px_30px_rgba(252,147,40,0.5)] border-2 border-(--main-color-orange)">
            {isLoading ? <Loader/>
                :
                <>

                </>
            }
        </div>
    );
}
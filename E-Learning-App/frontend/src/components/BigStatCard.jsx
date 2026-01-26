import * as React from "react";

export default function BigStatCard({
                                        mainText,
                                        secondText,
                                        iconPath
                                    }) {
    return (
        <div className="w-[300px] aspect-square bg-gray-600 shadow-[5px_10px_30px_rgba(252,147,40,0.5)] rounded-lg border-2 border-(--main-color-orange) p-8 hover:shadow-[5px_10px_30px_rgba(252,147,40,0.8)]">
            <div className="h-12">
                <img className="w-[40px] h-[40px] aspect-square" src ={iconPath} alt = {mainText}/>
            </div>
            {/*<h3 className="text-3xl font-bold text-gray-900 mb-1">{number}</h3>*/}
            <p className="text-2xl font-extrabold mb-3 text-white pb-3">{mainText}</p>
            <p className="text-md text-gray-300 leading-relaxed whitespace-pre-line">{secondText}</p>
        </div>
    )
}
import * as React from "react";

export default function StatCard({
                                     imgPath,
                                     value,
                                     text}){

    return (
        <div className="flex flex-col items-center min-[700px]:w-[150px] w-[150px] aspect-square rounded-lg bg-white p-6">
            <div className="h-12">
                <img className="w-[40px] h-[40px] aspect-square" src ={imgPath} alt = {text}/>
            </div>
            <div className="my-2">
                <h2 className="text-4xl font-bold text-(--main-color-orange)"><span>{value}</span> </h2>
            </div>

            <div>
                <p className="mt-1 font-sans text-base font-medium text-gray-500 whitespace-nowrap">{text}</p>
            </div>
        </div>
    )
}
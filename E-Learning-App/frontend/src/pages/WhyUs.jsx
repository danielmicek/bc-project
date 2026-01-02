
export function WhyUs(){
    return(
        <div className = "grid h-[100vh] w-[100vw] gap-[50px] border border-[#F7374F] grid-cols-[30vw_30vw] grid-rows-[200px_200px_200px_200px] [grid-template-areas:'zero_zero''first-left_first-right''sec-left_sec-right''last-left_last-right'] justify-center overflow-y-scroll">
            <div className="flex items-center justify-center text-white border border-[#F7374F] rounded-[16px] transition-transform duration-300 ease-in-out hover:scale-[1.05] hover:bg-[#F7374F] [grid-area:zero]">The journey starts here. Now.</div>
            <div className="flex items-center justify-center text-white border border-[#F7374F] rounded-[16px] transition-transform duration-300 ease-in-out hover:scale-[1.05] hover:bg-[#F7374F] [grid-area:first-left]">Study materials</div>
            <div className="flex items-center justify-center text-white border border-[#F7374F] rounded-[16px] transition-transform duration-300 ease-in-out hover:scale-[1.05] hover:bg-[#F7374F] [grid-area:first-right]">Test yourself</div>
            <div className="flex items-center justify-center text-white border border-[#F7374F] rounded-[16px] transition-transform duration-300 ease-in-out hover:scale-[1.05] hover:bg-[#F7374F] [grid-area:sec-left]">See results</div>
            <div className="flex items-center justify-center text-white border border-[#F7374F] rounded-[16px] transition-transform duration-300 ease-in-out hover:scale-[1.05] hover:bg-[#F7374F] [grid-area:sec-right]">Get certificate</div>
        </div>
    )
}

export function ErrorNotFound(){
    return(
        <>
            <div id = "NOT_FOUND" className = "relative flex w-[100vw] h-[100vh] items-center justify-center text-white [text-shadow:grey_0.1em_0.1em_0.2em]">
                <h3>You need to rest, study later...</h3>
            </div>
            <footer className = "absolute bottom-0 flex items-center h-[12vh]">
                <p id = "404" className="text-[5rem] font-[700] text-[#88304E]">404</p>
                <p id = "ERROR_TEXT" className="relative flex h-fit top-[3px] text-[#88304E]">The page you’re looking for doesn’t exist <br/> or has been moved.
                    Please check the URL <br/> or return to the homepage.</p>
            </footer>
        </>
    )
}
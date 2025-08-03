import '../styles/ErrorPage.css';




export function ErrorNotFound(){
    return(
        <>
            <div className = "notFound">

                <h3>You need to rest, study later...</h3>

            </div>


            <footer>
                <p className="fourZeroFour">404</p>
                <p className="errorText">The page you’re looking for doesn’t exist <br/> or has been moved.
                    Please check the URL <br/> or return to the homepage.</p>
            </footer>

        </>

    )
}
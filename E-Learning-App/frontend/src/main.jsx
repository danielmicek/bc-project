import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import './styles/index.css'
import Home from './pages/Home.jsx'
import {CourseInfoPage} from './pages/CourseInfoPage.jsx'
import {Profile} from './pages/Profile.jsx'
import {WhyUs} from './pages/WhyUs.jsx'
import {ErrorNotFound} from "./pages/ErrorNotFound.jsx";
import {ClerkProvider} from "@clerk/clerk-react";
import UserPage from "./pages/UserPage.jsx";
import Test from "./pages/Test.jsx";
import {HeroUIProvider} from "@heroui/react";
import TheNavbar from "./components/TheNavbar.jsx";


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

function showOrHidePopup(ref, openedPopup, setOpenedPopup) {
    openedPopup === true ? ref.current.style.display = "none" : ref.current.style.display = "grid";
    setOpenedPopup((boolean_value) => !boolean_value);
}

const router = createBrowserRouter([
    {
        element: (
            <>
                <TheNavbar/>
                <Outlet />
            </>

        ),
        children: [
            {
                path: '/',
                element: <Home/>,
                errorElement: <ErrorNotFound/>
            },
            {
                path: '/courseInfoPage',
                element: <CourseInfoPage showOrHidePopup={showOrHidePopup}/>,
                errorElement: <ErrorNotFound/>
            },
            {
                path: '/profile',
                element: <Profile/>,
                errorElement: <ErrorNotFound/>
            },
            {
                path: '/whyus',
                element: <WhyUs/>,
                errorElement: <ErrorNotFound/>
            },
            {
                path: '*',
                element: <ErrorNotFound/>,
                errorElement: <ErrorNotFound/>
            },
            {
                path: '/userPage',
                element: <UserPage/>,
                errorElement: <ErrorNotFound/>
            },
            {
                path: '/test',
                element: <Test showOrHidePopup={showOrHidePopup}/>,
                errorElement: <ErrorNotFound/>
            }
        ]
    }
]);


createRoot(document.getElementById('root')).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <StrictMode>
          <HeroUIProvider>
            <RouterProvider  router={router}/>
          </HeroUIProvider>
      </StrictMode>
    </ClerkProvider>
);

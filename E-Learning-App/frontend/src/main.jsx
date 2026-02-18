import {createRoot} from 'react-dom/client'
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import './styles/index.css'
import Home from './pages/Home.jsx'
import {CourseInfoPage} from './pages/CourseInfoPage.jsx'
import {Profile} from './pages/Profile.jsx'
import {ErrorNotFound} from "./pages/ErrorNotFound.jsx";
import {ClerkProvider} from "@clerk/clerk-react";
import UserPage from "./pages/UserPage.jsx";
import Test from "./pages/Test.jsx";
import {HeroUIProvider} from "@heroui/react";
import TheNavbar from "./components/TheNavbar.jsx";
import LearningInfoPage from "./pages/LearningInfoPage.jsx";
import Chapter from "./pages/Chapter.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
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
                element: <CourseInfoPage/>,
                errorElement: <ErrorNotFound/>
            },
            {
                path: '/profile',
                element: <Profile/>,
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
                path: '/learning',
                element: <LearningInfoPage/>,
                errorElement: <ErrorNotFound/>
            },
            {
                path: '/learning/:chapter',
                element: <Chapter/>,
                errorElement: <ErrorNotFound/>
            },

        ]
    },
    {
        element: <Outlet />,
        children: [
            {
                path: "/test",
                element: <Test/>,
            },
        ],
    },

    { path: "*", element: <ErrorNotFound /> }
]);


createRoot(document.getElementById('root')).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <HeroUIProvider>
        <RouterProvider  router={router}/>
      </HeroUIProvider>
    </ClerkProvider>
);

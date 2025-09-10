import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import './styles/index.css'
import Home from './pages/Home.jsx'
import { Course } from './pages/Course.jsx'
import { Profile } from './pages/Profile.jsx'
import { WhyUs } from './pages/WhyUs.jsx'
import { ErrorNotFound } from "./pages/ErrorNotFound.jsx";
import Header from "./components/Header.jsx";
import {ClerkProvider} from "@clerk/clerk-react";


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

const router = createBrowserRouter([
    {
        element: (
            <>
                <Header />
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
                path: '/course',
                element: <Course/>,
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
            }
        ]
    }
]);


createRoot(document.getElementById('root')).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <StrictMode>
        <RouterProvider  router={router}/>
      </StrictMode>
    </ClerkProvider>
);

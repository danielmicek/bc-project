import {createRoot} from 'react-dom/client'
import {useEffect} from "react";
import {createBrowserRouter, Outlet, RouterProvider, useLocation} from 'react-router-dom';
import './styles/index.css'
import Home from './pages/Home.jsx'
import {CourseInfoPage} from './pages/CourseInfoPage.jsx'
import {Profile} from './pages/Profile.jsx'
import ErrorNotFound from "./pages/ErrorNotFound.jsx";
import {ClerkProvider} from "@clerk/clerk-react";
import UserPage from "./pages/UserPage.jsx";
import Test from "./pages/Test.jsx";
import {HeroUIProvider} from "@heroui/react";
import TheNavbar from "./components/TheNavbar.jsx";
import LearningInfoPage from "./pages/LearningInfoPage.jsx";
import Chapter from "./pages/Chapter.jsx";
import CookieConsent from "@/components/cookie-consent.jsx";
import {FooterComponent} from "@/components/FooterComponent.jsx";
import ScrollReveal from "scrollreveal";
import {Toaster} from "react-hot-toast";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

function AppLayout() {
    const location = useLocation();

    useEffect(() => {
        const sr = ScrollReveal();

        sr.reveal("#MAIN_TITLE", {reset: true});
        sr.reveal("#QUOTE", {reset: true});
        sr.reveal("#WHAT_IS_ELEONORE", {reset: true});
        sr.reveal(".BIG_STAT_CARD", {reset: true, interval: 80});
        sr.reveal("#BOTTOM_CONTAINER", {reset: true});

        sr.reveal("#MAIN_CONTAINER_WITH_PROFILE_PIC", {reset: true});
        sr.reveal("#SEND_FR_AND_COPY_PROFILE_LINK_CONTAINER", {reset: true});
        sr.reveal("#STATS_TITLE", {reset: true});

        sr.reveal("#HISTORY_TABLE", {reset: true});
        sr.reveal("#LEADERBOARD", {reset: true});
        sr.reveal("#FRIEND_OR_FR_LIST", {reset: true});
        sr.reveal("#EXPORT_CERT", {reset: true});
        sr.reveal("#PIE_CHART_TITLE", {reset: true});
        sr.reveal("#PIE_CHART", {reset: true});
        sr.reveal("#BAR_CHART_TITLE", {reset: true});
        sr.reveal("#BAR_CHART", {reset: true});
        sr.reveal("#SPARKLINE_CHART_TITLE", {reset: true});
        sr.reveal("#SPARKLINE_CHART", {reset: true});
        sr.reveal(".STAT_CARD", {reset: true});
        sr.reveal("#CARD", {reset: true});

    }, [location.pathname]);

    return (
        <>
            <TheNavbar/>
            <div className="min-h-screen flex flex-col bg-[#050505]">
                <CookieConsent variant="default"/>
                <div className="flex-1"><Outlet/></div>
                <FooterComponent/>
            </div>
        </>
    );
}


const router = createBrowserRouter([
    {
        element: <AppLayout/>,
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
        <Toaster
            position="bottom-center"
            reverseOrder={false}
        />
        <RouterProvider router={router}/>
      </HeroUIProvider>
    </ClerkProvider>
);

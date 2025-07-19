import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/index.css'
import Home from './pages/Home.jsx'
import { Course } from './pages/Course.jsx'
import { Profile } from './pages/Profile.jsx'
import { WhyUs } from './pages/WhyUs.jsx'


const router = createBrowserRouter([
    { path: '/', element: <Home/>, errorElement: <div>Error 404 Not Found kokotko</div>},
    { path: '/course', element: <Course/>, errorElement: <div>Error 404 Not Found kokotko</div>},
    { path: '/profile', element: <Profile/>, errorElement: <div>Error 404 Not Found kokotko</div>},
    { path: '/whyus', element: <WhyUs/>, errorElement: <div>Error 404 Not Found kokotko</div>},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider  router={router}/>
  </StrictMode>,
);

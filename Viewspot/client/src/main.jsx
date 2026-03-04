// main.jsx
import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy loading the components 🚀
import App from './App.jsx';



//Auth Pages
const Forget = lazy(() => import('./pages/Auth/Forget/Forget.jsx'));
const Reset = lazy(() => import('./pages/Auth/Reset/Reset.jsx'));
const Login = lazy(() => import('./pages/Auth/Login/Login.jsx'));
const Register = lazy(() => import('./pages/Auth/Register/Signup.jsx'));


//Auth Actions
import logout from './pages/Auth/logout.js';
import actionLogin from './pages/Auth/Login/actionLogin.js';
import actionRegister from './pages/Auth/Register/actionRegister.js';


//User Pages
const Feedpage = lazy(() => import('./pages/User/Feed/Feedpage.jsx'));
const Profile = lazy(()=> import('./pages/User/Profile/Profile.jsx'));
const Liked = lazy(()=> import('./pages/User/Liked/LikedReels.jsx'));
const DMs = lazy(()=> import('./pages/User/DMs/DMs.jsx'));
const ChatPage = lazy(()=> import('./pages/User/Chatpage/Chatpage.jsx'));
const NotifsPage = lazy(()=> import('./pages/User/Notifications/NotifsPage.jsx'));




//User Actions
import  actionUpload  from './pages/User/UploadPost/actionUpload.js';
import  loaderFeed  from './pages/User/Feed/loaderFeed.js';
import loaderProfile from './pages/User/Profile/loaderProfile.js';
import loaderLiked from './pages/User/Liked/loaderLiked.js';
import loaderDMs  from './pages/User/DMs/loaderDMs.js';
import loaderNotifications  from './pages/User/Notifications/loaderNotifs.js';
import rootLoader from './rootLoader.js';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<LoadingSpinner/>}><App/></Suspense>,
    loader: rootLoader,
    children: [
      {
    path: '/', 
    element: <Suspense fallback={<LoadingSpinner/>}><Feedpage /></Suspense>,
    loader: loaderFeed,
    action: actionUpload
  },
      {
    path: '/user/:id', 
    element: <Suspense fallback={<LoadingSpinner/>}><Feedpage /></Suspense>,
    loader: loaderFeed,
    action: actionUpload
  },
  {
    path: '/profile/:id',
    element: <Suspense fallback={<LoadingSpinner/>}><Profile /></Suspense>,
    loader: loaderProfile,
    action: actionUpload
  }, 
  {
    path: '/user/:id/likes',
    element: <Suspense fallback={<LoadingSpinner/>}><Liked/></Suspense>,
    loader: loaderLiked,
    action: actionUpload
  },
  {
    path: '/DMs',
    element: <Suspense fallback={<LoadingSpinner/>}><DMs/></Suspense>,
    loader: loaderDMs,
  },
  {
    path: '/chat/:receiverId',
    element: <Suspense fallback={<LoadingSpinner/>}><ChatPage/></Suspense>
  },
  {
    path: '/notifications',
    element: <Suspense fallback={<LoadingSpinner/>}><NotifsPage /></Suspense>,
    loader: loaderNotifications,
}
    ]
  },
  
  {
    path: '/auth/login',
    element: <Suspense fallback={<LoadingSpinner/>}><Login /></Suspense>,
    action: actionLogin,
  },
  {
    path: '/auth/register',
    element: <Suspense fallback={<LoadingSpinner/>}><Register /></Suspense>,
    action: actionRegister,
  },
  {
    path: '/auth/logout',
    action: logout,
  },
  {
    path: '/auth/forget-password',
    element: <Suspense fallback={<LoadingSpinner/>}><Forget /></Suspense>,
  },
  {
    path: '/auth/reset-password/:token',
    element: <Suspense fallback={<LoadingSpinner/>}><Reset /></Suspense>,
  },


  //User Pages
  
  
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer
        position="top-right"
      />
        <RouterProvider router={router} />
  </React.StrictMode>
);
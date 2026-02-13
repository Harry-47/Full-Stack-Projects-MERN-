import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/queryClient.js';

import './index.css'

import LoadingSpinner from './components/LoadingSpinner.jsx'
// --- LAZY LOADING AUTH PAGES ---
const Signup = lazy(() => import('./pages/Auth/Register/Signup.jsx'))
const Login = lazy(() => import('./pages/Auth/Login/Login.jsx'))
const Forget = lazy(() => import('./pages/Auth/Forget/Forget.jsx'))
const Reset = lazy(() => import('./pages/Auth/Reset/Reset.jsx'))


// --- LOADING AUTH PAGES ACTIONS ---
import actionRegister from './pages/Auth/Register/actionRegister.js'
import actionLogin from './pages/Auth/Login/actionLogin.js'
import actionForget from './pages/Auth/Forget/actionForget.js'
import actionReset from './pages/Auth/Reset/actionReset.js'


//--- Common pages for both ---//
const TasksPage = lazy(()=> import('./pages/Tasks/TasksPage.jsx'))
const ProfilePage = lazy(()=> import('./pages/Profile/ProfilePage.jsx'))


// --- MANAGER PAGES --- //
const ManagerDashboard = lazy(() => import('./pages/Manager/Dashboard/ManagerDashboard.jsx'))
const AssignTask = lazy(()=> import('./pages/Manager/Tasks/AssignTask/AssignTask.jsx'))
const AllEmployees = lazy(()=> import('./pages/Manager/Employees/AllEmployees.jsx'))
const PendingReviews = lazy(()=> import('./pages/Manager/Tasks/PendingReviews/PendingReviews.jsx'))

// ACTIONS/LOADERS (MANAGERS)---

import loadManagerDashboard from './pages/Manager/Dashboard/utils/loadManagerDashboard.js'
import employeesLoader from './pages/Manager/Employees/utils/employeesLoader.js';


//--- EMPLOYEES --- //
const EmployeeDashboard = lazy(() => import('./pages/Employee/Dashboard/employeeDashboard.jsx'))


//--ACTIONS/LOADER (EMPLOYEES) ---//
import employeeDashboardLoader from './pages/Employee/Dashboard/utils/employeeDashboardLoader.js';
import loaderAssignTask from './pages/Manager/Tasks/AssignTask/utils/loaderAssignTask.js';
import loaderPendingReviews from './pages/Manager/Tasks/PendingReviews/utils/loaderPendingReviews.js';

// --- ROUTER CONFIGURATION ---
const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Signup />
      </Suspense>
    ),
    action: actionRegister
  },

  //AUTH ROUTES
  {
    path: '/auth/login',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    ),
    action: actionLogin
  },
  {
    path: '/auth/register',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Signup />
      </Suspense>
    ),
    action: actionRegister,
  },
  {
     path: '/auth/forget-password',
      element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Forget />
      </Suspense>
    ),
    action: actionForget,
  },
  { 
    path: '/auth/reset-password/:token',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Reset />
      </Suspense>
    ),
    action: actionReset,
  },
 
  //--- Employee Pages ---//
  
  {
    path: '/employee/dashboard',
    element: (
      
      <Suspense fallback={<LoadingSpinner/>} >
      <EmployeeDashboard/>
      </Suspense>
  
    ),
    loader: employeeDashboardLoader
  },
  {
    path: '/employee/profile',
    element: (
      <Suspense fallback={<LoadingSpinner/>}>
        <ProfilePage/>
      </Suspense>
    )
  },
  {
  path: '/employee/tasks',
  element: (
    <Suspense fallback={<LoadingSpinner/>}>
      <TasksPage role="employee" /> 
    </Suspense>
  )
},

  //--- Manager pages --- //
  {
    path: '/manager/dashboard',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ManagerDashboard />
      </Suspense>
    ),
    loader: loadManagerDashboard
    // action: actionTasks, 
 },
 {
  path: '/manager/employees',
  element: (
    <Suspense fallback={<LoadingSpinner />}>
      <AllEmployees />
    </Suspense>
  ),
  loader: employeesLoader
 },
 {
  path: '/manager/dashboard/employees/:id',
  element: (
    <Suspense fallback={<LoadingSpinner />}>
      <EmployeeDashboard />
    </Suspense>
  ),
    loader: employeeDashboardLoader
 },
 {
  path: '/manager/assign-task',
  element : (
    <Suspense fallback={<LoadingSpinner/>}>
       <AssignTask/>
    </Suspense>
  ),
  loader: loaderAssignTask
 },
 {
  path: '/manager/tasks',
  element : (
    <Suspense fallback={<LoadingSpinner/>}>
      <TasksPage role="manager" /> 
    </Suspense>
  )
},
 {
  path: '/manager/reviews',
  element: (
    <Suspense fallback={<LoadingSpinner/>}>
      <PendingReviews/>
    </Suspense>
  ),
  loader: loaderPendingReviews
},
{
    path: '/manager/profile',
    element: (
      <Suspense fallback={<LoadingSpinner/>}>
        <ProfilePage/>
      </Suspense>
    )
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <ToastContainer position="top-right" autoClose={1000} closeButton closeOnClick/>
    <RouterProvider router={routes} />
    </QueryClientProvider>
    
  </StrictMode>
)
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import {Login} from './pages/Login.jsx';
import {Signup} from './pages/Signup.jsx';
import {Dashboard} from './pages/Dashboard.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/signin" replace />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/signin',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '*',
    element: <div>404 - Page Not Found</div>,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
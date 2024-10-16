import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Shift from './components/Shift.jsx';
import Attandance from './components/Attandance.jsx';
import AddShift from './components/AddShift.jsx';
import Request from './components/Request.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },{
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/Shift",
    element: <Shift />,
  },
  {
    path: "/Attandance",
    element: <Attandance />,
  },
  {
    path: "/AddShift",
    element: <AddShift />,
  },
  {
    path: "/Request",
    element: <Request />,
  }
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

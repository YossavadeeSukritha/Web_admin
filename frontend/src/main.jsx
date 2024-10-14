import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './components/Home.jsx';
import Shift from './components/Shift.jsx';
import AddShift from './components/AddShift.jsx';
import Request from './components/Request.jsx';
import Login from './components/Login.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/Home",
    element: <Home />,
  },
  {
    path: "/Shift",
    element: <Shift />,
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

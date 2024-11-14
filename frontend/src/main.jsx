import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ShiftMaster from './components/ShiftMaster.jsx';
import Attendance from './components/Attendance.jsx';
import AddShift from './components/AddShift.jsx';
import Request from './components/Request.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx'
import Employees from './components/Employee.jsx';
import Location from './components/Location.jsx';
import ShiftManagement from './components/ShiftMangement.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },{
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/ShiftMaster",
    element: <ShiftMaster />,
  },
  {
    path: "/Attendance",
    element: <Attendance />,
  },
  {
    path: "/AddShift",
    element: <AddShift />,
  },
  {
    path: "/Request",
    element: <Request />,
  },
  {
    path: "/Employees",
    element: <Employees />,
  },
  {
    path: "/Location",
    element: <Location />,
  },
  {
    path: "/ShiftManagement",
    element: <ShiftManagement />,
  }
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

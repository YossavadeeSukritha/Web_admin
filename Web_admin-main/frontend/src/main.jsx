import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ShiftMaster from './components/ShiftMaster.jsx';
import Attendance from './components/Attendance.jsx';
import AddShift from './components/AddShift.jsx';
import Login from './components/Login.jsx';
import Employees from './components/Employee.jsx';
import Location from './components/Location.jsx';
import ShiftManagement from './components/ShiftMangement.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AddLocation from './components/AddLocaion.jsx';
import Setting from './components/Setting.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, 
  },
  {
    path: "/ShiftMaster",
    element: (
      <PrivateRoute>
        <ShiftMaster />
      </PrivateRoute>
    ),
  },
  {
    path: "/Attendance",
    element: (
      <PrivateRoute>
        <Attendance />
      </PrivateRoute>
    ),
  },
  {
    path: "/AddShift",
    element: (
      <PrivateRoute>
        <AddShift />
      </PrivateRoute>
    ),
  },
  {
    path: "/Employees",
    element: (
      <PrivateRoute>
        <Employees />
      </PrivateRoute>
    ),
  },
  {
    path: "/Location",
    element: (
      <PrivateRoute>
        <Location />
      </PrivateRoute>
    ),
  },
  {
    path: "/ShiftManagement",
    element: (
      <PrivateRoute>
        <ShiftManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "/AddLocation",
    element: (
      <PrivateRoute>
        <AddLocation />
      </PrivateRoute>
    ),
  },
  {
    path: "/Setting",
    element: (
      <PrivateRoute>
        <Setting />
      </PrivateRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

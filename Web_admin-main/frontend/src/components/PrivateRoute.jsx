import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = React.useState(null);

   React.useEffect(() => {
     const validateToken = async () => {
       const token = localStorage.getItem('token');

       if (!token) {
         setIsAuthenticated(false);
         return;
       }

       try {
         const response = await axios.get('http://localhost:5000/api/validate-token', {
           headers: { Authorization: `Bearer ${token}` }
         });

         if (response.data.valid) {
           setIsAuthenticated(true);
         } else {
           localStorage.removeItem('token');
           localStorage.removeItem('user');
           setIsAuthenticated(false);
         }
       } catch (error) {
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         setIsAuthenticated(false);
       }
     };

     validateToken();
   }, []);

   // เพิ่มการ block การเข้าถึงโดยตรง
   if (isAuthenticated === null) {
     return <div>กำลังโหลด...</div>;
   }

   return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
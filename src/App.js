
import { jwtDecode } from 'jwt-decode';

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Home from './components/home'; // Adjust the path if necessary
import Manage from './components/Complaints';
import ManageRequest from './components/manageRequest';
import ReportItem from './components/report';
import Dashboard from './components/dash';
import Auth from './components/log';
import Additem from './components/additem';
import UserComplaint from './components/userComplaint';
import Bulletin from './components/bulletinboard';
import Profile from './components/prof';
// Helper function to check if the user is an admin
const isAdmin = () => {
  const token = localStorage.getItem('token'); // Assuming the JWT token is stored in localStorage
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.email === 'admin@gmail.com'; // Check if the usertype is 'admin'
    } catch (err) {
      console.error('Invalid token:', err);
      return false;
    }
  }
  return false;
};
const isStudent=()=>{
  const token = localStorage.getItem('token'); // Assuming the JWT token is stored in localStorage
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.email !== 'admin@gmail.com'; // Check if the usertype is 'admin'
    } catch (err) {
      console.error('Invalid token:', err);
      return false;
    }
  }
  return false;
}
// AdminRoute component for protected routes
const AdminRoute = ({ children }) => {
  return isAdmin() ? children : <Navigate to="/login" />;
};
const StudentRoute = ({ children }) => {
  return isStudent() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/complaints"
            element={
              <AdminRoute>
                <Manage />
              </AdminRoute>
            }
          />
    
          <Route
            path="/manaRequests"
            element={
              <AdminRoute>
                <ManageRequest />
              </AdminRoute>
            }
          />
   

          <Route
            path="/database"
            element={
              <AdminRoute>
                <ReportItem />
              </AdminRoute>
            }
          />

<Route
            path="/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
    <Route
            path="/additem"
            element={
              <AdminRoute>
                <Additem />
              </AdminRoute>
            }
          />
           <Route
            path="/bulletinboard" 
            element={
              <StudentRoute>
                <Bulletin />
              </StudentRoute>
            }
          />
    
    
      <Route
           path="/userComplaints"
            element={
              <StudentRoute>
                <UserComplaint />
              </StudentRoute>
            }
          />
          <Route path="/login" element={<Auth />} />
          <Route path="/prof" element={<Profile />} />

        </Routes>
        
      </div>
    </Router>
    
  );
}

export default App;

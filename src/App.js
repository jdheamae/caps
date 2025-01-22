
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

// PrivateRoute component for protected routes
const PrivateRoute = ({ children }) => {
  return isAdmin() ? children : <Navigate to="/login" />;
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
              <PrivateRoute>
                <Manage />
              </PrivateRoute>
            }
          />
    
          <Route
            path="/manaRequests"
            element={
              <PrivateRoute>
                <ManageRequest />
              </PrivateRoute>
            }
          />
   

          <Route
            path="/database"
            element={
              <PrivateRoute>
                <ReportItem />
              </PrivateRoute>
            }
          />

<Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
    <Route
            path="/additem"
            element={
              <PrivateRoute>
                <Additem />
              </PrivateRoute>
            }
          />
      <Route path="/bulletinboard"  element={<Bulletin/>  }/>
      <Route path="/userComplaints"  element={<UserComplaint/>  }/>
          
          <Route path="/login" element={<Auth />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;

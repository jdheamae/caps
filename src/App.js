import React from 'react'; // Include useRef if it's being used
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home'; // Adjust the path if necessary
import Manage from './components/Complaints';
import ManageRequest from './components/manageRequest'
import ReportItem from './components/report';
import Dashboard from './components/dash';
import Auth from './components/log';
import Additem from './components/additem';
import Header from './components/header';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/complaints" element={<Manage />} />
          <Route path="manaRequests" element={<ManageRequest />} />
          <Route path="database" element={<ReportItem />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="additem" element={<Additem />} />
          <Route path="/login" element={<Auth />} />
          <Route path="header" element={< Header />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
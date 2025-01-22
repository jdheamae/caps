import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaHome, FaBox, FaQrcode, FaFileAlt, 
  FaUserCheck, FaUser, FaSignOutAlt, FaChartLine, FaBars 
} from "react-icons/fa";
import "../style/sidebar.css"; 

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
         <button className="menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

        <img src="log.png" alt="FIRI" className="logo" />
        <nav className="nav-menu">
          <NavLink to="/" activeClassName="active" onClick={toggleSidebar}>
            <FaHome className="nav-icon" /> Home
          </NavLink>
          <NavLink to="/dashboard" activeClassName="active" onClick={toggleSidebar}>
            <FaChartLine className="nav-icon" /> Dashboard
          </NavLink>
          <NavLink to="/complaints" activeClassName="active" onClick={toggleSidebar}>
            <FaBox className="nav-icon" /> Lost Complaint
          </NavLink>
          <NavLink to="/additem" activeClassName="active" onClick={toggleSidebar}>
            <FaQrcode className="nav-icon" /> Found Items
          </NavLink>
          <NavLink to="/database" activeClassName="active" onClick={toggleSidebar}>
            <FaFileAlt className="nav-icon" /> Database
          </NavLink>
          <NavLink to="/manaRequests" activeClassName="active" onClick={toggleSidebar}>
            <FaUserCheck className="nav-icon" /> Manage Request
          </NavLink>
          <NavLink to="/profile" activeClassName="active" onClick={toggleSidebar}>
            <FaUser className="nav-icon" /> Profile
          </NavLink>
        </nav>
        <div className="logout">
          <NavLink to="/login" activeClassName="active" onClick={toggleSidebar}>
            <FaSignOutAlt className="nav-icon" /> Log Out
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

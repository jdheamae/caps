import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active class
import { FaHome, FaBox, FaQrcode, FaFileAlt, FaUserCheck, FaUser, FaSignOutAlt, FaChartLine } from "react-icons/fa";
import "../style/sidebar.css"; // Optional: for styling the sidebar

const Sidebar = () => {
  return (
    <div className="sidebar">
      <img src="log.png" alt="FIRI" className="logo" />
      <nav className="nav-menu">
        <NavLink to="/" activeClassName="active">
          <FaHome className="nav-icon" /> Home
        </NavLink>
        <NavLink to="/dashboard" activeClassName="active">
          <FaChartLine className="nav-icon" /> Dashboard
        </NavLink>
        <NavLink to="/complaints" activeClassName="active">
          <FaBox className="nav-icon" /> Lost Complaint
        </NavLink>
        <NavLink to="/additem" activeClassName="active">
          <FaQrcode className="nav-icon" /> Lost and Found Items
        </NavLink>
        <NavLink to="/database" activeClassName="active">
          <FaFileAlt className="nav-icon" /> Database
        </NavLink>
        <NavLink to="/manaRequests" activeClassName="active">
          <FaUserCheck className="nav-icon" /> Manage Request
        </NavLink>
        <NavLink to="/" activeClassName="active">
          <FaUser className="nav-icon" /> Profile
        </NavLink>
      </nav>
      <div className="logout">
        <NavLink to="/log" activeClassName="active">
          <FaSignOutAlt className="nav-icon" /> Log Out
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

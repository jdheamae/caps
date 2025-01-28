import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active class
import { jwtDecode } from 'jwt-decode';
import { FaHome, FaBox, FaQrcode, FaFileAlt, FaUserCheck, FaUser, FaSignOutAlt, FaChartLine, FaBars } from "react-icons/fa";
import "../style/sidebar.css"; // Optional: for styling the sidebar

const Sidebar = () => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle("sidebar-open", !isOpen);
  };

  const getUserType = () => {
    const token = localStorage.getItem("token"); // Replace with your token storage method
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.email; // Assuming 'usertype' is in the token
      } catch (err) {
        console.error("Invalid token:", err);
        return null;
      }
    }
    return null;
  };

  const userType = getUserType();
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage


  };
  return (
    <>
      {/* Menu Toggle Button */}
      <button className="menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <img src="log.png" alt="FIRI" className="logo" />
        <nav className="nav-menu">
          {userType !== "admin@gmail.com" && (
            <>
              <NavLink to="/" activeClassName="active">
                <FaHome className="nav-icon" /> Home
              </NavLink>
              <NavLink to="/userComplaints" activeClassName="active">
                <FaBox className="nav-icon" /> File Report
              </NavLink>
              <NavLink to="/bulletinboard" activeClassName="active">
                <FaChartLine className="nav-icon" /> Bulletin
              </NavLink>
              <NavLink to="/prof" activeClassName="active">
                <FaUser className="nav-icon" /> Profile
              </NavLink>
            </>
          )}
          {userType === "admin@gmail.com" && (
            <>
              <NavLink to="/dashboard" activeClassName="active">
                <FaChartLine className="nav-icon" /> Dashboard
              </NavLink>
              <NavLink to="/complaints" activeClassName="active">
                <FaBox className="nav-icon" /> Lost Complaint
              </NavLink>
              <NavLink to="/additem" activeClassName="active">
                <FaQrcode className="nav-icon" /> Found Items
              </NavLink>
              <NavLink to="/database" activeClassName="active">
                <FaFileAlt className="nav-icon" /> Database
              </NavLink>
              <NavLink to="/manaRequests" activeClassName="active">
                <FaUserCheck className="nav-icon" /> Manage Request
              </NavLink>
            </>
          )}
          <div className="logout">
            <NavLink to="/login" activeClassName="active">
              <FaSignOutAlt className="nav-icon" /> Log Out
              <button onClick={handleLogout}></button>
            </NavLink>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBullhorn, FaQrcode, FaFileAlt, FaUserCheck, FaSearch, FaFilter, FaUser, FaSignOutAlt  } from 'react-icons/fa';
import '../style/mana.css';

function Manage() {
  return (
    <div className="home-container">
      <div className="sidebar">
        <img src="log.png" alt="FIRI" className="logo" />
        <nav className='nav-menu'> 
          <Link to="/">
            <FaHome className="nav-icon" /> Home
          </Link>
          <Link to="/mana">
            <FaBullhorn className="nav-icon" /> Manage Bulletin
          </Link>
          <Link to="/">
            <FaQrcode className="nav-icon" /> Scan Item
          </Link>
          <Link to="/report">
            <FaFileAlt className="nav-icon" /> Report Lost Item
          </Link>
          <Link to="/manaReq">
            <FaUserCheck className="nav-icon" /> Manage Request
          </Link>
          <Link to="/">
            <FaUser className="nav-icon" /> Profile
          </Link>

        </nav>
        <div className='logout'>
            <Link to="/logout">
              <FaSignOutAlt  className="nav-icon" /> Log Out
            </Link>
          </div>
      </div>

      <header className="header">
          <h2>FIRI</h2>
        </header>
        
      
      <div className="content">

        <div className="manage-bulletin">
          <div className="breadcrumb">Manage Bulletin {'>'} Found Items</div>
                      {/* Buttons at the top-right */}
                      <div className="top-right-buttons">
                <button className="add-item-btn">+ Add Found Item</button>
                <button className="register-qr-btn">Register QR Code</button>
            </div>

          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <FaSearch className="search-icon" />
            <FaFilter className="filter-icon" />
          </div>

                    
          <table className="found-items-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Item Type</th>
                <th>Date Found</th>
                <th>Location</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { itemname: 'Redmi 10 C Redmi 10', type: 'Electronics', date: '2021-0424', location: 'Gym', time: '9:00 am' },
                { itemname: 'Laptop', type: 'Electronics', date: '2021-0423', location: 'Gym', time: '9:00 am' },
                { itemname: 'Laptop', type: 'Electronics', date: '2021-0423', location: 'Gym', time: '9:00 am' },
                { itemname: 'Laptop', type: 'Electronics', date: '2021-0423', location: 'Gym', time: '9:00 am' },
                { itemname: 'Laptop', type: 'Electronics', date: '2021-0423', location: 'Gym', time: '9:00 am' },
                { itemname: 'Redmi 10 C Redmi 10', type: 'Electronics', date: '2021-0424', location: 'Gym', time: '9:00 am' },
                { itemname: 'Redmi 10 C Redmi 10', type: 'Electronics', date: '2021-0424', location: 'Gym', time: '9:00 am' },
                { itemname: 'Redmi 10 C Redmi 10', type: 'Electronics', date: '2021-0424', location: 'Gym', time: '9:00 am' },
                { itemname: 'Redmi 10 C Redmi 10', type: 'Electronics', date: '2021-0424', location: 'Gym', time: '9:00 am' },
                { itemname: 'Redmi 10 C Redmi 10', type: 'Electronics', date: '2021-0424', location: 'Gym', time: '9:00 am' },
                // Add more items as needed
              ].map((item, index) => (
                <tr key={index}>
                  <td>{item.itemname}</td>
                  <td>{item.type}</td>
                  <td>{item.date}</td>
                  <td>{item.location}</td>
                  <td>{item.time}</td>
                  <td>
                    <button className="update-btn">Update</button>
                    <button className="delete-btn">Delete</button>
                    <button className="show-btn">Show</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div className="pagination">
          <button className="page-nav">&lt;</button>
          <button className="page-nav">&gt;</button>
        </div>
      </div>
    </div>
  );
}

export default Manage;

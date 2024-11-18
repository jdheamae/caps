import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBullhorn, FaQrcode, FaFileAlt, FaUserCheck, FaSearch, FaFilter, FaUser,FaSignOutAlt  } from 'react-icons/fa';
import '../style/manaReq.css';


function ReportItem() {
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
          <div className="breadcrumb">Bulletin {'>'} Report Lost Items</div>
                      {/* Buttons at the top-right */}

          <div className="reqsearch-bar">
            <input type="text" placeholder="Search" />
            <FaSearch className="search-icon" />
            <FaFilter className="filter-icon" />
          </div>

                    
          <table className="found-items-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID Number</th>
                <th>College</th>
                <th>Gmail Account</th>
                <th>Contact Number</th>
                <th>Date Request</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Paul Gary Oca', type: 'Electronics', date: '2021-0424', location: 'Gym', time: '9:00 am' },
                { name: 'Jean Dhea', type: 'Electronics', date: '2021-0423', location: 'Gym', time: '9:00 am' },
                { name: 'Christian Albert', type: 'Electronics', date: '2021-0423', location: 'Gym', time: '9:00 am' },
                { name: 'Laptop', type: 'Electronics', date: '2021-0423', location: 'Gym', time: '9:00 am' },
                { name: 'Laptop', type: 'Electronics', date: '2021-0423', location: 'Gym', time: '9:00 am' },
                { name: 'Redmi 10 C Redmi 10', type: 'Electronics', date: '2021-0424', location: 'Gym', time: '9:00 am' },
        
                // Add more items as needed
              ].map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.id}</td>
                  <td>{item.college}</td>
                  <td>{item.gaccount}</td>
                  <td>{item.number}</td>
                  <td>{item.request}</td>
                  <td>{item.statues}</td>



                  <td>
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

export default ReportItem;
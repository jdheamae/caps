import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBullhorn, FaQrcode, FaFileAlt, FaUserCheck } from 'react-icons/fa'; // Import icons
import './managebulletin.css'; // Import custom CSS for styling

function ManageBulletin() {
  return (
    <div className="home-container">
      <div className="sidebar">
        <img src="log.png" alt="FIRI" className="logo" />
        <nav className='nav-menu'> 
          <Link to="/">
            <FaHome className="nav-icon" /> Home
          </Link>
          <Link to="/managebulletin">
            <FaBullhorn className="nav-icon" /> Manage Bulletin
          </Link>
          <Link to="/mana">
            <FaQrcode className="nav-icon" /> Scan Item
          </Link>
          <Link to="/">
            <FaFileAlt className="nav-icon" /> Report Lost Item
          </Link>
          <Link to="/">
            <FaUserCheck className="nav-icon" /> Manage Request
          </Link>
        </nav>
      </div>
      
      {/* Fixed Header */}
      <header className="header">
        <h2>FIRI</h2>
      </header>
      
      <div className="manage-bulletin">
        {/* Items Table */}
        <table className="items-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Item Type</th>
              <th>Date Found</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Redmi 10 C</td>
              <td>Electronics</td>
              <td>2021-04-24</td>
              <td>9:00 AM</td>
              <td>
                <button className="action update">UPDATE</button>
                <button className="action delete">DELETE</button>
                <button className="action show">SHOW</button>
              </td>
            </tr>
            <tr>
              <td>Samsung Galaxy S20</td>
              <td>Electronics</td>
              <td>2021-05-10</td>
              <td>3:30 PM</td>
              <td>
                <button className="action update">UPDATE</button>
                <button className="action delete">DELETE</button>
                <button className="action show">SHOW</button>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>

        {/* Pagination (if needed) */}
        <div className="pagination">
          <button className="page-nav">&lt;</button>
          <button className="page-number">1</button>
          <button className="page-number">2</button>
          <button className="page-number">3</button>
          <button className="page-nav">&gt;</button>
        </div>
      </div>
    </div>
  );
}

export default ManageBulletin;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBullhorn, FaQrcode, FaFileAlt, FaUserCheck, FaSearch, FaFilter, FaUser, FaSignOutAlt } from 'react-icons/fa';
import '../style/mana.css';
import Sidebar from "./sidebar";

function Manage() {
  const [filterText, setFilterText] = useState(''); // State for filtering item names
  const [requests, setRequests] = useState([ // Sample data for requests
    { finder: 'Juan Dela Cruz', itemname: 'Wallet', type: 'Personal', confind:'Jean Dhea Mae Ampong', date: '2024-12-01', location: 'Library', time: '10:00 AM', owner: ' Hubert Blaine Wolfeschlege', status: 'Unclaimed' },
    { finder: 'Juan Dela Cruz', itemname: 'Wallet', type: 'Personal', confind:'Jean Dhea Mae Ampong', date: '2024-12-01', location: 'Library', time: '10:00 AM', owner: 'Maria Dela Cruz ', status: 'Unclaimed' },
    { itemname: 'Keys', type: 'Personal', date: '2024-12-03', location: 'Cafeteria', time: '2:30 PM' },
    { itemname: 'Backpack', type: 'Personal', date: '2024-12-05', location: 'Gym', time: '5:00 PM' },
    { finder: 'Juan Dela Cruz', itemname: 'Wallet', type: 'Personal', confind:'Jean Dhea Mae Ampong', date: '2024-12-01', location: 'Library', time: '10:00 AM', owner: ' Hubert Blaine Wolfeschlege', status: 'Unclaimed' },
    { finder: 'Juan Dela Cruz', itemname: 'Wallet', type: 'Personal', confind:'Jean Dhea Mae Ampong', date: '2024-12-01', location: 'Library', time: '10:00 AM', owner: 'Maria Dela Cruz ', status: 'Unclaimed' },
    { itemname: 'Keys', type: 'Personal', date: '2024-12-03', location: 'Cafeteria', time: '2:30 PM' },
    { itemname: 'Backpack', type: 'Personal', date: '2024-12-05', location: 'Gym', time: '5:00 PM' },
    { finder: 'Juan Dela Cruz', itemname: 'Wallet', type: 'Personal', confind:'Jean Dhea Mae Ampong', date: '2024-12-01', location: 'Library', time: '10:00 AM', owner: ' Hubert Blaine Wolfeschlege', status: 'Unclaimed' },
    { finder: 'Juan Dela Cruz', itemname: 'Wallet', type: 'Personal', confind:'Jean Dhea Mae Ampong', date: '2024-12-01', location: 'Library', time: '10:00 AM', owner: 'Maria Dela Cruz ', status: 'Unclaimed' },
    { itemname: 'Keys', type: 'Personal', date: '2024-12-03', location: 'Cafeteria', time: '2:30 PM' },
    { itemname: 'Backpack', type: 'Personal', date: '2024-12-05', location: 'Gym', time: '5:00 PM' },
  ]);

  // Filtered requests based on the filterText
  const filteredRequests = requests.filter((item) =>
    item.itemname.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="home-container">
      <Sidebar />

      <header className="header">
        <h2>FIRI LOGO</h2>
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
            <input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)} // Update filterText state
            />
            <FaSearch className="search-icon" />
            <FaFilter className="filter-icon" />
          </div>

          {filteredRequests.length > 0 ? (
            <table className="ffound-items-table">
              <thead>
                <tr>
                  <th>Finder</th>
                  <th>Item Name</th>
                  <th>Item Type</th>
                  <th>Contact of the Finder</th>
                  <th>Date Found</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Owner Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((item, index) => (
                  <tr key={index}>
                    <td>{item.finder}</td>
                    <td>{item.itemname}</td>
                    <td>{item.type}</td>
                    <td>{item.confind}</td>
                    <td>{item.date}</td>
                    <td>{item.location}</td>
                    <td>{item.time}</td>
                    <td>{item.owner}</td>
                    <td>{item.status  }</td>
                    <td>
                      <button className="view-btn">View More</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">No matching requests found</div>
          )}
        </div>

        <div className="ppagination">
          <button className="page-nav">&lt; Previous</button>
          <button className="page-nav">Next &gt;</button>
        </div>
      </div>
    </div>
  );
}

export default Manage;

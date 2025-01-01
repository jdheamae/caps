import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBullhorn, FaQrcode, FaFileAlt, FaUserCheck, FaSearch, FaFilter, FaUser, FaSignOutAlt } from 'react-icons/fa';
import '../style/manaReq.css';
import Sidebar from "./sidebar";
import '../style/report.css';

function ManageRequest() {
  const [filterText, setFilterText] = useState(''); // State for filtering item names

  const requests = [
    { name: 'Paul Gary Oca', id: '123', college: 'Engineering', gaccount: 'paul@gmail.com', number: '09123456789', request: '2021-04-24', statues: 'Pending' },
    { name: 'Jean Dhea', id: '456', college: 'Science', gaccount: 'jean@gmail.com', number: '09234567890', request: '2021-04-23', statues: 'Approved' },
    { name: 'Christian Albert', id: '789', college: 'Arts', gaccount: 'christian@gmail.com', number: '09345678901', request: '2021-04-23', statues: 'Rejected' },
    { name: 'Laptop', id: '321', college: 'Business', gaccount: 'laptop@gmail.com', number: '09456789012', request: '2021-04-23', statues: 'Pending' },
    { name: 'Redmi 10 C Redmi 10', id: '654', college: 'IT', gaccount: 'redmi@gmail.com', number: '09567890123', request: '2021-04-24', statues: 'Approved' },
  ];

  // Filtered list based on the search input
  const filteredRequests = requests.filter((request) =>
    request.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="home-container">
      <Sidebar />

      <header className="header">
      <h2>FIRI LOGO</h2>
      </header>

      <div className="content">
        <div className="manage-bulletin">
          <div className="breadcrumb">Bulletin {'>'} Request Items</div>
          {/* Filter input */}
          <div className="manareqsearch-bar">
            <input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <FaSearch className="ssearch-icon" />
            <FaFilter className="ffilter-icon" />
            
          </div>

          {/* Table displaying filtered results */}
          {filteredRequests.length > 0 ? (
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
                {filteredRequests.map((item, index) => (
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
          ) : (
            <div className="no-data">No matching requests found</div>
          )}
        </div>
        <div className="pagination">
          <button className="page-nav">&lt; Previous</button>
          <button className="page-nav"> Next &gt;</button>
        </div>
      </div>
    </div>
  );
}

export default ManageRequest;

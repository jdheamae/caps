import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios'; // Import axios
import Sidebar from "./sidebar";
import '../style/manaReq.css';
import Header from "./header";


function ManageRequest() {
  const [filterText, setFilterText] = useState('');
  const [requests, setRequests] = useState([]); // State to store requests
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch requests when the component mounts
  useEffect(() => {
    fetchRequests();
  }, []);

  // Function to fetch requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://10.10.83.224:5000/retrieval-requests'); // Replace with your backend URL
      setRequests(response.data.requests); // Extract requests from API response
      setLoading(false);
    } catch (error) {
      console.error('Error fetching retrieval requests:', error);
      setLoading(false);
    }
  };

  // Filtered list based on the search input
  const filteredRequests = requests.filter((request) =>
    request.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="home-container">
      <Sidebar />
      <Header />
      <header className="header">
        <h2>FIRI LOGO</h2>
      </header>

      <div className="content">
        <div className="manage-bulletin">
          <div className="breadcrumb">Manage Lost and Found {'>'} Manage Request</div>

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
          {loading ? (
            <div className="loading">Loading...</div>
          ) : filteredRequests.length > 0 ? (
            <table className="found-items-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Contact Number</th>
                  <th>ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request, index) => (
                  <tr key={index}>
                    <td>{request.name}</td>
                    <td>{request.description}</td>
                    <td>{request.contactNumber}</td>
                    <td>{request.id}</td>
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
          <button className="page-nav">Next &gt;</button>
        </div>
      </div>
    </div>
  );
}

export default ManageRequest;

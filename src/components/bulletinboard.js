import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBullhorn, FaQrcode, FaFileAlt, FaUserCheck, FaSearch, FaFilter, FaUser, FaSignOutAlt } from 'react-icons/fa';
import '../style/managebulletin.css';
import '../style/reportmanage.css';
import Sidebar from "./sidebar";
import axios from 'axios';

function Bulletin() {
  const [filterText, setFilterText] = useState('');
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [itemData, setItemData] = useState({
    ITEM: '',
    DESCRIPTION: '',
    DATE_FOUND: '',
    TIME_RETURNED: '',
    FINDER: '',
    CONTACT_OF_THE_FINDER: '',
    FOUND_LOCATION: '',
    OWNER: '',
    DATE_CLAIMED: '',
    STATUS: 'unclaimed',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://10.10.83.224:5000/items');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Filtered requests based on the filterText
  const filteredRequests = requests.filter((item) => {
    return item.ITEM && item.ITEM.toLowerCase().includes(filterText.toLowerCase());
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const displayedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="home-container">
      <Sidebar />
      <header className="header">
        <h2>FIRI LOGO</h2>
      </header>
      <div className="content">
        <div className="manage-bulletin">
          <div className="breadcrumb">Manage Lost and Found {'>'} Manage Found Items</div>
          <div className="top-right-buttons">
           
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <FaSearch className="search-icon" />
            <FaFilter className="filter-icon" />
          </div>
          {displayedRequests.length > 0 ? (
            <table className="found-items-table">
              <thead>
                <tr>
             
                  <th>Item Name</th>
        
                  <th>Date Found</th>
                  <th>Location</th>
             
                 <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedRequests.map((item) => (
                  <tr key={item._id}>
            
                    <td>{item.ITEM}</td>
                
                    <td>{item.DATE_FOUND}</td>
                    <td>{item.FOUND_LOCATION}</td>
                    <button className="view-btn" >View More</button>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">No matching requests found</div>
          )}
          <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className="page-nav"
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
  );
}

export default Bulletin;

import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Sidebar from './sidebar';
import '../style/retrievalRequest.css';
import { FaPlus } from "react-icons/fa6";
import Pagination from './pagination';
import Header from './header';

function UserRetrievalRequests() {
  const [requests, setRequests] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const role = decodedToken.usertype; // Assuming role is stored in the token
        setUserRole(role);

        const url = role === 'admin' 
          ? `http://10.10.83.224:5000/retrieval-requests` 
          : `http://10.10.83.224:5000/retrieval-requests/${userId}`;

        const response = await fetch(url);
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((request) =>
    request.item_name.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedRequests = filteredRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const displayedRequests = sortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="home-container">
      <Sidebar />
      <Header />
      <div className="content">
        <div className="manage-bulletin6">
          <div className="breadcrumb6">{userRole === 'admin' ? 'All Retrieval Requests' : 'Your Retrieval Requests'}</div>
          <div className="search-bar6">
            <input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="search-input6"
            />
          </div>
          <div className="grid-container6">
            {displayedRequests.map((request) => (
              <div className="grid-item6" key={request._id}>
                <h2>{request.item_name}</h2>
              
                <p><span>Description: </span> {request.description}</p>
                <p><span>Specific Location: </span> {request.specific_location}</p>
                <p><span>General Location: </span> {request.general_location}</p>
                <p><span>Date Lost: </span> {request.date_Lost}</p>
                <p><span>Status: </span> {request.status}</p>
             
              </div>
            ))}
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default UserRetrievalRequests;

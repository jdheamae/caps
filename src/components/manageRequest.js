import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import Sidebar from './sidebar';
import Header from './header';
import '../style/manageRequest.css';
import { FaTable } from "react-icons/fa6";
import { IoGridOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import Pagination from './pagination';

function ManageRequest() {
  const [filterText, setFilterText] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://10.10.83.224:5000/retrieval-requests');
      setRequests(response.data.requests);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching retrieval requests:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (type, id, updatedStatus) => {
    let endpoint = '';

    if (type === 'request') {
      endpoint = `http://10.10.83.224:5000/retrieval-request/${id}/status`;
    } else if (type === 'item') {
      if (!id) {
        console.error("Error: Item ID is undefined.");
        return;
      }
      endpoint = `http://10.10.83.224:5000/found-item/${id}/status`;
    }

    try {
      const response = await axios.put(endpoint, { status: updatedStatus });
      console.log(`Updated ${type}:`, response.data);
      fetchRequests(); // Refresh UI after update
    } catch (error) {
      console.error(`Error updating ${type} status:`, error);
    }
  };


  const handleStatusUpdate2 = async (type, id, updatedStatus) => {
    let endpoint = '';
    if (type === 'item') {
      endpoint = `http://10.10.83.224:5000/found-item/${id}/status`;
    }

    try {
      await axios.put(endpoint, { status: updatedStatus });
      fetchRequests(); // Refresh data after update
    } catch (error) {
      console.error(`Error updating ${type} status:`, error);
    }
  };

  const filteredRequests = requests.filter((request) =>
    request.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const displayedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [viewMode, setViewMode] = useState('table'); // Default to 'table' mode
  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'table' ? 'grid' : 'table'));
  };


  return (
    <div className="home-container">
      <Sidebar />
    <Header /> 
      <div className="content">
        <div className="manage-bulletin5">
          <div className="breadcrumb5">Manage Lost and Found {'>'} Manage Request</div>


          <div className="search-bar5">
            <input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <button onClick={toggleViewMode} className="view-mode-toggle5">
              {viewMode === 'table' ? <IoGridOutline /> : <FaTable />}
            </button>
          </div>

          {viewMode === 'table' ? (
            <table className="ffound-items-table5">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Contact Number</th>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Date Requested</th>
                  <th>Item Status</th>
                  <th>Action</th>

                </tr>
              </thead>
              <tbody>
                {displayedRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.name}</td>
                    <td>{request.description}</td>
                    <td>{request.contactNumber}</td>
                    <td>{request.id}</td>
                    <td>{request.status}</td>
                    <td>{request.createdAt}</td>
                    <td>{request.itemId?.STATUS}</td>
                    <td>
                      <button
                        className="view-btn5"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <FaPlus />Show
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid-container5">
              {displayedRequests.map((request) => (
                <div className="grid-item5" key={request._id}>
                  <h2>{request.name}</h2>
                  <p><span>Description: </span> {request.description}</p>
                  <p><span>Contact Number: </span> {request.contactNumber}</p>
                  <p><span>ID: </span> {request.id}</p>
                  <p><span>Status: </span> {request.status}</p>
                  <p><span>Date Requested: </span> {request.createdAt}</p>
                  <p><span>Item Status: </span> {request.itemId?.STATUS}</p>

                  <button className="view-btn5" onClick={() => setSelectedRequest(request)}>
                    <FaPlus /> Show
                  </button>
                </div>
              ))}
            </div>



          )}
        </div>


        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>



      {selectedRequest && (
        <div className="modal-overlay1">
          <div className="modal5">
            <h2>Request Details</h2>
            <p><strong>Name:</strong> {selectedRequest.name}</p>
            <p><strong>Description:</strong> {selectedRequest.description}</p>
            <p><strong>Contact Number:</strong> {selectedRequest.contactNumber}</p>
            <p><strong>Date Requested:</strong> {selectedRequest.createdAt}</p>
            <p><strong>Item Status:</strong>{selectedRequest.itemId?.STATUS}</p>
            <p><strong>Request Status:</strong></p>
            <select
              value={selectedRequest.status}
              onChange={(e) => handleStatusUpdate('request', selectedRequest.id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
            </select>

            <p><strong>Found Item Details:</strong></p>
            <li><strong>Item Name:</strong> {selectedRequest.itemId?.ITEM || 'N/A'}</li>
            <li><strong>Description:</strong> {selectedRequest.itemId?.DESCRIPTION || 'N/A'}</li>
            <li><strong>Date Found:</strong> {selectedRequest.itemId?.DATE_FOUND || 'N/A'}</li>

            <p><strong>Item Status:</strong>{selectedRequest.itemId?.STATUS}</p>
            <select
              value={selectedRequest.itemId?.STATUS || 'N/A'}
              onChange={(e) => handleStatusUpdate('item', selectedRequest.itemId?._id, e.target.value)}
            >
              <option value="unclaimed">Unclaimed</option>
              <option value="claimed">Claimed</option>
            </select>

            <div className="button-container5">
              <button onClick={() => setSelectedRequest(null)} className="close-btn-manager5">Close</button>
              </div>
              </div>
            </div>
        )}
          </div>

          );
}

          export default ManageRequest;

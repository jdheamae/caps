import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Sidebar from './sidebar';
import '../style/retrievalRequest.css';
import { FaPlus } from "react-icons/fa6";
import Pagination from './pagination';

function UserRetrievalRequests() {
  const [requests, setRequests] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [editContactNumber, setEditContactNumber] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await fetch(`http://10.10.83.224:5000/retrieval-requests/${userId}`);
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  

  // Open edit modal with selected request data
  const openEditModal = (request) => {
    setSelectedRequest(request);
    setEditDescription(request.description);
    setEditContactNumber(request.contactNumber);
    setShowEditModal(true);
  };

  // Update request
  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!selectedRequest) return;

    try {
      const response = await fetch(`http://10.10.83.224:5000/retrieval-requests/${selectedRequest._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: editDescription, contactNumber: editContactNumber })
      });

      if (response.ok) {
        setRequests(requests.map(req => req._id === selectedRequest._id 
          ? { ...req, description: editDescription, contactNumber: editContactNumber } 
          : req
        ));
        alert('Request updated successfully!'); // Show success alert
        setShowEditModal(false); // Close the edit modal
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (request) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  };

  // Delete request
  const handleDelete = async () => {
    if (!selectedRequest) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this request?');
    if (!confirmDelete) return; // If user cancels, do nothing

    try {
      const response = await fetch(`http://10.10.83.224:5000/retrieval-requests/${selectedRequest._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setRequests(requests.filter(req => req._id !== selectedRequest._id));
        alert('Request deleted successfully!'); // Show success alert
        setShowDeleteModal(false); // Close the delete modal
      }
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const filteredRequests = requests.filter((request) =>
    request.name.toLowerCase().includes(filterText.toLowerCase())
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
      <header className="header">
        <h2>FIRI LOGO</h2>
      </header>
      <div className="content">
        <div className="manage-bulletin6">
          <div className="breadcrumb6">Manage Retrieval Requests</div>

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
                <h2>{request.name}</h2>
                <p><span>Date Requested: </span> {request.createdAt}</p>
                <p><span>Description: </span> {request.description}</p>
                <p><span>Contact Number: </span> {request.contactNumber}</p>
                <p><span>Status: </span> {request.status}</p>
                <p><span>Item Name: </span> {request.itemId?.DESCRIPTION || 'N/A'}</p>

                <button className="view-btn6" onClick={() => openEditModal(request)}>
                  <FaPlus /> Edit
                </button>
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

      {showEditModal && (
        <div className="modal-overlay6">
          <div className="modal6">
            <h2>Edit Request</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group6">
                <label htmlFor="description">Description:</label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  maxLength="500"
                  placeholder="description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group6">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  maxLength="50"
                  placeholder="Contact Number"
                  value={editContactNumber}
                  onChange={(e) => setEditContactNumber(e.target.value)}
                  required
                />
              </div>

              <div className="button-container6">
                <button type="submit" className="submit-btn6">
                  Submit
                </button>

                <button
                  type="button"
                  className="delete-btn6"
                  onClick={() => {
                    handleDelete();
                    setShowEditModal(false); // Close the modal after deletion
                }}
                >
                  Delete
                </button>

                <button
                  type="button"
                  className="cancel-btn6"
                  onClick={() => {
                    setShowEditModal(false); // Close the edit modal
                   
                    
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserRetrievalRequests;
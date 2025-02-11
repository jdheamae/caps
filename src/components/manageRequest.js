import React, { useState, useEffect } from 'react';
import { FaSearch, FaTable } from 'react-icons/fa';
import { IoGridOutline } from 'react-icons/io5';
import axios from 'axios';
import Sidebar from './sidebar';
import Header from './header';
import Pagination from './pagination';
import '../style/manageRequest.css';

function ManageRequest() {
  const [filterText, setFilterText] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [viewMode, setViewMode] = useState('table');
  const [itemDetails, setItemDetails] = useState(null); // State to hold item details

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://10.10.83.224:5000/retrieval-requests');
      console.log("API Response Data:", response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        setRequests(response.data);
      } else {
        console.error("Invalid API response:", response.data);
        setRequests([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching retrieval requests:', error);
      setLoading(false);
    }
  };

  const fetchItemDetails = async (itemId) => {
    try {
      console.log("Fetching item details for ID:", itemId);  // Debugging log
      const response = await axios.get(`http://10.10.83.224:5000/items/${itemId}`);
      console.log("Fetched Item Details:", response.data);  // See what API returns
      setItemDetails(response.data || {}); // Set data if available
    } catch (error) {
      console.error("Error fetching item details:", error.response?.data || error.message);
      setItemDetails({}); // Ensure UI does not crash
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
      await axios.put(endpoint, { status: updatedStatus });
      fetchRequests(); // Refresh UI after update
    } catch (error) {
      console.error(`Error updating ${type} status:`, error);
    }
  };

  const handleRequestSelect = async (request) => {
    setSelectedRequest(request);
  
    if (request.itemId) {
      console.log("Fetching details for itemId:", request.itemId); // Debugging: check if itemId is correct
      await fetchItemDetails(request.itemId);  // Fetch item details before showing modal
    }
  };
  
  

  const filteredRequests = requests.filter((request) =>
    request.item_name?.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const displayedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleViewMode = () => setViewMode(viewMode === 'table' ? 'grid' : 'table');

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

          {loading ? (
            <p>Loading requests...</p>
          ) : displayedRequests.length === 0 ? (
            <p>No matching requests found.</p>
          ) : viewMode === 'table' ? (
            <div className="ttable-container">
            <table className="ffound-items-table5">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Description</th>
                  <th>General Location</th>
                  <th>Specific Location</th>
                  <th>Date Lost</th>
                  <th>Time Lost</th>
                  <th>Item Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.item_name || "N/A"}</td>
                    <td>{request.description || "N/A"}</td>
                    <td>{request.general_location || "N/A"}</td>
                    <td>{request.specific_location || "N/A"}</td>
                    <td>{request.date_Lost || "N/A"}</td>
                    <td>{request.time_Lost || "N/A"}</td>
                    <td>{request.status || "N/A"}</td>
                    <td>
                      <button className="view-btn5" onClick={() => handleRequestSelect(request)}>
                        Show
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          

          ) : (
            <div className="grid-container5">
              {displayedRequests.map((request) => (
                <div className="grid-item5" key={request._id}>
                  <h2>{request.item_name}</h2>
                  <p><strong>Description:</strong> {request.description}</p>
                  <p><strong>General Location:</strong> {request.general_location}</p>
                  <p><strong>Specific Location:</strong> {request.specific_location}</p>
                  <p><strong>Date Lost:</strong> {request.date_Lost}</p>
                  <p><strong>Time Lost:</strong> {request.time_Lost}</p>
                  <p><strong>Status:</strong> {request.status}</p>

                  <button className="view-btn5" onClick={() => handleRequestSelect(request)}>
                    Show
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
      </div>

      {selectedRequest && (
        <div className="modal-overlay1">
          <div className="modal5">
            <h2>Request Details</h2>
            <p><strong>Item Name:</strong> {selectedRequest.item_name || "N/A"}</p>
            <p><strong>Description:</strong> {selectedRequest.description || "N/A"}</p>
            <p><strong>General Location:</strong> {selectedRequest.general_location || "N/A"}</p>
            <p><strong>Specific Location:</strong> {selectedRequest.specific_location || "N/A"}</p>
            <p><strong>Status:</strong> {selectedRequest.status || "N/A"}</p>
            {itemDetails && (
                <>
                  <h2>gayvad Details</h2>
                  <p><strong>Item Type:</strong> {itemDetails.ITEM_TYPE || "N/A"}</p>
                  <p><strong>Item Description:</strong> {itemDetails.DESCRIPTION || "N/A"}</p>
                  <p><strong>Contact of the Finder:</strong> {itemDetails.CONTACT_OF_THE_FINDER || "N/A"}</p>
                  <p><strong>Date Found:</strong> {itemDetails.DATE_FOUND || "N/A"}</p>
                  <p><strong>General Location:</strong> {itemDetails.GENERAL_LOCATION || "N/A"}</p>
                  <p><strong>Found Location:</strong> {itemDetails.FOUND_LOCATION || "N/A"}</p>
                </>
              )}


            <select value={selectedRequest.status} onChange={(e) => handleStatusUpdate('request', selectedRequest._id, e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
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
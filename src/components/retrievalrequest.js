import React, { useState, useEffect } from 'react';
import { FaSearch, FaTable } from 'react-icons/fa';
import { storage, db, uploadBytesResumable, getDownloadURL, ref, doc, updateDoc } from "../firebase";

import { IoGridOutline } from 'react-icons/io5';
import axios from 'axios';
import Sidebar from './sidebar';
import Header from './header';
import { jwtDecode } from 'jwt-decode';
import Pagination from './pagination';
import '../style/manageRequest.css';

function UserRetrievalRequests() {
  const [filterText, setFilterText] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
   const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
    const [itemDetails, setItemDetails] = useState(null); // State to hold item details
  const [modalType, setModalType] = useState(null); // 'show', 'update', or 'delete'
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    general_location: '',
    specific_location: '',
    date_Lost: '',
    time_Lost: '',
    owner_image:'',
    status: '',
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
           const decodedToken = jwtDecode(token);
           console.log("Decoded Token:", decodedToken); // Check if 'college' exists
           const userId = decodedToken.id;
        if (!userId) {
            console.error("No user ID found.");
            return;
        }

        const response = await axios.get(`http://10.10.83.224:5000/user-retrieval-requests?userId=${userId}`);
        setRequests(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching retrieval requests:', error);
        setLoading(false);
    }
};


 
  const fetchItemDetails = async (itemId) => {
    try {
      const response = await axios.get(`http://10.10.83.224:5000/items/${itemId}`);
      setItemDetails(response.data);
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;
    try {
      await axios.put(`http://10.10.83.224:5000/retrieval-requests/${selectedRequest._id}`, formData);
      fetchRequests();
      //add js notification
      closeModal();
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleDeleteRequest = async () => {
    if (!selectedRequest) return;
    try {
      await axios.delete(`http://10.10.83.224:5000/retrieval-requests/${selectedRequest._id}`);
      fetchRequests();
      //add js notification
      closeModal();
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const openModal = (type, request) => {
    setModalType(type);
    setSelectedRequest(request);
    if (type === 'update') {
      setFormData({
        item_name: request.item_name || '',
        description: request.description || '',
        general_location: request.general_location || '',
        specific_location: request.specific_location || '',
        date_Lost: request.date_Lost || '',
        time_Lost: request.time_Lost || '',
        owner_image: request.owner_image || '',        
        status: request.status || '',
      });
    }
  };
  const handleRequestSelect = (request) => {
    console.log("Selected Request:", request); // Debugging
    setSelectedRequest(request);
    setModalType('show');
  
    const itemId = request.itemId || request.item_id || request._id; // Adjust based on API response
    if (itemId) {
      fetchItemDetails(itemId);
    } else {
      console.error("No valid itemId found in the request.");
    }
  };
  
  const closeModal = () => {
    setModalType(null);
    setSelectedRequest(null);
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (!file) return;

    setUploading(true); // Show upload progress

    const storageRef = ref(storage, `FIRI/requests/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: Track upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload Progress: ${progress}%`);
        //add js notification
      },
      (error) => {
        console.error("Upload failed", error);
        setUploading(false);
      },
      async () => {
        // Get the download URL after successful upload
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prev) => ({ ...prev, owner_image: downloadURL }));
        setUploading(false);
      }
    );
  };
  const filteredRequests = requests.filter((request) =>
    request.item_name?.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const displayedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const toggleViewMode = () => setViewMode(viewMode === 'table' ? 'grid' : 'table');

  return (
    <div className="home-container">
      <Sidebar />
      <Header />
      <div className="content">
        <div className="manage-bulletin5">
          <div className="breadcrumb5">Manage Lost and Found {'>'} Manage Request</div>

          <div className="search-bar5">
            <input type="text" placeholder="Search" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
            <button onClick={toggleViewMode} className="view-mode-toggle5">
              {viewMode === 'table' ? <IoGridOutline /> : <FaTable />}
            </button>
          </div>

          {loading ? (
            <p>Loading requests...</p>
          ) : displayedRequests.length === 0 ? (
            <p>No matching requests found.</p>
          ) : viewMode === 'table' ? (
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
                  <th>Actions</th>
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
                      <button className="view-btn5" onClick={() => handleRequestSelect(request)}>Show</button>
                      <button className="update-btn5" onClick={() => openModal('update', request)}>Update</button>
                      <button className="delete-btn5" onClick={() => openModal('delete', request)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={setCurrentPage} />
      </div>

      {/* Update Modal with Editable Fields */}
      {modalType === 'update' && selectedRequest && (
        <div className="modal-overlay1">
          <div className="modal5">
            <h2>Edit Request Details</h2>
            <p><strong>Item Name</strong><input type="text" name="item_name" 
            value={formData.item_name} onChange={handleInputChange} placeholder="Item Name" /></p>
            <p><strong>Description</strong><input type="text" name="description" 
            value={formData.description} onChange={handleInputChange} placeholder="Description" /></p>
             <p><strong>General Location</strong><input type="text" name="general_location" 
            value={formData.general_location} onChange={handleInputChange} placeholder="General Location" /></p>
             <p><strong>Specific Location</strong><input type="text" name="specific_location" 
            value={formData.specific_location} onChange={handleInputChange} placeholder="Specific Location" /></p>
             <p><strong>Date Lost</strong><input type="date" name="date_Lost" 
            value={formData.date_Lost} onChange={handleInputChange} /></p>
            
            <p><strong>Time Lost</strong> <input type="time" name="time_Lost" 
            value={formData.time_Lost} onChange={handleInputChange} /></p>
            <p><strong>Image</strong> </p> <input
          type="file"
          id="owner_image"
          name="owner_image"
          accept="image/*"
          onChange={handleImageUpload}
        />
            <div className="button-container5">
              <button onClick={handleUpdateRequest} className="update-btn5">Save Changes</button>
              <button onClick={closeModal} className="close-btn-manager5">Cancel</button>
            </div>
          </div>
        </div>
      )}
{/* Show Request Details Modal */}
{modalType === 'show' && itemDetails && selectedRequest&&(
  <div className="modal-overlay1">
    <div className="modal5">
    <h3>Item Details</h3>
      <p><strong>Item Type:</strong> {itemDetails.ITEM || "N/A"}</p>
      <p><strong>Description:</strong> {itemDetails.DESCRIPTION || "N/A"}</p>
      <p><strong>Finder Contact:</strong> {itemDetails.CONTACT_OF_THE_FINDER || "N/A"}</p>
      <p><strong>Date Found:</strong> {itemDetails.DATE_FOUND || "N/A"}</p>
      <p><strong>Found Location:</strong> {itemDetails.FOUND_LOCATION || "N/A"}</p>
      <p><strong>IMAGE :</strong> </p>
      <img 
  src={itemDetails.IMAGE_URL} 
  alt="Item Image" 
  className="avatar-image" 
  style={{ filter: 'blur(5px)' }} 
/>


      <h3>Requests Details</h3>
      <p><strong>Item Name:</strong> {selectedRequest.item_name || "N/A"}</p>
  <p><strong>Description:</strong> {selectedRequest.description || "N/A"}</p>
  <p><strong>General Location:</strong> {selectedRequest.general_location || "N/A"}</p>
  <p><strong>Specific Location:</strong> {selectedRequest.specific_location || "N/A"}</p>

  <img src={selectedRequest.owner_image} alt="Request Item Image" className="avatar-image" />
  <p><strong>Request Status:</strong> {selectedRequest.status || "N/A"}</p>
      <div className="button-container5">
        <button onClick={closeModal} className="close-btn-manager5">Close</button>
      </div>
    </div>
  </div>
  
) 
}

      {/* Delete Modal */}
      {modalType === 'delete' && selectedRequest && (
        <div className="modal-overlay1">
          <div className="modal5">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this request?</p>
            <div className="button-container5">
              <button onClick={handleDeleteRequest} className="delete-btn5">Delete</button>
              <button onClick={closeModal} className="close-btn-manager5">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserRetrievalRequests;

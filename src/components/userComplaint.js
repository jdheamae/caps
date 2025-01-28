import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import "../style/Lost.css";
import { FaTable } from "react-icons/fa6";
import { IoGridOutline } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { jwtDecode } from 'jwt-decode';
import Pagination from './pagination';
import axios from 'axios';

function UserComplaint() {
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  //const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  //const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [itemData, setItemData] = useState({
    itemname: '',
    type: '',
    contact: '',
    date: '',
    location: '',
    time: '',
    description: '',
    status: 'Not Found',
  });

  // Fetch all data from the database when the component mounts
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://10.10.83.224:5000/usercomplaints:id");
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Decode the JWT token to extract the userId
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const newComplaint = {
      complainer: formData.get("complainer"),
      itemname: formData.get("itemname"),
      type: formData.get("type"),
      contact: formData.get("contact"),
      date: formData.get("date"),
      location: formData.get("location"),
      time: formData.get("time"),
      description: formData.get("description"),
      userId: userId, // Include the userId here
    };

    try {
      const response = await fetch("http://10.10.83.224:5000/usercomplaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComplaint),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setRequests([...requests, { ...newComplaint, status: "Not Found", finder: "N/A" }]);
        setShowModal(false);
      } else {
        alert("Error filing complaint. Please try again.");
      }
    } catch (error) {
      console.error("Error filing complaint:", error);
      alert("Error filing complaint. Please try again.");
    }
  };

  const handleViewMore = (request) => {
    setSelectedRequest(request); // Set the selected request
    setItemData(request); // Populate itemData with the selected request's data
    setShowModal(true); // Open modal for viewing more details
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      // Optimistically remove the complaint from the state
      const updatedRequests = requests.filter((req) => req._id !== selectedRequest._id);
      setRequests(updatedRequests);

      try {
        const response = await fetch(
          `http://10.10.83.224:5000/usercomplaints/${selectedRequest._id}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          const result = await response.json();
          alert(result.message || "Complaint successfully deleted.");
          setShowViewMoreModal(false); // Close modal after successful deletion
        } else {
          // Roll back the change in case of failure
          setRequests([...updatedRequests, selectedRequest]);
          alert("Failed to delete the complaint. Please try again.");
        }
      } catch (error) {
        // Roll back the change in case of failure
        setRequests([...updatedRequests, selectedRequest]);
        console.error("Error deleting complaint:", error);
        alert("An error occurred while deleting the complaint. Please try again.");
      }
    }
  };



  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedRequest ={
      ...selectedRequest,
      ...itemData,
    };

    try {
      const response = await fetch(`http://10.10.83.224:5000/usercomplaints/${selectedRequest._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRequest),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);

        setRequests(
          requests.map((req) =>
            req._id === selectedRequest._id ? updatedRequest : req
          )
        );

        setShowModal(false); // Close the modal after successful update
        setSelectedRequest(null);// Clear selected request
        setItemData ({ // Reset itemData after update
          itemname: '',
          type: '',
          contact: '',
          date: '',
          location: '',
          description: '',
          time: '',
          status: 'Not Found'
        });

      } else {
        alert("Error updating complaint. Please try again.");
      }
    } catch (error) {
      console.error("Error updating complaint:", error);
      alert("Error updating complaint. Please try again.");
    }
  };

  const fetchRequests = async () => {
    try {
      // Get token and decode it to get userId
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token); // Decode the token
      const userId = decodedToken.id; // Extract userId

      // Fetch user-specific complaints using userId
      const response = await fetch(`http://10.10.83.224:5000/usercomplaints/${userId}`);
      const data = await response.json();
      setRequests(data); // Set the fetched data to the state
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  // Fetch requests on component mount
  useEffect(() => {
    fetchRequests(); // Call fetchRequests on component mount
  }, []);

  const filteredRequests = requests.filter((item) => {
    return item.itemname && item.itemname.toLowerCase().includes(filterText.toLowerCase());
  });
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const displayedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = async (item) => {
    const newStatus = item.STATUS === 'unclaimed' ? 'claimed' : 'unclaimed'; // Toggle status
    try {
      await axios.put(`http://10.10.83.224:5000/items/${item._id}`, { ...item, STATUS: newStatus });
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === item._id ? { ...req, STATUS: newStatus } : req
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const [viewMode, setViewMode] = useState('table'); // Default to 'table' mode
  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'table' ? 'grid' : 'table'));
  };

  const handleAddComplaint = () => {
    setSelectedRequest(null); // Clear selected request for new complaint
    setItemData({
      itemname: '',
      type: '',
      contact: '',
      date: '',
      location: '',
      description: '',
      time: '',
      status: 'Not Found',
    });
    setShowModal(true); // Open modal for adding a complaint
  };


  return (
    <div className="home-container">
      <Sidebar />

      <header className="header">
        <h2>FIRI LOGO</h2>
      </header>

      <div className="content">
        <div className="manage-bulletin2">
          <div className="breadcrumb2">
            Manage Lost And Found {'>'} Manage Reports and Complaints
          </div>



          <div className="search-bar2">
            <input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="search-input"
            />
            <button onClick={toggleViewMode} className="view-mode-toggle2">
              {viewMode === 'table' ? <IoGridOutline /> : <FaTable />}
            </button>



            <div className="top-right-buttons2">
              <button className="add-item-btn2" onClick={handleAddComplaint}>+ File Complaint</button>
              <button className="register-qr-btn2">Register QR Code</button>
            </div>
          </div>



          {viewMode === 'table' ? (
            <table className="ffound-items-table2">
              <thead>
                <tr>
                  <th>Complainer</th>
                  <th>Item Name</th>
                  <th>Item Type</th>
                  <th>Contact of the Complainer</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Finder</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedRequests.map((item) => (
                  <tr key={item._id}>
                    <td>{item.complainer}</td>
                    <td>{item.itemname}</td>
                    <td>{item.type}</td>
                    <td>{item.contact}</td>
                    <td>{item.date}</td>
                    <td>{item.location}</td>
                    <td>{item.time}</td>
                    <td>{item.status}</td>
                    <td>{item.finder}</td>
                    <td>

                      <button className="view-btn2" onClick={() => handleViewMore(item)}>
                        <FaPlus /> View More
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (

            <div className="grid-container2">
              {displayedRequests.map((item) => (
                <div className="grid-item2" key={item._id}>
                  <h2>{item.itemname}</h2>
                  <p><span>Complainer: </span>{item.complainer}</p>
                  <p><span>Item Type: </span> {item.type}</p>
                  <p><span>Contact of the Complainer: </span> {item.contact}</p>
                  <p><span>Date: </span> {item.date}</p>
                  <p><span>Location: </span> {item.location}</p>
                  <p><span>Time: </span> {item.time}</p>
                  <p><span>Status: </span> {item.status}</p>
                  <p><span>Finder: </span> {item.finder}</p>
                  <button className="view-btn2" onClick={() => setShowModal(item)}>
                    <FaPlus /> View More
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

      {/* Modal for filing complaints */}

      {showModal && (
        <div className="modal-overlay2">
          <div className="modal2">
            <h2>{selectedRequest ? 'Update Complaint' : 'File a Complaint'}</h2>
            <form onSubmit={selectedRequest ? handleUpdate : handleComplaintSubmit}>
              <div className="form-group2">
                <label htmlFor="complainerName">Complainer Name</label>
                <input
                  type="text"
                  id="complainerName"
                  name="complainer"
                  maxLength="100"
                  placeholder="Complainer Name"
                  value={itemData.complainer}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group2">
                <label htmlFor="itemName">Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  name="itemname"
                  maxlength="100"
                  placeholder="Item Name"
                  value={itemData.itemname}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group2">
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  maxlength="500"
                  placeholder="Description"
                  value={itemData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group2">
                <label htmlFor="itemType">Item Type</label>
                <input
                  type="text"
                  id="itemType"
                  name="type"
                  maxlength="100"
                  placeholder="Item Type"
                  value={itemData.type}
                  onChange={handleInputChange}
                  required
                ></input>
              </div>


              <div className="form-group2">
                <label htmlFor="contact">Contact of the Complainer</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  maxlength="50"
                  placeholder="Contact of the Complainer"
                  value={itemData.contact}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group2">
                <label htmlFor="dateC">Date</label>
                <input
                  type="date"
                  id="dateC"
                  name="date"
                  value={itemData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group2">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  maxlength="200"
                  placeholder="Location"
                  value={itemData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group2">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={itemData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>





              <div className="button-container2">
                <button type="submit" className="submit-btn2">
                  {selectedRequest ? 'Update' : 'Submit'}
                </button>
                {selectedRequest && (
                  <button
                    type="button"
                    className="delete-btn1"
                    onClick={() => {
                      handleDelete(selectedRequest._id);
                      setShowModal(false); // Close the modal after deletion
                    }}
                  >
                    Delete
                  </button>
                )}

                <button
                  type="button"
                  className="cancel-btn2"
                  onClick={() => setShowModal(false)}
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

export default UserComplaint;

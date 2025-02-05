import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import Sidebar from "./sidebar";
import "../style/complaints.css";
import { FaTable } from "react-icons/fa6";
import { IoGridOutline } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import Pagination from './pagination';
import axios from 'axios';
import Header from "./header";

function Manage() {
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  // const [showUpdateModal, setShowUpdateModal] = useState(false);  // State to manage update modal visibility
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]); // No initial data here
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
    status: 'not-found',
    finder:'',
  });

  // Fetch all data from the database when the component mounts
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://10.10.83.224:5000/complaints");
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
    const newComplaint = {
      complainer: formData.get("complainer"),
      itemname: formData.get("itemname"),
      type: formData.get("type"),
      contact: formData.get("contact"),
      date: formData.get("date"),
      location: formData.get("location"),
      time: formData.get("time"),
      description: formData.get("description"),
    };

    try {
      const response = await fetch("http://10.10.83.224:5000/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComplaint),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setRequests([...requests, { ...newComplaint, status: "not-found", finder: "N/A" }]);
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
          `http://10.10.83.224:5000/complaints/${selectedRequest._id}`,
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



  // const handleUpdate = () => {
  //   setShowUpdateModal(true);  // Show the update modal when the "Update" button is clicked
  // };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedRequest = {
      ...selectedRequest,
      ...itemData,
    };

    try {
      const response = await fetch(`http://10.10.83.224:5000/complaints/${selectedRequest._id}`, {
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
        setItemData({ // Reset itemData after update
          itemname: '',
          type: '',
          contact: '',
          date: '',
          location: '',
          description: '',
          time: '',
          status: 'not-found',
          finder: ''
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
      const response = await fetch("http://10.10.83.224:5000/complaints");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };


  const filteredRequests = requests.filter((item) => {
    return item.complainer && item.complainer.toLowerCase().includes(filterText.toLowerCase());
  });

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
      status: 'not-found',
    });
    setShowModal(true); // Open modal for adding a complaint
  };

  const handleStatusChange = async (item) => {
    const newStatus = item.status === 'not-found' ? 'found' : 'not-found'; // Toggle status
    try {
      await axios.put(`http://10.10.83.224:5000/complaints/${item._id}`, { ...item, status: newStatus });
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === item._id ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };



  return (
    <div className="home-container">
      <Sidebar />
      <Header />



      <div className="content">
        <div className="manage-bulletin3">
          <div className="breadcrumb3">
            Manage Lost And Found {'>'} Manage Reports and Complaints
          </div>



          <div className="search-bar3">
            <input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="search-input3"
            />
            <button onClick={toggleViewMode} className="view-mode-toggle3">
              {viewMode === 'table' ? <IoGridOutline /> : <FaTable />}
            </button>

            <div className="top-right-buttons3">
              <button className="add-item-btn3" onClick={handleAddComplaint}>+ File Complaint</button>
              <button className="register-qr-btn3">Register QR Code</button>
            </div>

          </div>

          {viewMode === 'table' ? (
            <table className="ffound-items-table3">
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
                    <td>
                    <button
                        className={`status-btn3 ${item.status && typeof item.status === 'string' && item.status.toLowerCase() === 'not-found' ? 'not-found' : 'found'}`}
                        onClick={() => handleStatusChange(item)}
                      >
                        {item.status || 'not-found'}
                        <IoMdArrowDropdown className='arrow3' />
                      </button>
                      </td>
                    <td>{item.finder}</td>
                    <td>
                      <button className="view-btn3" onClick={() => handleViewMore(item)}>
                        <FaPlus /> View More
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid-container3">
              {displayedRequests.map((item) => (
                <div className="grid-item3" key={item._id}>
                  <h2>{item.itemname}</h2>
                  <p><span>Complainer: </span>{item.complainer}</p>
                  <p><span>Item Type: </span> {item.type}</p>
                  <p><span>Contact of the Complainer: </span> {item.contact}</p>
                  <p><span>Date: </span> {item.date}</p>
                  <p><span>Location: </span> {item.location}</p>
                  <p><span>Time: </span> {item.time}</p>
                  <p><span>Status: </span> {item.status}</p>
                  <p><span>Finder: </span> {item.finder}</p>
                  <button className="view-btn3" onClick={() => setShowModal(item)}>
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
        <div className="modal-overlay3">
          <div className="modal3">
            <h2>{selectedRequest ? 'Update Complaint' : 'File a Complaint'}</h2>
            <form onSubmit={selectedRequest ? handleUpdate : handleComplaintSubmit}>
              <div className="form-group3">
                <label htmlFor="complainerName">Complainer Name</label>
                <input
                  type="text"
                  id="complainerName"
                  name="complainer"
                  maxLength="100"
                  placeholder="Complainer Name"
                  value={itemData.complainer}
                  onChange={handleInputChange}
                  required={!selectedRequest}
                />
              </div>

              <div className="form-group3">
                <label htmlFor="itemName">Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  name="itemname"
                  maxlength="100"
                  placeholder="Item Name"
                  value={itemData.itemname}
                  onChange={handleInputChange}
                  required={!selectedRequest}
                />
              </div>

              <div className="form-group3">
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  maxlength="500"
                  placeholder="Description"
                  value={itemData.description}
                  onChange={handleInputChange}
                  required={!selectedRequest}
                />
              </div>

              <div className="form-group3">
                <label htmlFor="itemType">Item Type</label>
                <input
                  type="text"
                  id="itemType"
                  name="type"
                  maxlength="100"
                  placeholder="Item Type"
                  value={itemData.type}
                  onChange={handleInputChange}
                  required={!selectedRequest}
                ></input>
              </div>


              <div className="form-group3">
                <label htmlFor="contact">Contact of the Complainer</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  maxlength="50"
                  placeholder="Contact of the Complainer"
                  value={itemData.contact}
                  onChange={handleInputChange}
                  required={!selectedRequest}
                />
              </div>

              <div className="form-group3">
                <label htmlFor="dateC">Date</label>
                <input
                  type="date"
                  id="dateC"
                  name="date"
                  value={itemData.date}
                  onChange={handleInputChange}
                  required={!selectedRequest}
                />
              </div>

              <div className="form-group3">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  maxlength="200"
                  placeholder="Location"
                  value={itemData.location}
                  onChange={handleInputChange}
                  required={!selectedRequest}
                />
              </div>

              <div className="form-group3">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={itemData.time}
                  onChange={handleInputChange}
                  required={!selectedRequest}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={itemData.status}
                  onChange={handleInputChange}
                >
                  option
                  <option value="found">found</option>
                  <option value="not-found">not-found</option>
                </select>
              </div>

              <div className="form-group3">
                <label htmlFor="finder">Finder</label>
                <input
                  type="text"
                  id="finder"
                  name="finder"
                  placeholder="Finder's Name"
                  value={itemData.finder}
                  onChange={handleInputChange}
                  required={!selectedRequest}
                />
              </div>




              <div className="button-container3">
                <button type="submit" className="submit-btn3">
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
                  className="cancel-btn3"
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

export default Manage;

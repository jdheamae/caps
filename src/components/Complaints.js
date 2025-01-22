import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import Sidebar from "./sidebar";
import "../style/mana.css";

function Manage() {
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]); // No initial data here

  // Fetch all data from the database when the component mounts
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:5000/complaints");
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((item) =>
    item.itemname.toLowerCase().includes(filterText.toLowerCase())
  );


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
    };

    try {
      const response = await fetch("http://localhost:5000/complaints", {
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
    setSelectedRequest(request);
    setShowViewMoreModal(true);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      setRequests(requests.filter((req) => req !== selectedRequest));
      setShowViewMoreModal(false);
    }
  };

  const handleUpdate = () => {
    alert("Update functionality can be implemented here.");
  };

  return (
    <div className="home-container">
      <Sidebar />

      <header className="header">
        <h2>FIRI LOGO</h2>
      </header>

      <div className="content">
        <div className="manage-bulletin">
          <div className="breadcrumb">
            Manage Lost And Found {'>'} Manage Reports and Complaints
          </div>

          <div className="top-right-buttons">
            <button className="add-item-btn" onClick={() => setShowModal(true)}>
              + File Complaints
            </button>
            <button className="register-qr-btn">Register QR Code</button>
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

          {filteredRequests.length > 0 ? (
            <table className="ffound-items-table">
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
                {filteredRequests.map((item, index) => (
                  <tr key={index}>
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
                      <button className="view-btn" onClick={() => handleViewMore(item)}>
                        View More
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">No matching requests found</div>
          )}
        </div>

        <div className="ppagination">
          <button className="page-nav">&lt; Previous</button>
          <button className="page-nav">Next &gt;</button>
        </div>
      </div>

      {/* Modal for filing complaints */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>File a Complaint</h2>
            <form onSubmit={handleComplaintSubmit}>
              <input type="text" name="complainer" placeholder="Your Name" required />
              <input type="text" name="itemname" placeholder="Item Name" required />
              <input type="text" name="type" placeholder="Item Type" required />
              <textarea type="text" name="description" placeholder="Description" required />
              <input type="text" name="contact" placeholder="Your Contact" required />
              <input type="date" name="date" required />
              <input type="text" name="location" placeholder="Location" required />
              <input type="time" name="time" required />
              <button type="submit" className="submit-btn">Submit</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View More Modal */}
      {showViewMoreModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Details</h2>
            <p><strong>Complainer:</strong> {selectedRequest.complainer}</p>
            <p><strong>Item Name:</strong> {selectedRequest.itemname}</p>
            <p><strong>Type:</strong> {selectedRequest.type}</p>
            <p><strong>Contact:</strong> {selectedRequest.contact}</p>
            <p><strong>Date:</strong> {selectedRequest.date}</p>
            <p><strong>Location:</strong> {selectedRequest.location}</p>
            <p><strong>Time:</strong> {selectedRequest.time}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <p><strong>Finder:</strong> {selectedRequest.finder}</p>
            <button className="update-btn" onClick={handleUpdate}>Update</button>
            <button className="delete-btn" onClick={handleDelete}>Delete</button>
            <button className="cancel-btn" onClick={() => setShowViewMoreModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Manage;

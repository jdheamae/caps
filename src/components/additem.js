import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBullhorn, FaQrcode, FaFileAlt, FaUserCheck, FaSearch, FaFilter, FaUser, FaSignOutAlt } from 'react-icons/fa';
import '../style/Found.css';
import Sidebar from "./sidebar";

function Additem() {
  const [filterText, setFilterText] = useState(''); // State for filtering item names
  const [showModal, setShowModal] = useState(false);
  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([ // Sample data for requests
    {date: '2024-12-01',timeReturned: '11:00 AM',itemName: 'Wallet',itemType: 'Personal',description: 'Black leather wallet with cards and cash',picture: '',location: 'Library',timeFound: '10:00 AM',finder: 'Juan Dela Cruz',finderNum: '12345',owner: 'Maria Dela Cruz',status: 'Unclaimed'},
    {date: '2024-12-01',timeReturned: '11:00 AM',itemName: 'Wallet',itemType: 'Personal',description: 'Black leather wallet with cards and cash',picture: '',location: 'Library',timeFound: '10:00 AM',finder: 'Juan Dela Cruz',finderNum: '12345',owner: 'Maria Dela Cruz',status: 'Unclaimed' },
    {date: '2024-12-01',timeReturned: '11:00 AM',itemName: 'Wallet',itemType: 'Personal',description: 'Black leather wallet with cards and cash',picture: '',location: 'Library',timeFound: '10:00 AM',finder: 'Juan Dela Cruz',finderNum: '12345',owner: 'Maria Dela Cruz',status: 'Unclaimed'},
    {date: '2024-12-01',timeReturned: '11:00 AM',itemName: 'Wallet',itemType: 'Personal',description: 'Black leather wallet with cards and cash',picture: '',location: 'Library',timeFound: '10:00 AM',finder: 'Juan Dela Cruz',finderNum: '12345',owner: 'Maria Dela Cruz',status: 'Unclaimed'},
    {date: '2024-12-01',timeReturned: '11:00 AM',itemName: 'Wallet',itemType: 'Personal',description: 'Black leather wallet with cards and cash',picture: '',location: 'Library',timeFound: '10:00 AM',finder: 'Juan Dela Cruz',finderNum: '12345',owner: 'Maria Dela Cruz',status: 'Unclaimed'},
    {date: '2024-12-01',timeReturned: '11:00 AM',itemName: 'Wallet',itemType: 'Personal',description: 'Black leather wallet with cards and cash',picture: '',location: 'Library',timeFound: '10:00 AM',finder: 'Juan Dela Cruz',finderNum: '12345',owner: 'Maria Dela Cruz',status: 'Unclaimed'},
    {date: '2024-12-01',timeReturned: '11:00 AM',itemName: 'Wallet',itemType: 'Personal',description: 'Black leather wallet with cards and cash',picture: '',location: 'Library',timeFound: '10:00 AM',finder: 'Juan Dela Cruz',finderNum: '12345',owner: 'Maria Dela Cruz',status: 'Unclaimed'},
    {date: '2024-12-01',timeReturned: '11:00 AM',itemName: 'Wallet',itemType: 'Personal',description: 'Black leather wallet with cards and cash',picture: '',location: 'Library',timeFound: '10:00 AM',finder: 'Juan Dela Cruz',finderNum: '12345',owner: 'Maria Dela Cruz',status: 'Unclaimed'},
    {date: '2024-12-01',timeReturned: '11:00 AM',itemName: 'Wallet',itemType: 'Personal',description: 'Black leather wallet with cards and cash',picture: '',location: 'Library',timeFound: '10:00 AM',finder: 'Juan Dela Cruz',finderNum: '12345',owner: 'Maria Dela Cruz',status: 'Unclaimed'},
    {date: '2024-12-01',timeReturned: '11:00 AM',itemName: 'Wallet',itemType: 'Personal',description: 'Black leather wallet with cards and cash',picture: '',location: 'Library',timeFound: '10:00 AM',finder: 'Juan Dela Cruz',finderNum: '12345',owner: 'Maria Dela Cruz',status: 'Unclaimed'},
    {date: '2024-12-01',timeReturned: '11:00 AM',itemName: 'Wallet',itemType: 'Personal',description: 'Black leather wallet with cards and cash',picture: '',location: 'Library',timeFound: '10:00 AM',finder: 'Juan Dela Cruz',finderNum: '12345',owner: 'Maria Dela Cruz',status: 'Unclaimed'},
  ]);

  // Fetch all data from the database when the component mounts
    useEffect(() => {
      const fetchRequests = async () => {
        try {
          const response = await fetch("http://localhost:5000/additem");
          const data = await response.json();
          setRequests(data);
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      };
      
      fetchRequests();
    }, []);

    const handleFoundSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const newFound = {
        date: formData.get("date"),
        timeReturned: formData.get("timeReturned"),
        itemName: formData.get("itemName"),
        itemType: formData.get("itemType"),
        description: formData.get("description"),
        picture: formData.get("picture"),
        location: formData.get("location"),
        timeFound: formData.get("timeFound"),
        finder: formData.get("finder"),
        finderNum: formData.get("finderNum"),
        owner: formData.get("owner"),
        status: formData.get("status"),
        
      };
  
      try {
        const response = await fetch("http://localhost:5000/additem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFound),
        });
  
        if (response.ok) {
          const result = await response.json();
          alert(result.message);
          setRequests([...requests, { ...newFound, status: "Not Found", finder: "N/A" }]);
          setShowModal(false);
        } else {
          alert("Error adding Found Item. Please try again.");
        }
      } catch (error) {
        console.error("Error adding Found Item:", error);
        alert("Error Adding Found item. Please try again.");
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

  // Filtered requests based on the filterText
  const filteredRequests = requests.filter((item) =>
    item.itemName.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="home-container">
      <Sidebar />

      <header className="header">
        <h2>FIRI LOGO</h2>
      </header>

      <div className="content">
        <div className="manage-bulletin">
          <div className="breadcrumb">Manage Lost and Found {'>'} Manage FaBoxound Items</div>

          

          <div className="search-bar1" > 
            <input
              type="text"
              placeholder="Search"
              
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)} // Update filterText state
            />
            <FaSearch className="search-icon1" />
            <FaFilter className="filter-icon1" />
          </div>

          {/* Buttons at the top-right */}
          <div className="top-right-buttons1">
            <button className="add-item-btn1" onClick={() => setShowModal(true)}>+ Add Found Item</button>
            <button className="register-qr-btn1">Register QR Code</button>
          </div>

          {filteredRequests.length > 0 ? (
            <table className="ffound-items-table1">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time Returned</th>
                  <th>Item Name</th>
                  <th>Item Type</th>
                  <th>Description</th>
                  <th>Picture</th>
                  <th>Location</th>
                  <th>Time Found</th>
                  <th>Finder</th>
                  <th>Finder #</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.timeReturned}</td>
                    <td>{item.itemName}</td>
                    <td>{item.itemType}</td>
                    <td>{item.description}</td>
                    <td>{item.picture}</td>
                    <td>{item.location}</td>
                    <td>{item.timeFound}</td>
                    <td>{item.finder}</td>
                    <td>{item.finderNum}</td>
                    <td>{item.owner}</td>
                    <td>{item.status}</td>
                    
                    <td>
                      <button className="view-btn1" onClick={() => handleViewMore(item)}>View More </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data1">No matching requests found</div>
          )}
        </div>

        <div className="ppagination1">
          <button className="page-nav1">&lt; Previous</button>
          <button className="page-nav1">Next &gt;</button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay1">
          <div className="modal1">
            <h2>File a Found Item</h2>
            <form onSubmit={handleFoundSubmit}>
              <div className="form-group">
                <label htmlFor="dateFound">Date Found</label>
                <input type="date" id="dateFound" name="dateFound"  required />
              </div>

              <div className="form-group">
                <label htmlFor="timeRet">Time Returned</label>
                <input type="time" id="timeRet" name="timeRet"  required />
              </div>

              <div className="form-group">
                <label htmlFor="itemType">Item Type</label>
                <select id="itemType" name="itemType" required>
                  <option value="">Select Item Type</option>
                  <option value="personal">Personal</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="bags">Bags</option>
                  <option value="stationery">Stationery</option>
                  <option value="miscellanous">Miscellanous</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="descript">Description</label>
                <input type="text" id="descript" name="descript" placeholder="Description"  required />
              </div>

              <div className="form-group">
                <label htmlFor="loc">Location</label>
                <input type="text" id="loc" name="loc" placeholder="Location Found"  required />
              </div>

              <div className="form-group">
                <label htmlFor="timeFound">Time Found</label>
                <input type="time" id="timeFound" name="timeFound" placeholder="Time Found"  required />
              </div>

              <div className="form-group">
                <label htmlFor="finderName">Finder Name</label>
                <input type="text" id="finderName" name="finderName" placeholder="Finder Name"  required />
              </div>

              <div className="form-group">
                <label htmlFor="finNum">Finder #</label>
                <input type="text" id="finNum" name="finNum" placeholder="Finder Number"  required />
              </div>

              <div className="form-group">
                <label htmlFor="owNer">Owner Name</label>
                <input type="text" id="owNer" name="owNer" placeholder="May skip if owner is not yet identified" />
              </div>

              <div className="form-group">
                <label htmlFor="stat">Status</label>
                <select>
                  <option value="">Select Status</option>
                  <option value="claimed">Claimed</option>
                  <option value="unclaimed">Unclaimed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="itemPic">Item Picture</label>
                <input
                  type="file"
                  id="itemPic"
                  accept="image/*"
                  required
                  className="item-pic-input"
                />
              </div>

              <div className="button-container">
              <button type="submit" className="submit-btn1">Submit</button>
              <button
                  type="button"
                  className="cancel-btn1"
                  onClick={() => setShowModal(false)}
              >
                  Cancel
              </button>
          </div>
            </form>
          </div>
        </div>
)}

      {/* View More Modal */}
      {showViewMoreModal && selectedRequest && (
        <div className="modal-overlay1">
          <div className="modal1">
            <h2>Details</h2>
            <p><strong>date:</strong> {selectedRequest.date}</p>
            <p><strong>Item Name:</strong> {selectedRequest.itemName}</p>
            <p><strong>item Type:</strong> {selectedRequest.itemType}</p>
            <p><strong>Description:</strong> {selectedRequest.description}</p>
            <p><strong>Picture:</strong> {selectedRequest.picture}</p>
            <p><strong>Location:</strong> {selectedRequest.location}</p>
            <p><strong>Time Found:</strong> {selectedRequest.timeFound}</p>
            <p><strong>finder:</strong> {selectedRequest.finder}</p>
            <p><strong>finder #:</strong> {selectedRequest.finderNum}</p>
            <p><strong>owner:</strong> {selectedRequest.owner}</p>
            <p><strong>status:</strong> {selectedRequest.status}</p>
            <button className="update-btn1" onClick={handleUpdate}>Update</button>
            <button className="delete-btn1" onClick={handleDelete}>Delete</button>
            <button className="cancel-btn1" onClick={() => setShowViewMoreModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Additem;

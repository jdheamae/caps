import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Sidebar from "./sidebar";
import '../style/additem.css';
import axios from 'axios'; // For making HTTP requests

function Additem() {
  const [filterText, setFilterText] = useState('');
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
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
    STATUS: 'unclaimed'
  });

  // Fetching items from the backend when the component loads
  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await axios.get('http://10.10.83.224:5000/items'); // Adjusted to localhost
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    }
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make POST request to add the found item
      const response = await axios.post('http://10.10.83.224:5000/items', itemData); // Adjusted to localhost
      console.log('Item added:', response.data);
      setShowModal(false); // Close the modal
      // Optionally, update the list of items if needed
      setRequests([...requests, response.data]); // Add the newly added item to the list
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Filter requests based on the filter text
  const filteredRequests = requests.filter((item) => {
    // Ensure the ITEM field exists and is a string before using toLowerCase()
    return item.ITEM && item.ITEM.toLowerCase().includes(filterText.toLowerCase());
  });

  return (
    <div className="home-container">
      <Sidebar />

      <header className="header">
        <h2>FIRI LOGO</h2>
      </header>

      <div className="content">
        <div className="manage-bulletin">
          <div className="breadcrumb">Manage Lost and Found {'>'} Manage Found Items</div>

          {/* Buttons at the top-right */}
          <div className="top-right-buttons">
            <button className="add-item-btn" onClick={() => setShowModal(true)}>+ Add Found Item</button>
            <button className="register-qr-btn">Register QR Code</button>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)} // Update filterText state
            />
            <FaSearch className="search-icon" />
            <FaFilter className="filter-icon" />
          </div>

          {filteredRequests.length > 0 ? (
            <table className="found-items-table">
              <thead>
                <tr>
                  <th>Finder</th>
                  <th>Item Name</th>
                  <th>Item Type</th>
                  <th>Contact of the Finder</th>
                  <th>Date Found</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Owner Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((item, index) => (
                  <tr key={index}>
                    <td>{item.FINDER}</td>
                    <td>{item.ITEM}</td>
                    <td>{item.DESCRIPTION}</td>
                    <td>{item.CONTACT_OF_THE_FINDER}</td>
                    <td>{item.DATE_FOUND}</td>
                    <td>{item.FOUND_LOCATION}</td>
                    <td>{item.TIME_RETURNED}</td>
                    <td>{item.OWNER}</td>
                    <td>{item.STATUS}</td>
                    <td>
                      <button className="view-btn">View More</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">No matching requests found</div>
          )}
        </div>

        <div className="pagination">
          <button className="page-nav">&lt; Previous</button>
          <button className="page-nav">Next &gt;</button>
        </div>
      </div>

      {/* Modal for Adding Found Item */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h3>Add Found Item</h3>
            <form onSubmit={handleFormSubmit}>
              <label>Item Name:</label>
              <input
                type="text"
                name="ITEM"
                value={itemData.ITEM}
                onChange={handleInputChange}
                required
              />
              <label>Description:</label>
              <input
                type="text"
                name="DESCRIPTION"
                value={itemData.DESCRIPTION}
                onChange={handleInputChange}
                required
              />
              <label>Date Found:</label>
              <input
                type="date"
                name="DATE_FOUND"
                value={itemData.DATE_FOUND}
                onChange={handleInputChange}
                required
              />
              <label>Time Returned:</label>
              <input
                type="time"
                name="TIME_RETURNED"
                value={itemData.TIME_RETURNED}
                onChange={handleInputChange}
                required
              />
              <label>Finder:</label>
              <input
                type="text"
                name="FINDER"
                value={itemData.FINDER}
                onChange={handleInputChange}
                required
              />
              <label>Contact of Finder:</label>
              <input
                type="text"
                name="CONTACT_OF_THE_FINDER"
                value={itemData.CONTACT_OF_THE_FINDER}
                onChange={handleInputChange}
                required
              />
              <label>Location Found:</label>
              <input
                type="text"
                name="FOUND_LOCATION"
                value={itemData.FOUND_LOCATION}
                onChange={handleInputChange}
                required
              />
              <label>Owner:</label>
              <input
                type="text"
                name="OWNER"
                value={itemData.OWNER}
                onChange={handleInputChange}
                required
              />
              <label>Status:</label>
              <select
                name="STATUS"
                value={itemData.STATUS}
                onChange={handleInputChange}
              >
                <option value="unclaimed">Unclaimed</option>
                <option value="claimed">Claimed</option>
              </select>
              <button type="submit">Add Item</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Additem;

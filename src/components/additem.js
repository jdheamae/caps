import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Sidebar from "./sidebar";
import '../style/additem.css';
import axios from 'axios';

function Additem() {
  const [filterText, setFilterText] = useState('');
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    STATUS: 'unclaimed',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://10.10.83.224:5000/items');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await axios.put(`http://10.10.83.224:5000/items/${selectedItem._id}`, itemData);
      } else {
        const response = await axios.post('http://10.10.83.224:5000/items', itemData);
        setRequests([...requests, response.data]);
      }
      setShowModal(false);
      fetchItems();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://10.10.83.224:5000/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const openModal = (item = null) => {
    setSelectedItem(item);
    setItemData(
      item || {
        ITEM: '',
        DESCRIPTION: '',
        DATE_FOUND: '',
        TIME_RETURNED: '',
        FINDER: '',
        CONTACT_OF_THE_FINDER: '',
        FOUND_LOCATION: '',
        OWNER: '',
        DATE_CLAIMED: '',
        STATUS: 'unclaimed',
      }
    );
    setShowModal(true);
  };

  const filteredRequests = requests.filter((item) => {
    return item.ITEM && item.ITEM.toLowerCase().includes(filterText.toLowerCase());
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const displayedRequests = filteredRequests.slice(
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
        <div className="manage-bulletin">
          <div className="breadcrumb">Manage Lost and Found {'>'} Manage Found Items</div>
          <div className="top-right-buttons">
            <button className="add-item-btn" onClick={() => openModal()}>+ Add Found Item</button>
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
          {displayedRequests.length > 0 ? (
            <table className="found-items-table">
              <thead>
                <tr>
                  <th>Finder</th>
                  <th>Item Name</th>
                  <th>Description</th>
                  <th>Contact</th>
                  <th>Date Found</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedRequests.map((item) => (
                  <tr key={item._id}>
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
                      <button className="view-btn" onClick={() => openModal(item)}>View More</button>
                      <button className="edit-btn" onClick={() => openModal(item)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">No matching requests found</div>
          )}
          <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className="page-nav"
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h3>{selectedItem ? 'Edit Item' : 'Add Found Item'}</h3>
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
              <button type="submit">{selectedItem ? 'Update Item' : 'Add Item'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Additem;

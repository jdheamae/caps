import React, { useState, useEffect } from 'react';
import { FaTable } from "react-icons/fa6";
import { IoGridOutline } from "react-icons/io5";
import { FaSearch, FaFilter } from 'react-icons/fa';
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import Sidebar from "./sidebar";
import '../style/Found.css';
import axios from 'axios';
import Pagination from './pagination';

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

  return (
    <div className="home-container">
      <Sidebar />
      <header className="header">
        <h2>FIRI LOGO</h2>
      </header>
      <div className="content">
        <div className="manage-bulletin1">
          <div className="breadcrumb1">Manage Lost and Found {'>'} Manage Found Items</div>
          


          
          <div className="search-bar1">
            <input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="search-input"
            />
            <button onClick={toggleViewMode} className="view-mode-toggle">
              {viewMode === 'table' ? <IoGridOutline /> : <FaTable />}
            </button>

            <div className="top-right-buttons1">
              <button className="add-item-btn1" onClick={() => openModal()}>+ Add Found Item</button>
              <button className="register-qr-btn1">Register QR Code</button>
            </div>
          </div>


          {viewMode === 'table' ? (
            <table className="ffound-items-table1">
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
                    <td>
                      <button
                        className={`status-btn1 ${item.STATUS && typeof item.STATUS === 'string' && item.STATUS.toLowerCase() === 'unclaimed' ? 'unclaimed' : 'claimed'}`}
                        onClick={() => handleStatusChange(item)}
                      >
                        {item.STATUS || 'Unclaimed'}
                        <IoMdArrowDropdown className='arrow1' />
                      </button>
                    </td>
                    <td>
                      <button className="view-btn1" onClick={() => openModal(item)}>
                        <FaPlus /> View More
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid-container">
              {displayedRequests.map((item) => (
                <div className="grid-item" key={item._id}>
                  <h2>{item.ITEM}</h2>
                  <p><span>Description: </span>{item.DESCRIPTION}</p>
                  <p><span>Finder: </span> {item.FINDER}</p>
                  <p><span>Contact: </span> {item.CONTACT_OF_THE_FINDER}</p>
                  <p><span>Date Found: </span> {item.DATE_FOUND}</p>
                  <p><span>Location: </span> {item.FOUND_LOCATION}</p>
                  <p><span>Time: </span> {item.TIME_RETURNED}</p>
                  <p><span>Owner: </span> {item.OWNER}</p>
                  <button
                    className={`status-btn1 ${item.STATUS && typeof item.STATUS === 'string' && item.STATUS.toLowerCase() === 'unclaimed' ? 'unclaimed' : 'claimed'}`}
                    onClick={() => handleStatusChange(item)}
                  >
                    {item.STATUS || 'unclaimed'}
                    <IoMdArrowDropdown className='arrow1' />
                  </button>
                  <button className="view-btn1" onClick={() => openModal(item)}>
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

      {showModal && (
        <div className="modal-overlay1">
          <div className="modal1">
            <h2>{selectedItem ? 'Update Item' : 'File a Found Item'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="finderName">Finder Name</label>
                <input
                  type="text"
                  id="finderName"
                  name="FINDER"
                  maxLength="100"
                  placeholder="Finder Name"
                  value={itemData.FINDER}
                  onChange={handleInputChange}
                  required={!selectedItem}
                />
              </div>

              <div className="form-group">
                <label htmlFor="itemName">Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  name="ITEM"
                  maxlength="100"
                  placeholder="Item Name"
                  value={itemData.ITEM}
                  onChange={handleInputChange}
                  required={!selectedItem}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  id="description"
                  name="DESCRIPTION"
                  maxlength="500"
                  placeholder="Description"
                  value={itemData.DESCRIPTION}
                  onChange={handleInputChange}
                  required={!selectedItem}
                ></textarea>
              </div>

 
              <div className="form-group">
                <label htmlFor="contact">Contact</label>
                <input
                  type="text"
                  id="contact"
                  name="CONTACT_OF_THE_FINDER"
                  maxlength="50"
                  placeholder="Contact Number"
                  value={itemData.CONTACT_OF_THE_FINDER}
                  onChange={handleInputChange}
                  required={!selectedItem}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateFound">Date Found</label>
                <input
                  type="date"
                  id="dateFound"
                  name="DATE_FOUND"
                  value={itemData.DATE_FOUND}
                  onChange={handleInputChange}
                  required={!selectedItem}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="FOUND_LOCATION"
                  maxlength="200"
                  placeholder="Location"
                  value={itemData.FOUND_LOCATION}
                  onChange={handleInputChange}
                  required={!selectedItem}
                />
              </div>

              <div className="form-group">
                <label htmlFor="timeReceived">Time Received</label>
                <input
                  type="time"
                  id="timeReceived"
                  name="TIME_RETURNED"
                  value={itemData.TIME_RETURNED}
                  onChange={handleInputChange}
                  required={!selectedItem}
                />
              </div>

              <div className="form-group">
                <label htmlFor="owner">Owner Name</label>
                <input
                  type="text"
                  id="owner"
                  name="OWNER"
                  maxlength="50"
                  placeholder="May skip if owner is not yet identified"
                  value={itemData.OWNER}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="STATUS"
                  value={itemData.STATUS}
                  onChange={handleInputChange}
                >
                  <option value="unclaimed">Unclaimed</option>
                  <option value="claimed">Claimed</option>
                </select>
              </div>

              <div className="button-container1">
                <button type="submit" className="submit-btn1">
                  {selectedItem ? 'Update' : 'Submit'}
                </button>

                {selectedItem && (
                  <button
                    type="button"
                    className="delete-btn1"
                    onClick={() => {
                      handleDelete(selectedItem._id);
                      setShowModal(false); // Close the modal after deletion
                    }}
                  >
                    Delete
                  </button>
                )}
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
    </div>
  );
}

export default Additem;
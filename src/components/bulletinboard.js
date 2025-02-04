import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import '../style/userBulletin.css';
import Sidebar from "./sidebar";
import axios from 'axios';
import { FaTable } from "react-icons/fa6";
import { IoGridOutline } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6"
import Pagination from './pagination';
import { jwtDecode } from 'jwt-decode';
import Header from './header';


function Bulletin() {
  const [filterText, setFilterText] = useState('');
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  //for Request
  const [itemData, setItemData] = useState({
    name: '',
    description: '',
    contactNumber: '',
    id: '',
  });



  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://10.10.83.224:5000/useritems');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Handle modal data changes
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({ ...prev, [name]: value }));
  };
  const handleModalSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id; // Get userId from the token
  
      const response = await axios.post('http://10.10.83.224:5000/retrieval-request', {
        name: itemData.name,
        description: itemData.description,
        contactNumber: itemData.contactNumber,
        id: itemData.id,
        itemId: selectedItem._id, // Assuming you're passing the selected item ID
        userId: userId, // Include userId in the request
      });
  
      console.log('Response:', response.data); // Log the response
      alert('Request submitted successfully!'); // Confirmation alert
  
      // Reset itemData to clear the form fields
      setItemData({
        name: '',
        description: '',
        contactNumber: '',
        id: '',
      });
  
      setShowModal(false); // Close the modal after successful submission
    } catch (error) {
      console.error('Error submitting the form:', error); // Log any errors
      alert('Error submitting the form. Please try again.'); // Alert on error
    }
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

  // Filtered requests based on the filterText
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
      <Header />


      <div className="content">
        <div className="manage-bulletin4">
          <div className="breadcrumb4">Manage Lost and Found {'>'} Manage Found Items</div>





          <div className="search-bar4">
            <input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="search-input4"
            />




          </div>


          <div className="grid-container4">
            {displayedRequests.map((item) => (
              <div className="grid-item4" key={item._id}>
                <h2>{item.ITEM}</h2>
                {item.IMAGE_URL && (
                  <img src={item.IMAGE_URL || "default-image-url"} alt="Product" className="item-image4" />
                )}
                <p><span>Date Found: </span> {item.DATE_FOUND}</p>
                <p><span>Location: </span> {item.FOUND_LOCATION}</p>

                <button className="view-btn4" onClick={() => {
                  setSelectedItem(item);
                  setShowModal(true);
                }}>
                  <FaPlus /> View More
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


      {showModal && (
        <div className="modal-overlay4">
          <div className="modal4">
            <h2>File a Request</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="form-group4">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  maxLength="100"
                  placeholder="Name"
                  value={itemData.name}
                  onChange={handleModalChange}
                  required
                />
              </div>

              <div className="form-group4">
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  maxLength="500"
                  placeholder="Description"
                  value={itemData.description}
                  onChange={handleModalChange}
                  required
                />
              </div>

              <div className="form-group4">
                <label htmlFor="contactNumber">Contact Number:</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  maxLength="50"
                  placeholder="Contact Number"
                  value={itemData.contactNumber}
                  onChange={handleModalChange}
                  required
                ></input>
              </div>


              <div className="form-group4">
                <label htmlFor="id">ID:</label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  maxLength="50"
                  placeholder="ID Number"
                  value={itemData.id}
                  onChange={handleModalChange}
                  required
                />
              </div>



              <div className="button-container4">
                <button type="submit" className="submit-btn4">
                  Submit
                </button>

                {/* {selectedItem && (
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
                )} */}
                <button
                  type="button"
                  className="cancel-btn4"
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

export default Bulletin;

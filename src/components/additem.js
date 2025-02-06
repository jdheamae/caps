import React, { useState, useEffect, useRef } from 'react';
import { FaTable } from "react-icons/fa6";
import { IoGridOutline } from "react-icons/io5";
import { FaSearch, FaFilter } from 'react-icons/fa';
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import Sidebar from "./sidebar";
import '../style/Found.css';
import axios from 'axios';
import { storage } from "../firebase"; // Import Firebase storage
import Pagination from './pagination';
import { ref, uploadBytesResumable, uploadString, getDownloadURL } from "firebase/storage";
import Header from './header';


function Additem() {
  const [filterText, setFilterText] = useState('');
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [itemData, setItemData] = useState({
    // ITEM: '',
    // DESCRIPTION: '',
    // DATE_FOUND: '',
    // TIME_RETURNED: '',
    // FINDER: '',
    // CONTACT_OF_THE_FINDER: '',
    // FOUND_LOCATION: '',
    // OWNER: '',
    // DATE_CLAIMED: '',
    // STATUS: 'unclaimed',
    // IMAGE_URL: '',  // Store image URL
    FINDER: '',//based  on their csv
    FINDER_TYPE:'',//for data visualization 
    ITEM: '',//item name ,based on their csv
    ITEM_TYPE:'',//for data visualization
    DESCRIPTION: '',//item description ,base on their csv
    IMAGE_URL:'',//change to item image later
    CONTACT_OF_THE_FINDER: '',//based on their csv
    DATE_FOUND: '',//based on their csv
    GENERAL_LOCATION:'',//for data visualization
    FOUND_LOCATION: '',//based on their csv
    TIME_RETURNED: '',  //time received
    OWNER: '',
    OWNER_COLLEGE: '',
    OWNER_CONTACT:'',
    OWNER_IMAGE: '',
    DATE_CLAIMED: '',
    TIME_CLAIMED:'',
    STATUS: 'unclaimed',
  });

  const [image, setImage] = useState(null); // State to hold the captured image
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://10.10.83.224:5000/items');
      
      const sortedRequests = response.data.sort((a, b) => {
        // Combine DATE_FOUND and TIME_RETURNED into a single Date object
        const dateA = new Date(`${a.DATE_FOUND}T${a.TIME_RETURNED}`);
        const dateB = new Date(`${b.DATE_FOUND}T${b.TIME_RETURNED}`);
        return dateB - dateA; // Sort in descending order
      });
  
      setRequests(sortedRequests);
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
    let imageUrl = itemData.IMAGE_URL; // Default to existing URL if any

   // Check if adding a new item and no image is captured
  if (!selectedItem && !image) {
    alert('Please capture an image before submitting the form.'); // Alert if no image is captured
    return; // Exit the function
  }
    // Step 1: Upload the image to Firebase Storage if available
    if (image) {
      const imageRef = ref(storage, `images/${Date.now()}.png`);
      try {
        await uploadString(imageRef, image, 'data_url');
        const downloadURL = await getDownloadURL(imageRef);
        imageUrl = downloadURL; // Update the URL
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    // Step 2: Update itemData with the image URL
    const updatedData = { ...itemData, IMAGE_URL: imageUrl };

    try {
      if (selectedItem) {
        await axios.put(`http://10.10.83.224:5000/items/${selectedItem._id}`, updatedData);
        alert('Item updated successfully!');
      } else {
        const response = await axios.post('http://10.10.83.224:5000/items', updatedData);
        setRequests([...requests, response.data]);
        alert('Item updated successfully!');
      }
      setShowModal(false);
      fetchItems();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://10.10.83.224:5000/items/${id}`);
        fetchItems();
        alert('Item deleted successfully!'); // Alert on successful deletion
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item. Please try again.'); // Alert on error
      }
    }
  };

  const openModal = (item = null) => {
    setSelectedItem(item);
    setItemData(
      item || {
        FINDER: '',//based  on their csv
        FINDER_TYPE:'',//for data visualization 
        ITEM: '',//item name ,based on their csv
        ITEM_TYPE:'',//for data visualization
        DESCRIPTION: '',//item description ,base on their csv
        IMAGE_URL:'',//change to item image later
        CONTACT_OF_THE_FINDER: '',//based on their csv
        DATE_FOUND: '',//based on their csv
        GENERAL_LOCATION:'',//for data visualization
        FOUND_LOCATION: '',//based on their csv
        TIME_RETURNED: '',  //time received
        OWNER: '',
        OWNER_COLLEGE: '',
        OWNER_CONTACT:'',
        OWNER_IMAGE: '',
        DATE_CLAIMED: '',
        TIME_CLAIMED:'',
        STATUS: 'unclaimed',
      }
    );
    setImage(null); // Reset the captured image when opening the modal
    setShowModal(true);
    startCamera();
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
      alert(`Status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const [viewMode, setViewMode] = useState('table'); // Default to 'table' mode
  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'table' ? 'grid' : 'table'));
  };




  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch((err) => {
          console.error('Error accessing the camera', err);
        });
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png'); // Capturing the image in base64 format
      setImage(imageData); // Set the captured image to state
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <Header />

      <div className="content">
        <div className="manage-bulletin1">
          <div className="breadcrumb1">Manage Lost and Found {'>'} Manage Found Items</div>




          <div className="search-bar1">
            <input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="search-input1"
            />
            <button onClick={toggleViewMode} className="view-mode-toggle1">
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
                  <th>Finder Type</th>{/* for visualization */}            
                  <th>Item Name</th>
                  <th>Item Type</th>{/* for visualization */}
                  <th>Item Description</th>
                  <th>Item Image</th>
                  <th>Finder Contact</th>
                  <th>Date Found</th>
                  <th>General Location</th>{/* for visualization */}
                  <th>Specific Location</th>
              
                  <th>Time Recieved</th>
                  <th>Owner</th>
                  <th>Owner College</th>{/* for visualization */}
                  <th>Contact</th>
                  <th>Owner Image</th>
                  <th>Date Claimed</th>{/* for visualization */}
                  <th>Time Claimed</th>
                  <th>Status</th>{/* for visualization */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedRequests.map((item) => (
                  <tr key={item._id}>
                    <td>{item.FINDER}</td>
                    <td>{item.FINDER_TYPE}</td>
                    <td>{item.ITEM}</td>
                    <td>{item.ITEM_TYPE}</td>
                    <td>{item.DESCRIPTION}</td>
                    <td> <img
                      src={item.IMAGE_URL || "default-image-url"}
                      alt="Product"
                      className="default-image-url1"

                    /></td>
                    <td>{item.CONTACT_OF_THE_FINDER}</td>
                    <td>{item.DATE_FOUND}</td>
                    <td>{item.GENERAL_LOCATION}</td>
                    <td>{item.FOUND_LOCATION}</td>
                  
                     <td>{item.TIME_RETURNED} </td>{/* it supposed to be TIME_RECIEVED */}
                    <td>{item.OWNER}</td>
                    <td>{item.OWNER_COLLEGE}</td>
                    <td>{item.OWNER_CONTACT}</td>
                   <td>{item.OWNER_IMAGE}</td>
                   <td>{item.DATE_CLAIMED}</td>
                   <td>{item.TIME_CLAIMED}</td>
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
            <div className="grid-container1">
              {displayedRequests.map((item) => (
                <div className="grid-item1" key={item._id}>
                  <h2>{item.ITEM}</h2>
                  <img
                    src={item.IMAGE_URL || "default-image-url"}
                    alt="Product"
                    className="default-image-url11"

                  />
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

            {/* Wrap form fields and camera in a flex container */}
            <div className="form-and-camera">
              <form onSubmit={handleFormSubmit} className="form-fields">
                <div className="form-group1">
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
                
             
                 <div className="form-group1">
                  <label htmlFor="finderType">Finder TYPE</label>  {/* ADD DROP DOWN */}
                  
                   <select           
                    id="finderType"
                    name="FINDER_TYPE"
                   
                    placeholder="Finder TYPE"
                    value={itemData.FINDER_TYPE}
                    onChange={handleInputChange}
                    required={!selectedItem}
                  >  
                  <option value="STUDENT">STUDENT</option>
                    <option value="UTILITIES">UTILITIES</option>
                    <option value="GUARD">GUARD</option>
                    <option value="VISITORS">VISITORS</option>
                    </select>
                </div>
                <div className="form-group1">
                  <label htmlFor="itemName">Item Name</label>
                  <input
                    type="text"
                    id="itemName"
                    name="ITEM"
                    maxLength="100"
                    placeholder="Item Name"
                    value={itemData.ITEM}
                    onChange={handleInputChange}
                    required={!selectedItem}
                  />
                </div>
                <div className="form-group1">
                  <label htmlFor="itemType">ITEM TYPE</label>  {/* ADD DROP DOWN */}
                    <select
                                  
                    id="itemType"
                    name="ITEM_TYPE"
                    placeholder="Item TYPE"
                    value={itemData.ITEM_TYPE}
                    onChange={handleInputChange}
                    required={!selectedItem}
                  >
                    <option value="PERSONAL">PERSONAL</option>
                    <option value="ELECTRONICS">ELECTRONICS</option>
                  </select>
                </div>
                <div className="form-group1">
                  <label htmlFor="description">Item Description</label>
                  <textarea
                    id="description"
                    name="DESCRIPTION"
                    maxLength="500"
                    placeholder="Description"
                    value={itemData.DESCRIPTION}
                    onChange={handleInputChange}
                    required={!selectedItem}
                  ></textarea>
                </div>

                <div className="form-group1">
                  <label htmlFor="contact">Finder Contact</label>
                  <input
                    type="text"
                    id="contact"
                    name="CONTACT_OF_THE_FINDER"
                    maxLength="50"
                    placeholder="Contact Number"
                    value={itemData.CONTACT_OF_THE_FINDER}
                    onChange={handleInputChange}
                    required={!selectedItem}
                  />
                </div>

                <div className="form-group1">
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
                <div className="form-group1">
                  <label htmlFor="generalLocation">General Location</label>  {/* ADD DROP DOWN */}
                
                     <select
                    id="generalLocation"
                    name="GENERAL_LOCATION"
                    placeholder="General Location"
                    value={itemData.GENERAL_LOCATION}
                    onChange={handleInputChange}
                  >
                    <option value="GYM">GYM</option>
                    <option value="LIBRARY">Library</option>
                  </select>
                </div>
                <div className="form-group1">
                  <label htmlFor="location">Specific Location</label>
                  <input
                    type="text"
                    id="location"
                    name="FOUND_LOCATION"
                    maxLength="200"
                    placeholder="Specific Location"
                    value={itemData.FOUND_LOCATION}
                    onChange={handleInputChange}
                    required={!selectedItem}
                  />
                </div>

                <div className="form-group1">
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

                <div className="form-group1">
                  <label htmlFor="owner">Owner Name</label>
                  <input
                    type="text"
                    id="owner"
                    name="OWNER"
                    maxLength="50"
                    placeholder="May skip if owner is not yet identified"
                    value={itemData.OWNER}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group1">
                  <label htmlFor="ownerCollege">Owner College</label>
                  <select
                    id="ownerCollege"
                    name="OWNER_COLLEGE"
                    value={itemData.OWNER_COLLEGE}
                    onChange={handleInputChange}
                  >
                    <option value="COE">COE</option>
                    <option value="CCS">CCS</option>
                  </select>
                </div>

                <div className="form-group1">
                  <label htmlFor="ownerContact">Owner Contact</label>
                  <input
                    type="text"
                    id="ownerContact"
                    name="OWNER_CONTACT"
                    maxLength="50"
                    placeholder="May skip if owner is not yet identified"
                    value={itemData.OWNER_CONTACT}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group1">
                  <label htmlFor="ownerImage">Owner Image</label>
                  <input
                    type="text"
                    id="ownerImage"
                    name="OWNER_IMAGE"
                    maxLength="50"
                    placeholder="May skip if owner is not yet identified"
                    value={itemData.OWNER_IMAGE}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group1">
                  <label htmlFor="dateClaimed">Date Claimed</label>
                  <input
                      type="date"
                    id="dateClaimed"
                    name="DATE_CLAIMED"
                    maxLength="50"
                    placeholder="May skip if owner is not yet identified"
                    value={itemData.DATE_CLAIMED}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group1">
                  <label htmlFor="ownerImage">Time Claimed</label>
                  <input
                    type="time"
                    id="timeClaimed"
                    name="TIME_CLAIMED"
                    maxLength="50"
                    placeholder="May skip if owner is not yet identified"
                    value={itemData.TIME_CLAIMED}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group1">
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

                {/* Buttons inside the form */}
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
                        setShowModal(false);
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


              {/* Camera Section on the Right */}
              <div className="camera-section">
                <video ref={videoRef} width="320" height="240" autoPlay />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div className="camera-buttons">
                  <button type="button" onClick={captureImage}>Capture Image</button>
                </div>
                {/* Show the saved image only when updating an existing item */}
                {selectedItem && itemData.IMAGE_URL && !image && (
                  <img src={itemData.IMAGE_URL} alt="Saved" className="captured-image" />
                )}

                {/* Show the captured image if available */}
                {image && (
                  <img src={image} alt="Captured" className="captured-image" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Additem;
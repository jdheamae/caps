import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBullhorn, FaQrcode, FaFileAlt, FaUserCheck, FaUser } from 'react-icons/fa'; // Import icons
import '../style/home.css'; // Import custom CSS for styling

function Home() {
  return (
    <div className="home-container">
      <div className="sidebar">
        <img src="log.png" alt="FIRI" className="logo" />
        <nav className='nav-menu'> 
          <Link to="/">
            <FaHome className="nav-icon" /> Home
          </Link>
          <Link to="/mana">
            <FaBullhorn className="nav-icon" /> Manage Bulletin
          </Link>
          <Link to="/">
            <FaQrcode className="nav-icon" /> Scan Item
          </Link>
          <Link to="/">
            <FaFileAlt className="nav-icon" /> Report Lost Item
          </Link>
          <Link to="/manaReq">
            <FaUserCheck className="nav-icon" /> Manage Request
          </Link>
          <Link to="/">
            <FaUser className="nav-icon" /> Profile
          </Link>
        </nav>
      </div>
      
      {/* Fixed Header */}
      <header className="header">
        <h2>FIRI</h2>
      </header>
      
      <div className="main-content">
        <div className="cont">
          <h1>Find It</h1>
          <h1>Retrieve It</h1>
          <p>
            Step into a world where the art of Interior Design is meticulously crafted to bring together timeless elegance and cutting-edge modern innovation. Allowing you to transform your living spaces into the epitome of luxury and sophistication.
          </p>
          <button className="get-qr-button">Get QR Code Now</button>
        </div>
        
        <div className="statistics">
          <div className="stat-item">
            <h2>400+</h2>
            <p>Found Items</p>
          </div>
          <div className="stat-item">
            <h2>600+</h2>
            <p>Retrieve Items</p>
          </div>
          <div className="stat-item">
            <h2>100+</h2>
            <p>Missing Items</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

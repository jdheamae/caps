import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from "react-router-dom"; // Use NavLink for active class
import { FaHome, FaBullhorn, FaQrcode, FaFileAlt, FaUserCheck, FaUser } from 'react-icons/fa'; // Import icons
import '../style/home.css'; // Import custom CSS for styling
import Sidebar from "./sidebar";

function Home() {
  
  return (
          <div className="home-container">
              <Sidebar />
              {/* Fixed Header */}
              <header className="header">
                <h2>FIRI LOGO</h2>
              </header>

              <div className="main-content">
                {/* Content Section */}
                <div className="cont">
                  <h1>Find It, <br /> Retrieve It!</h1>
                  <p>
                    Step into a world where the art of Interior Design is meticulously crafted to bring together timeless elegance and cutting-edge modern innovation. Allowing you to transform your living spaces into the epitome of luxury and sophistication.
                  </p>
                  <NavLink to="/mana">
                    <button className="get-qr-button">File Report Now</button>
                  </NavLink>
                  <div className='divider'></div>
                  <NavLink to="/mana">
                    <button className="get-qr-button">Add Item Now</button>
                  </NavLink>
                </div>

                {/* Statistics Section - Ensure it's properly aligned */}
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
              
                {/* Services Section */}
                <div className="services-section">
                  <h2 className="services1">Our Services</h2>
                  <div className="services-grid">
                    <div className="service-card">
                      <h3>Personal Loan</h3>
                      <p>Personal loans provide borrowers with flexibility in how they use the funds...</p>
                    </div>
                    <div className="service-card">
                      <h3>Educational Loan</h3>
                      <p>Educational Loan Services provide financial assistance to students for various purposes...</p>
                    </div>
                    <div className="service-card">
                      <h3>Pensioner Loan</h3>
                      <p>Pensioner Loan Services provide financing options for older adults...</p>
                    </div>
                  </div>
                </div>
            </div>

  );
}

export default Home;


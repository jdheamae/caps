import React from 'react';
import Sidebar from './sidebar'; // Assuming you have a Sidebar component
import '../style/prof.css'; // Create a new CSS file for specific profile styles

function Profile() {
  return (
    <div className="home-container1">
      <Sidebar />

      {/* Fixed Header */}
      <header className="header">
        <h2>FIRI LOGO</h2>
      </header>

      {/* Profile Content */}
      <div className="profile-container">
        {/* Profile Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar">

          <div className="una">
        <h2>Profile</h2>
      </div>

            <img
              src="prof.jpg" // Replace with dynamic user avatar if available
              alt="Profile Avatar"
              className="avatar-image"
            />
            <h3>Admin Admin</h3>
            <button className="change-avatar-button">Change Avatar</button>
            <p>No file chosen</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="profile-form">
          <h3>Profile Update </h3>
          <form>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" defaultValue="Admin" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" defaultValue="Admin" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" defaultValue="admin@admin.com" />
            </div>
            <br></br>
            <br></br>
                        <br></br>
            <br></br>
            <h3>Change Password</h3>
            <div className="form-group">
              <label>Password (Leave blank to keep current password)</label>
              <input type="password" placeholder="New Password" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm New Password" />
            </div>
            <button type="submit" className="save-button">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;

import React, { useState } from 'react';
import Sidebar from './sidebar'; // Assuming you have a Sidebar component
import '../style/prof.css'; // Ensure this CSS file exists


function Profile() {
  const [image, setImage] = useState("prof.jpg"); // Default avatar
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImage(URL.createObjectURL(file)); // Preview image
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const response = await fetch("http://10.10.83.224:5000/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Avatar uploaded successfully!");
      } else {
        alert(result.message || "Error uploading avatar.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading.");
    }
  };

  return (
    <div className="home-container1">
      <Sidebar />
    
      {/* Profile Content */}
      <div className="profile-container">
        {/* Profile Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="una">
              <h2>Profile</h2>
            </div>
            <img src={image} alt="Profile Avatar" className="avatar-image" />
            <h3>Admin Admin</h3>

            <input 
              type="file" 
              accept="image/*" 
              id="fileInput" 
              style={{ display: "none" }} 
              onChange={handleImageChange} 
            />

            <button className="change-avatar-button" onClick={() => document.getElementById("fileInput").click()}>
              Choose Avatar
            </button>

            <p>{selectedFile ? selectedFile.name : "No file chosen"}</p>

            <button className="upload-avatar-button" onClick={handleUpload}>
              Upload Avatar
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="profile-form"> 
          <div className="profcont"> 
            <h3>Profile Update</h3>
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

              <br /><br /><br /><br />

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
    </div>
  );
}

export default Profile;

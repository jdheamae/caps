import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { FaBox, FaCheck, FaFileAlt, FaUserCheck } from "react-icons/fa";
import "../style/dash.css";
import Sidebar from "./sidebar";
import Header from "./header";
import axios from 'axios';

function Dashboard() {
  const [listedFoundItems, setListedFoundItems] = useState(0);
  const [totalClaims, setTotalClaims] = useState(0);
  const [totalClaimFound,setComplaintsFound] =useState(0);
  const [totalFound,setTotalFound] =useState(0);
  const [totalLostReports, setTotalLostReports] = useState(0);
  const [totalRetrievalRequests, setTotalRetrievalRequests] = useState(0);
  const [lostData, setLostData] = useState([]);
  const [totalItems, setTotalItems] = useState(0); // Store total count
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const itemsResponse = await axios.get('http://10.10.83.224:5000/items');
      const lostResponse = await axios.get("http://10.10.83.224:5000/complaints");
      const claimsResponse = await axios.get('http://10.10.83.224:5000/items');
      const retrievalResponse = await axios.get('http://10.10.83.224:5000/retrieval-requests');

      const foundItems = itemsResponse.data.length;
      const lostComplaints = lostResponse.data.filter(complaint => complaint.status === "found").length;

      setListedFoundItems(foundItems);
      setComplaintsFound(lostComplaints);

      // Ensure the total is updated after both states are set
      setTotalItems(foundItems + lostComplaints);

      setTotalClaims(claimsResponse.data.filter(item => item.STATUS === "Claimed").length);
      setTotalLostReports(lostResponse.data.filter(complaint => complaint.status === "not-found").length);
      setTotalRetrievalRequests(retrievalResponse.data.filter(request => request.status === "pending").length);

     
      console.log("Lost Response Data:", itemsResponse.data); // Debugging API response

      // Define valid general locations
      const validLocations = [
        "Gym", "Unknown Location", "Institute Area", "COET Area", "Pedestrian & Traffic Zones", 
        "CSM Area", "IDS Area", "Admission & Admin Offices", "CCS Area", "Food Court Area", 
        "ATM & Banking Area", "Restrooms(CRs)", "CASS Area", "CEBA Area"
      ];

      // Initialize counts for each location
      const locationCounts = validLocations.reduce((acc, loc) => {
        acc[loc] = 0;  // Ensure every location starts with count 0
        return acc;
      }, {});

      // Count occurrences, only for valid locations
      itemsResponse.data.forEach(item => {
        let location = item.GENERAL_LOCATION ? item.GENERAL_LOCATION.trim() : "Unknown Location";
        if (validLocations.includes(location)) {
          locationCounts[location]++;
        } else {
          locationCounts["Unknown Location"]++; // Group all other locations under "Unknown Location"
        }
      });
      console.log("Raw Lost Response Data:",itemsResponse.data);

      console.log("Processed Locations:", locationCounts); // Debugging

      // Convert counts into array format for PieChart
      const lostDataArray = Object.keys(locationCounts).map(location => ({
        name: location,
        value: locationCounts[location]
      }));

      setLostData(lostDataArray);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Pie Chart Colors
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#FF6384", "#36A2EB",
    "#FFCE56", "#4BC0C0", "#9966FF", "#C9CBCF", "#E7E9ED", "#9B59B6", "#D35400"
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Header />

      <div className="name">
        <div className="dah">
          <h2>Dashboard</h2>
        </div>

        <div className="dashboard-cards">
          {/* Listed Found Items */}
          <div className="dashboard-card">
            <div className="card-icon">
              <FaBox />
            </div>
            <div className="card-details">
              <h2>{totalItems}</h2>
              <p>Listed Found Items</p>
            </div>
          </div>

          {/* Total Claims */}
          <div className="dashboard-card">
            <div className="card-icon">
              <FaCheck />
            </div>
            <div className="card-details">
              <h2>{totalClaims}</h2>
              <p>Total Claims</p>
            </div>
          </div>

          {/* Total Lost Reports */}
          <div className="dashboard-card">
            <div className="card-icon">
              <FaFileAlt />
            </div>
            <div className="card-details">
              <h2>{totalLostReports}</h2>
              <p>Total Lost Reports</p>
            </div>
          </div>

          {/* Total Retrieval Requests */}
          <div className="dashboard-card">
            <div className="card-icon">
              <FaUserCheck />
            </div>
            <div className="card-details">
              <h2>{totalRetrievalRequests}</h2>
              <p>Total Retrieval Requests</p>
            </div>
          </div>
        </div>

        {/* Pie Chart for Lost Items by Location */}
        <div className="chart-container"  style={{
    textAlign: "center",
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto"
  }}>
          <h3>Lost Items Distribution by Location</h3>
          <Legend></Legend>
          <PieChart width={400} height={300}>
            <Pie 
              data={lostData} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={120} 
              fill="#8884d8"
              label
            >
              {lostData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          <Tooltip></Tooltip>
        
           {/* <Legend></Legend> */}
          
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

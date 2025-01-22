const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./src/models/User");
const Item = require('./src/models/Item'); // Import the Item model
const jwt = require('jsonwebtoken');
const Complaint = require('./src/models/Complaint'); // Import the Complaint model

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose
.connect('mongodb+srv://quasi452:1412@cluster0.tv4qs.mongodb.net/firi?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
  console.log('Connected to MongoDB!');
})
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));
// Routes

const SECRET_KEY = "polgary";

app.post("/signup", async (req, res) => {
    const { name, email, password,usertype } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword ,usertype: "student"});
  
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error saving user to MongoDB:", error);
      res.status(500).json({ error: "Error registering user" });
    }
  });
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validate user credentials (replace with your logic)
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  
    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: '1h', // Token expiration time
    });
  
    res.json({ token });
  });
app.post("/register", async (req, res) => {
    const { name, email, contact, college, id } = req.body;
  
    try {
      const newItem = new Item({ name, email, contact, college, id });
      await newItem.save();
      res.status(201).json({ message: "Item saved successfully" });
    } catch (error) {
      console.error("Error saving item to MongoDB:", error);
      res.status(500).json({ message: "Error saving item" });
    }
  });
// Route to file a complaint
app.post("/complaints", async (req, res) => {
  const { complainer, itemname, type, contact, date, location, time,description } = req.body;

  try {
    const newComplaint = new Complaint({
      complainer,
      itemname,
      type,
      contact,
      date,
      location,
      time,
      status: "Not Found",
      finder: "N/A",
      description,
    });

    await newComplaint.save();
    res.status(201).json({ message: "Complaint filed successfully" });
  } catch (error) {
    console.error("Error saving complaint to MongoDB:", error);
    res.status(500).json({ error: "Error filing complaint" });
  }
});
// Route to get all complaints
app.get("/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to update a complaint
app.put("/complaints/:id", async (req, res) => {
  const { id } = req.params;
  const { complainer, itemname, type, contact, date, location, time, status, finder ,description} = req.body;

  try {
    // Find the complaint by ID
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update the complaint's fields with the new data if provided
    complaint.complainer = complainer || complaint.complainer;
    complaint.itemname = itemname || complaint.itemname;
    complaint.type = type || complaint.type;
    complaint.contact = contact || complaint.contact;
    complaint.date = date || complaint.date;
    complaint.location = location || complaint.location;
    complaint.time = time || complaint.time;
    complaint.status = status || complaint.status;
    complaint.finder = finder || complaint.finder;
    complaint.description=description||complaint.description;

    // Save the updated complaint
    await complaint.save();

    // Return a response with the updated complaint
    res.json({ message: "Complaint updated successfully", complaint });
  } catch (error) {
    // Handle any errors during the update process
    res.status(500).json({ message: error.message });
  }
});


// Route to delete a complaint
app.delete("/complaints/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    await complaint.remove();
    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/items', async (req, res) => {
  const { ITEM, DESCRIPTION, DATE_FOUND, TIME_RETURNED, FINDER, CONTACT_OF_THE_FINDER, FOUND_LOCATION, OWNER, DATE_CLAIMED, STATUS } = req.body;

  try {
    
    // Create a new Item object
    const newItem = new Item({
      ITEM,
      DESCRIPTION,
      DATE_FOUND,
      TIME_RETURNED, // Store the complete Date object
      FINDER,
      CONTACT_OF_THE_FINDER,
      FOUND_LOCATION,
      OWNER,
      DATE_CLAIMED,
      STATUS,
    });

    // Save the new item to the database
    await newItem.save();

    // Respond with the created item
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    console.error('Error adding item to MongoDB:', error);
    res.status(500).json({ message: 'Error adding item', error });
  }
});

// Route to get all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items', error });
  }
});



//user side add complain
app.post("/usercomplaints", async (req, res) => {
  const { complainer, itemname, type, contact, date, location, time,description } = req.body;

  try {
    const newComplaint = new Complaint({
      complainer,
      itemname,
      type,
      contact,
      date,
      location,
      time,
      status: "Not Found",
      finder: "N/A",
      description,
    });

    await newComplaint.save();
    res.status(201).json({ message: "Complaint filed successfully" });
  } catch (error) {
    console.error("Error saving complaint to MongoDB:", error);
    res.status(500).json({ error: "Error filing complaint" });
  }
});
app.get("/usercomplaints:id", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

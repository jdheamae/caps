const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./src/models/User");
const Item = require('./src/models/Item'); // Import the Item model
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/firi", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

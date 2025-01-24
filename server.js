const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./src/models/User");
const Item = require('./src/models/Item'); // Import the Item model
const jwt = require('jsonwebtoken');
const Complaint = require('./src/models/Complaint'); // Import the Complaint model
const RetrievalRequestSchema =require('./src/models/RetrievalRequest');

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
//--------------------signing upppp----------------------------------------
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
  //----------------------------------login ----------------------------------------------------
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


  //idk what is this ahahahah-------------------------------------------
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


//-----------------------------------creating complaints------------------------------------------
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
// -----------------------------------------print complaints-----------------------------------------
app.get("/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ------------------------------------updating complaints------------------------------------------------------------
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


//-------------------deleting complaints----------------------------------------------

app.delete("/complaints/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the complaint by its ID
    const deletedComplaint = await Complaint.findByIdAndDelete(id);

    if (!deletedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({ message: "Complaint deleted successfully", deletedComplaint });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete complaint" });
  }
});

//------------------------------addding found items for admin database--------------------------------------------------
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

//---------------------------------------adding found items for user database to be able to display--------------------
app.post('/useritems', async (req, res) => {
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

//-----------------------------------printing found items for admin user----------------------------------
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items', error });
  }
});
//-----------------printing found items for student users------------------------------
app.get('/useritems', async (req, res) => {
  try {
    // Fetch items with status 'unclaimed'
    const items = await Item.find({
      STATUS: { $regex: 'unclaimed', $options: 'i' }  // Case-insensitive match for 'unclaimed'
    });
    console.log("Fetched Items:", items);  // Log the fetched items to the console

    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items', error });
  }
});

//-----------------------------updating found items for admin user------------------------------------
app.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// -----------------------------------deleting found items for admin user------------------------------------
app.delete('/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});


//--------------------adding complaints for student users-----------------------------------
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
//------------------------------updating complaints for student users-----------------------------------
app.put("/usercomplaints/:id", async (req, res) => {
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

//-----------------------printing complaints for student users------------------------------------------------------------------------
app.get("/usercomplaints:id", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//----------------------------------------------user requesting for retrieval------------------------------------------------------------------------------
app.post('/retrieval-request', async (req, res) => {
  const { name, description, contactNumber, id, itemId, userId } = req.body;

  try {
    // Create a new retrieval request with the userId included
    const newRequest = new RetrievalRequestSchema({
      name,
      description,
      contactNumber,
      id,

    });

    await newRequest.save();

    // Respond back with the saved request
    res.status(201).json({
      message: 'Retrieval request successfully saved.',
      request: newRequest,
    });
  } catch (error) {
    console.error('Error saving retrieval request:', error);
    res.status(500).json({ message: 'Failed to save request.' });
  }
});
//-----------------------------admin fetching the retrievals---------------------------------------------------------------------
app.get('/retrieval-requests', async (req, res) => {
  try {
    const requests = await RetrievalRequestSchema.find({}, 'name description contactNumber id'); // Only select these fields
    res.json({ requests });
  } catch (error) {
    console.error('Error fetching retrieval requests:', error);
    res.status(500).json({ message: 'Error fetching retrieval requests', error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`deyamemyidol}`);
});

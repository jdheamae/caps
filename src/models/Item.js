const mongoose = require('mongoose');

// Define the Item schema
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  // You can add more fields as necessary, for example:
 
});

// Create the Item model
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;

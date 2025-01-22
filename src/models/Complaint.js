const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  complainer: { type: String, required: true },
  itemname: { type: String, required: true },
  type: { type: String, required: true },
  contact: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: "Not Found" },
  finder: { type: String, default: "N/A" },
});

module.exports = mongoose.model("Complaint", complaintSchema);

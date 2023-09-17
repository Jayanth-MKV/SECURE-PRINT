const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  filename: { type: String, required: true },
});

const PDF = mongoose.model("PDF", pdfSchema);

module.exports = PDF;

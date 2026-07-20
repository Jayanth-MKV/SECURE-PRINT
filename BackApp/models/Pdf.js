const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  originalName: { type: String, required: true, maxlength: 255 },
  storageName: { type: String, required: true, unique: true, select: false },
  size: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'printing'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('PDF', pdfSchema);

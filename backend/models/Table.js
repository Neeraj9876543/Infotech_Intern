const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: [true, 'Table number is required'],
    unique: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  location: {
    type: String,
    trim: true,
    default: 'Main Hall'
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'maintenance'],
    default: 'available'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;

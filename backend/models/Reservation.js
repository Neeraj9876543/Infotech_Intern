const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: [true, 'Table is required']
  },
  reservationDate: {
    type: Date,
    required: [true, 'Reservation date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    enum: [
      '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM',
      '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
    ]
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'At least 1 guest is required']
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Index to prevent double booking
reservationSchema.index({ table: 1, reservationDate: 1, timeSlot: 1, status: 1 }, {
  partialFilterExpression: { status: { $in: ['confirmed'] } }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;

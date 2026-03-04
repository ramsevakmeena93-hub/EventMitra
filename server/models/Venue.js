const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  building: {
    type: String,
    required: false,
    enum: ['old', 'new', 'other']
  },
  room: {
    type: String,
    required: false
  },
  capacity: {
    type: Number,
    default: 50
  },
  facilities: [String],
  hodDepartment: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Venue', venueSchema);

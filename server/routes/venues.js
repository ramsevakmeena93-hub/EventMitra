const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');
const { auth, authorize } = require('../middleware/auth');

// Get all venues
router.get('/', auth, async (req, res) => {
  try {
    const venues = await Venue.find({ isActive: true }).sort({ name: 1 });
    console.log(`[Venues API] Returning ${venues.length} venues`);
    res.json(venues);
  } catch (error) {
    console.error('[Venues API] Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create venue (admin only)
router.post('/', auth, authorize('abc', 'superadmin'), async (req, res) => {
  try {
    const venue = new Venue(req.body);
    await venue.save();
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get venue by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

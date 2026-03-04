const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

// Get events for calendar
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, venueId } = req.query;

    let query = {
      status: { $in: ['pending_faculty', 'pending_hod', 'pending_abc', 'pending_superadmin', 'approved'] }
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (venueId) {
      query.venueId = venueId;
    }

    const events = await Event.find(query)
      .populate('studentId', 'name')
      .populate('venueId', 'name building room')
      .select('date time status venueId studentId reason')
      .sort({ date: 1, time: 1 });

    const formattedEvents = events.map(event => ({
      id: event._id,
      title: `${event.venueId.building} - ${event.venueId.room}`,
      start: event.date,
      time: event.time,
      status: event.status,
      venue: event.venueId,
      student: event.studentId,
      reason: event.reason,
      color: event.status === 'approved' ? 'green' : 'yellow'
    }));

    res.json(formattedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

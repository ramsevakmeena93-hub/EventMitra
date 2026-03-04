const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const Venue = require('../models/Venue');
const { auth } = require('../middleware/auth');

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = {};

    switch (req.user.role) {
      case 'student':
        stats.totalEvents = await Event.countDocuments({ studentId: req.userId });
        stats.approved = await Event.countDocuments({ studentId: req.userId, status: 'approved' });
        stats.pending = await Event.countDocuments({ 
          studentId: req.userId, 
          status: { $in: ['pending_faculty', 'pending_hod', 'pending_abc', 'pending_superadmin', 'modification_pending'] }
        });
        stats.rejected = await Event.countDocuments({ studentId: req.userId, status: 'rejected' });
        break;

      case 'faculty':
        stats.pendingApprovals = await Event.countDocuments({ 
          facultyId: req.userId, 
          status: 'pending_faculty' 
        });
        stats.approved = await Event.countDocuments({ 
          facultyId: req.userId, 
          status: { $in: ['pending_hod', 'pending_abc', 'pending_superadmin', 'approved'] }
        });
        stats.totalEvents = await Event.countDocuments({ facultyId: req.userId });
        break;

      case 'hod':
        stats.pendingApprovals = await Event.countDocuments({ 
          hodId: req.userId, 
          status: 'pending_hod' 
        });
        stats.approved = await Event.countDocuments({ 
          hodId: req.userId, 
          status: { $in: ['pending_abc', 'pending_superadmin', 'approved'] }
        });
        stats.totalEvents = await Event.countDocuments({ hodId: req.userId });
        break;

      case 'abc':
        stats.pendingApprovals = await Event.countDocuments({ status: 'pending_abc' });
        stats.pendingModifications = await Event.countDocuments({ status: 'modification_pending' });
        stats.approved = await Event.countDocuments({ 
          abcId: req.userId,
          status: { $in: ['pending_superadmin', 'approved'] }
        });
        stats.totalEvents = await Event.countDocuments({ abcId: req.userId });
        break;

      case 'superadmin':
        stats.pendingApprovals = await Event.countDocuments({ 
          superAdminId: req.userId, 
          status: 'pending_superadmin' 
        });
        stats.approved = await Event.countDocuments({ 
          superAdminId: req.userId, 
          status: 'approved' 
        });
        stats.totalEvents = await Event.countDocuments({ superAdminId: req.userId });
        stats.totalUsers = await User.countDocuments({ isActive: true });
        stats.totalVenues = await Venue.countDocuments({ isActive: true });
        break;
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

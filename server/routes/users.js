const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Get faculty list
router.get('/faculty', auth, async (req, res) => {
  try {
    const faculty = await User.find({ 
      role: 'faculty', 
      isActive: true 
    }).select('name email department');
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get students list
router.get('/students', auth, async (req, res) => {
  try {
    const students = await User.find({ 
      role: 'student', 
      isActive: true 
    }).select('name email branch enrollmentNo');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get HODs list
router.get('/hods', auth, async (req, res) => {
  try {
    const hods = await User.find({ 
      role: 'hod', 
      isActive: true 
    }).select('name email department');
    res.json(hods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get ABC list
router.get('/abc', auth, async (req, res) => {
  try {
    const abc = await User.find({ 
      role: 'abc', 
      isActive: true 
    }).select('name email');
    res.json(abc);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Super Admins list
router.get('/superadmins', auth, async (req, res) => {
  try {
    const superadmins = await User.find({ 
      role: 'superadmin', 
      isActive: true 
    }).select('name email');
    res.json(superadmins);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get HOD by department
router.get('/hod/:department', auth, async (req, res) => {
  try {
    const hod = await User.findOne({ 
      role: 'hod', 
      department: req.params.department,
      isActive: true 
    }).select('name email department');
    
    if (!hod) {
      return res.status(404).json({ message: 'HOD not found for this department' });
    }
    
    res.json(hod);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user's club
router.get('/my-club', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('clubId');
    
    if (!user || !user.clubId) {
      return res.json({ club: null });
    }
    
    res.json({ club: user.clubId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

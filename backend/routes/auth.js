const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('../config/firebase');
const FirebaseUserModel = require('../models/FirebaseUser');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, dateOfBirth, education, experience } = req.body;

    if (!email || !password || !firstName) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await FirebaseUserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create user with Firebase
    const user = await FirebaseUserModel.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      education,
      experience
    });

    // Generate JWT token
    const token = jwt.sign(
      { uid: user.uid, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Verify with Firebase
    let firebaseUser;
    try {
      firebaseUser = await auth.getUserByEmail(email);
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Get user profile
    const userProfile = await FirebaseUserModel.findById(firebaseUser.uid);
    if (!userProfile) {
      return res.status(401).json({ success: false, message: 'User profile not found' });
    }

    // Update last login
    await FirebaseUserModel.update(firebaseUser.uid, {
      lastLogin: new Date().toISOString()
    });

    // Generate JWT token
    const token = jwt.sign(
      { uid: firebaseUser.uid, email: firebaseUser.email, isAdmin: userProfile.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: userProfile.firstName,
        isAdmin: userProfile.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// Get Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await FirebaseUserModel.findById(req.user.uid);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Update Profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, state, zipCode, education, experience, profileData } = req.body;
    
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    if (city) updates.city = city;
    if (state) updates.state = state;
    if (zipCode) updates.zipCode = zipCode;
    if (education) updates.education = education;
    if (experience) updates.experience = experience;
    if (profileData) updates.profileData = profileData;

    const user = await FirebaseUserModel.update(req.user.uid, updates);
    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

module.exports = router;

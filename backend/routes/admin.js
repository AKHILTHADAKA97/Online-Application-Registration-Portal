const express = require('express');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (status) {
      query.profileStatus = status;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password')
      .sort({ registeredDate: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalUsers: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get user details
router.get('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update user status (Admin only)
router.put('/users/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { profileStatus: status }, { new: true });
    res.json({ message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ profileStatus: 'active' });
    const inactiveUsers = await User.countDocuments({ profileStatus: 'inactive' });
    const suspendedUsers = await User.countDocuments({ profileStatus: 'suspended' });
    
    const usersWithApplications = await User.countDocuments({ 'applications.0': { $exists: true } });
    
    const applications = await User.aggregate([
      { $unwind: '$applications' },
      { $group: { _id: '$applications.status', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      usersWithApplications,
      applications
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// Export user data as CSV
router.get('/export/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    let csv = 'First Name,Last Name,Email,Phone,City,State,Education,Experience,Status,Registered Date\n';
    
    users.forEach(user => {
      csv += `"${user.firstName}","${user.lastName}","${user.email}","${user.phone}","${user.city}","${user.state}","${user.education}",${user.experience},"${user.profileStatus}","${user.registeredDate.toLocaleDateString()}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting data', error: error.message });
  }
});

module.exports = router;

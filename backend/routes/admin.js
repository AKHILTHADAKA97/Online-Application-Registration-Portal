const express = require('express');
const FirebaseUserModel = require('../models/FirebaseUser');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let result;
    if (search) {
      result = await FirebaseUserModel.search(search, limit, offset);
    } else if (status) {
      result = await FirebaseUserModel.filterByStatus(status, limit, offset);
    } else {
      result = await FirebaseUserModel.getAll(limit, offset);
    }

    res.json({
      users: result.users,
      totalPages: result.hasMore ? page + 1 : page,
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
});

// Get user details
router.get('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await FirebaseUserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
  }
});

// Update user status (Admin only)
router.put('/users/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await FirebaseUserModel.update(req.params.id, { profileStatus: status });
    res.json({ success: true, message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user status', error: error.message });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await FirebaseUserModel.delete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const stats = await FirebaseUserModel.getStats();
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching statistics', error: error.message });
  }
});

// Export user data as CSV
router.get('/export/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await FirebaseUserModel.getAll(1000, 0); // Get all users
    const users = result.users;
    
    let csv = 'First Name,Last Name,Email,Phone,City,State,Education,Experience,Status,Registered Date\n';
    
    users.forEach(user => {
      const regDate = new Date(user.registeredDate).toLocaleDateString();
      csv += `"${user.firstName}","${user.lastName}","${user.email}","${user.phone}","${user.city}","${user.state}","${user.education}",${user.experience},"${user.profileStatus}","${regDate}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error exporting data', error: error.message });
  }
});

module.exports = router;

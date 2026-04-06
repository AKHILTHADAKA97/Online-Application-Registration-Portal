const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize Firebase
const firebase = require('./config/firebase');
const { useEmulator } = firebase;

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log Firebase status
if (useEmulator) {
  console.log('✅ Firebase Emulator Mode - Using local emulation');
} else {
  console.log('✅ Firebase Production Mode - Using real Firebase');
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    message: 'Server is running', 
    database: useEmulator ? 'Firebase Emulator' : 'Firebase Production',
    timestamp: new Date() 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`✅ Backend Ready - Visit http://localhost:${PORT}/health`);
});

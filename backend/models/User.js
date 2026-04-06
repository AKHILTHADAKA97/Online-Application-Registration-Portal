const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    default: 0
  },
  profileData: {
    bio: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    certifications: {
      type: [String],
      default: []
    },
    portfolio: {
      type: String,
      default: ''
    },
    preferredJobTitle: {
      type: String,
      default: ''
    },
    preferredLocation: {
      type: String,
      default: ''
    },
    salaryExpectation: {
      type: String,
      default: ''
    },
    profilePicture: {
      type: String,
      default: null
    }
  },
  applications: [
    {
      position: String,
      company: String,
      status: {
        type: String,
        enum: ['pending', 'interview', 'accepted', 'rejected'],
        default: 'pending'
      },
      appliedDate: Date
    }
  ],
  registeredDate: {
    type: Date,
    default: Date.now
  },
  profileStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);

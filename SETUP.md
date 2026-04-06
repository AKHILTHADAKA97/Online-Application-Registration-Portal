# Online Application Registration Portal - Setup Guide

## Project Overview
This is a full-stack application for managing online job application registrations with smart password generation and an admin dashboard.

**Features:**
- User registration with smart password generation
- Email as username system
- Auto-profile creation
- Multi-tab user dashboard
- Admin dashboard with user management
- MongoDB database integration
- JWT authentication

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher) - can be local or cloud-hosted

## Project Structure
```
Online-Application-Registration-Portal/
├── src/                          # Frontend (React)
│   ├── pages/
│   │   ├── Home.js              # Landing page
│   │   ├── Register.js          # User registration
│   │   ├── Dashboard.js         # User dashboard
│   │   └── AdminDashboard.js    # Admin panel
│   ├── components/
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── services/
│   │   └── apiService.js        # API client
│   └── App.js                   # Main app
├── backend/                      # Node.js/Express server
│   ├── server.js                # Express setup
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   └── admin.js             # Admin endpoints
│   ├── models/
│   │   └── User.js              # MongoDB schema
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── package.json
│   └── .env                     # Environment variables
├── .env                         # Frontend env config
└── package.json
```

## Setup Instructions

### 1. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition (if not already installed)
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install -y mongodb
# Windows: Download from https://www.mongodb.com/try/download/community

# Start MongoDB
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free tier cluster
3. Get your connection string
4. Update `backend/.env` with your connection string

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MongoDB URI and other settings
# MONGODB_URI=mongodb://localhost:27017/registration-portal
# JWT_SECRET=your-secret-key-here
# ADMIN_EMAIL=admin@example.com
# ADMIN_PASSWORD=admin123

# Start the backend server (development mode with hot-reload)
npm run dev
# or for production
npm start
```

The backend will run on **http://localhost:5000**

### 3. Frontend Setup

```bash
# Navigate to root directory (if not there)
cd ..

# Install dependencies
npm install

# The .env file should already have:
# REACT_APP_API_URL=http://localhost:5000/api

# Start the frontend development server
npm start
```

The frontend will run on **http://localhost:3000**

## Running the Application

### Development Mode (with hot-reload)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
npm start
```

Then open your browser to **http://localhost:3000**

### Production Mode

**Build Frontend:**
```bash
npm run build
```

**Start Backend:**
```bash
cd backend
npm start
```

## First-Time Setup: Creating Admin User

The admin user can be created by registering with the email specified in your `backend/.env` file:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

Then:
1. Visit http://localhost:3000/register
2. Register with the admin email
3. The user will automatically get admin privileges

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT token)
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Admin Routes (requires isAdmin: true)
- `GET /api/admin/users` - List all users with pagination
- `GET /api/admin/users/:id` - Get specific user details
- `PUT /api/admin/users/:id/status` - Update user status (active/inactive/suspended)
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/export/users` - Export users as CSV

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Server returns a JWT token valid for 7 days
3. Token is stored in localStorage as `authToken`
4. For authenticated requests, include header: `Authorization: Bearer <token>`
5. AdminDashboard requires user to have `isAdmin: true`

## User Data Structure

Each user document in MongoDB contains:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "dateOfBirth": "1990-01-15",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "education": "Bachelor's Degree",
  "experience": 5,
  "profileStatus": "active",
  "isAdmin": false,
  "profileData": {
    "bio": "Professional summary...",
    "skills": ["JavaScript", "React", "Node.js"],
    "certifications": ["AWS Certified"],
    "portfolioUrl": "https://portfolio.com"
  },
  "applications": [
    {
      "position": "Senior Developer",
      "company": "Tech Corp",
      "status": "interview",
      "appliedDate": "2024-01-15"
    }
  ]
}
```

## Features

### User Registration
- Email as username
- Smart password generation from personal details (name + DOB + phone)
- "Generate New" button for password variants
- Form validation
- Auto-profile creation

### User Dashboard
- **Profile Tab**: Edit personal info, manage skills, view bio
- **Applications Tab**: Track job applications with status updates
- **Recommendations Tab**: Personalized job suggestions
- **Settings Tab**: Notification preferences, password change, account deletion

### Admin Dashboard
- **Dashboard Tab**: Real-time statistics and user analytics
- **Users Tab**: Search, filter, and manage all users
  - View detailed user profiles
  - Change user status (active/inactive/suspended)
  - Delete users
  - Export all users as CSV
- **Reports Tab**: (Coming soon) Advanced analytics

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running:
```bash
# macOS
brew services start mongodb-community

# Ubuntu
sudo service mongod start

# Windows
net start MongoDB
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Make sure backend is running and `REACT_APP_API_URL` in `.env` matches your backend URL.

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution:** Kill the process using the port or change the port:
```bash
# Change port in frontend
PORT=3001 npm start

# For backend, update .env
PORT=5001
```

### JWT Token Expired
**Solution:** The app will automatically log out the user. They need to log in again. Error will show in browser console.

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```
MONGODB_URI=mongodb://localhost:27017/registration-portal
PORT=5000
JWT_SECRET=your-secret-key-here (change this in production)
NODE_ENV=development
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## Development Tips

1. **Hot Reload:** Both frontend and backend use hot-reload in dev mode
2. **API Testing:** Use Postman or curl to test backend endpoints
3. **Browser DevTools:** Use React DevTools to inspect component state
4. **MongoDB Compass:** Use MongoDB Compass GUI for database exploration
5. **Logs:** Check terminal for detailed error messages

## Deployment

### Frontend Deployment (Vercel, Netlify, etc.)
```bash
npm run build
# Deploy the 'build' folder
```

### Backend Deployment (Heroku, AWS, DigitalOcean, etc.)
1. Set up environment variables on hosting platform
2. Push the `backend` folder
3. Make sure MongoDB is accessible from your hosting

## License
This project is open source and available under the MIT License.

## Support
For issues or questions, please check the console logs and error messages carefully. They usually indicate what went wrong.

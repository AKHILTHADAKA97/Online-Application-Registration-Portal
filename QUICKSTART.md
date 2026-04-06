# 🚀 Quick Start Guide

## 1️⃣ Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your MongoDB URI
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/registration-portal
PORT=5000
JWT_SECRET=your-secret-key-12345
NODE_ENV=development
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
EOF

# Start backend server (this will run on port 5000)
npm run dev
```

**In Terminal 1, you should see:**
```
✅ Server running on port 5000
✅ MongoDB connected successfully
```

## 2️⃣ Setup Frontend (in a NEW terminal)

```bash
# Make sure you're in the project root directory
cd Online-Application-Registration-Portal  # (if not already there)

# Install dependencies (if not already done)
npm install

# Start frontend (this will run on port 3000)
npm start
```

**In Terminal 2, you should see:**
```
✅ Compiled successfully!
✅ Local: http://localhost:3000
```

## 3️⃣ Test the Application

1. **Open Browser:** http://localhost:3000

2. **Create User Account:**
   - Click "Register" button
   - Fill in your details
   - For testing admin, use `admin@example.com` (from ADMIN_EMAIL in .env)
   - Click "Register"

3. **Access Admin Dashboard:**
   - After registration, you'll see "🔧 Admin" button in header (if admin user)
   - Click "🔧 Admin" to access the admin dashboard
   - View statistics, manage users, filter by status, export data

4. **Test Features:**
   - View user statistics
   - Search for users
   - Filter by status (Active/Inactive/Suspended)
   - Click "View" on a user to see full details
   - Change user status or delete user
   - Export users as CSV

## 📋 What You Get

### Frontend Features
- ✅ Registration with smart password generation
- ✅ User dashboard with 4 tabs
- ✅ Responsive design for mobile/tablet/desktop
- ✅ Admin dashboard with full user management
- ✅ CSV export functionality

### Backend API
- ✅ User authentication (register/login)
- ✅ JWT token-based security
- ✅ Admin-only routes with role checking
- ✅ MongoDB persistence
- ✅ Pagination, search, and filtering
- ✅ Comprehensive error handling

## 🔧 MongoDB Setup (if not already installed)

### Option A: Local MongoDB
```bash
# macOS (using Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install -y mongodb
sudo service mongod start

# Windows (if using WSL)
sudo apt-get install -y mongodb
sudo service mongod start
```

### Option B: MongoDB Atlas (Cloud - Recommended for Testing)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get connection string like: `mongodb+srv://user:password@cluster.mongodb.net/registration-portal`
4. Update `backend/.env` with this connection string

## 📱 Available Routes

### Frontend Routes
- `/` - Home page
- `/register` - User registration
- `/dashboard` - User dashboard (requires login)
- `/admin` - Admin dashboard (requires admin user)

### Backend API Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/status` - Change user status
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/export/users` - Export as CSV

## 🆘 Troubleshooting

### "Cannot connect to MongoDB"
- Make sure MongoDB is running: `brew services list` (macOS) or `sudo service mongod status` (Ubuntu)
- Check MONGODB_URI in `backend/.env` is correct
- If using Atlas, ensure IP whitelist includes your IP or use 0.0.0.0/0

### "CORS error" or "API unreachable"
- Check backend is running on port 5000
- Verify `REACT_APP_API_URL=http://localhost:5000/api` in root `.env`
- Check no firewall blocking port 5000

### "Admin button not showing"
- You need to register with the ADMIN_EMAIL from your `.env` file
- Check browser console for errors
- Restart frontend with `npm start`

### Port already in use
```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9
```

## 📝 Next Steps

1. Create your first user account
2. Access admin dashboard (if using admin email)
3. Add some test users and applications
4. Try filtering, searching, and exporting
5. Review `SETUP.md` for advanced configuration

## 🎉 You're All Set!

The full-stack application is now running with:
- React frontend with smart password generation
- Express backend with MongoDB
- JWT authentication
- Admin dashboard with user management
- CSV export functionality

Happy testing! 🚀

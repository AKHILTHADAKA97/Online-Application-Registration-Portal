# 📋 Online Application Registration Portal

A complete full-stack web application for managing online job application registrations with smart password generation, user profile management, and an advanced admin dashboard.

## 🌟 Project Highlights

**Complete Full-Stack Implementation:**
- ✅ React frontend with responsive design
- ✅ Express.js backend with RESTful API
- ✅ MongoDB database integration
- ✅ JWT authentication & authorization
- ✅ Admin dashboard with user management
- ✅ Smart password generation
- ✅ Email as username system
- ✅ CSV export functionality

## 📸 Features

### 👤 User Features
- ✅ Registration with smart password generation (name + DOB + phone)
- ✅ Email-based username system
- ✅ Automatic profile creation upon registration
- ✅ Multi-section dashboard:
  - **Profile Tab:** Edit personal info, manage skills, upload bio
  - **Applications Tab:** Track job applications with status updates
  - **Recommendations Tab:** Personalized job suggestions
  - **Settings Tab:** Preferences, password, account management
- ✅ Real-time application status tracking
- ✅ Skills management (add/remove tags)
- ✅ Responsive design (mobile, tablet, desktop)

### 🔧 Admin Features
- ✅ Complete user management dashboard
- ✅ User list with pagination (10 per page)
- ✅ Search users by name or email
- ✅ Filter users by status (Active, Inactive, Suspended)
- ✅ View detailed user profiles in modal
- ✅ Change user account status
- ✅ Delete user accounts
- ✅ Dashboard statistics:
  - Total user count
  - Status breakdown (active/inactive/suspended)
  - Application distribution by status
  - Advanced analytics
- ✅ CSV export of all users
- ✅ Analytics and reports section

### 🔐 Security
- ✅ JWT token-based authentication (7-day expiration)
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Role-based access control (user/admin)
- ✅ CORS protection
- ✅ Input validation on backend
- ✅ Protected API endpoints

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18.2.0
- **Routing:** React Router DOM 6.14.0
- **Styling:** CSS3 with responsive design
- **HTTP:** Native Fetch API
- **State Management:** React Hooks
- **Storage:** localStorage for auth persistence

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB 7.0.0
- **ODM:** Mongoose 7.0.0
- **Authentication:** JWT (jsonwebtoken 9.0.0)
- **Security:** bcryptjs 2.4.3
- **CORS:** Enabled for cross-origin requests

### Database
- **Type:** MongoDB (NoSQL)
- **Schema:** Mongoose with validation
- **Hosting:** Local or MongoDB Atlas (cloud)

## 📁 Project Structure

```
Online-Application-Registration-Portal/
├── src/                                    # Frontend (React)
│   ├── pages/
│   │   ├── Home.js                        # Landing page
│   │   ├── Register.js                    # User registration
│   │   ├── Dashboard.js                   # User dashboard (4 tabs)
│   │   └── AdminDashboard.js              # Admin panel
│   ├── components/
│   │   ├── Header.js                      # Navigation header
│   │   └── Footer.js                      # Footer
│   ├── services/
│   │   └── apiService.js                  # API client
│   └── App.js                             # Main app router
├── backend/                               # Backend (Express.js)
│   ├── server.js                          # Express server setup
│   ├── models/
│   │   └── User.js                        # MongoDB user schema
│   ├── routes/
│   │   ├── auth.js                        # Auth endpoints
│   │   └── admin.js                       # Admin endpoints
│   ├── middleware/
│   │   └── auth.js                        # JWT & admin middleware
│   ├── package.json
│   └── .env.example                       # Environment template
├── .env                                   # Frontend config
├── SETUP.md                               # Detailed setup guide
├── QUICKSTART.md                          # Quick start guide
├── ARCHITECTURE.md                        # System architecture
├── package.json
└── README.md                              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ and npm v6+
- MongoDB (local or MongoDB Atlas)

### Installation & Running

```bash
# 1. Start Backend (Terminal 1)
cd backend
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/registration-portal
PORT=5000
JWT_SECRET=your-secret-key-12345
NODE_ENV=development
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
EOF

npm run dev

# 2. Start Frontend (Terminal 2)
npm install
npm start
```

**Access the app:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Admin Dashboard: http://localhost:3000/admin (for admin users)

For detailed setup instructions, see [QUICKSTART.md](QUICKSTART.md) and [SETUP.md](SETUP.md)

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user (returns JWT) |
| GET | `/api/auth/profile` | Get user profile (auth required) |
| PUT | `/api/auth/profile` | Update user profile (auth required) |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users (paginated, searchable) |
| GET | `/api/admin/users/:id` | Get user details |
| PUT | `/api/admin/users/:id/status` | Change user status |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/stats` | Get dashboard statistics |
| GET | `/api/admin/export/users` | Export users as CSV |

*All admin endpoints require `isAdmin: true` in user record*

See [ARCHITECTURE.md](ARCHITECTURE.md) for complete API details.

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for stateless authentication:

1. **Registration:** User provides details → Password hashed → JWT issued
2. **Login:** Email + Password → Verified → JWT issued
3. **Protected Routes:** JWT included in `Authorization: Bearer <token>` header
4. **Token Expiry:** 7 days (auto-logout after expiration)
5. **Admin Routes:** Requires `isAdmin: true` in user document

## 📊 Data Model

Each user document contains:
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
  "isAdmin": false,
  "profileStatus": "active",
  "profileData": {
    "bio": "Professional summary",
    "skills": ["JavaScript", "React"],
    "certifications": ["AWS"]
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

## 🎯 Smart Password Generation

The system generates secure passwords using:
- **Base:** First 3 letters of name + DOB (DDMM) + Last 4 digits of phone
- **Example:** Name: "John", DOB: "1990-01-15", Phone: "1234567890"
  - Generated: `JOH0115` + `7890` → `JOH01157890`
- **Variants:** "Generate New" button creates unique variants with random numbers
- **Custom:** Users can create their own password

## 🌐 Deployment

### Frontend (Vercel, Netlify)
```bash
npm run build
# Deploy the 'build' folder
```

### Backend (Heroku, AWS, DigitalOcean)
1. Set environment variables on platform
2. Deploy `backend` folder
3. Use MongoDB Atlas for cloud database

See [SETUP.md](SETUP.md) for detailed deployment instructions.

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Make sure MongoDB is running:
- macOS: brew services start mongodb-community
- Ubuntu: sudo service mongod start
```

### CORS/API Errors
```
Verify:
1. Backend running on port 5000
2. REACT_APP_API_URL=http://localhost:5000/api in .env
3. No firewall blocking ports
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

See [SETUP.md](SETUP.md) for more troubleshooting tips.

## 📖 Additional Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP.md](SETUP.md)** - Comprehensive setup and deployment guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and data flow diagrams

## 🎓 Learning Features

This project demonstrates:
- ✅ Full-stack MERN development
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ RESTful API design
- ✅ MongoDB schema design
- ✅ React component patterns
- ✅ Form handling and validation
- ✅ Responsive design with CSS3
- ✅ Error handling
- ✅ Pagination and search

## 📝 Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```
MONGODB_URI=mongodb://localhost:27017/registration-portal
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## 🚦 Project Status

✅ **Completed:**
- React frontend with 5 pages
- Express.js backend with MongoDB
- User authentication (register/login)
- User dashboard with 4 tabs
- Admin dashboard with full CRUD operations
- JWT security and role-based access
- CSV export functionality
- Responsive design for all devices
- Smart password generation
- Email as username system

🟡 **Can be Extended:**
- Advanced analytics and charts
- Email notifications
- Two-factor authentication
- Social login integration
- Real-time notifications (WebSocket)
- File uploads (resume/portfolio)
- Machine learning recommendations

## 📞 Support

For issues or questions:
1. Check the troubleshooting section in [SETUP.md](SETUP.md)
2. Review error messages in browser console and terminal
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Ready to Start?

Follow the [QUICKSTART.md](QUICKSTART.md) guide to get running in 5 minutes!

---

**Happy Coding! 🚀**

│   └── index.css
├── package.json
├── .gitignore
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps to Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/AKHILTHADAKA97/Online-Application-Registration-Portal.git
   cd Online-Application-Registration-Portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

## Pages

### Home Page
- Welcome section with call-to-action
- Features overview
- How the application works
- Navigation to registration

### Registration Page
- Comprehensive registration form
- Personal information collection
- Educational and experience details
- Address information
- Form validation with error messages
- Password security (minimum 6 characters)

### Dashboard Page
- User profile information display
- Add new applications form
- Applications management table
- Status tracking and updates
- Application statistics
- Delete applications functionality

## Validation Rules

### Registration Form
- First Name & Last Name: Required
- Email: Required, valid email format
- Phone: Required, 10-digit number
- Password: Minimum 6 characters
- Confirm Password: Must match password
- Date of Birth: Required
- Address, City, State, Zip Code: Required
- Education Level: Required dropdown selection

## Data Storage

The application uses browser's **localStorage** to persist:
- User registration data
- Application records
- Application status updates

Data persists across browser sessions, allowing users to continue where they left off.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Features in Detail

### User Registration
- Form validation with real-time error messages
- Prevention of duplicate registrations
- Secure password handling
- Automatic login after registration

### Application Tracking
- Add applications with position and company details
- Update application status in real-time
- View all applications in a clean list format
- Delete applications if needed
- See statistics at a glance

### Responsive Design
- Mobile-first approach
- Fluid layouts for all screen sizes
- Touch-friendly interface
- Optimized for tablets and desktops

## Future Enhancements

- 🔗 Backend API integration
- 📧 Email notifications
- 💾 Database persistence
- 🔐 Enhanced security features
- 📄 Resume upload functionality
- 📅 Interview scheduling
- 🔔 Push notifications
- 📊 Advanced analytics

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License

This project is open source and available under the MIT License.

## Contact

For support or queries, please reach out to:
- GitHub: [@AKHILTHADAKA97](https://github.com/AKHILTHADAKA97)

---

Made with ❤️ by Akhil Thadaka
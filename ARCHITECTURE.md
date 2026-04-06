# Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Pages:                                                 │ │
│  │  - Home.js (Landing page)                              │ │
│  │  - Register.js (User registration)                     │ │
│  │  - Dashboard.js (User profile & apps)                  │ │
│  │  - AdminDashboard.js (Admin management)                │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Components:                                            │ │
│  │  - Header.js (Navigation)                              │ │
│  │  - Footer.js (Footer)                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Services:                                              │ │
│  │  - apiService.js (API client - fetch wrapper)          │ │
│  └────────────────────────────────────────────────────────┘ │
│                    Port: 3000                                │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/CORS
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Express.js)                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Routes:                                                │ │
│  │  ├─ /api/auth/ (register, login, profile)             │ │
│  │  └─ /api/admin/ (users, stats, export)                │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Middleware:                                            │ │
│  │  ├─ CORS (enable cross-origin requests)               │ │
│  │  ├─ body-parser (parse JSON)                          │ │
│  │  ├─ authMiddleware (verify JWT)                       │ │
│  │  └─ adminMiddleware (check isAdmin role)              │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Models:                                                │ │
│  │  └─ User.js (Mongoose schema)                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                    Port: 5000                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│               DATABASE (MongoDB)                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Collections:                                           │ │
│  │  └─ users (with applications and profile embedded)    │ │
│  └────────────────────────────────────────────────────────┘ │
│                Port: 27017 (local)                           │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
User Registration:
1. User fills form in Register.js
   ↓
2. apiService.register() makes POST to /api/auth/register
   ↓
3. Backend validates and hashes password with bcryptjs
   ↓
4. User document created in MongoDB
   ↓
5. JWT token generated (expires in 7 days)
   ↓
6. Token + user data returned to frontend
   ↓
7. Frontend stores in localStorage:
   - authToken (for API requests)
   - userData (for UI display)
   - isAdmin (for showing admin button)

User Login:
1. Same flow as registration
2. Backend finds existing user and verifies password
3. Issues new JWT token

Protected Requests:
1. Frontend includes JWT in all API requests
   Header: Authorization: Bearer <token>
   ↓
2. Backend authMiddleware verifies token
   ↓
3. If valid, req.user populated and next() called
   ↓
4. If invalid, 401 Unauthorized response

Admin-Only Routes:
1. Frontend routes /admin require isAdmin in localStorage
   ↓
2. AdminDashboard compares token and isAdmin status
   ↓
3. Backend adminMiddleware checks user.isAdmin flag
   ↓
4. If false, returns 403 Forbidden
```

## Data Flow Example: Viewing User List (Admin)

```
AdminDashboard.js (componentDidMount)
         ↓
    fetchUsers()
         ↓
    apiService.getAllUsers(token, params)
         ↓
    fetch(/api/admin/users, {
      headers: {
        Authorization: Bearer <token>
      }
    })
         ↓
Backend: GET /api/admin/users
         ↓
authMiddleware: Verify JWT token
         ↓
adminMiddleware: Check isAdmin === true
         ↓
Route Handler:
  - Query MongoDB with filters
  - Paginate results (default 10/page)
  - Exclude passwords
  - Return { users: [], totalPages: 5 }
         ↓
Frontend: Receive response
         ↓
setUsers([...]) + setState
         ↓
Render table with user list
```

## User Data Model

```javascript
{
  // Basic Information
  firstName: String,
  lastName: String,
  email: String (unique),      // Used as username
  password: String (hashed),
  phone: String,
  dateOfBirth: String,

  // Address
  address: String,
  city: String,
  state: String,
  zipCode: String,

  // Professional
  education: String,     // e.g., "Bachelor's Degree"
  experience: Number,    // Years of experience

  // Profile
  profileStatus: String, // 'active', 'inactive', 'suspended'
  isAdmin: Boolean,      // Only true for admin users
  registeredDate: Date,  // Timestamp
  lastLogin: Date,       // Timestamp

  // Profile Data (Embedded)
  profileData: {
    bio: String,
    skills: [String],          // ["JavaScript", "React"]
    certifications: [String],
    portfolioUrl: String,
    preferredJobTitle: String,
    preferredLocation: String,
    expectedSalary: String
  },

  // Applications (Embedded Array)
  applications: [
    {
      position: String,
      company: String,
      status: String,  // 'applied', 'interview', 'accepted', 'rejected'
      appliedDate: Date
    }
  ]
}
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST /register
**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "SecurePass123",
  "dateOfBirth": "1990-01-15",
  "education": "Bachelor's",
  "experience": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstName": "John",
    "isAdmin": false
  }
}
```

#### POST /login
**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:** Same as register

#### GET /profile
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": { ...complete user object }
}
```

#### PUT /profile
**Headers:** `Authorization: Bearer <token>`

**Request:** Any user fields to update

**Response:** Updated user object

### Admin Routes (`/api/admin`)

#### GET /users?page=1&search=&status=
**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**
- `page` - Page number (default: 1)
- `search` - Search term (name or email)
- `status` - Filter by status (active/inactive/suspended)

**Response:**
```json
{
  "users": [ ...user objects without password ],
  "totalPages": 5,
  "currentPage": 1
}
```

#### GET /users/:id
**Headers:** `Authorization: Bearer <admin-token>`

**Response:** Single user object with all fields

#### PUT /users/:id/status
**Headers:** `Authorization: Bearer <admin-token>`

**Request:**
```json
{
  "status": "inactive"
}
```

#### DELETE /users/:id
**Headers:** `Authorization: Bearer <admin-token>`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### GET /stats
**Headers:** `Authorization: Bearer <admin-token>`

**Response:**
```json
{
  "totalUsers": 150,
  "activeUsers": 120,
  "inactiveUsers": 25,
  "suspendedUsers": 5,
  "usersWithApplications": 100,
  "applications": [
    { "_id": "applied", "count": 45 },
    { "_id": "interview", "count": 30 }
  ]
}
```

#### GET /export/users
**Headers:** `Authorization: Bearer <admin-token>`

**Response:** CSV file download

## Security Features

1. **Password Hashing**
   - bcryptjs with 10 salt rounds
   - Passwords never stored in plain text
   - Never sent to frontend

2. **JWT Authentication**
   - Tokens expire after 7 days
   - Verified on every protected request
   - Stored in localStorage (frontend)

3. **Role-Based Access Control**
   - adminMiddleware checks isAdmin flag
   - Admin routes return 403 Forbidden for non-admins
   - Frontend also checks admin status before rendering

4. **Data Protection**
   - Passwords excluded from API responses
   - Sensitive fields filtered
   - CORS enabled only for frontend

5. **Input Validation**
   - Email format validation
   - Required fields checking
   - Unique email constraint in MongoDB

## Deployment Considerations

### Frontend (Vercel, Netlify, etc.)
1. Build: `npm run build`
2. Set `REACT_APP_API_URL` environment variable
3. Deploy the `build` folder
4. Ensure CORS headers configured on backend

### Backend (Heroku, AWS, DigitalOcean, etc.)
1. Set environment variables for production
2. Use cloud MongoDB Atlas (recommended)
3. Set secure JWT_SECRET
4. Enable CORS for your domain
5. Use process manager (PM2) or container (Docker)

### Database (MongoDB Atlas or Self-Hosted)
1. Ensure unique index on email field
2. Set up connection pooling
3. Regular backups
4. Monitor database performance

## Performance Optimizations

1. **Pagination** - Load only 10 users per page
2. **Search & Filter** - Reduce query results before sending
3. **Indexing** - MongoDB indexes on email, status, date fields
4. **Caching** - Frontend caches user data in state
5. **Lazy Loading** - Admin dashboard fetches on demand

## Error Handling

Frontend:
- Try-catch blocks in apiService
- User-friendly error messages
- State reset on logout

Backend:
- Centralized error handler in server.js
- Proper HTTP status codes (400, 401, 403, 500)
- Detailed error messages (only in development)

## Future Enhancements

1. Email verification for registration
2. Password reset functionality
3. Two-factor authentication
4. Social login (Google, GitHub)
5. Notification system (email/in-app)
6. Advanced search with filters
7. User activity logs
8. Export to multiple formats (JSON, Excel)
9. Real-time notifications (WebSocket)
10. Machine learning recommendations

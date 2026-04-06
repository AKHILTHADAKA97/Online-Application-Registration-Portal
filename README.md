# Online Application Registration Portal

A modern React.js web application for managing online applications and registrations. Users can create accounts, track their application status, and maintain a centralized record of all their job applications.

## Features

✨ **User Features:**
- 📝 Easy user registration with comprehensive form validation
- 🔐 Secure password management
- 👤 Detailed user profile management
- 📊 Personal dashboard to track applications
- 📱 Responsive design for all devices
- 🎯 Real-time application status updates

✨ **Application Management:**
- ➕ Add new job applications
- 📈 Track application status (Pending, Interview, Accepted, Rejected)
- 🗑️ Remove applications
- 📊 View statistics of applications
- 💾 Local data persistence

## Tech Stack

- **Frontend:** React 18.2.0
- **Routing:** React Router DOM 6.14.0
- **HTTP Client:** Axios 1.4.0
- **Build Tool:** Create React App (react-scripts 5.0.1)

## Project Structure

```
Online-Application-Registration-Portal/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Header.css
│   │   ├── Footer.js
│   │   └── Footer.css
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Home.css
│   │   ├── Register.js
│   │   ├── Register.css
│   │   ├── Dashboard.js
│   │   └── Dashboard.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
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
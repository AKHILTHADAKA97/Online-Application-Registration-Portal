# 🚀 Quick Start Guide - Enhanced Registration Portal

## Installation & Running

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm start
```
The application will open at `http://localhost:3000`

### Step 3: Build for Production
```bash
npm run build
```

---

## 🔑 Key Features Quick Reference

### 1. **Smart Password Generation**
When registering, instead of creating your own password:
1. Fill in First Name, Date of Birth, and Phone Number
2. Click "Generate Password from Your Details"
3. A password will be suggested using: First 3 letters + DOB (DDMM) + Last 4 phone digits
4. Click "Use This Password" or "Generate New" for alternatives

**Example:**
- First Name: John
- DOB: 15/05/1995
- Phone: 9876543210
- Generated: `JOH1505432`

### 2. **Email as Username**
Your email becomes your login username automatically. You don't need to create a separate username.

### 3. **Auto Profile Creation**
After registration, your profile is automatically created with:
- Basic information from registration
- Empty fields for additional info (you can edit)
- Skill management system ready to use

---

## 📱 Dashboard Navigation

### Profile Tab (👤)
- **View Profile**: See all your information
- **Edit Profile**: 
  - Add professional bio
  - Set preferred job title
  - Specify preferred location
  - Enter salary expectations
  - Add portfolio URL
  - Manage skills (add/remove)

### Applications Tab (📋)
- **Add Applications**: Track new job applications
- **Manage Status**: Update application status (Pending, Interview, Accepted, Rejected)
- **View Statistics**: See application summary
- **Delete**: Remove applications

### Recommendations Tab (💡)
- Get job recommendations based on your profile
- View suggested positions related to your preferences
- Personalized recommendations

### Settings Tab (⚙️)
- **Notifications**: Toggle email notifications and reminders
- **Security**: Change password or delete account

---

## 🎯 Common Tasks

### Adding a New Application
1. Go to Dashboard → Applications tab
2. Fill in "Position Title" and "Company Name"
3. Select initial status (usually "Pending")
4. Click "+ Add Application"

### Updating Application Status
1. Find your application in the list
2. Click on the status dropdown
3. Select new status (Interview, Accepted, Rejected)
4. Changes save automatically

### Managing Skills
1. Go to Dashboard → Profile tab
2. Click "Edit Profile"
3. In the Skills section, enter skill name
4. Click "+ Add" or press Enter
5. Skills appear as tags
6. Click "×" on any tag to remove it
7. Click "Save Profile"

### Changing Your Profile Information
1. Go to Dashboard → Profile tab
2. Click "Edit Profile"
3. Modify any field:
   - Bio
   - Preferred Job Title
   - Preferred Location
   - Salary Expectation
   - Portfolio URL
   - Skills
4. Click "Save Profile"

---

## 💡 Useful Tips

1. **Password Recovery**: Since your password is generated from your personal info, you can always regenerate it if you forget
2. **Data Persistence**: All your data is saved in your browser. Clear browser cache to reset
3. **Multiple Devices**: Use the same email to access from different devices
4. **Skill Tags**: Skills help with job recommendations - add relevant ones
5. **Profile Completeness**: More complete profiles get better recommendations

---

## 🔄 Password Generation Algorithm

```
Generated Password = FirstName[0-3] + DOB[DD] + DOB[MM] + Phone[-4]

Example Breakdown:
- Name: "John" → "JOH" (first 3 letters, uppercase)
- DOB: "15/05/1995" → "1505" (day + month)
- Phone: "9876543210" → "3210" (last 4 digits)
Result: JOH15053210
```

---

## 📊 Application Status Meanings

- **Pending**: Application submitted, awaiting response
- **Interview**: You have been called for an interview
- **Accepted**: Job offer received
- **Rejected**: Application was not successful

---

## ❓ FAQ

**Q: Can I change my email (username)?**
A: Email is your primary identifier. To change it, you would need to register as a new user.

**Q: Where is my data stored?**
A: All data is stored in your browser's localStorage. It persists until you clear browser cache.

**Q: Can I export my data?**
A: Currently, you can take screenshots. Backend integration would allow formal exports.

**Q: Is my data safe?**
A: Data is stored locally in your browser. For sensitive information, consider using a password manager.

**Q: Can I use the same password for all?**
A: Yes, but for security, consider creating custom passwords by disable auto-generation.

**Q: What if I forget my password?**
A: You can regenerate it from the registration form using the same personal details.

---

## 🎨 Customization

The app uses a consistent color scheme:
- **Primary Blue**: #3498db
- **Success Green**: #27ae60
- **Danger Red**: #e74c3c
- **Warning Orange**: #f39c12
- **Dark Blue**: #2c3e50

Fonts and colors can be modified in CSS files if needed.

---

## 🐛 Troubleshooting

**Issue**: Password generation not working
- **Solution**: Ensure all required fields (Name, DOB, Phone) are filled first

**Issue**: Profile not saving
- **Solution**: Check browser console for errors, refresh page and try again

**Issue**: Can't find my applications
- **Solution**: Applications tab should show all. Check browser cache isn't clearing data

**Issue**: Settings not persisting
- **Solution**: Make sure cookies/localStorage are enabled in browser

---

## 📞 Support

For issues or feature requests, refer to the GitHub repository or contact the development team.

---

## 🎉 Ready to Get Started!

1. Open the application
2. Click "Register" on the home page
3. Fill in your details
4. Generate your password
5. Complete registration
6. Explore the dashboard features

Enjoy managing your job applications! 🚀

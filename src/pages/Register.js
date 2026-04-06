import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register({ onRegister }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    education: '',
    experience: '',
    username: '', // Will be set to email
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [suggestedPassword, setSuggestedPassword] = useState('');
  const [showPasswordSuggestion, setShowPasswordSuggestion] = useState(false);
  const [useAutoPassword, setUseAutoPassword] = useState(false);

  // Generate password suggestion from name, DOB, and phone
  const generatePasswordSuggestion = (isNewPassword = false) => {
    if (!formData.firstName || !formData.dateOfBirth || !formData.phone) {
      alert('Please fill First Name, Date of Birth, and Phone Number first!');
      return;
    }

    const nameStart = formData.firstName.substring(0, 3).toUpperCase();
    const dobParts = formData.dateOfBirth.split('-');
    const dobShort = dobParts.length === 3 ? dobParts[2] + dobParts[1] : '0101'; // DDMM format
    
    let phoneDigits = formData.phone.replace(/\D/g, '');
    let phonePart = '';
    
    if (isNewPassword) {
      // Generate new password with different phone digits combination
      const randomStart = Math.floor(Math.random() * 3); // 0, 1, or 2
      phonePart = phoneDigits.substring(randomStart, randomStart + 4);
      
      // Add random number (1-99) to make it different
      const randomNum = Math.floor(Math.random() * 99) + 1;
      const suggested = `${nameStart}${dobShort}${phonePart}${randomNum}`;
      setSuggestedPassword(suggested);
    } else {
      // Generate original password from last 4 digits
      phonePart = phoneDigits.slice(-4);
      const suggested = `${nameStart}${dobShort}${phonePart}`;
      setSuggestedPassword(suggested);
    }
    
    setShowPasswordSuggestion(true);
  };

  const useSuggestedPassword = () => {
    setFormData(prev => ({
      ...prev,
      password: suggestedPassword,
      confirmPassword: suggestedPassword
    }));
    setUseAutoPassword(true);
    setShowPasswordSuggestion(false);
  };

  const generateNewPassword = () => {
    generatePasswordSuggestion(true); // true = generate new variant
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-set username to email whenever email changes
      username: name === 'email' ? value : prev.username
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    
    // Password validation - made optional if using auto-password
    if (!useAutoPassword) {
      if (!formData.password) {
        newErrors.password = 'Password is required or use "Generate Password"';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!formData.education) newErrors.education = 'Education level is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      // Create auto-profile
      const userProfile = {
        ...formData,
        username: formData.email, // Email becomes the username
        registeredDate: new Date().toLocaleDateString(),
        profileStatus: 'active',
        profileCompleteness: 100,
      };

      // Auto-create profile data
      const profileData = {
        bio: '',
        skills: [],
        certifications: [],
        portfolio: '',
        preferredJobTitle: '',
        preferredLocation: '',
        salaryExpectation: '',
        profilePicture: null,
      };

      // Save profile to localStorage
      localStorage.setItem('userProfile_' + formData.email, JSON.stringify({
        ...userProfile,
        ...profileData
      }));

      // Save username mapping
      localStorage.setItem('usernames', JSON.stringify({
        ...(JSON.parse(localStorage.getItem('usernames') || '{}')),
        [formData.email]: formData.email
      }));

      onRegister(userProfile);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>User Registration</h2>
        <p className="register-subtitle">Create your account to get started</p>

        {submitted && (
          <div className="success-message">
            ✓ Registration successful! Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'input-error' : ''}
                placeholder="John"
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'input-error' : ''}
                placeholder="Doe"
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address (Username) *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
                placeholder="john@example.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
              <small style={{ color: '#7f8c8d', marginTop: '4px', display: 'block' }}>
                Your email will be used as your username
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'input-error' : ''}
                placeholder="1234567890"
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? 'input-error' : ''}
              />
              {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="education">Education Level *</label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className={errors.education ? 'input-error' : ''}
              >
                <option value="">Select Education Level</option>
                <option value="10">10th Pass</option>
                <option value="12">12th Pass</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
              {errors.education && <span className="error-text">{errors.education}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'input-error' : ''}
              placeholder="123 Main Street"
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? 'input-error' : ''}
                placeholder="New York"
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? 'input-error' : ''}
                placeholder="NY"
              />
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">Zip Code *</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={errors.zipCode ? 'input-error' : ''}
                placeholder="10001"
              />
              {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="experience">Years of Experience</label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="0"
              min="0"
              max="70"
            />
          </div>

          {/* Password Suggestion Section */}
          <div className="password-suggestion-section">
            <h3>🔐 Password Setup</h3>
            <button 
              type="button" 
              className="suggest-password-btn"
              onClick={generatePasswordSuggestion}
            >
              Generate Password from Your Details
            </button>
            <small style={{ color: '#7f8c8d', display: 'block', marginTop: '8px' }}>
              Password will be generated using: First 3 letters of name + Date of Birth (DDMM) + Last 4 digits of phone
            </small>

            {showPasswordSuggestion && (
              <div className="suggested-password-box">
                <div className="suggested-password-display">
                  <strong>Suggested Password:</strong>
                  <code>{suggestedPassword}</code>
                </div>
                <div className="suggestion-actions">
                  <button 
                    type="button"
                    className="use-suggested-btn"
                    onClick={useSuggestedPassword}
                  >
                    ✓ Use This Password
                  </button>
                  <button 
                    type="button"
                    className="generate-new-btn"
                    onClick={generateNewPassword}
                  >
                    🔄 Generate New
                  </button>
                </div>
              </div>
            )}

            {useAutoPassword && (
              <div className="auto-password-used">
                ✓ Auto-generated password will be used
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'input-error' : ''}
                placeholder={useAutoPassword ? '(Auto-generated)' : '••••••••'}
                disabled={useAutoPassword}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
              {useAutoPassword && <small style={{ color: '#27ae60', marginTop: '4px', display: 'block' }}>Auto-generated password</small>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'input-error' : ''}
                placeholder={useAutoPassword ? '(Auto-generated)' : '••••••••'}
                disabled={useAutoPassword}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="submit-btn">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;

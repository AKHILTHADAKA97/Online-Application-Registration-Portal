import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ isLoggedIn, userData }) {
  const [applications, setApplications] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('applications');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: '',
    skills: [],
    certifications: [],
    portfolio: '',
    preferredJobTitle: '',
    preferredLocation: '',
    salaryExpectation: '',
    profilePicture: null,
  });
  const [newApplication, setNewApplication] = useState({
    position: '',
    company: '',
    status: 'pending',
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const savedApplications = localStorage.getItem('applications');
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }

    // Load user profile
    if (userData && userData.email) {
      const savedProfile = localStorage.getItem('userProfile_' + userData.email);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
        const profile = JSON.parse(savedProfile);
        setProfileData({
          bio: profile.bio || '',
          skills: profile.skills || [],
          certifications: profile.certifications || [],
          portfolio: profile.portfolio || '',
          preferredJobTitle: profile.preferredJobTitle || '',
          preferredLocation: profile.preferredLocation || '',
          salaryExpectation: profile.salaryExpectation || '',
          profilePicture: profile.profilePicture || null,
        });
      }
    }
  }, [userData]);

  const handleAddApplication = (e) => {
    e.preventDefault();
    if (newApplication.position && newApplication.company) {
      const app = {
        id: Date.now(),
        ...newApplication,
        appliedDate: new Date().toLocaleDateString(),
      };
      const updatedApplications = [...applications, app];
      setApplications(updatedApplications);
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
      setNewApplication({ position: '', company: '', status: 'pending' });
    }
  };

  const handleDeleteApplication = (id) => {
    const updatedApplications = applications.filter(app => app.id !== id);
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedApplications = applications.map(app =>
      app.id === id ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...profileData.skills, newSkill];
      setProfileData(prev => ({
        ...prev,
        skills: updatedSkills
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = profileData.skills.filter((_, i) => i !== index);
    setProfileData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  const handleSaveProfile = () => {
    if (userData && userData.email) {
      const updatedProfile = {
        ...userProfile,
        ...profileData,
        lastUpdated: new Date().toLocaleDateString()
      };
      localStorage.setItem('userProfile_' + userData.email, JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      setShowProfileForm(false);
      alert('Profile updated successfully!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f39c12';
      case 'accepted':
        return '#27ae60';
      case 'rejected':
        return '#e74c3c';
      case 'interview':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  if (!isLoggedIn || !userData) {
    return <Navigate to="/register" />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h2>Welcome, {userData.firstName} {userData.lastName}!</h2>
            <p>Username: <strong>{userData.email}</strong></p>
          </div>
          <div className="header-stats">
            <div className="stat-badge">
              <span className="stat-value">{applications.length}</span>
              <span className="stat-label">Applications</span>
            </div>
            <div className="stat-badge">
              <span className="stat-value">{profileData.skills.length}</span>
              <span className="stat-label">Skills</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          📋 Applications
        </button>
        <button
          className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          💡 Recommended Jobs
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="dashboard-container">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <>
            <div className="user-info-card">
              <div className="card-header">
                <h3>Your Profile</h3>
                <button 
                  className="edit-profile-btn"
                  onClick={() => setShowProfileForm(!showProfileForm)}
                >
                  {showProfileForm ? '✕ Cancel' : '✏️ Edit Profile'}
                </button>
              </div>

              {!showProfileForm ? (
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Username:</span>
                    <span className="info-value">{userData.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{userData.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{userData.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Education:</span>
                    <span className="info-value">{userData.education}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Experience:</span>
                    <span className="info-value">{userData.experience} years</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location:</span>
                    <span className="info-value">{userData.city}, {userData.state}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Member Since:</span>
                    <span className="info-value">{userProfile?.registeredDate}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Profile Status:</span>
                    <span className="info-value status-active">{userProfile?.profileStatus || 'active'}</span>
                  </div>
                </div>
              ) : (
                <form className="profile-form">
                  <div className="form-group">
                    <label htmlFor="bio">Professional Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      placeholder="Tell us about yourself..."
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="preferredJobTitle">Preferred Job Title</label>
                    <input
                      type="text"
                      id="preferredJobTitle"
                      name="preferredJobTitle"
                      value={profileData.preferredJobTitle}
                      onChange={handleProfileChange}
                      placeholder="e.g., Senior Developer"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="preferredLocation">Preferred Location</label>
                    <input
                      type="text"
                      id="preferredLocation"
                      name="preferredLocation"
                      value={profileData.preferredLocation}
                      onChange={handleProfileChange}
                      placeholder="e.g., Remote, New York"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="salaryExpectation">Salary Expectation</label>
                    <input
                      type="text"
                      id="salaryExpectation"
                      name="salaryExpectation"
                      value={profileData.salaryExpectation}
                      onChange={handleProfileChange}
                      placeholder="e.g., $80,000 - $120,000"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="portfolio">Portfolio URL</label>
                    <input
                      type="url"
                      id="portfolio"
                      name="portfolio"
                      value={profileData.portfolio}
                      onChange={handleProfileChange}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div className="skills-section">
                    <label>Skills</label>
                    <div className="skills-input-group">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      />
                      <button type="button" className="add-skill-btn" onClick={handleAddSkill}>
                        + Add
                      </button>
                    </div>
                    <div className="skills-list">
                      {profileData.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(index)}
                            className="remove-skill"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button type="button" className="save-profile-btn" onClick={handleSaveProfile}>
                    💾 Save Profile
                  </button>
                </form>
              )}
            </div>
          </>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <>
            <div className="add-application-card">
              <h3>Add New Application</h3>
              <form onSubmit={handleAddApplication} className="app-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="position">Position Title *</label>
                    <input
                      type="text"
                      id="position"
                      value={newApplication.position}
                      onChange={(e) => setNewApplication({
                        ...newApplication,
                        position: e.target.value
                      })}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company Name *</label>
                    <input
                      type="text"
                      id="company"
                      value={newApplication.company}
                      onChange={(e) => setNewApplication({
                        ...newApplication,
                        company: e.target.value
                      })}
                      placeholder="e.g., Tech Corp"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      value={newApplication.status}
                      onChange={(e) => setNewApplication({
                        ...newApplication,
                        status: e.target.value
                      })}
                    >
                      <option value="pending">Pending</option>
                      <option value="interview">Interview</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="add-btn">+ Add Application</button>
              </form>
            </div>

            <div className="applications-card">
              <h3>Your Applications ({applications.length})</h3>
              {applications.length === 0 ? (
                <p className="no-applications">No applications yet. Add one to get started!</p>
              ) : (
                <div className="applications-list">
                  {applications.map(app => (
                    <div key={app.id} className="application-item">
                      <div className="app-info">
                        <div className="app-header">
                          <h4>{app.position}</h4>
                          <span
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(app.status) }}
                          >
                            {app.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="company-name">{app.company}</p>
                        <p className="app-date">Applied: {app.appliedDate}</p>
                      </div>
                      <div className="app-actions">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="interview">Interview</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button
                          onClick={() => handleDeleteApplication(app.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="stats-card">
              <h3>Application Statistics</h3>
              <div className="stats-grid">
                <div className="stat">
                  <div className="stat-number">{applications.length}</div>
                  <div className="stat-label">Total Applications</div>
                </div>
                <div className="stat">
                  <div className="stat-number">{applications.filter(a => a.status === 'pending').length}</div>
                  <div className="stat-label">Pending</div>
                </div>
                <div className="stat">
                  <div className="stat-number">{applications.filter(a => a.status === 'interview').length}</div>
                  <div className="stat-label">Interviews</div>
                </div>
                <div className="stat">
                  <div className="stat-number">{applications.filter(a => a.status === 'accepted').length}</div>
                  <div className="stat-label">Accepted</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="recommendations-card">
            <h3>💡 Job Recommendations Based on Your Profile</h3>
            <div className="recommendations-list">
              {profileData.preferredJobTitle ? (
                <div className="recommendation-item">
                  <div className="rec-content">
                    <h4>Recommended Job Categories</h4>
                    <p>Based on your preference for: <strong>{profileData.preferredJobTitle}</strong></p>
                    <div className="recommended-positions">
                      <div className="rec-pos">📌 Senior {profileData.preferredJobTitle}</div>
                      <div className="rec-pos">📌 Lead {profileData.preferredJobTitle}</div>
                      <div className="rec-pos">📌 {profileData.preferredJobTitle} Specialist</div>
                    </div>
                  </div>
                  <button className="apply-rec-btn">View Jobs</button>
                </div>
              ) : (
                <p className="no-recommendations">Update your profile with preferred job title to see recommendations</p>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="settings-card">
            <h3>⚙️ Account Settings</h3>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-content">
                  <h4>Email Notifications</h4>
                  <p>Receive updates about your applications</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle-switch" />
              </div>
              <div className="setting-item">
                <div className="setting-content">
                  <h4>Application Reminders</h4>
                  <p>Get reminded about pending applications</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle-switch" />
              </div>
              <div className="setting-item">
                <div className="setting-content">
                  <h4>Job Recommendations</h4>
                  <p>Receive personalized job recommendations</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle-switch" />
              </div>
              <div className="setting-item danger">
                <div className="setting-content">
                  <h4>Change Password</h4>
                  <p>Update your account password</p>
                </div>
                <button className="change-password-btn">Change</button>
              </div>
              <div className="setting-item danger">
                <div className="setting-content">
                  <h4>Delete Account</h4>
                  <p>Permanently delete your account and data</p>
                </div>
                <button className="delete-account-btn">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

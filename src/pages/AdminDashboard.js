import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import apiService from '../services/apiService';
import './AdminDashboard.css';

function AdminDashboard({ token, isAdmin }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && isAdmin) {
      fetchDashboardStats();
      fetchUsers();
    }
  }, [token, isAdmin]);

  const fetchDashboardStats = async () => {
    try {
      const data = await apiService.getDashboardStats(token);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async (page = 1, search = '', status = '') => {
    setLoading(true);
    try {
      const data = await apiService.getAllUsers(token, {
        page,
        search: search || searchTerm,
        status: status || filterStatus
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    fetchUsers(1, value, filterStatus);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
    fetchUsers(1, searchTerm, status);
  };

  const handleViewUserDetail = async (user) => {
    try {
      const userDetail = await apiService.getUserById(user._id, token);
      setSelectedUser(userDetail);
      setShowUserDetail(true);
    } catch (error) {
      console.error('Error fetching user detail:', error);
    }
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      await apiService.updateUserStatus(userId, newStatus, token);
      fetchUsers(currentPage, searchTerm, filterStatus);
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, profileStatus: newStatus });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.deleteUser(userId, token);
        fetchUsers(currentPage, searchTerm, filterStatus);
        setShowUserDetail(false);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleExportUsers = async () => {
    try {
      const blob = await apiService.exportUsers(token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      a.click();
    } catch (error) {
      console.error('Error exporting users:', error);
    }
  };

  if (!isAdmin || !token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🔧 Admin Dashboard</h1>
        <button className="logout-btn" onClick={() => window.location.href = '/'}>Logout</button>
      </div>

      <div className="admin-nav-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📈 Reports
        </button>
      </div>

      <div className="admin-container">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="dashboard-content">
            <h2>System Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.totalUsers}</div>
                <div className="stat-title">Total Users</div>
              </div>
              <div className="stat-card active">
                <div className="stat-number">{stats.activeUsers}</div>
                <div className="stat-title">Active Users</div>
              </div>
              <div className="stat-card inactive">
                <div className="stat-number">{stats.inactiveUsers}</div>
                <div className="stat-title">Inactive Users</div>
              </div>
              <div className="stat-card suspended">
                <div className="stat-number">{stats.suspendedUsers}</div>
                <div className="stat-title">Suspended Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.usersWithApplications}</div>
                <div className="stat-title">Users with Applications</div>
              </div>
            </div>

            <div className="applications-stats">
              <h3>Application Status Distribution</h3>
              <div className="app-status-list">
                {stats.applications && stats.applications.map(app => (
                  <div key={app._id} className="app-status-item">
                    <span className="status-name">{app._id?.toUpperCase() || 'Unknown'}</span>
                    <span className="status-count">{app.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="users-content">
            <h2>Manage Users</h2>
            
            <div className="users-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>

              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filterStatus === '' ? 'active' : ''}`}
                  onClick={() => handleFilterStatus('')}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
                  onClick={() => handleFilterStatus('active')}
                >
                  Active
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'inactive' ? 'active' : ''}`}
                  onClick={() => handleFilterStatus('inactive')}
                >
                  Inactive
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'suspended' ? 'active' : ''}`}
                  onClick={() => handleFilterStatus('suspended')}
                >
                  Suspended
                </button>
              </div>

              <button className="export-btn" onClick={handleExportUsers}>📥 Export CSV</button>
            </div>

            {loading ? (
              <div className="loading">Loading users...</div>
            ) : (
              <>
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>Education</th>
                      <th>Status</th>
                      <th>Registered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.city}</td>
                        <td>{user.education}</td>
                        <td>
                          <span className={`status-badge ${user.profileStatus}`}>
                            {user.profileStatus}
                          </span>
                        </td>
                        <td>{new Date(user.registeredDate).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="action-btn view-btn"
                            onClick={() => handleViewUserDetail(user)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pagination">
                  <button
                    onClick={() => fetchUsers(currentPage - 1, searchTerm, filterStatus)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => fetchUsers(currentPage + 1, searchTerm, filterStatus)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="reports-content">
            <h2>Reports & Analytics</h2>
            <div className="report-card">
              <h3>User Growth</h3>
              <p>Chart integration coming soon...</p>
            </div>
            <div className="report-card">
              <h3>Application Status</h3>
              <p>Chart integration coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserDetail && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserDetail(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowUserDetail(false)}>×</button>
            
            <h2>User Details</h2>
            
            <div className="user-detail-grid">
              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedUser.firstName} {selectedUser.lastName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedUser.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedUser.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">DOB:</span>
                  <span className="detail-value">{selectedUser.dateOfBirth}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Address Information</h3>
                <div className="detail-item">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{selectedUser.address}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">City:</span>
                  <span className="detail-value">{selectedUser.city}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">State:</span>
                  <span className="detail-value">{selectedUser.state}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Zip Code:</span>
                  <span className="detail-value">{selectedUser.zipCode}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Professional Information</h3>
                <div className="detail-item">
                  <span className="detail-label">Education:</span>
                  <span className="detail-value">{selectedUser.education}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Experience:</span>
                  <span className="detail-value">{selectedUser.experience} years</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <select
                    value={selectedUser.profileStatus}
                    onChange={(e) => handleUpdateUserStatus(selectedUser._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="detail-section">
                <h3>Profile Data</h3>
                <div className="detail-item">
                  <span className="detail-label">Bio:</span>
                  <span className="detail-value">{selectedUser.profileData?.bio || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Skills:</span>
                  <div className="skills-list">
                    {selectedUser.profileData?.skills && selectedUser.profileData.skills.length > 0 ? (
                      selectedUser.profileData.skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))
                    ) : (
                      <span>No skills added</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Applications</h3>
                {selectedUser.applications && selectedUser.applications.length > 0 ? (
                  <div className="applications-list">
                    {selectedUser.applications.map((app, idx) => (
                      <div key={idx} className="app-item">
                        <strong>{app.position}</strong> at {app.company}
                        <span className={`app-status ${app.status}`}>{app.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span>No applications</span>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button className="delete-btn" onClick={() => handleDeleteUser(selectedUser._id)}>
                🗑️ Delete User
              </button>
              <button className="close-modal-btn" onClick={() => setShowUserDetail(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

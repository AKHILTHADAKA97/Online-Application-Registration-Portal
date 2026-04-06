import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <h2>Welcome to Application Registration Portal</h2>
        <p>Register for opportunities and track your applications in one place</p>
        <Link to="/register" className="cta-button">Get Started</Link>
      </div>

      <div className="features-section">
        <h3>Why Register With Us?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h4>Easy Registration</h4>
            <p>Simple and quick registration process to get started</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h4>Track Applications</h4>
            <p>Monitor the status of all your applications in real-time</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h4>Get Notifications</h4>
            <p>Receive updates about your application status instantly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h4>Secure</h4>
            <p>Your data is protected with advanced security measures</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>How It Works</h3>
        <ol className="steps">
          <li>
            <strong>Register:</strong> Create your account with basic information
          </li>
          <li>
            <strong>Complete Profile:</strong> Add your details and qualifications
          </li>
          <li>
            <strong>Submit Applications:</strong> Apply for positions you're interested in
          </li>
          <li>
            <strong>Track Status:</strong> Monitor your applications from your dashboard
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Home;

import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ isLoggedIn, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>📋 Registration Portal</h1>
        </div>
        <nav className="navbar">
          <Link to="/" className="nav-link">Home</Link>
          {!isLoggedIn ? (
            <Link to="/register" className="nav-link btn-register">Register</Link>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button onClick={onLogout} className="nav-link btn-logout">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

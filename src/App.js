import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUserData = localStorage.getItem('userData');
    const savedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (savedToken && savedUserData) {
      setToken(savedToken);
      setUserData(JSON.parse(savedUserData));
      setIsLoggedIn(true);
      setIsAdmin(savedIsAdmin);
    }
  }, []);

  const handleLogin = (data, token, isAdmin = false) => {
    setIsLoggedIn(true);
    setUserData(data);
    setToken(token);
    setIsAdmin(isAdmin);
    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem('authToken', token);
    localStorage.setItem('isAdmin', isAdmin);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
  };

  return (
    <Router>
      <div className="app">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} isAdmin={isAdmin} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
            <Route path="/dashboard" element={<Dashboard userData={userData} isLoggedIn={isLoggedIn} token={token} />} />
            <Route path="/admin" element={<AdminDashboard token={token} isAdmin={isAdmin} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

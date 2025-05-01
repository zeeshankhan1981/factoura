import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import ArticleDetail from './pages/articleDetail';
import Home from './pages/home';
import Profile from './pages/profile';

// Wrapper component to conditionally render Navbar
const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Don't show navbar on these pages
  const hideNavbarOn = ['/', '/login', '/signup', '/dashboard', '/profile'];
  const isArticleDetail = path.startsWith('/article/');
  const shouldHideNavbar = hideNavbarOn.includes(path) || isArticleDetail;

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        {/* Root route now points to the public Home page */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        {/* Add other routes here */}
      </Routes>
    </>
  );
};

const App = () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('token') !== null;

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
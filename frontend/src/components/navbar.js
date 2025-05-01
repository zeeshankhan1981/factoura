import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  // Only hide the Navbar on login, dashboard, and article detail pages
  // Show it on the home page and other pages
  if (path === '/login' || path === '/dashboard' || path.startsWith('/article/')) {
    return null;
  }

  // Don't show the navbar on the home page since it has its own navigation
  if (path === '/') {
    return null;
  }

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary-dark">
          <Link to="/" className="hover:text-primary-darker transition-colors duration-200">factoura</Link>
        </div>
        <ul className="flex space-x-8">
          <li>
            <Link to="/" className="text-gray-700 hover:text-primary-dark transition-colors duration-200 font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link to="/signup" className="text-gray-700 hover:text-primary-dark transition-colors duration-200 font-medium">
              Sign Up
            </Link>
          </li>
          <li>
            <Link to="/login" className="text-gray-700 hover:text-primary-dark transition-colors duration-200 font-medium">
              Login
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="bg-primary-dark hover:bg-primary-darker text-white px-4 py-2 rounded-md transition-colors duration-200">
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
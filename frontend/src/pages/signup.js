import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:5001/api/auth/signup', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        
        console.log('Registration successful', response.data);
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        navigate('/login');
      } catch (error) {
        console.error('Registration error', error.response?.data || error.message);
        setErrors({
          submit: error.response?.data?.message || 'Registration failed. Please try again.',
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-lighter to-primary-light font-sans">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="flex w-full max-w-5xl min-h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Left panel with features */}
          <div className="flex-1 bg-primary-darker text-white p-10 flex flex-col justify-center">
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Collaborative Journalism</h3>
                <p className="text-gray-200">Work together with journalists worldwide to uncover important stories.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Blockchain Verification</h3>
                <p className="text-gray-200">All verified stories are secured on Polygon PoS for permanent, tamper-proof records.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Transparent Reporting</h3>
                <p className="text-gray-200">Follow the verification process from initial reporting to final publication.</p>
              </div>
            </div>
          </div>
          
          {/* Right panel with form */}
          <div className="flex-1 p-10">
            <div className="h-full flex flex-col">
              <div className="mb-6">
                <Link to="/" className="text-primary-dark hover:text-primary-darker transition-colors duration-200">
                  ← Back to Home
                </Link>
              </div>
              
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">factoura.</h1>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600">Create your account to join our community of journalists and fact-checkers.</p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                  {errors.username && <div className="text-red-500 text-sm mt-1">{errors.username}</div>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                  {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                  {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                  {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
                </div>
                
                {errors.submit && <div className="text-red-500 text-sm">{errors.submit}</div>}
                
                <button 
                  type="submit" 
                  className="w-full py-3 px-4 bg-primary-dark hover:bg-primary-darker text-white font-medium rounded-md transition-colors duration-200 shadow-sm"
                >
                  Create Account
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account? <Link to="/login" className="text-primary-dark hover:text-primary-darker font-medium">Sign in</Link>
                </p>
              </div>
              
              <div className="mt-auto pt-6">
                <p className="text-xs text-gray-500 text-center">
                  By creating an account, you agree to our <a href="#" className="text-primary-dark hover:underline">Terms of Service</a> and <a href="#" className="text-primary-dark hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;

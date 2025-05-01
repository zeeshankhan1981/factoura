import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/api/users/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
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
          
          {/* Right panel with login form */}
          <div className="flex-1 p-10">
            <div className="h-full flex flex-col">
              <div className="mb-6">
                <Link to="/" className="text-primary-dark hover:text-primary-darker transition-colors duration-200">
                  ← Back to Home
                </Link>
              </div>
              
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-800">factoura.</h1>
              </div>
              
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
              </div>
              
              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="remember" 
                      className="h-4 w-4 text-primary-dark focus:ring-primary-light border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm text-primary-dark hover:text-primary-darker font-medium">
                    Forgot password?
                  </a>
                </div>
                
                {error && <div className="text-red-500 text-sm">{error}</div>}
                
                <button 
                  type="submit" 
                  className="w-full py-3 px-4 bg-primary-dark hover:bg-primary-darker text-white font-medium rounded-md transition-colors duration-200 shadow-sm"
                >
                  Sign In
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account? <Link to="/signup" className="text-primary-dark hover:text-primary-darker font-medium">Sign up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
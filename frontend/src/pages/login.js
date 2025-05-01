import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/users/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-lighter via-white to-secondary-lighter p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Branding Panel */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-dark to-primary-darker p-8 flex-col justify-between text-white">
          <div>
            <h1 className="text-3xl font-bold mb-4">factoura</h1>
            <p className="text-primary-lighter/80 mb-6">Digital journalism on the blockchain</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2">Verified Stories</h3>
              <p className="text-sm text-white/80">All stories are verified and stored securely on the blockchain</p>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2">Transparent Journalism</h3>
              <p className="text-sm text-white/80">Track sources and build trust with transparent reporting</p>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2">Collaborative Ecosystem</h3>
              <p className="text-sm text-white/80">Connect with journalists, fact-checkers and readers</p>
            </div>
          </div>
          
          <div className="text-sm text-white/60 mt-8">
            {new Date().getFullYear()} factoura. All rights reserved.
          </div>
        </div>
        
        {/* Right Login Form */}
        <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <div className="md:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-primary-dark">factoura</h1>
            <p className="text-sm text-gray-500">Digital journalism on the blockchain</p>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Welcome back</h2>
          <p className="text-center text-gray-500 mb-8">Sign in to access your account</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-gray-900 bg-gray-50"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-sm text-primary-dark hover:text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-gray-900 bg-gray-50"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition">
                <span className="sr-only">Sign in with Google</span>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </button>
              <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition">
                <span className="sr-only">Sign in with Microsoft</span>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
                </svg>
              </button>
              <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition">
                <span className="sr-only">Sign in with Twitter</span>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:text-primary-dark transition">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
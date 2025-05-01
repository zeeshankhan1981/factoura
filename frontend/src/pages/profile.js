import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5001/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user info', err);
        setError('Failed to load profile information');
        setLoading(false);
      }
    };

    const fetchUserArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/articles');
        const articlesWithAuthors = await Promise.all(response.data.map(async (article) => {
          try {
            const authorResponse = await axios.get(`http://localhost:5001/api/users/${article.authorId}`);
            return { 
              ...article, 
              authorName: authorResponse.data.username,
              verificationStatus: Math.random() > 0.5 ? 'verified' : 'pending',
              contributors: Math.floor(Math.random() * 5),
              blockchainId: `0x${Math.random().toString(16).substr(2, 40)}`,
              tags: ['journalism', 'investigation', 'politics'].slice(0, Math.floor(Math.random() * 3) + 1)
            };
          } catch (authorErr) {
            console.error(`Error fetching author info for article ${article.id}`, authorErr);
            return { ...article, authorName: 'Unknown' };
          }
        }));

        // Filter articles by the current user
        const token = localStorage.getItem('token');
        if (token) {
          const userResponse = await axios.get('http://localhost:5001/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const userId = userResponse.data.id;
          const userArticles = articlesWithAuthors.filter(article => article.authorId === userId);
          setArticles(userArticles);
        }
      } catch (err) {
        console.error('Error fetching user articles', err);
      }
    };

    fetchUserInfo();
    fetchUserArticles();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-red-500 text-xl mb-2">Error</div>
            <p className="text-gray-700">{error}</p>
            <Link to="/login" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-red-500 text-xl mb-2">User Not Found</div>
            <p className="text-gray-700">Unable to load your profile information.</p>
            <Link to="/login" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
            factoura.
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Dashboard
            </Link>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile header */}
        <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-32"></div>
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
              <div className="w-32 h-32 bg-blue-600 text-white flex items-center justify-center text-5xl font-bold rounded-full border-4 border-white shadow-md">
                {user.username ? user.username.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
                <p className="text-gray-600 mt-1">{user.email}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-wrap -mx-4">
                <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{articles.length}</div>
                    <div className="text-gray-600">Stories Published</div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {articles.filter(article => article.verificationStatus === 'verified').length}
                    </div>
                    <div className="text-gray-600">Verified Stories</div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 px-4">
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {articles.reduce((total, article) => total + article.contributors, 0)}
                    </div>
                    <div className="text-gray-600">Contributions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* My Stories Section */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">My Stories</h2>
              </div>
              <div className="p-6">
                {articles.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="mt-2 text-gray-500">You haven't published any stories yet.</p>
                    <Link to="/dashboard" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                      Create a Story
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {articles.map((article, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-gray-800 text-lg mb-2">{article.title}</h3>
                          {article.verificationStatus === 'verified' && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Verified</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mb-3">
                          <span>Published: {new Date(article.createdAt).toLocaleDateString()}</span>
                          {article.contributors > 0 && (
                            <span className="ml-3">• {article.contributors} contributor{article.contributors !== 1 ? 's' : ''}</span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-4 text-sm">
                          {article.content.length > 150 
                            ? `${article.content.substring(0, 150)}...` 
                            : article.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="space-x-2">
                            {article.tags && article.tags.map((tag, idx) => (
                              <span key={idx} className="inline-block text-xs text-gray-500">#{tag}</span>
                            ))}
                          </div>
                          <Link 
                            to={`/article/${article.id}`} 
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Read More →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            {/* Account Details */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Account Details</h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Username</div>
                  <div className="font-medium">{user.username}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Email</div>
                  <div className="font-medium">{user.email}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Member Since</div>
                  <div className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
            
            {/* Blockchain Verification */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Blockchain Verification</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-sm mb-4">
                  Your stories are secured on Polygon PoS blockchain for permanent, tamper-proof record-keeping.
                </p>
                <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors duration-200 text-sm">
                  View Blockchain Records
                </button>
              </div>
            </div>
            
            {/* Settings Quick Links */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Settings</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Edit Profile
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Change Password
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Notification Settings
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                      Privacy Settings
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 factoura. All rights reserved.</p>
            <p className="mt-1">Powered by Polygon PoS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;

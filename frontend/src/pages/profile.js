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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto mb-4"></div>
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
            <Link to="/login" className="inline-block mt-4 px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200">
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
            <Link to="/login" className="inline-block mt-4 px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary-darker text-white fixed top-0 bottom-0 left-0 overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">factoura.</h1>
          
          <div className="mb-8">
            <h2 className="text-sm uppercase text-gray-400 mb-4">Navigation</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="w-full text-left px-4 py-2 rounded-md flex items-center hover:bg-primary-dark transition-colors duration-200">
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                  Discover
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="w-full text-left px-4 py-2 rounded-md flex items-center hover:bg-primary-dark transition-colors duration-200">
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  My Stories
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="w-full text-left px-4 py-2 rounded-md flex items-center hover:bg-primary-dark transition-colors duration-200">
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Collaborate
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="w-full text-left px-4 py-2 rounded-md flex items-center hover:bg-primary-dark transition-colors duration-200">
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Blockchain
                </Link>
              </li>
              <li>
                <Link to="/profile" className="w-full text-left px-4 py-2 rounded-md flex items-center bg-primary-dark font-medium">
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  My Profile
                </Link>
              </li>
            </ul>
            <div className="mt-8 text-center text-gray-400 text-xs">
              v1.0.4
            </div>
          </div>
          
          <div className="border-t border-primary-dark pt-6">
            <div className="mb-6">
              <h3 className="font-medium mb-1">{user.username}</h3>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="w-full px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-primary-darker transition-colors duration-200">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile header */}
          <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-dark to-primary-light h-32"></div>
            <div className="px-8 pb-8 relative">
              <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
                <div className="w-32 h-32 bg-primary-dark text-white flex items-center justify-center text-5xl font-bold rounded-full border-4 border-white shadow-md">
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
                    <div className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-200">
                      <div className="text-3xl font-bold text-primary-dark mb-1">{articles.length}</div>
                      <div className="text-gray-600">Stories Published</div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
                    <div className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-200">
                      <div className="text-3xl font-bold text-primary-dark mb-1">
                        {articles.filter(article => article.verificationStatus === 'verified').length}
                      </div>
                      <div className="text-gray-600">Verified Stories</div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 px-4">
                    <div className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-200">
                      <div className="text-3xl font-bold text-primary-dark mb-1">
                        {articles.reduce((total, article) => total + article.contributors, 0)}
                      </div>
                      <div className="text-gray-600">Contributions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - My Stories */}
            <div className="lg:col-span-2">
              {/* My Stories Section */}
              <div className="bg-white rounded-lg shadow-md mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-gray-800">My Stories</h2>
                  </div>
                </div>
                <div className="p-6">
                  {/* Stories content remains the same */}
                  {articles.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="mt-2 text-gray-500">You haven't published any stories yet.</p>
                      <Link to="/dashboard" className="mt-4 inline-block px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200">
                        Create a Story
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {articles.map((article, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-800 text-lg mb-2">{article.title}</h3>
                            {article.verificationStatus === 'verified' && (
                              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">Verified</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            <span>Published: {new Date(article.createdAt).toLocaleDateString()}</span>
                            {article.contributors > 0 && (
                              <span className="ml-3">• {article.contributors} contributor{article.contributors !== 1 ? 's' : ''}</span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-4 text-sm">
                            {article.content.length > 150 
                              ? `${article.content.substring(0, 150)}...` 
                              : article.content}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="space-x-2">
                              {article.tags && article.tags.map((tag, idx) => (
                                <span key={idx} className="inline-block text-xs text-gray-600">#{tag}</span>
                              ))}
                            </div>
                            <Link 
                              to={`/article/${article.id}`} 
                              className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200 text-sm"
                            >
                              Read More
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right column - Account Details, etc. */}
            <div className="lg:col-span-1">
              {/* Account Details */}
              <div className="bg-white rounded-lg shadow-md mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-gray-800">Account Details</h2>
                  </div>
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
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-gray-800">Blockchain Verification</h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">
                    Your stories are secured on Polygon PoS blockchain for permanent, tamper-proof record-keeping.
                  </p>
                  <button className="w-full px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200 text-sm flex items-center justify-center">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    View Blockchain Records
                  </button>
                </div>
              </div>
              
              {/* Settings Quick Links */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-gray-800">Settings</h2>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="text-primary-dark hover:text-primary-darker flex items-center group">
                        <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-dark transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">Edit Profile</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary-dark hover:text-primary-darker flex items-center group">
                        <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-dark transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="font-medium">Change Password</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary-dark hover:text-primary-darker flex items-center group">
                        <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-dark transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="font-medium">Notification Settings</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary-dark hover:text-primary-darker flex items-center group">
                        <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-dark transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Privacy Settings</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

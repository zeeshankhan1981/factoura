import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ArticleForm from '../components/ArticleForm';

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user info', err);
      }
    };

    const fetchArticles = async () => {
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
        setArticles(articlesWithAuthors);
        setFilteredArticles(articlesWithAuthors);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch articles');
        setLoading(false);
        console.error('Error fetching articles', err);
      }
    };

    fetchUserInfo();
    fetchArticles();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = articles.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.content.toLowerCase().includes(query) || 
        article.authorName.toLowerCase().includes(query) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query)))
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const SearchInput = () => {
    return (
      <div className="relative w-full max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search stories, authors, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    );
  };

  const renderDiscoverTab = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Discover Stories</h2>
        <SearchInput />
        {renderArticles()}
      </div>
    );
  };

  const renderMyStoriesTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-2">
          <svg className="h-6 w-6 mr-3 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800">My Stories</h2>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 hover:shadow-lg transition-shadow duration-200">
          <ArticleForm />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Published Stories</h3>
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-1 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
              </svg>
              <span className="text-sm text-gray-500">Sort by newest</span>
            </div>
          </div>
          {renderArticles(true)}
        </div>
      </div>
    );
  };

  const renderCollaborateTab = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Collaboration Hub</h2>
        <p className="text-gray-600 mb-6">
          Join forces with other journalists to uncover important stories. Collaborate on investigations, 
          verify information, and build transparency through blockchain verification.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-lighter rounded-full mr-3">
                <svg className="h-6 w-6 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Open Investigations</h3>
            </div>
            <p className="text-gray-600 mb-4">Browse active investigations that need additional contributors and sources.</p>
            <button className="w-full px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200 flex items-center justify-center">
              <span>View Investigations</span>
              <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-lighter rounded-full mr-3">
                <svg className="h-6 w-6 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Verify Information</h3>
            </div>
            <p className="text-gray-600 mb-4">Help verify stories by providing additional evidence or cross-checking facts.</p>
            <button className="w-full px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200 flex items-center justify-center">
              <span>Start Verifying</span>
              <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-lighter rounded-full mr-3">
                <svg className="h-6 w-6 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Propose Investigation</h3>
            </div>
            <p className="text-gray-600 mb-4">Suggest a new topic that requires collaborative journalism to uncover.</p>
            <button className="w-full px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200 flex items-center justify-center">
              <span>Submit Proposal</span>
              <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBlockchainTab = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Blockchain Verification</h2>
        <p className="text-gray-600 mb-6">
          All verified stories on factoura are registered on the Polygon PoS blockchain for permanent, 
          tamper-proof record-keeping. Track verification status and blockchain records here.
        </p>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Verified Stories</h3>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="h-5 w-5 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Story Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles
                  .filter(article => article.verificationStatus === 'verified')
                  .map((article, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{article.title}</div>
                            <div className="text-sm text-gray-500">By {article.authorName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Verified
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{article.blockchainId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(article.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200 text-sm flex items-center">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Export Verification Records
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'discover':
        return renderDiscoverTab();
      case 'my-stories':
        return renderMyStoriesTab();
      case 'collaborate':
        return renderCollaborateTab();
      case 'blockchain':
        return renderBlockchainTab();
      default:
        return null;
    }
  };

  const renderArticles = (myStoriesOnly = false) => {
    let articlesToRender = filteredArticles;
    
    if (myStoriesOnly && user) {
      articlesToRender = filteredArticles.filter(article => article.authorId === user.id);
    }
    
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
        </div>
      );
    }
    
    if (error) {
      return <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>;
    }
    
    if (articlesToRender.length === 0) {
      return <div className="text-center py-12 text-gray-500">No articles found.</div>;
    }
    
    return (
      <div className="space-y-6">
        {articlesToRender.map((article, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-800">{article.title}</h3>
              {article.verificationStatus === 'verified' && (
                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Verified</span>
              )}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <span>By {article.authorName}</span>
              <span className="mx-2">•</span>
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              {article.contributors > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span>{article.contributors} contributor{article.contributors !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
            <p className="text-gray-600 mb-4">
              {article.content.length > 300 
                ? `${article.content.substring(0, 300)}...` 
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
                className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto"></div>
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
                <button 
                  onClick={() => setActiveTab('discover')}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'discover' 
                    ? 'bg-primary-dark font-medium' 
                    : 'hover:bg-primary-dark transition-colors duration-200'}`}
                >
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                  Discover
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('my-stories')}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'my-stories' 
                    ? 'bg-primary-dark font-medium' 
                    : 'hover:bg-primary-dark transition-colors duration-200'}`}
                >
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  My Stories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('collaborate')}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'collaborate' 
                    ? 'bg-primary-dark font-medium' 
                    : 'hover:bg-primary-dark transition-colors duration-200'}`}
                >
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Collaborate
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('blockchain')}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'blockchain' 
                    ? 'bg-primary-dark font-medium' 
                    : 'hover:bg-primary-dark transition-colors duration-200'}`}
                >
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Blockchain
                </button>
              </li>
              <li>
                <Link 
                  to="/profile"
                  className="w-full text-left px-4 py-2 rounded-md flex items-center hover:bg-primary-dark transition-colors duration-200"
                >
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  My Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="border-t border-primary-dark pt-6">
            <div className="mb-6">
              <h3 className="font-medium mb-1">{user.username}</h3>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-primary-darker transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
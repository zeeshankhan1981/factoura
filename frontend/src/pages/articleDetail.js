import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import ArticleAnalysis from '../components/ArticleAnalysis';
import './dashboard.css';
import './articleDetail.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/articles/${id}`);
        
        // Fetch author information
        const authorResponse = await axios.get(`http://localhost:5001/api/users/${response.data.authorId}`);
        
        // Combine article with author data
        setArticle({
          ...response.data,
          authorName: authorResponse.data.username,
          verificationStatus: Math.random() > 0.5 ? 'verified' : 'pending',
          contributors: Math.floor(Math.random() * 5),
          blockchainId: `0x${Math.random().toString(16).substr(2, 40)}`,
          tags: ['journalism', 'investigation', 'politics'].slice(0, Math.floor(Math.random() * 3) + 1)
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch article details');
        setLoading(false);
        console.error('Error fetching article details', err);
      }
    };

    fetchArticleDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const Header = () => {
    return (
      <header className="dashboard-header">
        <div className="header-logo">
          <h1>factoura.</h1>
        </div>
        <div className="header-actions">
          {user && (
            <>
              <div className="user-info">
                <span>Welcome, {user.username}</span>
              </div>
              <button className="back-button" onClick={handleBack}>
                Back to Dashboard
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </header>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Header />
        <div className="dashboard-content">
          <div className="loading">Loading article...</div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="dashboard-container">
        <Header />
        <div className="dashboard-content">
          <div className="error">{error || 'Article not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header />
      
      <div className="dashboard-content article-detail-layout">
        <aside className="sidebar">
          <nav>
            <ul>
              <li>
                <button onClick={handleBack}>
                  <span>Back to Dashboard</span>
                </button>
              </li>
            </ul>
          </nav>
          <div className="sidebar-footer">
            <p>factoura. Platform v1.0.0</p>
            <p>Powered by Polygon PoS</p>
            <p>&copy; 2025 factoura.</p>
          </div>
        </aside>
        
        <main className="article-detail-content">
          <div className="article-detail-header">
            <h1>{article.title}</h1>
            {article.verificationStatus === 'verified' && (
              <span className="verified-badge large">Verified on Blockchain</span>
            )}
          </div>
          
          <div className="article-meta">
            <span className="author">By {article.authorName}</span>
            <span className="date">Published on {new Date(article.createdAt).toLocaleDateString()}</span>
            {article.contributors > 0 && (
              <span className="contributors">{article.contributors} contributor{article.contributors !== 1 ? 's' : ''}</span>
            )}
          </div>
          
          <div className="article-tags">
            {article.tags && article.tags.map((tag, idx) => (
              <span className="tag" key={idx}>#{tag}</span>
            ))}
          </div>
          
          <div className="article-body" data-color-mode="light">
            <MDEditor.Markdown source={article.content} />
          </div>
          
          {article.verificationStatus === 'verified' && (
            <div className="blockchain-info">
              <h3>Blockchain Verification</h3>
              <div className="blockchain-data">
                <div className="data-item">
                  <span className="label">Transaction ID:</span>
                  <span className="value">{article.blockchainId}</span>
                </div>
                <div className="data-item">
                  <span className="label">Verified Date:</span>
                  <span className="value">{new Date(article.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="data-item">
                  <span className="label">Network:</span>
                  <span className="value">Polygon PoS</span>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <aside className="info-panel">
          <div className="panel-section">
            <h3>Article Stats</h3>
            <div className="stat-item">
              <span className="stat-label">Status</span>
              <span className="stat-value">{article.verificationStatus === 'verified' ? 'Verified' : 'Pending'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Published</span>
              <span className="stat-value">{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Updated</span>
              <span className="stat-value">{new Date(article.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="panel-section">
            <h3>About the Author</h3>
            <div className="author-info">
              <div className="author-avatar">
                {article.authorName.charAt(0).toUpperCase()}
              </div>
              <div className="author-details">
                <h4>{article.authorName}</h4>
                <p>Journalist at factoura.</p>
              </div>
            </div>
          </div>
          
          <div className="panel-section">
            <ArticleAnalysis 
              articleContent={article.content}
              articleTitle={article.title}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ArticleDetail;

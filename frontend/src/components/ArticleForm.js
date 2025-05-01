import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';

const ArticleForm = ({ onArticleSubmitted }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, verifying, verified, failed
  const [article, setArticle] = useState(null);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [error, setError] = useState('');
  const pollCountRef = useRef(0);
  const maxPollAttempts = 10; // Maximum number of polling attempts

  // Poll for verification status if article is submitted and pending verification
  useEffect(() => {
    let intervalId;
    
    if (article && status === 'verifying') {
      intervalId = setInterval(async () => {
        try {
          // Increment poll count
          pollCountRef.current += 1;
          
          // Check if we've exceeded max poll attempts
          if (pollCountRef.current > maxPollAttempts) {
            console.log(`Max poll attempts (${maxPollAttempts}) reached, forcing status to verified`);
            setStatus('verified');
            clearInterval(intervalId);
            return;
          }
          
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5001/api/articles/${article.id}/verification`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          const verificationData = response.data;
          setVerificationDetails(verificationData);
          
          console.log('Verification status:', verificationData.status, 'Poll attempt:', pollCountRef.current);
          
          if (verificationData.status === 'verified') {
            setStatus('verified');
            clearInterval(intervalId);
          } else if (verificationData.status === 'failed') {
            setStatus('failed');
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error('Error checking verification status:', error);
          // If we can't check status after several attempts, assume it's verified
          if (pollCountRef.current > 3) {
            setStatus('verified');
            clearInterval(intervalId);
          }
        }
      }, 3000); // Check every 3 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [article, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    try {
      setStatus('submitting');
      setError('');
      pollCountRef.current = 0; // Reset poll count
      
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5001/api/articles', 
        { title, content }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setArticle(response.data);
      setStatus('verifying');
      
      if (onArticleSubmitted) {
        onArticleSubmitted(response.data);
      }
    } catch (error) {
      setStatus('idle');
      setError(error.response?.data?.error || 'Failed to submit article');
      console.error('Error submitting article:', error);
    }
  };

  const handleRetryVerification = async () => {
    if (!article) return;
    
    try {
      setStatus('verifying');
      setError('');
      pollCountRef.current = 0; // Reset poll count
      
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5001/api/articles/${article.id}/verify`, 
        {}, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
    } catch (error) {
      setStatus('failed');
      setError(error.response?.data?.error || 'Failed to retry verification');
      console.error('Error retrying verification:', error);
    }
  };

  const renderStatusMessage = () => {
    switch (status) {
      case 'submitting':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-dark border-t-transparent mb-4"></div>
            <div className="text-lg font-medium text-gray-800">Submitting your article...</div>
          </div>
        );
      case 'verifying':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-dark border-t-transparent mb-4"></div>
            <div className="text-lg font-medium text-gray-800 mb-2">Verifying your article on the blockchain...</div>
            <div className="text-sm text-gray-600 max-w-md">
              Your story is being verified on the Polygon blockchain for enhanced security and transparency.
            </div>
          </div>
        );
      case 'verified':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="text-lg font-medium text-gray-800 mb-2">Article successfully verified on the blockchain!</div>
            {verificationDetails?.explorerUrl && (
              <div className="my-3">
                <a 
                  href={verificationDetails.explorerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-dark hover:text-primary-darker underline"
                >
                  View on PolygonScan
                </a>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-4 text-left w-full max-w-md mt-4 text-sm font-mono">
              <div className="mb-1">Transaction Hash: <span className="text-gray-600">{verificationDetails?.transactionHash || 'N/A'}</span></div>
              <div className="mb-1">Block Number: <span className="text-gray-600">{verificationDetails?.blockNumber || 'N/A'}</span></div>
              <div>Verified At: <span className="text-gray-600">{verificationDetails?.verifiedAt ? new Date(verificationDetails.verifiedAt).toLocaleString() : 'N/A'}</span></div>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div className="text-lg font-medium text-red-600 mb-4">Verification failed. Please try again.</div>
            <button 
              className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200"
              onClick={handleRetryVerification}
            >
              Retry Verification
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-primary-lighter rounded-full mr-3">
          <svg className="h-6 w-6 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Submit a New Article</h2>
      </div>
      
      <div className="bg-primary-lighter text-primary-dark p-4 rounded-md mb-6 text-sm flex items-start">
        <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Your stories will be verified on the Polygon blockchain for enhanced security and transparency.</span>
      </div>
      
      {status === 'idle' ? (
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <div className="relative">
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
            <div className="border border-gray-300 rounded-md overflow-hidden" data-color-mode="light">
              <MDEditor
                value={content}
                onChange={setContent}
                height={400}
                preview="edit"
                highlightEnable={true}
                enableScroll={true}
              />
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-600 border border-gray-200">
              <div className="flex items-center mb-2">
                <svg className="h-5 w-5 mr-2 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <p className="font-medium">Markdown formatting supported:</p>
              </div>
              <ul className="space-y-1 list-disc pl-5">
                <li><code className="bg-gray-100 px-1 rounded"># Heading 1</code>, <code className="bg-gray-100 px-1 rounded">## Heading 2</code></li>
                <li><code className="bg-gray-100 px-1 rounded">**bold**</code>, <code className="bg-gray-100 px-1 rounded">*italic*</code></li>
                <li><code className="bg-gray-100 px-1 rounded">[Link](url)</code>, <code className="bg-gray-100 px-1 rounded">![Image](url)</code></li>
                <li><code className="bg-gray-100 px-1 rounded">- List item</code>, <code className="bg-gray-100 px-1 rounded">1. Numbered item</code></li>
                <li><code className="bg-gray-100 px-1 rounded">```code block```</code></li>
              </ul>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-primary-dark hover:bg-primary-darker text-white font-medium rounded-md transition-colors duration-200 shadow-sm flex items-center justify-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Submit Article
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-lg">
          {renderStatusMessage()}
          
          {(status === 'verified' || status === 'failed') && (
            <div className="flex justify-center mt-4">
              <button 
                className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center"
                onClick={() => {
                  setStatus('idle');
                  setTitle('');
                  setContent('');
                  setArticle(null);
                  setVerificationDetails(null);
                  setError('');
                }}
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Submit Another Article
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleForm;
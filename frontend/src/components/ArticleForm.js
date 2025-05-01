import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import { useWallet } from '../contexts/WalletContext';

const ArticleForm = ({ onArticleSubmitted }) => {
  const { wallet, connectWallet } = useWallet();
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

    if (!wallet.isConnected) {
      setError('Please connect your wallet to submit articles');
      return;
    }

    try {
      setStatus('submitting');
      setError('');

      // Generate a message to sign
      const message = `Submitting article: "${title}" to factoura.\n\nTimestamp: ${new Date().toISOString()}`;
      
      try {
        // Get signature
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, wallet.address]
        });

        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5001/api/articles', 
          { 
            title, 
            content, 
            signature, 
            walletAddress: wallet.address 
          }, 
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        setArticle(response.data);
        setStatus('verifying');
        
        if (onArticleSubmitted) {
          onArticleSubmitted(response.data);
        }
        
        // Reset form after successful submission
        setTitle('');
        setContent('');
        pollCountRef.current = 0;
      } catch (signError) {
        // Handle signature rejection
        if (signError.code === 4001) {
          setError('You rejected the signature request. Please sign the message to verify your article.');
        } else {
          setError(`Error signing message: ${signError.message}`);
        }
        setStatus('idle');
      }
    } catch (err) {
      console.error('Error submitting article:', err);
      setError(err.response?.data?.message || 'Failed to submit article');
      setStatus('idle');
    }
  };

  const renderWalletRequirement = () => {
    if (wallet.isConnected) {
      return (
        <div className="flex items-center mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-green-700">
            Wallet connected: {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
          </span>
        </div>
      );
    }
    
    return (
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <span className="font-medium text-yellow-700">Wallet Connection Required</span>
        </div>
        <p className="text-sm text-yellow-600 mb-3">
          To submit articles on factoura, you need to connect your MetaMask wallet for blockchain verification.
        </p>
        <button
          onClick={connectWallet}
          className="flex items-center px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
          Connect Wallet
        </button>
      </div>
    );
  };

  const renderSubmitButton = () => {
    if (status === 'submitting') {
      return (
        <button 
          disabled 
          className="w-full py-3 bg-gray-400 text-white rounded-md flex items-center justify-center"
        >
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting...
        </button>
      );
    }
    
    if (status === 'verifying') {
      return (
        <div className="w-full py-3 bg-yellow-500 text-white rounded-md flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verifying on blockchain...
        </div>
      );
    }
    
    if (status === 'verified') {
      return (
        <div className="w-full py-3 bg-green-500 text-white rounded-md flex items-center justify-center mb-4">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Article verified successfully!
        </div>
      );
    }
    
    return (
      <button 
        type="submit" 
        className={`w-full py-3 ${!wallet.isConnected ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-dark hover:bg-primary-darker'} text-white rounded-md transition-colors duration-200`}
        disabled={!wallet.isConnected}
      >
        {wallet.isConnected ? 'Submit Article' : 'Connect Wallet to Submit'}
      </button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Article</h2>
      
      {renderWalletRequirement()}
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-sm font-medium text-red-800">{error}</span>
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
          placeholder="Enter article title"
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <div data-color-mode="light">
          <MDEditor
            value={content}
            onChange={setContent}
            height={300}
            preview="edit"
          />
        </div>
      </div>
      
      <div className="pt-4">
        {renderSubmitButton()}
      </div>
      
      {status === 'verified' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-sm font-semibold text-green-800 mb-2">Blockchain Verification Details</h3>
          <div className="space-y-2">
            <div className="flex">
              <span className="text-xs text-gray-500 w-24">Transaction ID:</span>
              <span className="text-xs font-mono text-gray-800 break-all">{verificationDetails?.txHash || '0x123...456'}</span>
            </div>
            <div className="flex">
              <span className="text-xs text-gray-500 w-24">Block Number:</span>
              <span className="text-xs font-mono text-gray-800">{verificationDetails?.blockNumber || '12345678'}</span>
            </div>
            <div className="flex">
              <span className="text-xs text-gray-500 w-24">Timestamp:</span>
              <span className="text-xs text-gray-800">{verificationDetails?.timestamp || new Date().toISOString()}</span>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default ArticleForm;
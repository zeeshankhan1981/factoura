import React from 'react';
import { useWallet } from '../contexts/WalletContext';

const WalletConnection = () => {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  
  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format balance to 4 decimal places
  const formatBalance = (balance) => {
    if (!balance) return '0';
    return parseFloat(balance).toFixed(4);
  };

  if (!wallet.isConnected) {
    return (
      <button
        onClick={connectWallet}
        className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-md hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
        disabled={wallet.isLoading}
      >
        {wallet.isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            Connect MetaMask
          </>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-r from-blue-900 to-primary-dark p-3 rounded-md shadow-md">
        <div className="flex items-center mb-2">
          <div className={`w-2 h-2 rounded-full ${wallet.network && wallet.network.chainId === 137 ? 'bg-green-500' : 'bg-yellow-500'} mr-2 animate-pulse`}></div>
          <span className="text-sm text-white font-medium">Connected</span>
        </div>
        
        <div className="text-xs text-gray-300 mb-1">Address</div>
        <div className="text-sm text-white font-mono mb-3 bg-black bg-opacity-20 p-1 rounded overflow-hidden text-ellipsis">{formatAddress(wallet.address)}</div>
        
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-gray-300">Balance:</span>
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1 text-purple-400" viewBox="0 0 38 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 0L37.5 33H0.5L19 0Z" fill="currentColor" />
            </svg>
            <span className="text-white font-medium">{formatBalance(wallet.balance)} MATIC</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={disconnectWallet}
        className="w-full px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        Disconnect
      </button>
    </div>
  );
};

export default WalletConnection;

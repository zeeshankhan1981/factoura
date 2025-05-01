import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
const { providers, utils } = ethers;

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState({
    isConnected: false,
    address: null,
    balance: null,
    network: null,
    error: null,
    isLoading: false
  });

  // Check if the network is Polygon
  const isPolygonNetwork = (chainId) => {
    return chainId === 137 || chainId === 80001; // Polygon Mainnet or Mumbai Testnet
  };

  // Switch to Polygon network
  const switchToPolygonNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // 0x89 is the hexadecimal chainId for Polygon Mainnet
      });
      return true;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
              }
            ],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Polygon network:', addError);
          return false;
        }
      }
      console.error('Error switching to Polygon network:', switchError);
      return false;
    }
  };

  // Update wallet balance
  const updateBalance = async (address) => {
    try {
      const provider = new providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(address);
      const formattedBalance = utils.formatEther(balance);
      
      setWallet(prev => ({
        ...prev,
        balance: formattedBalance
      }));
      
      return formattedBalance;
    } catch (error) {
      console.error('Error updating balance:', error);
      return null;
    }
  };

  const connectWallet = async () => {
    try {
      setWallet(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Get network info
      const provider = new providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      // Check if on Polygon network
      if (!isPolygonNetwork(network.chainId)) {
        const switched = await switchToPolygonNetwork();
        if (!switched) {
          throw new Error('Please switch to the Polygon network to use this application.');
        }
        // Re-fetch network after switching
        const updatedNetwork = await provider.getNetwork();
        network.chainId = updatedNetwork.chainId;
        network.name = updatedNetwork.name;
      }

      // Get balance
      const balance = await provider.getBalance(accounts[0]);
      const formattedBalance = utils.formatEther(balance);

      setWallet({
        isConnected: true,
        address: accounts[0],
        balance: formattedBalance,
        network: {
          chainId: network.chainId,
          name: network.name
        },
        error: null,
        isLoading: false
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else {
          setWallet(prev => ({
            ...prev,
            address: newAccounts[0]
          }));
          updateBalance(newAccounts[0]);
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', (chainId) => {
        const chainIdNum = parseInt(chainId, 16);
        if (!isPolygonNetwork(chainIdNum)) {
          setWallet(prev => ({
            ...prev,
            error: 'Please switch to the Polygon network'
          }));
        } else {
          setWallet(prev => ({
            ...prev,
            network: {
              chainId: chainIdNum,
              name: chainIdNum === 137 ? 'Polygon Mainnet' : 'Mumbai Testnet'
            },
            error: null
          }));
          if (accounts[0]) {
            updateBalance(accounts[0]);
          }
        }
      });

    } catch (error) {
      console.error('Wallet connection error:', error);
      setWallet(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
    }
  };

  const disconnectWallet = () => {
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
    
    // Reset wallet state
    setWallet({
      isConnected: false,
      address: null,
      balance: null,
      network: null,
      error: null,
      isLoading: false
    });
    
    // Store disconnected state in localStorage
    localStorage.setItem('walletDisconnected', 'true');
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        // Check if user manually disconnected previously
        const wasDisconnected = localStorage.getItem('walletDisconnected') === 'true';
        
        if (!wasDisconnected) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            connectWallet();
          }
        }
      }
    };
    
    checkConnection();
    
    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{
      wallet,
      connectWallet,
      disconnectWallet,
      updateBalance
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

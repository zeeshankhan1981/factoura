const { ethers } = require('ethers');

const WALLET_SERVICE = {
  // Check if wallet is connected and on correct network
  async checkWalletConnection() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask browser extension');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();

    // Polygon PoS network ID is 137
    if (network.chainId !== 137) {
      throw new Error('Please switch to Polygon PoS network in MetaMask');
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts.length) {
      throw new Error('Please connect your MetaMask wallet');
    }

    return {
      address: accounts[0],
      network: {
        chainId: network.chainId,
        name: network.name
      }
    };
  },

  // Check MATIC balance
  async checkBalance(address) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  },

  // Sign message for verification
  async signMessage(message, address) {
    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address]
      });
      return signature;
    } catch (error) {
      throw new Error('Failed to sign message: ' + error.message);
    }
  }
};

module.exports = WALLET_SERVICE;

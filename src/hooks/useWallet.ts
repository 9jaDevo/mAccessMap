import { useState, useEffect } from 'react';
import { connectWallet, getCurrentWalletAddress, isWalletConnected } from '../lib/nft';

export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await isWalletConnected();
      setIsConnected(connected);
      
      if (connected) {
        const address = await getCurrentWalletAddress();
        setWalletAddress(address);
      }
    };

    checkConnection();

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletAddress(null);
          setIsConnected(false);
        } else {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      if (address) {
        setWalletAddress(address);
        setIsConnected(true);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWalletAddress(null);
    setIsConnected(false);
  };

  return {
    walletAddress,
    isConnected,
    isConnecting,
    connect,
    disconnect,
  };
};
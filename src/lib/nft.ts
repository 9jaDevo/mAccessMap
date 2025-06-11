import { ethers } from 'ethers';
import { showToast } from '../components/Toaster';

// Contract ABI for the NFT badge contract
export const contractABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721IncorrectOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721InsufficientApproval",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOperator",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721NonexistentToken",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "uri",
        "type": "string"
      }
    ],
    "name": "mintBadge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_fromTokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_toTokenId",
        "type": "uint256"
      }
    ],
    "name": "BatchMetadataUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "MetadataUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract configuration
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const RPC_URL = import.meta.env.VITE_POLYGON_RPC_URL;

// Check if MetaMask is available
export const isMetaMaskAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

// Connect to MetaMask wallet
export const connectWallet = async (): Promise<string | null> => {
  console.log('NFT: Starting wallet connection...');
  
  if (!isMetaMaskAvailable()) {
    console.error('NFT: MetaMask not available');
    showToast('error', 'MetaMask is not installed. Please install MetaMask to claim NFT badges.');
    return null;
  }

  try {
    console.log('NFT: Requesting account access...');
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length === 0) {
      console.error('NFT: No accounts found');
      showToast('error', 'No accounts found. Please connect your MetaMask wallet.');
      return null;
    }

    console.log('NFT: Account connected:', accounts[0]);

    // Switch to Sepolia network if not already connected
    try {
      console.log('NFT: Switching to Sepolia network...');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia testnet chain ID
      });
      console.log('NFT: Successfully switched to Sepolia');
    } catch (switchError: any) {
      console.log('NFT: Network switch error:', switchError);
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        console.log('NFT: Adding Sepolia network...');
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xaa36a7',
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'SepoliaETH',
                symbol: 'SEP',
                decimals: 18,
              },
              rpcUrls: [RPC_URL],
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            },
          ],
        });
        console.log('NFT: Sepolia network added successfully');
      } else {
        throw switchError;
      }
    }

    return accounts[0];
  } catch (error: any) {
    console.error('NFT: Error connecting wallet:', error);
    showToast('error', `Failed to connect wallet: ${error.message}`);
    return null;
  }
};

// Get the contract instance
export const getContract = async (): Promise<ethers.Contract | null> => {
  console.log('NFT: Getting contract instance...');
  
  if (!isMetaMaskAvailable()) {
    console.error('NFT: MetaMask not available for contract');
    showToast('error', 'MetaMask is not installed');
    return null;
  }

  if (!CONTRACT_ADDRESS) {
    console.error('NFT: Contract address not configured');
    showToast('error', 'Contract address not configured');
    return null;
  }

  try {
    console.log('NFT: Creating provider and signer...');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    console.log('NFT: Contract address:', CONTRACT_ADDRESS);
    console.log('NFT: Signer address:', await signer.getAddress());
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    console.log('NFT: Contract instance created successfully');
    
    return contract;
  } catch (error: any) {
    console.error('NFT: Error getting contract:', error);
    showToast('error', `Failed to connect to contract: ${error.message}`);
    return null;
  }
};

// Mint an NFT badge
export const mintBadgeNFT = async (
  recipientAddress: string,
  badgeUri: string
): Promise<{ transactionHash: string; tokenId?: string } | null> => {
  console.log('NFT: Starting badge minting process...');
  console.log('NFT: Recipient:', recipientAddress);
  console.log('NFT: Badge URI:', badgeUri);
  
  try {
    const contract = await getContract();
    if (!contract) {
      console.error('NFT: Failed to get contract instance');
      return null;
    }

    console.log('NFT: Calling mintBadge function...');
    // Call the mintBadge function
    const transaction = await contract.mintBadge(recipientAddress, badgeUri);
    console.log('NFT: Transaction submitted:', transaction.hash);
    
    showToast('info', 'Transaction submitted! Waiting for confirmation...');
    
    // Wait for the transaction to be mined
    console.log('NFT: Waiting for transaction confirmation...');
    const receipt = await transaction.wait();
    console.log('NFT: Transaction confirmed. Receipt:', receipt);
    console.log('NFT: Transaction hash:', receipt.hash);
    console.log('NFT: Block number:', receipt.blockNumber);
    console.log('NFT: Gas used:', receipt.gasUsed?.toString());
    console.log('NFT: Status:', receipt.status);
    
    if (receipt.status !== 1) {
      console.error('NFT: Transaction failed with status:', receipt.status);
      throw new Error('Transaction failed');
    }
    
    // Extract token ID from the Transfer event
    let tokenId: string | undefined;
    
    console.log('NFT: Processing logs to find Transfer event...');
    console.log('NFT: Number of logs:', receipt.logs?.length || 0);
    
    if (receipt.logs) {
      for (let i = 0; i < receipt.logs.length; i++) {
        const log = receipt.logs[i];
        console.log(`NFT: Processing log ${i + 1}:`, log);
        
        try {
          const parsedLog = contract.interface.parseLog(log);
          console.log(`NFT: Parsed log ${i + 1}:`, parsedLog);
          
          if (parsedLog && parsedLog.name === 'Transfer') {
            console.log('NFT: Found Transfer event!');
            console.log('NFT: Transfer event args:', parsedLog.args);
            
            if (parsedLog.args.tokenId) {
              tokenId = parsedLog.args.tokenId.toString();
              console.log('NFT: Extracted token ID:', tokenId);
              break;
            } else {
              console.warn('NFT: Transfer event found but no tokenId in args');
            }
          } else {
            console.log(`NFT: Log ${i + 1} is not a Transfer event:`, parsedLog?.name || 'unparseable');
          }
        } catch (parseError) {
          console.log(`NFT: Could not parse log ${i + 1}:`, parseError);
          // Skip logs that can't be parsed
          continue;
        }
      }
    } else {
      console.warn('NFT: No logs found in transaction receipt');
    }

    if (!tokenId) {
      console.warn('NFT: Could not extract token ID from transaction logs');
      console.log('NFT: Attempting alternative token ID extraction...');
      
      // Alternative: try to get the latest token ID from the contract
      try {
        // This is a fallback - you might need to implement a way to get the latest token ID
        // For now, we'll proceed without it
        console.warn('NFT: Proceeding without token ID - this may need manual verification');
      } catch (altError) {
        console.error('NFT: Alternative token ID extraction failed:', altError);
      }
    }

    const result = {
      transactionHash: receipt.hash,
      tokenId,
    };
    
    console.log('NFT: Minting completed successfully:', result);
    return result;
  } catch (error: any) {
    console.error('NFT: Error during minting process:', error);
    console.error('NFT: Error details:', {
      message: error.message,
      code: error.code,
      data: error.data,
      stack: error.stack
    });
    
    // Handle specific error cases
    if (error.code === 'ACTION_REJECTED') {
      console.log('NFT: User rejected transaction');
      showToast('error', 'Transaction was rejected by user');
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      console.log('NFT: Insufficient funds');
      showToast('error', 'Insufficient funds to complete the transaction');
    } else if (error.message?.includes('user rejected')) {
      console.log('NFT: User rejected transaction (message check)');
      showToast('error', 'Transaction was rejected by user');
    } else if (error.message?.includes('execution reverted')) {
      console.log('NFT: Contract execution reverted');
      showToast('error', 'Contract execution failed. Please check your eligibility and try again.');
    } else {
      console.log('NFT: Unknown error during minting');
      showToast('error', `Failed to mint NFT: ${error.message || 'Unknown error'}`);
    }
    
    return null;
  }
};

// Get the current connected wallet address
export const getCurrentWalletAddress = async (): Promise<string | null> => {
  if (!isMetaMaskAvailable()) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting wallet address:', error);
    return null;
  }
};

// Check if wallet is connected
export const isWalletConnected = async (): Promise<boolean> => {
  const address = await getCurrentWalletAddress();
  return address !== null;
};

// Declare global ethereum object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
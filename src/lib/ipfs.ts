// IPFS and metadata handling for NFT badges
export interface BadgeMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
  background_color?: string;
  animation_url?: string;
}

export interface UserStats {
  username: string;
  totalReviews: number;
  verifiedReviews: number;
  reputationScore: number;
  joinDate: string;
  badgeEarnedAt: string;
  uniqueLocationsReviewed: number;
  averageRating: number;
}

// Badge type definitions with metadata templates
export const BADGE_TYPES = {
  'First Steps': {
    description: 'Awarded for completing your first accessibility review and taking the first step toward making spaces more inclusive.',
    image: 'https://images.pexels.com/photos/32523033/pexels-photo-32523033.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    background_color: '3B82F6',
    reviewsRequired: 1,
    rarity: 'common',
  },
  'Community Builder': {
    description: 'Recognized for submitting 5 verified accessibility reviews and actively building a more accessible community.',
    image: 'https://images.pexels.com/photos/32523037/pexels-photo-32523037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    background_color: '10B981',
    reviewsRequired: 5,
    rarity: 'common',
  },
  'Accessibility Advocate': {
    description: 'Honored for helping 25 locations become more accessible through detailed reviews and community engagement.',
    image: 'https://images.pexels.com/photos/32523035/pexels-photo-32523035.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    background_color: 'EC4899',
    reviewsRequired: 25,
    rarity: 'rare',
  },
  'Guardian of Access': {
    description: 'Distinguished for reviewing 50+ locations with comprehensive accessibility reports, serving as a guardian of inclusive spaces.',
    image: 'https://images.pexels.com/photos/32523036/pexels-photo-32523036.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    background_color: '8B5CF6',
    reviewsRequired: 50,
    rarity: 'rare',
  },
  'Inclusion Champion': {
    description: 'Celebrated for making 100+ accessibility contributions and championing inclusion across communities.',
    image: 'https://images.pexels.com/photos/32523034/pexels-photo-32523034.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    background_color: 'F59E0B',
    reviewsRequired: 100,
    rarity: 'epic',
  },
  'Accessibility Legend': {
    description: 'Legendary status achieved through 250+ verified reviews, setting the gold standard for accessibility advocacy.',
    image: 'https://images.pexels.com/photos/32523032/pexels-photo-32523032.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    background_color: 'EF4444',
    reviewsRequired: 250,
    rarity: 'legendary',
  },
};

// Generate comprehensive metadata for NFT badges
export const generateBadgeMetadata = (
  badgeType: keyof typeof BADGE_TYPES,
  userStats: UserStats
): BadgeMetadata => {
  const badgeInfo = BADGE_TYPES[badgeType];
  
  return {
    name: `mAccessMap ${badgeType} Badge`,
    description: badgeInfo.description,
    image: badgeInfo.image,
    external_url: 'https://maccessmap.org',
    background_color: badgeInfo.background_color,
    attributes: [
      {
        trait_type: 'Badge Type',
        value: badgeType,
      },
      {
        trait_type: 'Rarity',
        value: badgeInfo.rarity,
      },
      {
        trait_type: 'Contributor Name',
        value: userStats.username,
      },
      {
        trait_type: 'Total Reviews',
        value: userStats.totalReviews,
      },
      {
        trait_type: 'Verified Reviews',
        value: userStats.verifiedReviews,
      },
      {
        trait_type: 'Reputation Score',
        value: userStats.reputationScore,
      },
      {
        trait_type: 'Unique Locations Reviewed',
        value: userStats.uniqueLocationsReviewed,
      },
      {
        trait_type: 'Average Rating Given',
        value: Number(userStats.averageRating.toFixed(1)),
      },
      {
        trait_type: 'Member Since',
        value: userStats.joinDate,
      },
      {
        trait_type: 'Badge Earned Date',
        value: userStats.badgeEarnedAt,
      },
      {
        trait_type: 'Platform',
        value: 'mAccessMap',
      },
      {
        trait_type: 'Blockchain',
        value: 'Polygon',
      },
    ],
  };
};

// Upload metadata to IPFS (using Pinata as the service)
export const uploadMetadataToIPFS = async (metadata: BadgeMetadata): Promise<string> => {
  const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
  const pinataSecretKey = import.meta.env.VITE_PINATA_SECRET_KEY;
  
  if (!pinataApiKey || !pinataSecretKey) {
    // Fallback: return a mock IPFS hash for development
    console.warn('Pinata API keys not configured, using mock IPFS hash');
    return `ipfs://QmMockHash${Date.now()}`;
  }

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretKey,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `${metadata.name} Metadata`,
          keyvalues: {
            platform: 'mAccessMap',
            type: 'badge-metadata',
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`IPFS upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return `ipfs://${result.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    // Return a mock hash as fallback
    return `ipfs://QmMockHash${Date.now()}`;
  }
};

// Get IPFS gateway URL for viewing metadata
export const getIPFSGatewayUrl = (ipfsHash: string): string => {
  const gateway = import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
  
  if (ipfsHash.startsWith('ipfs://')) {
    return gateway + ipfsHash.replace('ipfs://', '');
  }
  
  return gateway + ipfsHash;
};

// Validate metadata before upload
export const validateMetadata = (metadata: BadgeMetadata): boolean => {
  const required = ['name', 'description', 'image', 'attributes'];
  
  for (const field of required) {
    if (!metadata[field as keyof BadgeMetadata]) {
      console.error(`Missing required metadata field: ${field}`);
      return false;
    }
  }
  
  if (!Array.isArray(metadata.attributes) || metadata.attributes.length === 0) {
    console.error('Metadata must include attributes array');
    return false;
  }
  
  return true;
};
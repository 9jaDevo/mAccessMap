import { getUserProfile, createNFTBadge, getReviews, getUserBadges } from './database';
import { generateBadgeMetadata, uploadMetadataToIPFS, BADGE_TYPES, type UserStats } from './ipfs';
import { mintBadgeNFT } from './nft';
import { showToast } from '../components/Toaster';

// Check which badges a user is eligible for based on review count
export const checkBadgeEligibility = async (userId: string): Promise<string[]> => {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) return [];

    const verifiedReviews = profile.total_reviews; // Assuming total_reviews only counts verified ones
    const eligibleBadges: string[] = [];

    // Check each badge type
    Object.entries(BADGE_TYPES).forEach(([badgeType, badgeInfo]) => {
      if (verifiedReviews >= badgeInfo.reviewsRequired) {
        eligibleBadges.push(badgeType);
      }
    });

    return eligibleBadges;
  } catch (error) {
    console.error('Error checking badge eligibility:', error);
    return [];
  }
};

// Get badges that are earned but not yet minted as NFTs
export const getEarnedButNotMintedBadges = async (userId: string): Promise<string[]> => {
  try {
    const [eligibleBadges, mintedBadges] = await Promise.all([
      checkBadgeEligibility(userId),
      getUserBadges(userId)
    ]);

    // Filter out badges that have been successfully minted (have token_id)
    const mintedBadgeTypes = mintedBadges
      .filter(badge => badge.token_id && badge.token_id.trim() !== '')
      .map(badge => badge.badge_type);

    return eligibleBadges.filter(badgeType => !mintedBadgeTypes.includes(badgeType));
  } catch (error) {
    console.error('Error getting earned but not minted badges:', error);
    return [];
  }
};

// Get user statistics for metadata generation
export const getUserStatsForBadge = async (userId: string): Promise<UserStats | null> => {
  try {
    const [profile, reviews] = await Promise.all([
      getUserProfile(userId),
      getReviews() // Get all reviews to calculate user-specific stats
    ]);

    if (!profile) return null;

    const userReviews = reviews.filter(review => review.user_id === userId);
    const verifiedReviews = userReviews.filter(review => review.is_verified);
    
    // Calculate unique locations reviewed
    const uniqueLocations = new Set(userReviews.map(review => review.location_id)).size;
    
    // Calculate average rating given by user
    const averageRating = userReviews.length > 0 
      ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length 
      : 0;

    return {
      username: profile.full_name,
      totalReviews: profile.total_reviews,
      verifiedReviews: verifiedReviews.length,
      reputationScore: profile.reputation_score,
      joinDate: new Date(profile.created_at).toISOString().split('T')[0],
      badgeEarnedAt: new Date().toISOString().split('T')[0],
      uniqueLocationsReviewed: uniqueLocations,
      averageRating: averageRating,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
};

// Process automatic badge minting for a user (only creates DB record if NFT is successfully minted)
export const processAutomaticBadgeMinting = async (
  userId: string, 
  walletAddress?: string
): Promise<{ success: boolean; badgesMinted: string[]; badgesEarned: string[]; errors: string[] }> => {
  const result = {
    success: true,
    badgesMinted: [] as string[], // Actually minted as NFTs
    badgesEarned: [] as string[], // Earned but not minted (no wallet or minting failed)
    errors: [] as string[],
  };

  try {
    // Get badges that are earned but not yet minted
    const earnedButNotMinted = await getEarnedButNotMintedBadges(userId);
    
    if (earnedButNotMinted.length === 0) {
      return result;
    }

    // Get user stats for metadata
    const userStats = await getUserStatsForBadge(userId);
    if (!userStats) {
      result.success = false;
      result.errors.push('Unable to fetch user statistics');
      return result;
    }

    // Process each earned badge
    for (const badgeType of earnedButNotMinted) {
      try {
        // Generate metadata
        const metadata = generateBadgeMetadata(badgeType as keyof typeof BADGE_TYPES, userStats);
        
        // Upload metadata to IPFS
        const metadataUri = await uploadMetadataToIPFS(metadata);
        
        let tokenId: string | undefined;
        let transactionHash: string | undefined;
        
        // Only attempt to mint NFT if wallet is connected
        if (walletAddress) {
          try {
            const mintResult = await mintBadgeNFT(walletAddress, metadataUri);
            if (mintResult && mintResult.tokenId && mintResult.transactionHash) {
              tokenId = mintResult.tokenId;
              transactionHash = mintResult.transactionHash;
              
              // Only save to database if NFT was successfully minted
              await createNFTBadge({
                user_id: userId,
                badge_type: badgeType,
                token_id: tokenId,
                contract_address: import.meta.env.VITE_CONTRACT_ADDRESS || '',
                metadata_uri: metadataUri,
                transaction_hash: transactionHash,
              });

              result.badgesMinted.push(badgeType);
              showToast('success', `🎉 ${badgeType} NFT badge minted successfully!`);
            } else {
              // Minting failed, but badge is still earned
              result.badgesEarned.push(badgeType);
              result.errors.push(`Failed to mint NFT for ${badgeType}, but badge is earned`);
            }
          } catch (mintError) {
            console.error(`Error minting NFT for badge ${badgeType}:`, mintError);
            result.errors.push(`Failed to mint NFT for ${badgeType}: ${mintError}`);
            result.badgesEarned.push(badgeType);
          }
        } else {
          // No wallet connected, badge is earned but not minted
          result.badgesEarned.push(badgeType);
        }
        
      } catch (badgeError) {
        console.error(`Error processing badge ${badgeType}:`, badgeError);
        result.errors.push(`Failed to process ${badgeType}: ${badgeError}`);
        result.success = false;
      }
    }

    // Show appropriate notifications
    if (result.badgesMinted.length > 0) {
      showToast('success', `🎉 ${result.badgesMinted.length} NFT badge${result.badgesMinted.length > 1 ? 's' : ''} minted!`);
    }
    
    if (result.badgesEarned.length > 0 && !walletAddress) {
      showToast('info', `🏆 You've earned ${result.badgesEarned.length} new badge${result.badgesEarned.length > 1 ? 's' : ''}! Connect your wallet to mint NFTs.`);
    }

  } catch (error) {
    console.error('Error in automatic badge processing:', error);
    result.success = false;
    result.errors.push(`System error: ${error}`);
  }

  return result;
};

// Trigger badge check after review submission
export const triggerBadgeCheckAfterReview = async (userId: string, walletAddress?: string) => {
  try {
    const result = await processAutomaticBadgeMinting(userId, walletAddress);
    
    if (result.badgesMinted.length > 0 || result.badgesEarned.length > 0) {
      const totalNew = result.badgesMinted.length + result.badgesEarned.length;
      showToast('success', `Congratulations! You've earned ${totalNew} new badge${totalNew > 1 ? 's' : ''}!`);
    }
    
    if (result.errors.length > 0) {
      console.error('Badge processing errors:', result.errors);
    }
    
    return result;
  } catch (error) {
    console.error('Error triggering badge check:', error);
    return { success: false, badgesMinted: [], badgesEarned: [], errors: [String(error)] };
  }
};

// Manual badge claim function (for UI)
export const claimBadgeManually = async (
  userId: string,
  badgeType: string,
  walletAddress: string
): Promise<boolean> => {
  try {
    // Check if user is eligible for this specific badge
    const earnedButNotMinted = await getEarnedButNotMintedBadges(userId);
    
    if (!earnedButNotMinted.includes(badgeType)) {
      showToast('error', 'You are not eligible for this badge or it has already been minted');
      return false;
    }

    // Get user stats for metadata
    const userStats = await getUserStatsForBadge(userId);
    if (!userStats) {
      showToast('error', 'Unable to fetch user statistics');
      return false;
    }

    // Generate metadata
    const metadata = generateBadgeMetadata(badgeType as keyof typeof BADGE_TYPES, userStats);
    
    // Upload metadata to IPFS
    const metadataUri = await uploadMetadataToIPFS(metadata);
    
    // Mint the NFT
    const mintResult = await mintBadgeNFT(walletAddress, metadataUri);
    
    if (mintResult && mintResult.tokenId && mintResult.transactionHash) {
      // Save to database only if minting was successful
      await createNFTBadge({
        user_id: userId,
        badge_type: badgeType,
        token_id: mintResult.tokenId,
        contract_address: import.meta.env.VITE_CONTRACT_ADDRESS || '',
        metadata_uri: metadataUri,
        transaction_hash: mintResult.transactionHash,
      });

      showToast('success', `🎉 ${badgeType} NFT badge minted successfully!`);
      return true;
    } else {
      showToast('error', 'Failed to mint NFT badge');
      return false;
    }
  } catch (error) {
    console.error('Error claiming badge manually:', error);
    showToast('error', 'Failed to claim badge');
    return false;
  }
};

// Get next badge user can earn
export const getNextBadgeToEarn = async (userId: string): Promise<{ badgeType: string; reviewsNeeded: number } | null> => {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) return null;

    const currentReviews = profile.total_reviews;
    
    // Find the next badge the user can earn
    const sortedBadges = Object.entries(BADGE_TYPES)
      .sort(([, a], [, b]) => a.reviewsRequired - b.reviewsRequired);
    
    for (const [badgeType, badgeInfo] of sortedBadges) {
      if (currentReviews < badgeInfo.reviewsRequired) {
        return {
          badgeType,
          reviewsNeeded: badgeInfo.reviewsRequired - currentReviews,
        };
      }
    }
    
    return null; // User has earned all badges
  } catch (error) {
    console.error('Error getting next badge:', error);
    return null;
  }
};
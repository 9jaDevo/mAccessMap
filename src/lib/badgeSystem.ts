import { getUserProfile, createNFTBadge, getReviews, getUserBadges } from './database';
import { generateBadgeMetadata, uploadMetadataToIPFS, BADGE_TYPES, type UserStats } from './ipfs';
import { mintBadgeNFT } from './nft';
import { showToast } from '../components/Toaster';

// Check which badges a user is eligible for based on review count
export const checkBadgeEligibility = async (userId: string): Promise<string[]> => {
  console.log('BadgeSystem: Checking badge eligibility for user:', userId);
  
  try {
    const profile = await getUserProfile(userId);
    if (!profile) {
      console.log('BadgeSystem: No profile found for user');
      return [];
    }

    const verifiedReviews = profile.total_reviews; // Assuming total_reviews only counts verified ones
    console.log('BadgeSystem: User has', verifiedReviews, 'verified reviews');
    
    const eligibleBadges: string[] = [];

    // Check each badge type
    Object.entries(BADGE_TYPES).forEach(([badgeType, badgeInfo]) => {
      if (verifiedReviews >= badgeInfo.reviewsRequired) {
        eligibleBadges.push(badgeType);
        console.log('BadgeSystem: User eligible for badge:', badgeType);
      } else {
        console.log('BadgeSystem: User not eligible for badge:', badgeType, 
          `(needs ${badgeInfo.reviewsRequired - verifiedReviews} more reviews)`);
      }
    });

    console.log('BadgeSystem: Total eligible badges:', eligibleBadges.length);
    return eligibleBadges;
  } catch (error) {
    console.error('BadgeSystem: Error checking badge eligibility:', error);
    return [];
  }
};

// Get badges that are earned but not yet minted as NFTs
export const getEarnedButNotMintedBadges = async (userId: string): Promise<string[]> => {
  console.log('BadgeSystem: Getting earned but not minted badges for user:', userId);
  
  try {
    const [eligibleBadges, mintedBadges] = await Promise.all([
      checkBadgeEligibility(userId),
      getUserBadges(userId)
    ]);

    console.log('BadgeSystem: Eligible badges:', eligibleBadges);
    console.log('BadgeSystem: Minted badges:', mintedBadges.length);

    // Filter out badges that have been successfully minted (have token_id)
    const mintedBadgeTypes = mintedBadges
      .filter(badge => {
        const hasMintedToken = badge.token_id && badge.token_id.trim() !== '';
        console.log('BadgeSystem: Badge', badge.badge_type, 'minted status:', hasMintedToken);
        return hasMintedToken;
      })
      .map(badge => badge.badge_type);

    console.log('BadgeSystem: Successfully minted badge types:', mintedBadgeTypes);

    const earnedButNotMinted = eligibleBadges.filter(badgeType => !mintedBadgeTypes.includes(badgeType));
    console.log('BadgeSystem: Earned but not minted badges:', earnedButNotMinted);

    return earnedButNotMinted;
  } catch (error) {
    console.error('BadgeSystem: Error getting earned but not minted badges:', error);
    return [];
  }
};

// Get user statistics for metadata generation
export const getUserStatsForBadge = async (userId: string): Promise<UserStats | null> => {
  console.log('BadgeSystem: Getting user stats for badge metadata, user:', userId);
  
  try {
    const [profile, reviews] = await Promise.all([
      getUserProfile(userId),
      getReviews() // Get all reviews to calculate user-specific stats
    ]);

    if (!profile) {
      console.error('BadgeSystem: No profile found for user');
      return null;
    }

    const userReviews = reviews.filter(review => review.user_id === userId);
    const verifiedReviews = userReviews.filter(review => review.is_verified);
    
    // Calculate unique locations reviewed
    const uniqueLocations = new Set(userReviews.map(review => review.location_id)).size;
    
    // Calculate average rating given by user
    const averageRating = userReviews.length > 0 
      ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length 
      : 0;

    const stats = {
      username: profile.full_name,
      totalReviews: profile.total_reviews,
      verifiedReviews: verifiedReviews.length,
      reputationScore: profile.reputation_score,
      joinDate: new Date(profile.created_at).toISOString().split('T')[0],
      badgeEarnedAt: new Date().toISOString().split('T')[0],
      uniqueLocationsReviewed: uniqueLocations,
      averageRating: averageRating,
    };

    console.log('BadgeSystem: Generated user stats:', stats);
    return stats;
  } catch (error) {
    console.error('BadgeSystem: Error getting user stats:', error);
    return null;
  }
};

// Process automatic badge minting for a user (only creates DB record if NFT is successfully minted)
export const processAutomaticBadgeMinting = async (
  userId: string, 
  walletAddress?: string
): Promise<{ success: boolean; badgesMinted: string[]; badgesEarned: string[]; errors: string[] }> => {
  console.log('BadgeSystem: Starting automatic badge minting process for user:', userId);
  console.log('BadgeSystem: Wallet address provided:', walletAddress || 'none');
  
  const result = {
    success: true,
    badgesMinted: [] as string[], // Actually minted as NFTs
    badgesEarned: [] as string[], // Earned but not minted (no wallet or minting failed)
    errors: [] as string[],
  };

  try {
    // Get badges that are earned but not yet minted
    const earnedButNotMinted = await getEarnedButNotMintedBadges(userId);
    console.log('BadgeSystem: Badges to process:', earnedButNotMinted);
    
    if (earnedButNotMinted.length === 0) {
      console.log('BadgeSystem: No badges to mint');
      return result;
    }

    // Get user stats for metadata
    const userStats = await getUserStatsForBadge(userId);
    if (!userStats) {
      console.error('BadgeSystem: Failed to get user stats');
      result.success = false;
      result.errors.push('Unable to fetch user statistics');
      return result;
    }

    // Process each earned badge
    for (const badgeType of earnedButNotMinted) {
      console.log('BadgeSystem: Processing badge:', badgeType);
      
      try {
        // Generate metadata
        console.log('BadgeSystem: Generating metadata for badge:', badgeType);
        const metadata = generateBadgeMetadata(badgeType as keyof typeof BADGE_TYPES, userStats);
        console.log('BadgeSystem: Generated metadata:', metadata);
        
        // Upload metadata to IPFS
        console.log('BadgeSystem: Uploading metadata to IPFS...');
        const metadataUri = await uploadMetadataToIPFS(metadata);
        console.log('BadgeSystem: Metadata uploaded, URI:', metadataUri);
        
        let tokenId: string | undefined;
        let transactionHash: string | undefined;
        
        // Only attempt to mint NFT if wallet is connected
        if (walletAddress) {
          console.log('BadgeSystem: Attempting to mint NFT for badge:', badgeType);
          
          try {
            const mintResult = await mintBadgeNFT(walletAddress, metadataUri);
            console.log('BadgeSystem: Mint result:', mintResult);
            
            if (mintResult && mintResult.transactionHash) {
              tokenId = mintResult.tokenId;
              transactionHash = mintResult.transactionHash;
              
              console.log('BadgeSystem: NFT minted successfully');
              console.log('BadgeSystem: Token ID:', tokenId);
              console.log('BadgeSystem: Transaction hash:', transactionHash);
              
              // Only save to database if NFT was successfully minted
              console.log('BadgeSystem: Saving badge to database...');
              await createNFTBadge({
                user_id: userId,
                badge_type: badgeType,
                token_id: tokenId || '',
                contract_address: import.meta.env.VITE_CONTRACT_ADDRESS || '',
                metadata_uri: metadataUri,
                transaction_hash: transactionHash,
              });

              result.badgesMinted.push(badgeType);
              console.log('BadgeSystem: Badge saved to database successfully');
              showToast('success', `🎉 ${badgeType} NFT badge minted successfully!`);
            } else {
              // Minting failed, but badge is still earned
              console.error('BadgeSystem: Minting failed - no transaction hash returned');
              result.badgesEarned.push(badgeType);
              result.errors.push(`Failed to mint NFT for ${badgeType}, but badge is earned`);
            }
          } catch (mintError) {
            console.error(`BadgeSystem: Error minting NFT for badge ${badgeType}:`, mintError);
            result.errors.push(`Failed to mint NFT for ${badgeType}: ${mintError}`);
            result.badgesEarned.push(badgeType);
          }
        } else {
          // No wallet connected, badge is earned but not minted
          console.log('BadgeSystem: No wallet connected, badge earned but not minted');
          result.badgesEarned.push(badgeType);
        }
        
      } catch (badgeError) {
        console.error(`BadgeSystem: Error processing badge ${badgeType}:`, badgeError);
        result.errors.push(`Failed to process ${badgeType}: ${badgeError}`);
        result.success = false;
      }
    }

    // Show appropriate notifications
    if (result.badgesMinted.length > 0) {
      console.log('BadgeSystem: Successfully minted', result.badgesMinted.length, 'badges');
      showToast('success', `🎉 ${result.badgesMinted.length} NFT badge${result.badgesMinted.length > 1 ? 's' : ''} minted!`);
    }
    
    if (result.badgesEarned.length > 0 && !walletAddress) {
      console.log('BadgeSystem: Badges earned but no wallet connected');
      showToast('info', `🏆 You've earned ${result.badgesEarned.length} new badge${result.badgesEarned.length > 1 ? 's' : ''}! Connect your wallet to mint NFTs.`);
    }

  } catch (error) {
    console.error('BadgeSystem: Error in automatic badge processing:', error);
    result.success = false;
    result.errors.push(`System error: ${error}`);
  }

  console.log('BadgeSystem: Automatic badge minting completed:', result);
  return result;
};

// Trigger badge check after review submission
export const triggerBadgeCheckAfterReview = async (userId: string, walletAddress?: string) => {
  console.log('BadgeSystem: Triggering badge check after review submission');
  
  try {
    const result = await processAutomaticBadgeMinting(userId, walletAddress);
    
    if (result.badgesMinted.length > 0 || result.badgesEarned.length > 0) {
      const totalNew = result.badgesMinted.length + result.badgesEarned.length;
      console.log('BadgeSystem: User earned', totalNew, 'new badges');
      showToast('success', `Congratulations! You've earned ${totalNew} new badge${totalNew > 1 ? 's' : ''}!`);
    }
    
    if (result.errors.length > 0) {
      console.error('BadgeSystem: Badge processing errors:', result.errors);
    }
    
    return result;
  } catch (error) {
    console.error('BadgeSystem: Error triggering badge check:', error);
    return { success: false, badgesMinted: [], badgesEarned: [], errors: [String(error)] };
  }
};

// Manual badge claim function (for UI)
export const claimBadgeManually = async (
  userId: string,
  badgeType: string,
  walletAddress: string
): Promise<boolean> => {
  console.log('BadgeSystem: Starting manual badge claim');
  console.log('BadgeSystem: User ID:', userId);
  console.log('BadgeSystem: Badge type:', badgeType);
  console.log('BadgeSystem: Wallet address:', walletAddress);
  
  try {
    // Check if user is eligible for this specific badge
    const earnedButNotMinted = await getEarnedButNotMintedBadges(userId);
    console.log('BadgeSystem: Earned but not minted badges:', earnedButNotMinted);
    
    if (!earnedButNotMinted.includes(badgeType)) {
      console.error('BadgeSystem: User not eligible for badge or already minted');
      showToast('error', 'You are not eligible for this badge or it has already been minted');
      return false;
    }

    // Get user stats for metadata
    const userStats = await getUserStatsForBadge(userId);
    if (!userStats) {
      console.error('BadgeSystem: Failed to get user stats for manual claim');
      showToast('error', 'Unable to fetch user statistics');
      return false;
    }

    // Generate metadata
    console.log('BadgeSystem: Generating metadata for manual claim...');
    const metadata = generateBadgeMetadata(badgeType as keyof typeof BADGE_TYPES, userStats);
    
    // Upload metadata to IPFS
    console.log('BadgeSystem: Uploading metadata to IPFS for manual claim...');
    const metadataUri = await uploadMetadataToIPFS(metadata);
    console.log('BadgeSystem: Metadata uploaded for manual claim, URI:', metadataUri);
    
    // Mint the NFT
    console.log('BadgeSystem: Starting NFT minting for manual claim...');
    const mintResult = await mintBadgeNFT(walletAddress, metadataUri);
    console.log('BadgeSystem: Manual claim mint result:', mintResult);
    
    if (mintResult && mintResult.transactionHash) {
      // Save to database only if minting was successful
      console.log('BadgeSystem: Saving manually claimed badge to database...');
      await createNFTBadge({
        user_id: userId,
        badge_type: badgeType,
        token_id: mintResult.tokenId || '',
        contract_address: import.meta.env.VITE_CONTRACT_ADDRESS || '',
        metadata_uri: metadataUri,
        transaction_hash: mintResult.transactionHash,
      });

      console.log('BadgeSystem: Manual badge claim completed successfully');
      showToast('success', `🎉 ${badgeType} NFT badge minted successfully!`);
      return true;
    } else {
      console.error('BadgeSystem: Manual badge claim failed - no transaction hash');
      showToast('error', 'Failed to mint NFT badge');
      return false;
    }
  } catch (error) {
    console.error('BadgeSystem: Error claiming badge manually:', error);
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
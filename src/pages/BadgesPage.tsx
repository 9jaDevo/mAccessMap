import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Star, Shield, Heart, Trophy, Crown, Zap, LogIn, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile, useUserBadges } from '../hooks/useDatabase';
import { useWallet } from '../hooks/useWallet';
import { claimBadgeManually, getNextBadgeToEarn, checkBadgeEligibility } from '../lib/badgeSystem';
import { BADGE_TYPES } from '../lib/ipfs';
import { showToast } from '../components/Toaster';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reviewsRequired: number;
  holders: number;
  metadata_uri: string;
  minted?: boolean;
  earned?: boolean;
  unlockedAt?: string;
}

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Completed your first accessibility review',
    icon: Star,
    gradient: 'from-blue-400 to-blue-600',
    rarity: 'common',
    reviewsRequired: 1,
    holders: 3821,
    metadata_uri: 'ipfs://QmFirstStepsBadgeMetadata',
    minted: false,
    earned: false,
  },
  {
    id: '2',
    name: 'Community Builder',
    description: 'Submitted 5 verified accessibility reviews',
    icon: Users,
    gradient: 'from-emerald-400 to-emerald-600',
    rarity: 'common',
    reviewsRequired: 5,
    holders: 1943,
    metadata_uri: 'ipfs://QmCommunityBuilderBadgeMetadata',
    minted: false,
    earned: false,
  },
  {
    id: '3',
    name: 'Accessibility Advocate',
    description: 'Helped 25 locations become more accessible',
    icon: Heart,
    gradient: 'from-pink-400 to-pink-600',
    rarity: 'rare',
    reviewsRequired: 25,
    holders: 452,
    metadata_uri: 'ipfs://QmAccessibilityAdvocateBadgeMetadata',
    minted: false,
    earned: false,
  },
  {
    id: '4',
    name: 'Guardian of Access',
    description: 'Reviewed 50+ locations with detailed reports',
    icon: Shield,
    gradient: 'from-purple-400 to-purple-600',
    rarity: 'rare',
    reviewsRequired: 50,
    holders: 128,
    metadata_uri: 'ipfs://QmGuardianOfAccessBadgeMetadata',
    minted: false,
    earned: false,
  },
  {
    id: '5',
    name: 'Inclusion Champion',
    description: 'Made 100+ accessibility contributions',
    icon: Trophy,
    gradient: 'from-yellow-400 to-yellow-600',
    rarity: 'epic',
    reviewsRequired: 100,
    holders: 43,
    metadata_uri: 'ipfs://QmInclusionChampionBadgeMetadata',
    minted: false,
    earned: false,
  },
  {
    id: '6',
    name: 'Accessibility Legend',
    description: 'Elite contributor with 250+ verified reviews',
    icon: Crown,
    gradient: 'from-orange-400 to-red-600',
    rarity: 'legendary',
    reviewsRequired: 250,
    holders: 7,
    metadata_uri: 'ipfs://QmAccessibilityLegendBadgeMetadata',
    minted: false,
    earned: false,
  },
];

const rarityColors = {
  common: 'border-gray-300 text-gray-600',
  rare: 'border-blue-300 text-blue-600',
  epic: 'border-purple-300 text-purple-600',
  legendary: 'border-orange-300 text-orange-600',
};

const rarityBadgeColors = {
  common: 'bg-gray-100 text-gray-700',
  rare: 'bg-blue-100 text-blue-700',
  epic: 'bg-purple-100 text-purple-700',
  legendary: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700',
};

export const BadgesPage: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { badges, loading: badgesLoading, refetch: refetchBadges } = useUserBadges();
  const { walletAddress, isConnected, isConnecting, connect } = useWallet();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [rarityFilter, setRarityFilter] = useState<'all' | Badge['rarity']>('all');
  const [claimingBadges, setClaimingBadges] = useState<Set<string>>(new Set());
  const [nextBadge, setNextBadge] = useState<{ badgeType: string; reviewsNeeded: number } | null>(null);
  const [eligibleBadges, setEligibleBadges] = useState<string[]>([]);

  // Fetch next badge information and eligible badges
  React.useEffect(() => {
    if (user) {
      Promise.all([
        getNextBadgeToEarn(user.id),
        checkBadgeEligibility(user.id)
      ]).then(([nextBadgeData, eligibleBadgeData]) => {
        setNextBadge(nextBadgeData);
        setEligibleBadges(eligibleBadgeData);
      });
    }
  }, [user, profile]);

  // Show sign-in prompt for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Inclusivity Badge Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Unique NFT badges that recognize your contributions to accessibility. 
              Each badge is minted on the blockchain as a permanent record of your civic service.
            </p>
          </div>

          {/* Sign-in Required Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <LogIn className="w-10 h-10 text-emerald-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sign In to View Your Badges
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create an account or sign in to start earning unique NFT badges for your accessibility contributions. 
              Track your progress and showcase your impact on making spaces more inclusive.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/review"
                className="border border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Preview Badge Grid */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Available Badges to Earn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockBadges.slice(0, 6).map((badge) => {
                const Icon = badge.icon;
                
                return (
                  <div
                    key={badge.id}
                    className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200 opacity-75"
                  >
                    <div className="relative mb-4">
                      <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center grayscale`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      
                      <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${rarityBadgeColors[badge.rarity]}`}>
                        {badge.rarity.toUpperCase()}
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {badge.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {badge.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-gray-500">Required: </span>
                          <span className="font-semibold text-gray-900">
                            {badge.reviewsRequired} review{badge.reviewsRequired !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        <div className="text-sm">
                          <span className="text-gray-500">Holders: </span>
                          <span className="font-semibold text-gray-900">
                            {badge.holders.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-8 mt-12 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Earning Badges?</h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Join thousands of accessibility advocates making a real difference. 
              Submit your first review and begin your journey toward earning unique NFT badges.
            </p>
            <Link
              to="/auth"
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Get Started Today</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while profile is being fetched
  if (profileLoading || badgesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Your Badges</h3>
          <p className="text-gray-600">Fetching your accessibility achievements...</p>
        </div>
      </div>
    );
  }

  // Use actual user review count from profile
  const userReviews = profile?.total_reviews || 0;

  // Update badges with earned and minted status
  const badgesWithStatus = mockBadges.map(badge => {
    const isEarned = eligibleBadges.includes(badge.name);
    const mintedBadge = badges.find(b => b.badge_type === badge.name);
    const isMinted = mintedBadge && mintedBadge.token_id && mintedBadge.token_id.trim() !== '';
    
    return {
      ...badge,
      earned: isEarned,
      minted: !!isMinted,
    };
  });

  const filteredBadges = badgesWithStatus.filter(badge => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unlocked' && badge.earned) || 
                         (filter === 'locked' && !badge.earned);
    const matchesRarity = rarityFilter === 'all' || badge.rarity === rarityFilter;
    
    return matchesFilter && matchesRarity;
  });

  const unlockedCount = badgesWithStatus.filter(badge => badge.earned).length;
  const mintedCount = badgesWithStatus.filter(badge => badge.minted).length;

  const handleClaimBadge = async (badge: Badge) => {
    if (!isConnected) {
      showToast('info', 'Please connect your wallet first to claim NFT badges');
      return;
    }

    if (!walletAddress) {
      showToast('error', 'Wallet address not found');
      return;
    }

    if (!badge.earned) {
      showToast('error', 'You have not earned this badge yet');
      return;
    }

    if (badge.minted) {
      showToast('info', 'This badge has already been minted as an NFT');
      return;
    }

    setClaimingBadges(prev => new Set(prev).add(badge.id));

    try {
      const success = await claimBadgeManually(user.id, badge.name, walletAddress);
      
      if (success) {
        // Refresh badges
        await refetchBadges();
        showToast('success', `🎉 ${badge.name} NFT badge claimed successfully!`);
      }
    } catch (error: any) {
      console.error('Error claiming badge:', error);
      showToast('error', `Failed to claim badge: ${error.message}`);
    } finally {
      setClaimingBadges(prev => {
        const newSet = new Set(prev);
        newSet.delete(badge.id);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your Badge Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Unique NFT badges that recognize your contributions to accessibility. 
            Each badge is minted on the blockchain as a permanent record of your civic service.
          </p>
          
          <div className="bg-white rounded-xl p-6 max-w-md mx-auto shadow-sm border">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">
                  {unlockedCount}
                </div>
                <div className="text-gray-600 text-sm">Badges Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {mintedCount}
                </div>
                <div className="text-gray-600 text-sm">NFTs Minted</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(unlockedCount / mockBadges.length) * 100}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Based on {userReviews} review{userReviews !== 1 ? 's' : ''} submitted
            </div>
          </div>
        </div>

        {/* Next Badge Progress */}
        {nextBadge && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Badge: {nextBadge.badgeType}</h3>
            <p className="text-gray-600 mb-4">
              Submit {nextBadge.reviewsNeeded} more review{nextBadge.reviewsNeeded !== 1 ? 's' : ''} to unlock your next badge!
            </p>
            <Link
              to="/review"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Review
            </Link>
          </div>
        )}

        {/* Wallet Connection */}
        {!isConnected && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-center">
            <Wallet className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Connect Your Wallet</h3>
            <p className="text-blue-700 mb-4">
              Connect your MetaMask wallet to claim NFT badges for your accessibility contributions.
            </p>
            <button
              onClick={connect}
              disabled={isConnecting}
              className={`bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto ${
                isConnecting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isConnecting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Wallet className="w-5 h-5" />
              )}
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          </div>
        )}

        {/* Connected Wallet Info */}
        {isConnected && walletAddress && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Wallet className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">
                Wallet Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Badges
              </button>
              <button
                onClick={() => setFilter('unlocked')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'unlocked' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Earned ({unlockedCount})
              </button>
              <button
                onClick={() => setFilter('locked')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'locked' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Locked ({mockBadges.length - unlockedCount})
              </button>
            </div>
            
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value as typeof rarityFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map((badge) => {
            const Icon = badge.icon;
            const isClaiming = claimingBadges.has(badge.id);
            
            return (
              <div
                key={badge.id}
                className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
                  badge.earned 
                    ? `${rarityColors[badge.rarity]} hover:scale-105` 
                    : 'border-gray-200 opacity-60'
                }`}
              >
                {/* Badge Icon */}
                <div className="relative mb-4">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center ${
                    !badge.earned ? 'grayscale' : ''
                  }`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Rarity Badge */}
                  <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${rarityBadgeColors[badge.rarity]}`}>
                    {badge.rarity.toUpperCase()}
                  </div>
                  
                  {/* Status Indicator */}
                  {badge.minted ? (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                  ) : badge.earned ? (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Award className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Badge Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {badge.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {badge.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-500">Required: </span>
                      <span className="font-semibold text-gray-900">
                        {badge.reviewsRequired} review{badge.reviewsRequired !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Holders: </span>
                      <span className="font-semibold text-gray-900">
                        {badge.holders.toLocaleString()}
                      </span>
                    </div>
                    
                    {badge.minted ? (
                      <div className="text-sm">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          ✓ NFT Minted!
                        </span>
                      </div>
                    ) : badge.earned ? (
                      <div className="mt-4">
                        <button
                          onClick={() => handleClaimBadge(badge)}
                          disabled={!isConnected || isClaiming}
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                            !isConnected
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : isClaiming
                              ? 'bg-blue-400 text-white cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isClaiming ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Minting...</span>
                            </div>
                          ) : !isConnected ? (
                            'Connect Wallet to Mint NFT'
                          ) : (
                            'Mint NFT Badge'
                          )}
                        </button>
                        <div className="text-xs text-blue-600 mt-1">
                          Badge earned! Ready to mint as NFT
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <span className="text-gray-500">Progress: </span>
                        <span className="font-semibold text-orange-600">
                          {userReviews} / {badge.reviewsRequired}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar for Locked Badges */}
                {!badge.earned && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((userReviews / badge.reviewsRequired) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No badges found</h3>
            <p className="text-gray-500">
              Try adjusting your filters to see more badges.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-8 mt-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            {unlockedCount === 0 ? 'Start Earning Badges Today' : 'Keep Making a Difference'}
          </h2>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            {unlockedCount === 0 
              ? 'Submit your first accessibility review and begin your journey toward earning unique NFT badges that showcase your commitment to inclusion.'
              : `You've earned ${unlockedCount} badge${unlockedCount !== 1 ? 's' : ''}! Continue contributing to earn more recognition for your accessibility advocacy.`
            }
          </p>
          <Link
            to="/review"
            className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            {unlockedCount === 0 ? 'Submit Your First Review' : 'Add Another Review'}
          </Link>
        </div>
      </div>
    </div>
  );
};
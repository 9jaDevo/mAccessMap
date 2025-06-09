import React from 'react';
import { User, MapPin, Camera, Award, Star, Calendar, Trophy, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile, useUserReviews, useUserBadges } from '../hooks/useDatabase';
import { showToast } from '../components/Toaster';
import { useNavigate } from 'react-router-dom';

// Import badge data from BadgesPage
const mockBadges = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Completed your first accessibility review',
    reviewsRequired: 1,
  },
  {
    id: '2',
    name: 'Community Builder',
    description: 'Submitted 5 verified accessibility reviews',
    reviewsRequired: 5,
  },
  {
    id: '3',
    name: 'Accessibility Advocate',
    description: 'Helped 25 locations become more accessible',
    reviewsRequired: 25,
  },
  {
    id: '4',
    name: 'Guardian of Access',
    description: 'Reviewed 50+ locations with detailed reports',
    reviewsRequired: 50,
  },
  {
    id: '5',
    name: 'Inclusion Champion',
    description: 'Made 100+ accessibility contributions',
    reviewsRequired: 100,
  },
  {
    id: '6',
    name: 'Accessibility Legend',
    description: 'Elite contributor with 250+ verified reviews',
    reviewsRequired: 250,
  },
];

export const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { reviews, loading: reviewsLoading } = useUserReviews();
  const { badges, loading: badgesLoading } = useUserBadges();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast('success', 'You have been signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      showToast('error', 'Failed to sign out. Please try again.');
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handlePrivacySettings = () => {
    navigate('/profile/privacy');
  };

  const handleViewAllReviews = () => {
    navigate('/profile/reviews');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (profileLoading || reviewsLoading || badgesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Profile</h3>
          <p className="text-gray-600">Fetching your accessibility contributions...</p>
        </div>
      </div>
    );
  }

  // Calculate unique locations reviewed
  const uniqueLocations = new Set(reviews.map(review => review.location_id)).size;

  // Calculate average rating given by user
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Calculate people helped this month (estimate based on reviews)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthReviews = reviews.filter(review => {
    const reviewDate = new Date(review.created_at);
    return reviewDate.getMonth() === currentMonth && reviewDate.getFullYear() === currentYear;
  }).length;
  const peopleHelpedThisMonth = thisMonthReviews * 3; // Estimate 3 people helped per review

  // Find next badge to earn
  const userReviewCount = profile?.total_reviews || 0;
  const nextBadge = mockBadges.find(badge => userReviewCount < badge.reviewsRequired);
  const allBadgesUnlocked = !nextBadge;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  {profile?.full_name || user.user_metadata?.full_name || 'Accessibility Advocate'}
                </h1>
                <p className="text-emerald-100">{user.email}</p>
                <p className="text-emerald-200 text-sm">
                  Member since {new Date(user.created_at || profile?.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {profile?.total_reviews || 0}
              </div>
              <div className="text-sm text-gray-600">Reviews Submitted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {uniqueLocations}
              </div>
              <div className="text-sm text-gray-600">Locations Reviewed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {profile?.badges_earned || 0}
              </div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {profile?.reputation_score || 0}
              </div>
              <div className="text-sm text-gray-600">Impact Score</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Camera className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
              </div>
              
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No reviews yet</h3>
                  <p className="text-gray-500 mb-4">Start contributing by adding your first accessibility review!</p>
                  <a
                    href="/review"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Add Your First Review
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">
                          {review.locations?.name || 'Unknown Location'}
                        </h3>
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{review.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {review.locations?.address || 'Address not available'}
                      </p>
                      
                      {review.accessibility_features.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {review.accessibility_features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                              {feature.replace('-', ' ')}
                            </span>
                          ))}
                          {review.accessibility_features.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{review.accessibility_features.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      
                      {review.comments && (
                        <p className="text-sm text-gray-600 mb-2 italic">
                          "{review.comments.substring(0, 100)}{review.comments.length > 100 ? '...' : ''}"
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                        {review.is_verified && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {reviews.length > 5 && (
                    <div className="text-center pt-4">
                      <button 
                        onClick={handleViewAllReviews}
                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                      >
                        View All {reviews.length} Reviews
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Impact Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Your Impact</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-emerald-700 mb-1">{peopleHelpedThisMonth}</div>
                  <div className="text-sm text-emerald-600">People helped this month</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700 mb-1">
                    {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm text-blue-600">Average review rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <a
                  href="/review"
                  className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Add New Review</span>
                </a>
                
                <a
                  href="/map"
                  className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Explore Map</span>
                </a>
                
                <a
                  href="/badges"
                  className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Award className="w-4 h-4" />
                  <span>View Badges</span>
                </a>
              </div>
            </div>

            {/* Next Badge Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">Next Badge</h2>
              </div>
              
              <div className="text-center">
                {allBadgesUnlocked ? (
                  <div>
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">All Badges Unlocked!</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Congratulations! You've earned all available badges.
                    </p>
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 rounded-full text-sm font-medium text-yellow-700">
                      🏆 Legend Status
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{nextBadge.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{nextBadge.description}</p>
                    
                    <div className="text-sm text-gray-500 mb-2">
                      Progress: {userReviewCount} / {nextBadge.reviewsRequired}
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((userReviewCount / nextBadge.reviewsRequired) * 100, 100)}%` }}
                      />
                    </div>
                    
                    {userReviewCount >= nextBadge.reviewsRequired && (
                      <div className="mt-3">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          Badge Unlocked! 🎉
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Badges */}
            {badges.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Badges</h2>
                
                <div className="space-y-3">
                  {badges.slice(0, 3).map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{badge.badge_type}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(badge.minted_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {badges.length > 3 && (
                    <a
                      href="/badges"
                      className="block text-center text-emerald-600 hover:text-emerald-700 font-medium text-sm pt-2"
                    >
                      View All {badges.length} Badges
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Active</span>
                  <span className="text-gray-900">
                    {reviews.length > 0 
                      ? new Date(reviews[0].created_at).toLocaleDateString()
                      : 'No activity yet'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Level</span>
                  <span className="text-emerald-600 font-medium">
                    {(profile?.total_reviews || 0) >= 25 ? 'Advocate' : 
                     (profile?.total_reviews || 0) >= 5 ? 'Contributor' : 'Newcomer'}
                  </span>
                </div>
                
                <hr className="my-4" />
                
                <button 
                  onClick={handleEditProfile}
                  className="text-gray-600 hover:text-gray-900 transition-colors w-full text-left"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={handlePrivacySettings}
                  className="text-gray-600 hover:text-gray-900 transition-colors w-full text-left"
                >
                  Privacy Settings
                </button>
                <button 
                  onClick={handleSignOut}
                  className="text-red-600 hover:text-red-700 transition-colors w-full text-left"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
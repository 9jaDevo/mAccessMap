import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, BarChart3, Settings, Search, Filter, 
  CheckCircle, XCircle, Edit, Trash2, ChevronLeft, ChevronRight,
  SortAsc, SortDesc, Shield, Award, MapPin, Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getAllReviewsForAdmin, 
  getAllUsersForAdmin, 
  verifyReview, 
  deleteReviewAsAdmin,
  updateUserAsAdmin,
  getGlobalStats,
  type Review,
  type UserProfile,
  type PaginatedResult
} from '../lib/database';
import { showToast } from '../components/Toaster';

type AdminTab = 'dashboard' | 'reviews' | 'users' | 'settings';

export const AdminPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalLocations: 0,
    totalReviews: 0,
    totalUsers: 0,
    totalBadges: 0,
  });

  // Reviews management
  const [reviews, setReviews] = useState<PaginatedResult<Review>>({
    data: [],
    count: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewFilters, setReviewFilters] = useState({
    page: 1,
    searchQuery: '',
    verificationFilter: 'all' as 'all' | 'verified' | 'pending',
    sortBy: 'created_at' as 'created_at' | 'rating' | 'location_name' | 'user_name',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  // Users management
  const [users, setUsers] = useState<PaginatedResult<UserProfile>>({
    data: [],
    count: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [usersLoading, setUsersLoading] = useState(false);
  const [userFilters, setUserFilters] = useState({
    page: 1,
    searchQuery: '',
    sortBy: 'created_at' as 'created_at' | 'full_name' | 'total_reviews' | 'reputation_score',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  // Check admin access
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const data = await getGlobalStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      showToast('error', 'Failed to load dashboard statistics');
    }
  };

  // Fetch reviews for admin
  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const data = await getAllReviewsForAdmin(reviewFilters);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showToast('error', 'Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch users for admin
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await getAllUsersForAdmin(userFilters);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('error', 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Handle review verification
  const handleVerifyReview = async (reviewId: string, isVerified: boolean) => {
    try {
      await verifyReview(reviewId, isVerified);
      showToast('success', `Review ${isVerified ? 'verified' : 'unverified'} successfully`);
      fetchReviews();
    } catch (error) {
      console.error('Error verifying review:', error);
      showToast('error', 'Failed to update review verification status');
    }
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId: string, locationName: string) => {
    if (!confirm(`Are you sure you want to delete the review for "${locationName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteReviewAsAdmin(reviewId);
      showToast('success', 'Review deleted successfully');
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      showToast('error', 'Failed to delete review');
    }
  };

  // Handle user admin status toggle
  const handleToggleUserAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      await updateUserAsAdmin(userId, { is_admin: isAdmin });
      showToast('success', `User admin status ${isAdmin ? 'granted' : 'revoked'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user admin status:', error);
      showToast('error', 'Failed to update user admin status');
    }
  };

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'reviews') {
      fetchReviews();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Refetch reviews when filters change
  useEffect(() => {
    if (activeTab === 'reviews') {
      const timer = setTimeout(() => {
        fetchReviews();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [reviewFilters]);

  // Refetch users when filters change
  useEffect(() => {
    if (activeTab === 'users') {
      const timer = setTimeout(() => {
        fetchUsers();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [userFilters]);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'reviews', name: 'Reviews', icon: FileText },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Shield className="w-8 h-8 text-emerald-600" />
            <span>Admin Panel</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage reviews, users, and platform settings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AdminTab)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Platform Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Users</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.totalUsers.toLocaleString()}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-600 text-sm font-medium">Total Reviews</p>
                        <p className="text-2xl font-bold text-emerald-900">{stats.totalReviews.toLocaleString()}</p>
                      </div>
                      <FileText className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Total Locations</p>
                        <p className="text-2xl font-bold text-purple-900">{stats.totalLocations.toLocaleString()}</p>
                      </div>
                      <MapPin className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">NFT Badges</p>
                        <p className="text-2xl font-bold text-orange-900">{stats.totalBadges.toLocaleString()}</p>
                      </div>
                      <Award className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="text-emerald-900 font-medium mb-2">Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
                    >
                      Review Pending Reviews
                    </button>
                    <button
                      onClick={() => setActiveTab('users')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Manage Users
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Review Management</h2>
                  <div className="text-sm text-gray-600">
                    {reviews.count} total reviews
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-64">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search reviews..."
                          value={reviewFilters.searchQuery}
                          onChange={(e) => setReviewFilters(prev => ({ ...prev, searchQuery: e.target.value, page: 1 }))}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <select
                      value={reviewFilters.verificationFilter}
                      onChange={(e) => setReviewFilters(prev => ({ ...prev, verificationFilter: e.target.value as any, page: 1 }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="all">All Reviews</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                    </select>

                    <select
                      value={`${reviewFilters.sortBy}-${reviewFilters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-');
                        setReviewFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder: sortOrder as any, page: 1 }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="created_at-desc">Newest First</option>
                      <option value="created_at-asc">Oldest First</option>
                      <option value="rating-desc">Highest Rating</option>
                      <option value="rating-asc">Lowest Rating</option>
                      <option value="location_name-asc">Location A-Z</option>
                      <option value="user_name-asc">User A-Z</option>
                    </select>
                  </div>
                </div>

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading reviews...</p>
                  </div>
                ) : reviews.data.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No reviews found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.data.map((review) => (
                      <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {review.locations?.name || 'Unknown Location'}
                              </h3>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                                <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">By:</span> {review.user_profiles?.full_name || 'Unknown User'}
                              <span className="mx-2">•</span>
                              <span className="font-medium">Location:</span> {review.locations?.address || 'Address not available'}
                              <span className="mx-2">•</span>
                              <span className="font-medium">Date:</span> {new Date(review.created_at).toLocaleDateString()}
                            </div>
                            
                            {review.comments && (
                              <p className="text-gray-700 mb-3 italic">"{review.comments}"</p>
                            )}
                            
                            {review.accessibility_features.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {review.accessibility_features.map((feature, index) => (
                                  <span
                                    key={index}
                                    className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs"
                                  >
                                    {feature.replace('-', ' ')}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {review.is_verified ? (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>Pending</span>
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="text-xs text-gray-500">
                            Review ID: {review.id}
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleVerifyReview(review.id, !review.is_verified)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                review.is_verified
                                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {review.is_verified ? 'Unverify' : 'Verify'}
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id, review.locations?.name || 'Unknown Location')}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {reviews.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {((reviewFilters.page - 1) * 20) + 1} to {Math.min(reviewFilters.page * 20, reviews.count)} of {reviews.count} reviews
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setReviewFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={!reviews.hasPreviousPage}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          reviews.hasPreviousPage
                            ? 'text-gray-600 hover:bg-gray-100'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>
                      
                      <span className="px-3 py-2 text-sm text-gray-600">
                        Page {reviewFilters.page} of {reviews.totalPages}
                      </span>
                      
                      <button
                        onClick={() => setReviewFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={!reviews.hasNextPage}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          reviews.hasNextPage
                            ? 'text-gray-600 hover:bg-gray-100'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                  <div className="text-sm text-gray-600">
                    {users.count} total users
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-64">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={userFilters.searchQuery}
                          onChange={(e) => setUserFilters(prev => ({ ...prev, searchQuery: e.target.value, page: 1 }))}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <select
                      value={`${userFilters.sortBy}-${userFilters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-');
                        setUserFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder: sortOrder as any, page: 1 }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="created_at-desc">Newest First</option>
                      <option value="created_at-asc">Oldest First</option>
                      <option value="full_name-asc">Name A-Z</option>
                      <option value="total_reviews-desc">Most Reviews</option>
                      <option value="reputation_score-desc">Highest Reputation</option>
                    </select>
                  </div>
                </div>

                {/* Users List */}
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading users...</p>
                  </div>
                ) : users.data.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No users found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.data.map((user) => (
                      <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              {user.avatar_url ? (
                                <img 
                                  src={user.avatar_url} 
                                  alt="Avatar" 
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <Users className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                                {user.is_admin && (
                                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                                    Admin
                                  </span>
                                )}
                              </div>
                              
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Reviews:</span> {user.total_reviews}
                                <span className="mx-2">•</span>
                                <span className="font-medium">Badges:</span> {user.badges_earned}
                                <span className="mx-2">•</span>
                                <span className="font-medium">Reputation:</span> {user.reputation_score}
                              </div>
                              
                              <div className="text-xs text-gray-500 mt-1">
                                Joined: {new Date(user.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleUserAdmin(user.id, !user.is_admin)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                user.is_admin
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                            >
                              {user.is_admin ? 'Revoke Admin' : 'Make Admin'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {users.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {((userFilters.page - 1) * 20) + 1} to {Math.min(userFilters.page * 20, users.count)} of {users.count} users
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setUserFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={!users.hasPreviousPage}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          users.hasPreviousPage
                            ? 'text-gray-600 hover:bg-gray-100'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>
                      
                      <span className="px-3 py-2 text-sm text-gray-600">
                        Page {userFilters.page} of {users.totalPages}
                      </span>
                      
                      <button
                        onClick={() => setUserFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={!users.hasNextPage}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          users.hasNextPage
                            ? 'text-gray-600 hover:bg-gray-100'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Platform Settings</h2>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-yellow-900 font-medium mb-2">Coming Soon</h3>
                  <p className="text-yellow-700 text-sm">
                    Platform settings and configuration options will be available in a future update.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
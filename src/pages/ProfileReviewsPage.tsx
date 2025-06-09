import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, Calendar, MapPin, Camera, Edit, Trash2, 
  Filter, Search, ChevronLeft, ChevronRight, SortAsc, SortDesc 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserReviews, useReviewCategories } from '../hooks/useDatabase';
import { updateReview, deleteReview, getReviewCountsByVerificationStatus } from '../lib/database';
import { showToast } from '../components/Toaster';

const categoryDisplayNames: Record<string, string> = {
  'restaurant': 'Restaurants',
  'retail': 'Retail Stores',
  'public-service': 'Public Services',
  'transportation': 'Transportation',
  'entertainment': 'Entertainment',
  'healthcare': 'Healthcare',
  'recreation': 'Recreation',
  'other': 'Other',
};

export const ProfileReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'rating'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [reviewCounts, setReviewCounts] = useState({
    verified: 0,
    pending: 0,
    total: 0,
  });
  const [editData, setEditData] = useState({
    rating: 0,
    comments: '',
    accessibility_features: [] as string[],
  });

  const limit = 10; // Reviews per page

  const { reviews, pagination, loading, refetch } = useUserReviews({
    page: currentPage,
    limit,
    searchQuery: searchQuery.trim(),
    categoryFilter: categoryFilter === 'all' ? '' : categoryFilter,
    sortBy,
    sortOrder,
  });

  const { categories } = useReviewCategories();

  // Fetch review counts by verification status
  useEffect(() => {
    const fetchReviewCounts = async () => {
      if (!user) return;
      
      try {
        const counts = await getReviewCountsByVerificationStatus(user.id);
        setReviewCounts(counts);
      } catch (error) {
        console.error('Error fetching review counts:', error);
      }
    };

    fetchReviewCounts();
  }, [user, reviews]); // Refetch when reviews change

  // Filter reviews by verification status (client-side for now)
  const filteredReviews = reviews.filter(review => {
    if (filter === 'verified') return review.is_verified;
    if (filter === 'pending') return !review.is_verified;
    return true;
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, categoryFilter, sortBy, sortOrder]);

  const handleEditStart = (review: any) => {
    setEditingReview(review.id);
    setEditData({
      rating: review.rating,
      comments: review.comments,
      accessibility_features: review.accessibility_features,
    });
  };

  const handleEditSave = async (reviewId: string) => {
    try {
      await updateReview(reviewId, editData);
      setEditingReview(null);
      refetch();
      showToast('success', 'Review updated successfully!');
    } catch (error) {
      console.error('Error updating review:', error);
      showToast('error', 'Failed to update review');
    }
  };

  const handleEditCancel = () => {
    setEditingReview(null);
    setEditData({ rating: 0, comments: '', accessibility_features: [] });
  };

  const handleDelete = async (reviewId: string, locationName: string) => {
    if (!confirm(`Are you sure you want to delete your review for "${locationName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteReview(reviewId);
      refetch();
      showToast('success', 'Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      showToast('error', 'Failed to delete review');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to view your reviews.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Reviews</h3>
          <p className="text-gray-600">Fetching your accessibility contributions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/profile"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
              <p className="text-gray-600 mt-1">
                {pagination.count} review{pagination.count !== 1 ? 's' : ''} total
              </p>
            </div>
            
            <Link
              to="/review"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Add Review</span>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reviews by location name, address, or comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <div className="flex space-x-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({reviewCounts.total})
                </button>
                <button
                  onClick={() => setFilter('verified')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'verified' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Verified ({reviewCounts.verified})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'pending' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Pending ({reviewCounts.pending})
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {categoryDisplayNames[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <button
                onClick={() => toggleSort('created_at')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'created_at' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>Date</span>
                {sortBy === 'created_at' && (
                  sortOrder === 'desc' ? <SortDesc className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => toggleSort('rating')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'rating' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>Rating</span>
                {sortBy === 'rating' && (
                  sortOrder === 'desc' ? <SortDesc className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery || categoryFilter !== 'all' ? 'No matching reviews found' : 'No reviews yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || categoryFilter !== 'all' 
                ? 'Try adjusting your search terms or filters.'
                : 'Start contributing by adding your first accessibility review!'
              }
            </p>
            {!searchQuery && categoryFilter === 'all' && (
              <Link
                to="/review"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Add Your First Review
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {editingReview === review.id ? (
                    // Edit Mode
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Editing: {review.locations?.name}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditSave(review.id)}
                            className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                      
                      {/* Rating Edit */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setEditData(prev => ({ ...prev, rating: star }))}
                              className={`w-6 h-6 ${star <= editData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              <Star className="w-full h-full fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Comments Edit */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                        <textarea
                          value={editData.comments}
                          onChange={(e) => setEditData(prev => ({ ...prev, comments: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {review.locations?.name || 'Unknown Location'}
                            </h3>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{review.locations?.address || 'Address not available'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
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
                          
                          {review.comments && (
                            <p className="text-gray-700 mb-3 italic">"{review.comments}"</p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {review.is_verified ? (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                  ✓ Verified
                                </span>
                              ) : (
                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                                  ⏳ Pending Verification
                                </span>
                              )}
                              
                              {review.photos && review.photos.length > 0 && (
                                <span className="text-xs text-gray-500 flex items-center space-x-1">
                                  <Camera className="w-3 h-3" />
                                  <span>{review.photos.length} photo{review.photos.length !== 1 ? 's' : ''}</span>
                                </span>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditStart(review)}
                                className="text-emerald-600 hover:text-emerald-700 p-1"
                                title="Edit review"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(review.id, review.locations?.name || 'Unknown Location')}
                                className="text-red-600 hover:text-red-700 p-1"
                                title="Delete review"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.count)} of {pagination.count} reviews
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPreviousPage}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pagination.hasPreviousPage
                          ? 'text-gray-600 hover:bg-gray-100'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-emerald-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pagination.hasNextPage
                          ? 'text-gray-600 hover:bg-gray-100'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
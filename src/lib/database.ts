import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  reputation_score: number;
  total_reviews: number;
  badges_earned: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  category: string;
  latitude: number;
  longitude: number;
  overall_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  location_id: string;
  rating: number;
  accessibility_features: string[];
  photos: string[];
  comments: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  user_profiles?: UserProfile;
  locations?: Location;
}

export interface NFTBadge {
  id: string;
  user_id: string;
  badge_type: string;
  token_id?: string;
  contract_address?: string;
  metadata_uri?: string;
  transaction_hash?: string;
  minted_at: string;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ReviewCounts {
  verified: number;
  pending: number;
  total: number;
}

// Enhanced error handling for database operations
const handleDatabaseError = (error: any, operation: string) => {
  console.error(`Database error during ${operation}:`, error);
  
  // Check for authentication-related errors
  if (error?.message?.includes('JWT') || 
      error?.message?.includes('token') || 
      error?.message?.includes('expired') ||
      error?.message?.includes('invalid') ||
      error?.code === 'PGRST301' || // PostgREST JWT expired
      error?.code === 'PGRST302') { // PostgREST JWT invalid
    
    // Re-throw with a more specific error message
    const authError = new Error('Authentication token is invalid or expired. Please sign in again.');
    authError.name = 'AuthenticationError';
    throw authError;
  }
  
  // For other errors, re-throw the original error
  throw error;
};

// User Profile Functions
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      handleDatabaseError(error, 'getUserProfile');
    }

    return data;
  } catch (error) {
    handleDatabaseError(error, 'getUserProfile');
    return null; // This line won't be reached due to the throw above, but TypeScript needs it
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      handleDatabaseError(error, 'updateUserProfile');
    }

    return data;
  } catch (error) {
    handleDatabaseError(error, 'updateUserProfile');
  }
};

// Location Functions
export const getLocations = async (): Promise<Location[]> => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      handleDatabaseError(error, 'getLocations');
    }

    return data || [];
  } catch (error) {
    handleDatabaseError(error, 'getLocations');
    return []; // This line won't be reached due to the throw above, but TypeScript needs it
  }
};

export const getLocationById = async (locationId: string): Promise<Location | null> => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', locationId)
      .single();

    if (error) {
      console.error('Error fetching location:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
};

export const createLocation = async (location: Omit<Location, 'id' | 'created_at' | 'updated_at' | 'overall_rating' | 'total_reviews'>) => {
  console.log('createLocation: Function called with data:', location);
  
  try {
    console.log('createLocation: Starting fetch before insert logic');
    
    // FETCH BEFORE INSERT: Check if location already exists
    console.log('createLocation: Checking for existing location with name and address');
    const { data: existingLocation, error: fetchError } = await supabase
      .from('locations')
      .select('*')
      .eq('name', location.name)
      .eq('address', location.address)
      .single();

    console.log('createLocation: Fetch query completed');
    console.log('createLocation: Existing location data:', existingLocation);
    console.log('createLocation: Fetch error:', fetchError);

    // If we found an existing location, return it
    if (existingLocation && !fetchError) {
      console.log('createLocation: Found existing location, returning:', existingLocation);
      return existingLocation;
    }

    // If the error is not "no rows found", it's a real error
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('createLocation: Unexpected error during fetch:', fetchError);
      handleDatabaseError(fetchError, 'createLocation (fetch phase)');
    }

    console.log('createLocation: No existing location found, proceeding with insert');
    console.log('createLocation: About to call supabase.from("locations").insert()');
    console.log('createLocation: Supabase client status:', !!supabase);
    
    const startTime = Date.now();
    
    // INSERT: Create new location since none exists
    const { data, error } = await supabase
      .from('locations')
      .insert(location)
      .select()
      .single();

    const endTime = Date.now();
    console.log('createLocation: Insert call completed in', endTime - startTime, 'ms');
    console.log('createLocation: Insert result - data:', data, 'error:', error);

    if (error) {
      console.error('createLocation: Supabase insert error:', error);
      console.error('createLocation: Error details - message:', error.message, 'code:', error.code, 'details:', error.details);
      handleDatabaseError(error, 'createLocation (insert phase)');
    }

    console.log('createLocation: Insert successful, returning new location:', data);
    return data;
  } catch (error) {
    console.error('createLocation: Caught error during location creation:', error);
    console.error('createLocation: Error stack:', (error as Error).stack);
    handleDatabaseError(error, 'createLocation');
  }
};

// Review Functions
export const getReviews = async (locationId?: string): Promise<Review[]> => {
  try {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        user_profiles (
          id,
          full_name,
          avatar_url
        ),
        locations (
          id,
          name,
          address
        )
      `)
      .order('created_at', { ascending: false });

    if (locationId) {
      query = query.eq('location_id', locationId);
    }

    const { data, error } = await query;

    if (error) {
      handleDatabaseError(error, 'getReviews');
    }

    return data || [];
  } catch (error) {
    handleDatabaseError(error, 'getReviews');
    return []; // This line won't be reached due to the throw above, but TypeScript needs it
  }
};

export const getUserReviews = async (
  userId: string,
  options: {
    page?: number;
    limit?: number;
    searchQuery?: string;
    categoryFilter?: string;
    sortBy?: 'created_at' | 'rating' | 'location_name';
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<PaginatedResult<Review>> => {
  const {
    page = 1,
    limit = 10,
    searchQuery = '',
    categoryFilter = '',
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options;

  const offset = (page - 1) * limit;

  try {
    // Build the base query
    let query = supabase
      .from('reviews')
      .select(`
        *,
        locations (
          id,
          name,
          address,
          category
        )
      `, { count: 'exact' })
      .eq('user_id', userId);

    // Apply search filter
    if (searchQuery.trim()) {
      query = query.or(`comments.ilike.%${searchQuery}%,locations.name.ilike.%${searchQuery}%,locations.address.ilike.%${searchQuery}%`);
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
      query = query.eq('locations.category', categoryFilter);
    }

    // Apply sorting
    if (sortBy === 'location_name') {
      query = query.order('name', { ascending: sortOrder === 'asc', foreignTable: 'locations' });
    } else {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      handleDatabaseError(error, 'getUserReviews');
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: data || [],
      count: totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    handleDatabaseError(error, 'getUserReviews');
    // This return won't be reached due to the throw above, but TypeScript needs it
    return {
      data: [],
      count: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
};

export const getReviewCountsByVerificationStatus = async (userId: string): Promise<ReviewCounts> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('is_verified')
      .eq('user_id', userId);

    if (error) {
      handleDatabaseError(error, 'getReviewCountsByVerificationStatus');
    }

    const reviews = data || [];
    const verified = reviews.filter(review => review.is_verified).length;
    const pending = reviews.filter(review => !review.is_verified).length;
    const total = reviews.length;

    return {
      verified,
      pending,
      total,
    };
  } catch (error) {
    handleDatabaseError(error, 'getReviewCountsByVerificationStatus');
    // This return won't be reached due to the throw above, but TypeScript needs it
    return {
      verified: 0,
      pending: 0,
      total: 0,
    };
  }
};

export const createReview = async (review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'is_verified'>) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();

    if (error) {
      handleDatabaseError(error, 'createReview');
    }

    return data;
  } catch (error) {
    handleDatabaseError(error, 'createReview');
  }
};

export const updateReview = async (reviewId: string, updates: Partial<Review>) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      handleDatabaseError(error, 'updateReview');
    }

    return data;
  } catch (error) {
    handleDatabaseError(error, 'updateReview');
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      handleDatabaseError(error, 'deleteReview');
    }
  } catch (error) {
    handleDatabaseError(error, 'deleteReview');
  }
};

// NFT Badge Functions
export const getUserBadges = async (userId: string): Promise<NFTBadge[]> => {
  try {
    const { data, error } = await supabase
      .from('nft_badges')
      .select('*')
      .eq('user_id', userId)
      .order('minted_at', { ascending: false });

    if (error) {
      handleDatabaseError(error, 'getUserBadges');
    }

    return data || [];
  } catch (error) {
    handleDatabaseError(error, 'getUserBadges');
    return []; // This line won't be reached due to the throw above, but TypeScript needs it
  }
};

export const createNFTBadge = async (badge: Omit<NFTBadge, 'id' | 'minted_at'>) => {
  try {
    const { data, error } = await supabase
      .from('nft_badges')
      .insert(badge)
      .select()
      .single();

    if (error) {
      handleDatabaseError(error, 'createNFTBadge');
    }

    return data;
  } catch (error) {
    handleDatabaseError(error, 'createNFTBadge');
  }
};

// Search and Filter Functions
export const searchLocations = async (query: string, category?: string): Promise<Location[]> => {
  try {
    let searchQuery = supabase
      .from('locations')
      .select('*');

    if (query) {
      searchQuery = searchQuery.or(`name.ilike.%${query}%,address.ilike.%${query}%`);
    }

    if (category && category !== 'all') {
      searchQuery = searchQuery.eq('category', category);
    }

    const { data, error } = await searchQuery
      .order('overall_rating', { ascending: false })
      .limit(50);

    if (error) {
      handleDatabaseError(error, 'searchLocations');
    }

    return data || [];
  } catch (error) {
    handleDatabaseError(error, 'searchLocations');
    return []; // This line won't be reached due to the throw above, but TypeScript needs it
  }
};

// Statistics Functions
export const getLocationStats = async (locationId: string) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating, accessibility_features')
      .eq('location_id', locationId)
      .eq('is_verified', true);

    if (error) {
      handleDatabaseError(error, 'getLocationStats');
    }

    const reviews = data || [];
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    // Count accessibility features
    const featureCounts: Record<string, number> = {};
    reviews.forEach(review => {
      review.accessibility_features.forEach((feature: string) => {
        featureCounts[feature] = (featureCounts[feature] || 0) + 1;
      });
    });

    return {
      totalReviews,
      averageRating,
      featureCounts,
    };
  } catch (error) {
    handleDatabaseError(error, 'getLocationStats');
  }
};

export const getGlobalStats = async () => {
  try {
    const [locationsResult, reviewsResult, usersResult, badgesResult] = await Promise.all([
      supabase.from('locations').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
      supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('nft_badges').select('id', { count: 'exact', head: true }),
    ]);

    return {
      totalLocations: locationsResult.count || 0,
      totalReviews: reviewsResult.count || 0,
      totalUsers: usersResult.count || 0,
      totalBadges: badgesResult.count || 0,
    };
  } catch (error) {
    handleDatabaseError(error, 'getGlobalStats');
  }
};

// Get available categories for filtering
export const getReviewCategories = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('locations(category)')
      .eq('user_id', userId);

    if (error) {
      handleDatabaseError(error, 'getReviewCategories');
    }

    const categories = new Set<string>();
    data?.forEach(review => {
      if (review.locations?.category) {
        categories.add(review.locations.category);
      }
    });

    return Array.from(categories).sort();
  } catch (error) {
    handleDatabaseError(error, 'getReviewCategories');
    return []; // This line won't be reached due to the throw above, but TypeScript needs it
  }
};

// Leaderboard Functions
export const getTopUsers = async (options: {
  limit?: number;
  sortBy?: 'reputation_score' | 'total_reviews' | 'badges_earned';
  region?: string;
  timePeriod?: 'week' | 'month';
} = {}): Promise<UserProfile[]> => {
  const {
    limit = 50,
    sortBy = 'reputation_score',
    region,
    timePeriod
  } = options;

  try {
    let query = supabase
      .from('user_profiles')
      .select('*');

    // Apply time period filter if specified
    if (timePeriod) {
      const now = new Date();
      let startDate: Date;
      
      if (timePeriod === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (timePeriod === 'month') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else {
        startDate = new Date(0); // Beginning of time
      }

      query = query.gte('updated_at', startDate.toISOString());
    }

    // Apply region filter if specified
    if (region) {
      // For now, we'll skip region filtering since we don't have region data in user profiles
      // In a real implementation, you might join with reviews and locations to filter by region
    }

    // Apply sorting and limit
    query = query
      .order(sortBy, { ascending: false })
      .gt(sortBy, 0) // Only include users with some activity
      .limit(limit);

    const { data, error } = await query;

    if (error) {
      handleDatabaseError(error, 'getTopUsers');
    }

    return data || [];
  } catch (error) {
    handleDatabaseError(error, 'getTopUsers');
    return []; // This line won't be reached due to the throw above, but TypeScript needs it
  }
};

export const getLeaderboardRegions = async (): Promise<string[]> => {
  try {
    // Get unique cities from location addresses
    const { data, error } = await supabase
      .from('locations')
      .select('address');

    if (error) {
      handleDatabaseError(error, 'getLeaderboardRegions');
    }

    const regions = new Set<string>();
    data?.forEach(location => {
      // Extract city from address (simplified - assumes format "Street, City, State")
      const addressParts = location.address.split(',');
      if (addressParts.length >= 2) {
        const city = addressParts[addressParts.length - 2].trim();
        regions.add(city);
      }
    });

    return Array.from(regions).sort();
  } catch (error) {
    handleDatabaseError(error, 'getLeaderboardRegions');
    return []; // This line won't be reached due to the throw above, but TypeScript needs it
  }
};

// Admin Functions
export const getAllReviewsForAdmin = async (options: {
  page?: number;
  limit?: number;
  searchQuery?: string;
  verificationFilter?: 'all' | 'verified' | 'pending';
  sortBy?: 'created_at' | 'rating' | 'location_name' | 'user_name';
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<PaginatedResult<Review>> => {
  const {
    page = 1,
    limit = 20,
    searchQuery = '',
    verificationFilter = 'all',
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options;

  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        user_profiles (
          id,
          full_name,
          avatar_url
        ),
        locations (
          id,
          name,
          address,
          category
        )
      `, { count: 'exact' });

    // Apply search filter
    if (searchQuery.trim()) {
      query = query.or(`comments.ilike.%${searchQuery}%,locations.name.ilike.%${searchQuery}%,locations.address.ilike.%${searchQuery}%,user_profiles.full_name.ilike.%${searchQuery}%`);
    }

    // Apply verification filter
    if (verificationFilter === 'verified') {
      query = query.eq('is_verified', true);
    } else if (verificationFilter === 'pending') {
      query = query.eq('is_verified', false);
    }

    // Apply sorting
    if (sortBy === 'location_name') {
      query = query.order('name', { ascending: sortOrder === 'asc', foreignTable: 'locations' });
    } else if (sortBy === 'user_name') {
      query = query.order('full_name', { ascending: sortOrder === 'asc', foreignTable: 'user_profiles' });
    } else {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      handleDatabaseError(error, 'getAllReviewsForAdmin');
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: data || [],
      count: totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    handleDatabaseError(error, 'getAllReviewsForAdmin');
    // This return won't be reached due to the throw above, but TypeScript needs it
    return {
      data: [],
      count: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
};

export const getAllUsersForAdmin = async (options: {
  page?: number;
  limit?: number;
  searchQuery?: string;
  sortBy?: 'created_at' | 'full_name' | 'total_reviews' | 'reputation_score';
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<PaginatedResult<UserProfile>> => {
  const {
    page = 1,
    limit = 20,
    searchQuery = '',
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options;

  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('user_profiles')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (searchQuery.trim()) {
      query = query.or(`full_name.ilike.%${searchQuery}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      handleDatabaseError(error, 'getAllUsersForAdmin');
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: data || [],
      count: totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    handleDatabaseError(error, 'getAllUsersForAdmin');
    // This return won't be reached due to the throw above, but TypeScript needs it
    return {
      data: [],
      count: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
};

export const verifyReview = async (reviewId: string, isVerified: boolean) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update({ is_verified: isVerified })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      handleDatabaseError(error, 'verifyReview');
    }

    return data;
  } catch (error) {
    handleDatabaseError(error, 'verifyReview');
  }
};

export const deleteReviewAsAdmin = async (reviewId: string) => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      handleDatabaseError(error, 'deleteReviewAsAdmin');
    }
  } catch (error) {
    handleDatabaseError(error, 'deleteReviewAsAdmin');
  }
};

export const updateUserAsAdmin = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      handleDatabaseError(error, 'updateUserAsAdmin');
    }

    return data;
  } catch (error) {
    handleDatabaseError(error, 'updateUserAsAdmin');
  }
};
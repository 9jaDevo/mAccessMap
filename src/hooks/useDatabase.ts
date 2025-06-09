import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as db from '../lib/database';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<db.UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const userProfile = await db.getUserProfile(user.id);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return { profile, loading, refetch: fetchProfile };
};

export const useLocations = () => {
  const [locations, setLocations] = useState<db.Location[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const data = await db.getLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return { locations, loading, refetch: fetchLocations };
};

export const useReviews = (locationId?: string) => {
  const [reviews, setReviews] = useState<db.Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const data = await db.getReviews(locationId);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [locationId]);

  return { reviews, loading, refetch: fetchReviews };
};

export const useUserReviews = (options?: {
  page?: number;
  limit?: number;
  searchQuery?: string;
  categoryFilter?: string;
  sortBy?: 'created_at' | 'rating' | 'location_name';
  sortOrder?: 'asc' | 'desc';
}) => {
  const { user } = useAuth();
  const [result, setResult] = useState<db.PaginatedResult<db.Review>>({
    data: [],
    count: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchUserReviews = async () => {
    if (!user) {
      setResult({
        data: [],
        count: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
      setLoading(false);
      return;
    }

    try {
      const data = await db.getUserReviews(user.id, options);
      setResult(data);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReviews();
  }, [user, options?.page, options?.limit, options?.searchQuery, options?.categoryFilter, options?.sortBy, options?.sortOrder]);

  return { 
    reviews: result.data, 
    pagination: {
      count: result.count,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
    },
    loading, 
    refetch: fetchUserReviews 
  };
};

export const useUserBadges = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<db.NFTBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBadges = async () => {
    if (!user) {
      setBadges([]);
      setLoading(false);
      return;
    }

    try {
      const data = await db.getUserBadges(user.id);
      setBadges(data);
    } catch (error) {
      console.error('Error fetching user badges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBadges();
  }, [user]);

  return { badges, loading, refetch: fetchUserBadges };
};

export const useReviewCategories = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) {
        setCategories([]);
        setLoading(false);
        return;
      }

      try {
        const data = await db.getReviewCategories(user.id);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching review categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user]);

  return { categories, loading };
};

export const useLeaderboard = (options?: {
  sortBy?: 'reputation_score' | 'total_reviews' | 'badges_earned';
  region?: string;
  timePeriod?: 'week' | 'month';
}) => {
  const [users, setUsers] = useState<db.UserProfile[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [usersData, regionsData] = await Promise.all([
        db.getTopUsers(options),
        db.getLeaderboardRegions()
      ]);
      
      setUsers(usersData);
      setRegions(regionsData);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [options?.sortBy, options?.region, options?.timePeriod]);

  return { users, regions, loading, error, refetch: fetchLeaderboard };
};
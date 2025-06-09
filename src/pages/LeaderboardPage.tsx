import React, { useState } from 'react';
import { Trophy, Medal, Award, Users, Star, MapPin, Calendar, TrendingUp, Crown } from 'lucide-react';
import { useLeaderboard } from '../hooks/useDatabase';

type RankingType = 'reputation' | 'reviews' | 'badges';
type TimePeriod = 'all' | 'month' | 'week';

export const LeaderboardPage: React.FC = () => {
  const [rankingType, setRankingType] = useState<RankingType>('reputation');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const { users, regions, loading, error } = useLeaderboard({
    sortBy: rankingType === 'reputation' ? 'reputation_score' : 
           rankingType === 'reviews' ? 'total_reviews' : 'badges_earned',
    region: selectedRegion === 'all' ? undefined : selectedRegion,
    timePeriod: timePeriod === 'all' ? undefined : timePeriod,
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <div className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">#{rank}</div>;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  const getStatValue = (user: any) => {
    switch (rankingType) {
      case 'reputation': return user.reputation_score;
      case 'reviews': return user.total_reviews;
      case 'badges': return user.badges_earned;
      default: return 0;
    }
  };

  const getStatLabel = () => {
    switch (rankingType) {
      case 'reputation': return 'Reputation Points';
      case 'reviews': return 'Reviews Submitted';
      case 'badges': return 'Badges Earned';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Leaderboard</h3>
          <p className="text-gray-600">Fetching top accessibility advocates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Unable to Load Leaderboard</h3>
          <p className="text-gray-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-6">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Leaderboard</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Celebrating our top accessibility advocates who are making the world more inclusive
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Ranking Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Rank By</label>
              <div className="space-y-2">
                <button
                  onClick={() => setRankingType('reputation')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                    rankingType === 'reputation'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">Reputation Score</span>
                </button>
                <button
                  onClick={() => setRankingType('reviews')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                    rankingType === 'reviews'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Star className="w-5 h-5" />
                  <span className="font-medium">Total Reviews</span>
                </button>
                <button
                  onClick={() => setRankingType('badges')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                    rankingType === 'badges'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Award className="w-5 h-5" />
                  <span className="font-medium">Badges Earned</span>
                </button>
              </div>
            </div>

            {/* Time Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Time Period</label>
              <div className="space-y-2">
                <button
                  onClick={() => setTimePeriod('all')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                    timePeriod === 'all'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">All Time</span>
                </button>
                <button
                  onClick={() => setTimePeriod('month')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                    timePeriod === 'month'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">This Month</span>
                </button>
                <button
                  onClick={() => setTimePeriod('week')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                    timePeriod === 'week'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">This Week</span>
                </button>
              </div>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        {users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Contributors Found</h3>
            <p className="text-gray-500">
              Be the first to contribute accessibility reviews and earn your place on the leaderboard!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top 3 Podium */}
            {users.length >= 3 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Top Contributors</h2>
                <div className="flex justify-center items-end space-x-8">
                  {/* 2nd Place */}
                  <div className="text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mx-auto">
                        {users[1]?.avatar_url ? (
                          <img 
                            src={users[1].avatar_url} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <Medal className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900">{users[1]?.full_name}</h3>
                    <p className="text-sm text-gray-600">{getStatValue(users[1])} {getStatLabel()}</p>
                    <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mt-2">
                      2nd Place
                    </div>
                  </div>

                  {/* 1st Place */}
                  <div className="text-center">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 bg-yellow-200 rounded-full flex items-center justify-center overflow-hidden mx-auto border-4 border-yellow-400">
                        {users[0]?.avatar_url ? (
                          <img 
                            src={users[0].avatar_url} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-12 h-12 text-yellow-600" />
                        )}
                      </div>
                      <div className="absolute -top-3 -right-3">
                        <Crown className="w-10 h-10 text-yellow-500" />
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{users[0]?.full_name}</h3>
                    <p className="text-gray-600">{getStatValue(users[0])} {getStatLabel()}</p>
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold mt-2">
                      🏆 Champion
                    </div>
                  </div>

                  {/* 3rd Place */}
                  <div className="text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center overflow-hidden mx-auto">
                        {users[2]?.avatar_url ? (
                          <img 
                            src={users[2].avatar_url} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-10 h-10 text-amber-600" />
                        )}
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <Award className="w-8 h-8 text-amber-600" />
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900">{users[2]?.full_name}</h3>
                    <p className="text-sm text-gray-600">{getStatValue(users[2])} {getStatLabel()}</p>
                    <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium mt-2">
                      3rd Place
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Full Rankings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Complete Rankings - {getStatLabel()}
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {users.map((user, index) => {
                  const rank = index + 1;
                  return (
                    <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getRankBadgeColor(rank)}`}>
                          {rank <= 3 ? getRankIcon(rank) : `#${rank}`}
                        </div>

                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt="Avatar" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="w-6 h-6 text-gray-400" />
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>{user.reputation_score} reputation</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4" />
                              <span>{user.total_reviews} reviews</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Award className="w-4 h-4" />
                              <span>{user.badges_earned} badges</span>
                            </div>
                          </div>
                        </div>

                        {/* Primary Stat */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">
                            {getStatValue(user).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getStatLabel()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-8 mt-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Join the Leaderboard!</h2>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Start contributing accessibility reviews today and earn your place among the top advocates 
            making the world more inclusive for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/review"
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Submit Your First Review
            </a>
            <a
              href="/badges"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
            >
              View Available Badges
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
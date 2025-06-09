import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Camera, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useDatabase';
import { updateUserProfile } from '../lib/database';
import { showToast } from '../components/Toaster';

export const EditProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading, refetch } = useUserProfile();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || '',
      });
      setAvatarPreview(profile.avatar_url || '');
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === 'avatar_url') {
      setAvatarPreview(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      showToast('error', 'User not found');
      return;
    }

    if (!formData.full_name.trim()) {
      showToast('error', 'Full name is required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await updateUserProfile(user.id, {
        full_name: formData.full_name.trim(),
        avatar_url: formData.avatar_url.trim() || null,
      });
      
      refetch();
      showToast('success', 'Profile updated successfully!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showToast('error', error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarError = () => {
    setAvatarPreview('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to edit your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Profile</h3>
          <p className="text-gray-600">Fetching your profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/profile"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-1">Update your profile information</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      onError={handleAvatarError}
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                  <Camera className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Profile Picture</p>
            </div>

            {/* Avatar URL Input */}
            <div>
              <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://example.com/your-avatar.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a URL to an image you'd like to use as your profile picture
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed. Contact support if you need to update your email.
              </p>
            </div>

            {/* Account Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Account Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Member Since:</span>
                  <div className="font-medium text-gray-900">
                    {new Date(user.created_at || '').toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Total Reviews:</span>
                  <div className="font-medium text-emerald-600">
                    {profile?.total_reviews || 0}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Badges Earned:</span>
                  <div className="font-medium text-purple-600">
                    {profile?.badges_earned || 0}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Impact Score:</span>
                  <div className="font-medium text-orange-600">
                    {profile?.reputation_score || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } text-white`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              
              <Link
                to="/profile"
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Privacy Notice</h4>
          <p className="text-sm text-blue-700">
            Your profile information is used to personalize your experience and display your contributions 
            to the accessibility community. Your email address is never shared publicly.
          </p>
        </div>
      </div>
    </div>
  );
};
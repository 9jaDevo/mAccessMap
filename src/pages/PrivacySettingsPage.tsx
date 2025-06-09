import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, EyeOff, Globe, Lock, Users, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/Toaster';

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  category: 'profile' | 'reviews' | 'notifications';
}

export const PrivacySettingsPage: React.FC = () => {
  const { user } = useAuth();
  
  const [settings, setSettings] = useState<PrivacySetting[]>([
    {
      id: 'public_profile',
      title: 'Public Profile',
      description: 'Allow other users to view your profile and contribution statistics',
      icon: Globe,
      enabled: true,
      category: 'profile',
    },
    {
      id: 'show_review_count',
      title: 'Show Review Count',
      description: 'Display the number of reviews you\'ve submitted on your public profile',
      icon: Eye,
      enabled: true,
      category: 'profile',
    },
    {
      id: 'show_badges',
      title: 'Show Badges',
      description: 'Display your earned NFT badges on your public profile',
      icon: Shield,
      enabled: true,
      category: 'profile',
    },
    {
      id: 'anonymous_reviews',
      title: 'Anonymous Reviews',
      description: 'Hide your name from public reviews (reviews will show as "Anonymous User")',
      icon: EyeOff,
      enabled: false,
      category: 'reviews',
    },
    {
      id: 'review_notifications',
      title: 'Review Notifications',
      description: 'Receive notifications when your reviews are verified or commented on',
      icon: Bell,
      enabled: true,
      category: 'notifications',
    },
    {
      id: 'badge_notifications',
      title: 'Badge Notifications',
      description: 'Receive notifications when you earn new NFT badges',
      icon: Shield,
      enabled: true,
      category: 'notifications',
    },
    {
      id: 'community_updates',
      title: 'Community Updates',
      description: 'Receive occasional updates about new features and community highlights',
      icon: Users,
      enabled: false,
      category: 'notifications',
    },
  ]);

  const toggleSetting = (settingId: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ));
    
    // In a real app, this would save to the database
    showToast('success', 'Privacy setting updated');
  };

  const handleSaveAll = () => {
    // In a real app, this would save all settings to the database
    showToast('success', 'All privacy settings saved successfully!');
  };

  const handleResetToDefaults = () => {
    setSettings(prev => prev.map(setting => ({
      ...setting,
      enabled: setting.id === 'public_profile' || 
               setting.id === 'show_review_count' || 
               setting.id === 'show_badges' ||
               setting.id === 'review_notifications' ||
               setting.id === 'badge_notifications'
    })));
    showToast('info', 'Privacy settings reset to defaults');
  };

  const groupedSettings = {
    profile: settings.filter(s => s.category === 'profile'),
    reviews: settings.filter(s => s.category === 'reviews'),
    notifications: settings.filter(s => s.category === 'notifications'),
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to manage your privacy settings.</p>
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
          
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Settings</h1>
          </div>
          <p className="text-gray-600">Control how your information is shared and displayed</p>
        </div>

        {/* Profile Visibility Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              <span>Profile Visibility</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Control what information is visible on your public profile
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            {groupedSettings.profile.map((setting) => {
              const Icon = setting.icon;
              return (
                <div key={setting.id} className="flex items-center justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">{setting.title}</h3>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting(setting.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      setting.enabled ? 'bg-emerald-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Privacy Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span>Review Privacy</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Control how your reviews and contributions are displayed
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            {groupedSettings.reviews.map((setting) => {
              const Icon = setting.icon;
              return (
                <div key={setting.id} className="flex items-center justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">{setting.title}</h3>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting(setting.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      setting.enabled ? 'bg-emerald-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              <span>Notifications</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose what notifications you'd like to receive
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            {groupedSettings.notifications.map((setting) => {
              const Icon = setting.icon;
              return (
                <div key={setting.id} className="flex items-center justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">{setting.title}</h3>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting(setting.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      setting.enabled ? 'bg-emerald-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleSaveAll}
            className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Save All Settings
          </button>
          <button
            onClick={handleResetToDefaults}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Privacy Commitment</h4>
          <p className="text-sm text-blue-700">
            We are committed to protecting your privacy. Your personal information is never sold or 
            shared with third parties. All data is encrypted and stored securely. You can request 
            to download or delete your data at any time by contacting our support team.
          </p>
        </div>
      </div>
    </div>
  );
};
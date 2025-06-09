import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Eye, EyeOff, LogIn, UserPlus, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/Toaster';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        showToast('success', 'Welcome back! You have been signed in successfully.');
        navigate('/profile');
      } else {
        if (!formData.fullName.trim()) {
          showToast('error', 'Please enter your full name');
          return;
        }
        await signUp(formData.email, formData.password, formData.fullName);
        showToast('success', 'Account created successfully! Welcome to mAccessMap.');
        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      showToast('error', error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleQuickLogin = (email: string, password: string) => {
    setFormData({
      email,
      password,
      fullName: '',
    });
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <img 
              src="/logo.png" 
              alt="mAccessMap Logo" 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                // Fallback to icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center';
                fallback.innerHTML = '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>';
                target.parentNode?.insertBefore(fallback, target);
              }}
            />
            <span className="text-2xl font-bold text-gray-900">mAccessMap</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Join Our Community'}
          </h2>
          <p className="text-gray-600">
            {isLogin 
              ? 'Sign in to continue your accessibility journey'
              : 'Start making spaces more accessible for everyone'
            }
          </p>
        </div>

        {/* Quick Login Buttons */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Quick Login (Demo)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('admin@example.com', '123456')}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              Admin Login
            </button>
            <button
              onClick={() => handleQuickLogin('user@example.com', '123456')}
              className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              User Login
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="fullName\" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required={!isLogin}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              } text-white`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>

          {!isLogin && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
              <h4 className="text-sm font-medium text-emerald-800 mb-2">Why Join mAccessMap?</h4>
              <ul className="text-xs text-emerald-600 space-y-1">
                <li>• Help make public spaces more accessible</li>
                <li>• Earn unique NFT badges for your contributions</li>
                <li>• Connect with a community of accessibility advocates</li>
                <li>• Track your impact on accessibility improvements</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
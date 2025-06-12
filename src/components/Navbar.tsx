import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Award, User, LogOut, Settings, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  // Debug logging for isAdmin state changes
  React.useEffect(() => {
    console.log('Navbar: [useEffect] isAdmin state changed to:', isAdmin);
    console.log('Navbar: [useEffect] Current user:', user?.id || 'no user');
    console.log('Navbar: [useEffect] Current location:', location.pathname);
  }, [isAdmin, user?.id, location.pathname]);

  // Additional logging on every render
  console.log('Navbar: [render] Current state:', {
    hasUser: !!user,
    userId: user?.id,
    isAdmin,
    currentPath: location.pathname,
    timestamp: new Date().toISOString()
  });

  const navigation = [
    { name: 'Map Explorer', href: '/map', icon: MapPin },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Badges', href: '/badges', icon: Award },
    ...(user ? [{ name: 'Profile', href: '/profile', icon: User }] : []),
    ...(isAdmin ? [{ name: 'Admin Panel', href: '/admin', icon: Settings }] : []),
  ];

  // Log navigation array changes
  React.useEffect(() => {
    console.log('Navbar: [navigation] Navigation items updated:', navigation.map(item => item.name));
    console.log('Navbar: [navigation] Admin panel included:', navigation.some(item => item.name === 'Admin Panel'));
  }, [navigation.length, isAdmin]);

  const handleSignOut = async () => {
    console.log('Navbar: [handleSignOut] Sign out initiated');
    console.log('Navbar: [handleSignOut] Current isAdmin state before sign out:', isAdmin);

    try {
      await signOut();
      console.log('Navbar: [handleSignOut] Sign out completed successfully');
    } catch (error) {
      console.error('Navbar: [handleSignOut] Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="mAccessMap Logo" 
                className="w-8 h-8 object-contain" 
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center';
                  fallback.innerHTML = '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>';
                  target.parentNode?.insertBefore(fallback, target);
                }} 
              />
              <span className="text-xl font-bold text-gray-900">mAccessMap</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isAdminPanel = item.name === 'Admin Panel';
                
                // Log when rendering admin panel item
                if (isAdminPanel) {
                  console.log('Navbar: [render] Rendering Admin Panel navigation item');
                  console.log('Navbar: [render] isAdmin state when rendering Admin Panel:', isAdmin);
                }
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      if (isAdminPanel) {
                        console.log('Navbar: [onClick] Admin Panel clicked, current isAdmin:', isAdmin);
                      }
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isAdminPanel = item.name === 'Admin Panel';
                
                // Log when rendering admin panel item in mobile
                if (isAdminPanel) {
                  console.log('Navbar: [mobile render] Rendering Admin Panel navigation item');
                  console.log('Navbar: [mobile render] isAdmin state when rendering Admin Panel:', isAdmin);
                }
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => {
                      setIsOpen(false);
                      if (isAdminPanel) {
                        console.log('Navbar: [mobile onClick] Admin Panel clicked, current isAdmin:', isAdmin);
                      }
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {user ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </>
    </nav>
  );
};
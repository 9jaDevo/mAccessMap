import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Github, Linkedin, Facebook, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
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
                  fallback.innerHTML = '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>';
                  target.parentNode?.insertBefore(fallback, target);
                }}
              />
              <span className="text-xl font-bold">mAccessMap</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Empowering communities to create a more accessible world through collaborative mapping and blockchain-verified contributions.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for accessibility</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/map" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  Explore Map
                </Link>
              </li>
              <li>
                <Link to="/review" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  Add Review
                </Link>
              </li>
              <li>
                <Link to="/badges" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  NFT Badges
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal & Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links & Newsletter */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-400">Follow us:</span>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/9jaDevo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                  aria-label="Follow us on GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/ambassador-akinwumi-michael/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                  aria-label="Follow us on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://web.facebook.com/AmbassadorMich6/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400">Stay updated:</span>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-r-lg text-sm font-medium transition-colors flex items-center space-x-1">
                  <span>Subscribe</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} mAccessMap. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Built with accessibility in mind</span>
              <div className="flex items-center space-x-1">
                <span>Powered by</span>
                <a
                  href="https://polygon.technology/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Polygon
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
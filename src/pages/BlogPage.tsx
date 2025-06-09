import React from 'react';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

export const BlogPage: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Future of Accessibility Mapping: How Blockchain is Revolutionizing Civic Engagement',
      excerpt: 'Discover how blockchain technology is creating permanent, verifiable records of accessibility contributions and transforming how communities document inclusive spaces.',
      author: 'Ambassador Akinwumi Michael',
      date: '2024-01-15',
      category: 'Technology',
      readTime: '5 min read',
      image: 'https://images.pexels.com/photos/7551659/pexels-photo-7551659.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
      featured: true,
    },
    {
      id: '2',
      title: '10 Essential Accessibility Features Every Business Should Have',
      excerpt: 'A comprehensive guide to the most important accessibility features that make businesses welcoming to everyone, from wheelchair ramps to audio announcements.',
      author: 'Sarah Chen',
      date: '2024-01-10',
      category: 'Accessibility',
      readTime: '7 min read',
      image: 'https://images.pexels.com/photos/7551728/pexels-photo-7551728.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
    },
    {
      id: '3',
      title: 'Community Spotlight: How Chicago Became a Model for Inclusive Urban Planning',
      excerpt: 'Learn how one city used community-driven accessibility mapping to transform their public spaces and create a more inclusive environment for all residents.',
      author: 'Marcus Rodriguez',
      date: '2024-01-05',
      category: 'Community',
      readTime: '6 min read',
      image: 'https://images.pexels.com/photos/7551661/pexels-photo-7551661.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
    },
    {
      id: '4',
      title: 'Understanding NFT Badges: Your Digital Recognition for Real-World Impact',
      excerpt: 'Everything you need to know about earning, viewing, and sharing your mAccessMap NFT badges that recognize your contributions to accessibility.',
      author: 'Ambassador Akinwumi Michael',
      date: '2023-12-28',
      category: 'Technology',
      readTime: '4 min read',
      image: 'https://images.pexels.com/photos/7551662/pexels-photo-7551662.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
    },
    {
      id: '5',
      title: 'The Psychology of Inclusive Design: Why Accessibility Benefits Everyone',
      excerpt: 'Explore the research behind universal design principles and how creating accessible spaces improves the experience for all users, not just those with disabilities.',
      author: 'Dr. Emily Watson',
      date: '2023-12-20',
      category: 'Research',
      readTime: '8 min read',
      image: 'https://images.pexels.com/photos/7551663/pexels-photo-7551663.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
    },
    {
      id: '6',
      title: 'Getting Started: Your First Accessibility Review',
      excerpt: 'A step-by-step guide for new contributors on how to submit your first accessibility review and start making a difference in your community.',
      author: 'Marcus Rodriguez',
      date: '2023-12-15',
      category: 'Getting Started',
      readTime: '3 min read',
      image: 'https://images.pexels.com/photos/7551664/pexels-photo-7551664.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
    },
  ];

  const categories = ['All', 'Technology', 'Accessibility', 'Community', 'Research', 'Getting Started'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">mAccessMap Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Insights, stories, and updates from the accessibility community
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{post.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span>{post.readTime}</span>
                </div>
                <button className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1 text-sm">
                  <span>Read More</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest accessibility insights, community stories, and platform updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
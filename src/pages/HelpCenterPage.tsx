import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, HelpCircle, Book, MessageCircle, Video, FileText } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  articles: number;
}

export const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories: HelpCategory[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using mAccessMap',
      icon: Book,
      articles: 8,
    },
    {
      id: 'reviews',
      title: 'Reviews & Ratings',
      description: 'How to submit and manage accessibility reviews',
      icon: MessageCircle,
      articles: 12,
    },
    {
      id: 'nft-badges',
      title: 'NFT Badges',
      description: 'Understanding and earning digital badges',
      icon: HelpCircle,
      articles: 6,
    },
    {
      id: 'account',
      title: 'Account & Profile',
      description: 'Managing your account and privacy settings',
      icon: FileText,
      articles: 10,
    },
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I create an account on mAccessMap?',
      answer: 'To create an account, click the "Sign In" button in the top navigation, then select "Sign Up". You\'ll need to provide your email address, create a password, and enter your full name. After submitting the form, you can start using mAccessMap immediately.',
      category: 'getting-started',
    },
    {
      id: '2',
      question: 'What makes a good accessibility review?',
      answer: 'A good accessibility review includes specific details about accessibility features like ramps, automatic doors, accessible restrooms, parking, and any barriers you encountered. Include photos when possible and be honest about both positive and negative aspects. Focus on factual observations rather than opinions.',
      category: 'reviews',
    },
    {
      id: '3',
      question: 'How do I earn NFT badges?',
      answer: 'NFT badges are earned by submitting verified accessibility reviews. After your first 5 reviews are verified by our community, you\'ll receive your first badge. Additional badges are earned at milestones like 25, 50, and 100 verified reviews. Badges are automatically minted to your connected wallet.',
      category: 'nft-badges',
    },
    {
      id: '4',
      question: 'Can I edit or delete my reviews?',
      answer: 'Yes, you can edit or delete your reviews at any time. Go to your profile page, click "View All Reviews", then use the edit or delete buttons next to each review. Note that editing a review may require re-verification.',
      category: 'reviews',
    },
    {
      id: '5',
      question: 'How is my privacy protected?',
      answer: 'We take privacy seriously. Your email address is never shared publicly, and you can choose to make your reviews anonymous. We use encryption to protect your data and never sell your information to third parties. You can review our full Privacy Policy for more details.',
      category: 'account',
    },
    {
      id: '6',
      question: 'What if I find incorrect information about a location?',
      answer: 'If you find outdated or incorrect accessibility information, please submit a new review with current details. Our community-driven approach means that more recent reviews help provide accurate information. You can also report obviously false or spam reviews using the report button.',
      category: 'reviews',
    },
    {
      id: '7',
      question: 'How do I connect my crypto wallet for NFT badges?',
      answer: 'To receive NFT badges, you\'ll need a compatible crypto wallet like MetaMask. In your profile settings, look for the "Connect Wallet" option and follow the prompts. We support wallets that work with the Polygon network. Your badges will be automatically sent to your connected wallet.',
      category: 'nft-badges',
    },
    {
      id: '8',
      question: 'Can I use mAccessMap without creating an account?',
      answer: 'You can browse locations and read reviews without an account, but you\'ll need to create an account to submit reviews, earn badges, or save favorite locations. Creating an account is free and helps us build a trusted community of contributors.',
      category: 'getting-started',
    },
    {
      id: '9',
      question: 'How are reviews verified?',
      answer: 'Reviews are verified through a combination of community moderation and automated checks. We look for detailed, helpful information and may flag reviews that seem suspicious. Verified reviews contribute to your badge progress and help maintain the quality of our platform.',
      category: 'reviews',
    },
    {
      id: '10',
      question: 'What accessibility features should I look for when reviewing?',
      answer: 'Key features include: wheelchair accessibility (ramps, wide doors, accessible restrooms), parking availability, automatic doors, audio announcements, visual aids like braille or high contrast signage, and staff assistance availability. Also note any barriers or challenges you encounter.',
      category: 'reviews',
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of mAccessMap
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedCategory === category.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedCategory === category.id
                        ? 'bg-emerald-100'
                        : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        selectedCategory === category.id
                          ? 'text-emerald-600'
                          : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.title}</h3>
                      <p className="text-sm text-gray-500">{category.articles} articles</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </button>
              );
            })}
          </div>
          
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              ← Show all categories
            </button>
          )}
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
            {filteredFAQs.length !== faqs.length && (
              <span className="text-lg font-normal text-gray-500 ml-2">
                ({filteredFAQs.length} of {faqs.length})
              </span>
            )}
          </h2>
          
          {filteredFAQs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
              <p className="text-gray-500">
                Try adjusting your search terms or browse a different category.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {filteredFAQs.map((faq, index) => (
                <div key={faq.id} className={index !== 0 ? 'border-t border-gray-200' : ''}>
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                  
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Contact Support */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you with any questions about mAccessMap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="mailto:support@maccessmap.org"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
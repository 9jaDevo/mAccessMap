import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Award, Users, Heart, ArrowRight, Shield, Camera, Star } from 'lucide-react';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Map Explorer',
      description: 'Discover accessibility ratings for businesses, parks, and public spaces in your area.',
    },
    {
      icon: Camera,
      title: 'Share Reviews',
      description: 'Upload photos and rate accessibility features to help others navigate confidently.',
    },
    {
      icon: Award,
      title: 'Earn NFT Badges',
      description: 'Collect unique digital badges that recognize your contributions to accessibility.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a growing community of advocates making the world more accessible.',
    },
  ];

  const stats = [
    { label: 'Locations Reviewed', value: '12,547' },
    { label: 'Active Contributors', value: '3,821' },
    { label: 'NFT Badges Minted', value: '1,943' },
    { label: 'Cities Covered', value: '156' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Making Every Space
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 block">
                Accessible
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empower your community by cataloging accessibility features of public spaces. 
              Earn digital badges as you help create a more inclusive world for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/map"
                className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <MapPin className="w-5 h-5" />
                <span>Explore Map</span>
              </Link>
              <Link
                to="/review"
                className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-50 transition-all duration-200 flex items-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Add Review</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How mAccessMap Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple tools that make a real difference in creating accessible communities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NFT Badges Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Earn Unique NFT Badges
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Your contributions to accessibility matter. After verifying 5 reviews, 
                you'll unlock exclusive NFT badges stored on the blockchain—permanent 
                recognition of your civic service.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-700">Verified and secure on Polygon blockchain</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-700">Unique designs based on your contribution level</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-700">Share your impact on social media</span>
                </li>
              </ul>
              <Link
                to="/badges"
                className="inline-flex items-center space-x-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                <span>View Badge Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="w-full h-32 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div className="w-full h-24 bg-gradient-to-br from-blue-200 to-blue-300 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-700" />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="w-full h-24 bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-700" />
                  </div>
                  <div className="w-full h-32 bg-gradient-to-br from-orange-200 to-orange-300 rounded-xl flex items-center justify-center">
                    <Heart className="w-8 h-8 text-orange-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Join thousands of accessibility advocates creating a more inclusive world, 
            one review at a time.
          </p>
          <Link
            to="/auth"
            className="bg-white text-emerald-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
          >
            <span>Get Started Today</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
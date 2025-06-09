import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Award, Heart, Target, Globe, Lightbulb, Shield } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Ambassador Akinwumi Michael',
      role: 'Founder & Lead Developer',
      description: 'Passionate about creating inclusive digital experiences and blockchain technology.',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Sarah Chen',
      role: 'Accessibility Consultant',
      description: 'Expert in WCAG guidelines and assistive technology with 10+ years experience.',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Community Manager',
      description: 'Building bridges between technology and accessibility advocacy communities.',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Inclusion First',
      description: 'Every feature we build prioritizes accessibility and inclusive design from the ground up.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Our platform is powered by real people sharing real experiences to help others.',
    },
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'Blockchain verification ensures authentic reviews and permanent recognition of contributions.',
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Creating a worldwide network of accessibility information that benefits everyone.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img 
            src="/logo.png" 
            alt="mAccessMap Logo" 
            className="w-16 h-16 object-contain mx-auto mb-6"
            onError={(e) => {
              // Fallback to icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6';
              fallback.innerHTML = '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>';
              target.parentNode?.insertBefore(fallback, target);
            }}
          />
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About mAccessMap
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're on a mission to make the world more accessible, one review at a time. 
            By combining community-driven mapping with blockchain technology, we're creating 
            a permanent record of accessibility improvements worldwide.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6 text-emerald-600" />
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                mAccessMap exists to bridge the information gap that prevents people with disabilities 
                from confidently navigating public spaces. We believe that accessibility information 
                should be comprehensive, reliable, and easily accessible to everyone.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Through our platform, we empower communities to document accessibility features, 
                share experiences, and earn recognition for their civic contributions. Every review 
                helps create a more inclusive world where everyone can participate fully in society.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7551659/pexels-photo-7551659.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="People collaborating on accessibility mapping"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Lightbulb className="w-6 h-6 text-emerald-600" />
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            </div>
          </div>
          
          <div className="prose prose-lg mx-auto text-gray-600">
            <p>
              mAccessMap was born from a simple observation: while there's an abundance of information 
              about restaurants, shops, and entertainment venues online, reliable accessibility 
              information is often missing or outdated.
            </p>
            <p>
              Our founder, Ambassador Akinwumi Michael, experienced this firsthand when helping a 
              friend navigate the city using a wheelchair. Despite extensive online research, they 
              encountered numerous unexpected barriers that could have been avoided with better information.
            </p>
            <p>
              This experience sparked the idea for a community-driven platform where people could 
              share detailed accessibility information and be recognized for their contributions. 
              By leveraging blockchain technology, we ensure that every contribution is permanently 
              recorded and contributors receive lasting recognition for their civic service.
            </p>
            <p>
              Today, mAccessMap is growing into a global movement of accessibility advocates, 
              creating the world's most comprehensive database of accessibility information.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              Passionate individuals working to make the world more accessible
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Be part of the movement to create a more accessible world. Every review you submit 
            helps someone navigate their community with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Get Started Today
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
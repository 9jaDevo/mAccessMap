import React from 'react';
import { MapPin, Clock, DollarSign, Users, Heart, Code, Palette, MessageCircle } from 'lucide-react';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

export const CareersPage: React.FC = () => {
  const jobListings: JobListing[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      salary: '$120k - $160k',
      description: 'Join our engineering team to build accessible, user-friendly interfaces that help millions of people navigate the world with confidence.',
      requirements: [
        '5+ years of React/TypeScript experience',
        'Strong understanding of web accessibility (WCAG)',
        'Experience with modern CSS frameworks',
        'Knowledge of blockchain/Web3 technologies (preferred)',
      ],
      benefits: [
        'Competitive salary and equity',
        'Comprehensive health insurance',
        'Flexible work arrangements',
        'Professional development budget',
      ],
    },
    {
      id: '2',
      title: 'Accessibility Consultant',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      salary: '$90k - $120k',
      description: 'Help us ensure our platform meets the highest accessibility standards and guide our community in creating inclusive content.',
      requirements: [
        'CPACC or WAS certification preferred',
        '3+ years accessibility consulting experience',
        'Experience with assistive technologies',
        'Strong communication and training skills',
      ],
      benefits: [
        'Competitive salary and equity',
        'Comprehensive health insurance',
        'Conference and training budget',
        'Flexible work arrangements',
      ],
    },
    {
      id: '3',
      title: 'Community Manager',
      department: 'Community',
      location: 'Remote / New York',
      type: 'Full-time',
      salary: '$70k - $90k',
      description: 'Build and nurture our global community of accessibility advocates, organizing events and fostering meaningful connections.',
      requirements: [
        '3+ years community management experience',
        'Passion for accessibility and inclusion',
        'Experience with social media and community platforms',
        'Event planning and coordination skills',
      ],
      benefits: [
        'Competitive salary and equity',
        'Comprehensive health insurance',
        'Travel budget for community events',
        'Flexible work arrangements',
      ],
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Inclusion First',
      description: 'We prioritize accessibility and inclusion in everything we do, from our hiring practices to our product development.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Our team works closely with the disability community to ensure we\'re building solutions that truly matter.',
    },
    {
      icon: Code,
      title: 'Innovation',
      description: 'We use cutting-edge technology like blockchain to solve real-world accessibility challenges.',
    },
    {
      icon: MessageCircle,
      title: 'Open Communication',
      description: 'We believe in transparent, honest communication and creating a safe space for all voices to be heard.',
    },
  ];

  const benefits = [
    'Competitive salary and equity packages',
    'Comprehensive health, dental, and vision insurance',
    'Flexible work arrangements and remote-first culture',
    'Professional development budget ($2,000/year)',
    'Conference attendance and speaking opportunities',
    'Accessibility equipment and software budget',
    'Unlimited PTO policy',
    'Parental leave (16 weeks paid)',
    'Mental health and wellness support',
    'Team retreats and community events',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Mission</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Help us build a more accessible world. We're looking for passionate individuals who want to make a real difference in people's lives.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-emerald-700 text-sm">
              <strong>Commitment to Accessibility:</strong> We're an equal opportunity employer committed to creating an inclusive environment for all employees. We provide reasonable accommodations and assistive technologies as needed.
            </p>
          </div>
        </div>

        {/* Company Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Open Positions</h2>
          <div className="space-y-6">
            {jobListings.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{job.description}</p>
                  </div>
                  <button className="mt-4 lg:mt-0 lg:ml-6 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                    Apply Now
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="text-gray-600 text-sm flex items-start">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="text-gray-600 text-sm flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits & Perks */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Benefits & Perks</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Hiring Process</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Application', description: 'Submit your resume and cover letter' },
                { step: '2', title: 'Phone Screen', description: '30-minute conversation with our team' },
                { step: '3', title: 'Technical/Skills Assessment', description: 'Role-specific evaluation' },
                { step: '4', title: 'Final Interview', description: 'Meet the team and discuss culture fit' },
              ].map((phase, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    {phase.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{phase.title}</h3>
                  <p className="text-gray-600 text-sm">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Don't See a Perfect Fit?</h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals who are passionate about accessibility. 
              Send us your resume and tell us how you'd like to contribute to our mission.
            </p>
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Send Us Your Resume
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
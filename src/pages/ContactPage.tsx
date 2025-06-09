import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Users, Headphones } from 'lucide-react';
import { showToast } from '../components/Toaster';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showToast('success', 'Message sent successfully! We\'ll get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: 'general',
      message: '',
    });
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help with your account or technical issues',
      contact: 'support@maccessmap.org',
      action: 'mailto:support@maccessmap.org',
    },
    {
      icon: MessageCircle,
      title: 'General Inquiries',
      description: 'Questions about our mission or partnerships',
      contact: 'hello@maccessmap.org',
      action: 'mailto:hello@maccessmap.org',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with other accessibility advocates',
      contact: 'Join our Discord',
      action: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions, feedback, or want to get involved? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="accessibility">Accessibility Feedback</option>
                    <option value="press">Press & Media</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{method.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                        <a
                          href={method.action}
                          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          {method.contact}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Office Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Office</h3>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">mAccessMap HQ</p>
                  <p className="text-gray-600 text-sm">
                    123 Accessibility Lane<br />
                    Innovation District<br />
                    Tech City, TC 12345
                  </p>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Headphones className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-emerald-900">Response Time</h3>
              </div>
              <p className="text-emerald-700 text-sm">
                We typically respond to all inquiries within 24 hours during business days. 
                For urgent technical issues, please include "URGENT" in your subject line.
              </p>
            </div>

            {/* FAQ Link */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Answers</h3>
              <p className="text-blue-700 text-sm mb-3">
                Looking for immediate help? Check our Help Center for answers to common questions.
              </p>
              <a
                href="/help"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Visit Help Center →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
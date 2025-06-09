import React from 'react';
import { Heart, Eye, Ear, Hand, Brain, Globe, Mail, CheckCircle } from 'lucide-react';

export const AccessibilityStatementPage: React.FC = () => {
  const lastUpdated = 'January 15, 2024';

  const features = [
    {
      icon: Eye,
      title: 'Visual Accessibility',
      items: [
        'High contrast color schemes with WCAG AA compliance',
        'Scalable text up to 200% without horizontal scrolling',
        'Alternative text for all images and graphics',
        'Clear visual hierarchy and consistent navigation',
        'Focus indicators for keyboard navigation',
      ],
    },
    {
      icon: Ear,
      title: 'Auditory Accessibility',
      items: [
        'No auto-playing audio content',
        'Visual alternatives for audio information',
        'Captions and transcripts for video content',
        'Audio descriptions where applicable',
      ],
    },
    {
      icon: Hand,
      title: 'Motor Accessibility',
      items: [
        'Full keyboard navigation support',
        'Large click targets (minimum 44x44 pixels)',
        'No time-sensitive interactions required',
        'Drag and drop alternatives provided',
        'Voice control compatibility',
      ],
    },
    {
      icon: Brain,
      title: 'Cognitive Accessibility',
      items: [
        'Clear, simple language and instructions',
        'Consistent navigation and layout patterns',
        'Error prevention and clear error messages',
        'Multiple ways to find and access content',
        'Progress indicators for multi-step processes',
      ],
    },
  ];

  const assistiveTech = [
    'Screen readers (NVDA, JAWS, VoiceOver, TalkBack)',
    'Voice recognition software (Dragon NaturallySpeaking)',
    'Switch navigation devices',
    'Eye-tracking systems',
    'Keyboard-only navigation',
    'Screen magnification software',
    'High contrast and dark mode displays',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Accessibility Statement</h1>
          <p className="text-lg text-gray-600">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Commitment */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Accessibility</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At mAccessMap, accessibility isn't just a feature—it's our core mission. We are committed to ensuring 
                that our platform is accessible to everyone, including people with disabilities. We believe that 
                creating an inclusive digital experience is not only the right thing to do but essential for building 
                a platform that truly serves the accessibility community.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We continuously work to improve the accessibility of our platform and welcome feedback from our users 
                to help us identify areas for improvement.
              </p>
            </section>

            {/* Standards */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Accessibility Standards</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                mAccessMap is designed to conform to the following accessibility standards:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines 2.1 at Level AA conformance</li>
                <li><strong>Section 508:</strong> U.S. federal accessibility requirements</li>
                <li><strong>EN 301 549:</strong> European accessibility standard</li>
                <li><strong>AODA:</strong> Accessibility for Ontarians with Disabilities Act compliance</li>
              </ul>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Accessibility Features</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {feature.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-700 text-sm flex items-start">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Assistive Technology */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Assistive Technology Support</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                Our platform is designed to work with a wide range of assistive technologies, including:
              </p>
              <div className="grid md:grid-cols-2 gap-2">
                {assistiveTech.map((tech, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{tech}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Testing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Testing and Validation</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Automated Testing</h3>
                  <p className="text-gray-700">
                    We use automated accessibility testing tools including axe-core, WAVE, and Lighthouse 
                    to continuously monitor our platform for accessibility issues.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Manual Testing</h3>
                  <p className="text-gray-700">
                    Our development team regularly performs manual testing using screen readers, keyboard-only 
                    navigation, and other assistive technologies to ensure real-world usability.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Testing</h3>
                  <p className="text-gray-700">
                    We conduct regular usability testing with people with disabilities to gather feedback 
                    and identify areas for improvement.
                  </p>
                </div>
              </div>
            </section>

            {/* Known Issues */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Known Accessibility Issues</h2>
              
              <p className="text-gray-700 mb-4">
                We are continuously working to improve our platform. Currently known issues include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Some third-party map components may have limited screen reader support (we're working with providers to improve this)</li>
                <li>Complex data visualizations may need additional alternative text descriptions</li>
                <li>Some legacy content may not meet current accessibility standards (being updated)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                We are actively working to address these issues and expect to have solutions implemented in upcoming releases.
              </p>
            </section>

            {/* Feedback */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Feedback and Support</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                We welcome your feedback on the accessibility of mAccessMap. If you encounter any accessibility 
                barriers or have suggestions for improvement, please contact us:
              </p>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="font-semibold text-emerald-900 mb-3">Accessibility Support</h3>
                <ul className="text-emerald-700 space-y-2">
                  <li><strong>Email:</strong> accessibility@maccessmap.org</li>
                  <li><strong>Phone:</strong> +1 (555) 123-4567 (TTY available)</li>
                  <li><strong>Response Time:</strong> We aim to respond within 24 hours</li>
                  <li><strong>Alternative Formats:</strong> We can provide information in alternative formats upon request</li>
                </ul>
              </div>
            </section>

            {/* Ongoing Efforts */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ongoing Accessibility Efforts</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Training and Education</h3>
                  <p className="text-gray-700">
                    All team members receive regular accessibility training to ensure they understand best 
                    practices and can contribute to creating an inclusive platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Design and Development Process</h3>
                  <p className="text-gray-700">
                    Accessibility is integrated into our design and development process from the beginning, 
                    not added as an afterthought. We follow inclusive design principles and conduct 
                    accessibility reviews at every stage.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Involvement</h3>
                  <p className="text-gray-700">
                    We actively engage with the disability community and accessibility experts to ensure 
                    our platform meets real-world needs and expectations.
                  </p>
                </div>
              </div>
            </section>

            {/* Legal */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Information</h2>
              <p className="text-gray-700">
                This accessibility statement applies to the mAccessMap platform (maccessmap.org) and 
                associated mobile applications. We review and update this statement regularly to reflect 
                our current accessibility status and ongoing improvements.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
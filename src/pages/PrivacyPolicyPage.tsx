import React from 'react';
import { Shield, Eye, Lock, Database, Globe, Mail } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = 'January 15, 2024';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                At mAccessMap, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                accessibility mapping platform and services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Database className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Name and email address when you create an account</li>
                    <li>Profile information you choose to provide</li>
                    <li>Communication preferences and settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Review and Contribution Data</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Accessibility reviews and ratings you submit</li>
                    <li>Photos and comments about locations</li>
                    <li>Location data for places you review</li>
                    <li>Timestamps and verification status of your contributions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Usage patterns and interaction data</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Data</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Wallet addresses for NFT badge distribution</li>
                    <li>Transaction hashes and blockchain records</li>
                    <li>Badge metadata and achievement records</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide and maintain our accessibility mapping services</li>
                <li>Process and display your accessibility reviews and contributions</li>
                <li>Generate and distribute NFT badges for verified contributions</li>
                <li>Communicate with you about your account and our services</li>
                <li>Improve our platform and develop new features</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>Send you updates about accessibility resources (with your consent)</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Information Sharing and Disclosure</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Public Information</h3>
                  <p className="text-gray-700">
                    Your accessibility reviews, ratings, and comments are publicly visible to help others make informed decisions. 
                    You can choose to make your reviews anonymous in your privacy settings.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">We Do Not Sell Your Data</h3>
                  <p className="text-gray-700">
                    We never sell, rent, or trade your personal information to third parties for marketing purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Limited Sharing</h3>
                  <p className="text-gray-700 mb-2">We may share your information only in these specific circumstances:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>With your explicit consent</li>
                    <li>To comply with legal requirements or court orders</li>
                    <li>To protect our rights, property, or safety</li>
                    <li>With service providers who help us operate our platform (under strict confidentiality agreements)</li>
                    <li>In connection with a business transfer or acquisition</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure cloud infrastructure with reputable providers</li>
                <li>Employee training on data protection best practices</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Access and Control</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>View and update your personal information</li>
                    <li>Download a copy of your data</li>
                    <li>Delete your account and associated data</li>
                    <li>Control your privacy settings and preferences</li>
                    <li>Opt out of non-essential communications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Regional Rights</h3>
                  <p className="text-gray-700">
                    Depending on your location, you may have additional rights under laws such as GDPR (EU), 
                    CCPA (California), or other privacy regulations. We honor all applicable privacy rights.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
              
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Essential cookies:</strong> Required for basic platform functionality</li>
                <li><strong>Analytics cookies:</strong> Help us understand how you use our platform</li>
                <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-700">
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you believe we have collected information from 
                a child under 13, please contact us immediately.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your data during international transfers, 
                including standard contractual clauses and adequacy decisions.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-700">
                We retain your personal information only as long as necessary to provide our services and 
                fulfill the purposes outlined in this policy. When you delete your account, we will remove 
                your personal information, though some anonymized data may be retained for analytics and 
                platform improvement.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new policy on our platform and updating the "Last updated" date. 
                Your continued use of our services after changes become effective constitutes acceptance 
                of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="text-gray-700 space-y-2">
                  <li><strong>Email:</strong> privacy@maccessmap.org</li>
                  <li><strong>Address:</strong> mAccessMap Privacy Team, 123 Accessibility Lane, Tech City, TC 12345</li>
                  <li><strong>Data Protection Officer:</strong> dpo@maccessmap.org</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
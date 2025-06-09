import React from 'react';
import { FileText, Scale, Shield, AlertTriangle, Users, Gavel } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const lastUpdated = 'January 15, 2024';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to mAccessMap! These Terms of Service ("Terms") govern your use of our accessibility mapping 
                platform and services. By accessing or using mAccessMap, you agree to be bound by these Terms. 
                If you disagree with any part of these terms, you may not access our service.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Our Service</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                mAccessMap is a community-driven platform that allows users to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Submit and view accessibility reviews of public spaces</li>
                <li>Share photos and detailed accessibility information</li>
                <li>Earn NFT badges for verified contributions</li>
                <li>Connect with other accessibility advocates</li>
                <li>Access comprehensive accessibility data for locations worldwide</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Creation</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>You must be at least 13 years old to create an account</li>
                    <li>You must provide accurate and complete information</li>
                    <li>You are responsible for maintaining account security</li>
                    <li>You may not share your account with others</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Responsibilities</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Keep your login credentials secure and confidential</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Update your information to keep it current and accurate</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Content */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">User-Generated Content</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Standards</h3>
                  <p className="text-gray-700 mb-2">All content you submit must be:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Accurate and truthful to the best of your knowledge</li>
                    <li>Relevant to accessibility features and experiences</li>
                    <li>Respectful and non-discriminatory</li>
                    <li>Free from spam, advertising, or promotional content</li>
                    <li>Compliant with applicable laws and regulations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Prohibited Content</h3>
                  <p className="text-gray-700 mb-2">You may not submit content that:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Contains false, misleading, or fraudulent information</li>
                    <li>Violates any person's privacy or publicity rights</li>
                    <li>Infringes on intellectual property rights</li>
                    <li>Contains hate speech, harassment, or discriminatory language</li>
                    <li>Includes personal information of others without consent</li>
                    <li>Promotes illegal activities or violates any laws</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Content License</h3>
                  <p className="text-gray-700">
                    By submitting content to mAccessMap, you grant us a worldwide, non-exclusive, royalty-free 
                    license to use, display, and distribute your content for the purpose of operating our service. 
                    You retain ownership of your content and can delete it at any time.
                  </p>
                </div>
              </div>
            </section>

            {/* NFT Badges */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">NFT Badges and Blockchain</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Badge Earning</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>NFT badges are earned through verified contributions to the platform</li>
                    <li>Badge criteria and requirements may change over time</li>
                    <li>We reserve the right to verify and validate contributions before issuing badges</li>
                    <li>Fraudulent or manipulated contributions may result in badge revocation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Considerations</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>NFT badges are minted on the Polygon blockchain</li>
                    <li>Blockchain transactions are irreversible and permanent</li>
                    <li>You are responsible for managing your own wallet and private keys</li>
                    <li>We are not responsible for lost or stolen cryptocurrency wallets</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Prohibited Uses */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Prohibited Uses</h2>
              </div>
              
              <p className="text-gray-700 mb-4">You may not use our service to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Violate any applicable laws or regulations</li>
                <li>Submit false, misleading, or fraudulent reviews</li>
                <li>Attempt to manipulate ratings or gaming the system</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Spam or send unsolicited communications</li>
                <li>Reverse engineer or attempt to access our source code</li>
                <li>Use automated tools to scrape or harvest data</li>
                <li>Interfere with the security or integrity of our systems</li>
                <li>Impersonate others or create fake accounts</li>
                <li>Use the service for commercial purposes without permission</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Rights</h3>
                  <p className="text-gray-700">
                    The mAccessMap platform, including its design, functionality, and underlying technology, 
                    is protected by copyright, trademark, and other intellectual property laws. You may not 
                    copy, modify, or distribute our platform without permission.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Rights</h3>
                  <p className="text-gray-700">
                    You retain all rights to the content you create and submit to our platform. However, 
                    you grant us the necessary licenses to display and use your content as part of our service.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy</h2>
              <p className="text-gray-700">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your 
                use of the service, to understand our practices regarding the collection and use of your information.
              </p>
            </section>

            {/* Disclaimers */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Scale className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Disclaimers and Limitations</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Availability</h3>
                  <p className="text-gray-700">
                    We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                    We may temporarily suspend service for maintenance, updates, or other operational reasons.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Accuracy</h3>
                  <p className="text-gray-700">
                    While we encourage accurate reporting, we cannot guarantee the accuracy of user-submitted 
                    content. Always verify accessibility information independently when making important decisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Limitation of Liability</h3>
                  <p className="text-gray-700">
                    To the fullest extent permitted by law, mAccessMap shall not be liable for any indirect, 
                    incidental, special, consequential, or punitive damages arising from your use of our service.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">By You</h3>
                  <p className="text-gray-700">
                    You may terminate your account at any time by contacting us or using the account deletion 
                    feature in your profile settings.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">By Us</h3>
                  <p className="text-gray-700">
                    We may suspend or terminate your account if you violate these Terms or engage in behavior 
                    that harms our community or service. We will provide notice when possible.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Gavel className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Governing Law</h2>
              </div>
              
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], 
                without regard to its conflict of law provisions. Any disputes arising under these Terms shall 
                be resolved in the courts of [Jurisdiction].
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify users of material 
                changes by posting the updated Terms on our platform and updating the "Last updated" date. 
                Your continued use of the service after changes become effective constitutes acceptance of 
                the new Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="text-gray-700 space-y-2">
                  <li><strong>Email:</strong> legal@maccessmap.org</li>
                  <li><strong>Address:</strong> mAccessMap Legal Team, 123 Accessibility Lane, Tech City, TC 12345</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
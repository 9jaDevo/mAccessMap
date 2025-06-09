import React, { useState } from 'react';
import { Heart, X, ExternalLink } from 'lucide-react';

export const DonateButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Floating Donate Button */}
      <button
        onClick={openModal}
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
        aria-label="Support mAccessMap with a donation"
      >
        <Heart className="w-6 h-6 group-hover:animate-pulse" />
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-pink-500 to-red-500 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Support Our Mission</h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors"
                  aria-label="Close donation modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Help Us Build a More Accessible World
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your donation helps us maintain and improve mAccessMap, making it easier for everyone 
                  to find accessible spaces and contribute to a more inclusive community. Every contribution, 
                  no matter the size, makes a difference.
                </p>
              </div>

              {/* Donation Options */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 text-center">Choose Your Donation Method</h4>
                  
                  <div className="space-y-3">
                    {/* PayPal Option */}
                    <a
                      href="https://paypal.me/ambassadormichael"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">PP</span>
                        </div>
                        <span className="font-medium">Donate via PayPal</span>
                      </div>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    {/* AirTM Option */}
                    <a
                      href="https://airtm.me/9jadevo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 font-bold text-sm">AT</span>
                        </div>
                        <span className="font-medium">Donate via AirTM</span>
                      </div>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Thank You Message */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Thank you for supporting accessibility and inclusion! 🙏
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4">
              <button
                onClick={closeModal}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
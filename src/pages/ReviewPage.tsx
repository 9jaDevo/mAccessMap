import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Star, Check, Armchair as Wheelchair, Volume2, Eye, DoorOpen, Navigation } from 'lucide-react';
import { showToast } from '../components/Toaster';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleMaps } from '../contexts/GoogleMapsContext';
import { useWallet } from '../hooks/useWallet';
import { createLocation, createReview } from '../lib/database';
import { triggerBadgeCheckAfterReview } from '../lib/badgeSystem';
import { PhotoUpload } from '../components/PhotoUpload';
import { type UploadResult } from '../lib/storage';

interface AccessibilityFeature {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const accessibilityFeatures: AccessibilityFeature[] = [
  {
    id: 'wheelchair-accessible',
    name: 'Wheelchair Accessible',
    icon: Wheelchair,
    description: 'Ramps, wide doorways, accessible restrooms',
  },
  {
    id: 'audio-cues',
    name: 'Audio Cues',
    icon: Volume2,
    description: 'Audio announcements, talking elevators',
  },
  {
    id: 'visual-aids',
    name: 'Visual Aids',
    icon: Eye,
    description: 'Braille signage, high contrast displays',
  },
  {
    id: 'automatic-doors',
    name: 'Automatic Doors',
    icon: DoorOpen,
    description: 'Motion sensor or push button doors',
  },
];

export const ReviewPage: React.FC = () => {
  const { user } = useAuth();
  const { isLoaded: googleMapsLoaded, loadError } = useGoogleMaps();
  const { walletAddress } = useWallet();
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  
  const [formData, setFormData] = useState({
    locationName: '',
    address: '',
    latitude: 0,
    longitude: 0,
    category: 'restaurant',
    rating: 0,
    features: [] as string[],
    comments: '',
  });

  const [uploadedPhotos, setUploadedPhotos] = useState<UploadResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!googleMapsLoaded || !addressInputRef.current || autocompleteRef.current) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          types: ['establishment', 'geocode'],
          fields: ['formatted_address', 'geometry', 'name', 'place_id'],
        }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          setFormData(prev => ({
            ...prev,
            address: place.formatted_address || place.name || '',
            latitude: lat,
            longitude: lng,
            locationName: prev.locationName || place.name || '',
          }));
        }
      });
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    }
  }, [googleMapsLoaded]);

  // Handle URL parameters for pre-filling location data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const locationParam = urlParams.get('location');
    const addressParam = urlParams.get('address');

    if (locationParam || addressParam) {
      setFormData(prev => ({
        ...prev,
        locationName: locationParam || prev.locationName,
        address: addressParam || prev.address,
      }));

      // If we have an address and Google Maps is loaded, geocode it
      if (addressParam && googleMapsLoaded && window.google.maps.Geocoder) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: addressParam }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            setFormData(prev => ({
              ...prev,
              latitude: location.lat(),
              longitude: location.lng(),
            }));
          }
        });
      }
    }
  }, [googleMapsLoaded]);

  const handleLocateMe = async () => {
    if (!navigator.geolocation) {
      showToast('error', 'Geolocation is not supported by this browser');
      return;
    }

    if (!googleMapsLoaded) {
      showToast('error', 'Google Maps is still loading. Please try again in a moment.');
      return;
    }

    setLocatingUser(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            setFormData(prev => ({
              ...prev,
              address: results[0].formatted_address,
              latitude,
              longitude,
            }));
            showToast('success', 'Location detected successfully!');
          } else {
            setFormData(prev => ({
              ...prev,
              latitude,
              longitude,
            }));
            showToast('warning', 'Location detected, but address lookup failed');
          }
          setLocatingUser(false);
        }
      );
    } catch (error: any) {
      setLocatingUser(false);
      
      if (error.code === error.PERMISSION_DENIED) {
        showToast('error', 'Location access denied. Please enable location permissions.');
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        showToast('error', 'Location information is unavailable.');
      } else if (error.code === error.TIMEOUT) {
        showToast('error', 'Location request timed out. Please try again.');
      } else {
        showToast('error', 'Failed to get your location. Please try again.');
      }
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId],
    }));
  };

  const handleTestLocationInsert = async () => {
    try {
      console.log('Attempting to insert test location...');
      const dummyLocation = {
        name: 'Test Location ' + Date.now(),
        address: '123 Test St, Test City, TC 12345',
        category: 'other',
        latitude: 0.0,
        longitude: 0.0,
      };
      const result = await createLocation(dummyLocation);
      console.log('Test location insert result:', result);
      if (result) {
        showToast('success', 'Test location inserted successfully!');
      } else {
        showToast('error', 'Test location insert failed (no result)');
      }
    } catch (error) {
      console.error('Error during test location insert:', error);
      showToast('error', 'Error inserting test location: ' + (error as Error).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast('error', 'Please sign in to submit a review');
      return;
    }

    if (!formData.locationName || !formData.address || formData.rating === 0) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    if (formData.latitude === 0 || formData.longitude === 0) {
      showToast('error', 'Please select a valid address with location coordinates');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // First, create or find the location
      const locationData = {
        name: formData.locationName,
        address: formData.address,
        category: formData.category,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      const location = await createLocation(locationData);

      // Then create the review with photo URLs
      const reviewData = {
        user_id: user.id,
        location_id: location.id,
        rating: formData.rating,
        accessibility_features: formData.features,
        photos: uploadedPhotos.map(photo => photo.url), // Use uploaded photo URLs
        comments: formData.comments,
      };

      await createReview(reviewData);
      
      showToast('success', 'Review submitted successfully! Thank you for making spaces more accessible.');
      
      // Trigger automatic badge checking after successful review submission
      if (user.id) {
        try {
          await triggerBadgeCheckAfterReview(user.id, walletAddress || undefined);
        } catch (badgeError) {
          console.error('Error checking for new badges:', badgeError);
          // Don't show error to user as the review was successful
        }
      }
      
      // Reset form
      setFormData({
        locationName: '',
        address: '',
        latitude: 0,
        longitude: 0,
        category: 'restaurant',
        rating: 0,
        features: [],
        comments: '',
      });

      // Reset uploaded photos
      setUploadedPhotos([]);

      // Clear the autocomplete input
      if (addressInputRef.current) {
        addressInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      showToast('error', error.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, rating: index + 1 }))}
        className={`w-8 h-8 ${index < formData.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
      >
        <Star className="w-full h-full fill-current" />
      </button>
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to submit accessibility reviews.</p>
          <a
            href="/auth"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-4xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Google Maps Error</h2>
          <p className="text-gray-600 mb-4">{loadError}</p>
          <p className="text-sm text-gray-500">
            Please check your Google Maps API configuration and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <Camera className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Add Accessibility Review</h1>
            </div>
            <p className="text-emerald-100">
              Help others navigate with confidence by sharing accessibility information
            </p>
            {walletAddress && (
              <div className="mt-3 bg-emerald-700 bg-opacity-50 rounded-lg p-3">
                <p className="text-emerald-100 text-sm">
                  🎉 Wallet connected! You'll automatically earn NFT badges for verified reviews.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Location Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Location Details</span>
              </h2>
              
              <div>
                <label htmlFor="locationName" className="block text-sm font-medium text-gray-700 mb-2">
                  Location Name *
                </label>
                <input
                  id="locationName"
                  name="locationName"
                  type="text"
                  required
                  value={formData.locationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Central Park Cafe"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <div className="relative">
                  <input
                    id="address"
                    name="address"
                    ref={addressInputRef}
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Start typing an address..."
                  />
                  <button
                    type="button"
                    onClick={handleLocateMe}
                    disabled={locatingUser || !googleMapsLoaded}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md transition-colors ${
                      locatingUser || !googleMapsLoaded
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-emerald-600 hover:bg-emerald-50'
                    }`}
                    title="Use my current location"
                  >
                    {locatingUser ? (
                      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Navigation className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {!googleMapsLoaded && !loadError && (
                  <p className="text-xs text-gray-500 mt-1">
                    Loading Google Maps for address suggestions...
                  </p>
                )}
                {googleMapsLoaded && formData.latitude !== 0 && formData.longitude !== 0 && (
                  <p className="text-xs text-emerald-600 mt-1">
                    ✓ Location coordinates detected
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="retail">Retail Store</option>
                  <option value="public-service">Public Service</option>
                  <option value="transportation">Transportation</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="recreation">Recreation</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Rating */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Accessibility Rating *</h2>
              <div className="flex items-center space-x-2">
                {renderStars()}
                <span className="ml-3 text-sm text-gray-600">
                  {formData.rating > 0 ? `${formData.rating} out of 5 stars` : 'Select a rating'}
                </span>
              </div>
            </div>

            {/* Accessibility Features */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Accessibility Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accessibilityFeatures.map((feature) => {
                  const Icon = feature.icon;
                  const isSelected = formData.features.includes(feature.id);
                  
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => handleFeatureToggle(feature.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="text-left">
                          <div className="font-medium">{feature.name}</div>
                          <div className="text-sm opacity-75">{feature.description}</div>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Photos</h2>
              <PhotoUpload
                photos={uploadedPhotos}
                onPhotosChange={setUploadedPhotos}
                userId={user.id}
                maxPhotos={5}
                disabled={isSubmitting}
              />
            </div>

            {/* Comments */}
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Share any additional details about accessibility features or barriers..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } text-white`}
              >
                {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
              </button>
              
              {/* Test Button */}
              <button
                type="button"
                onClick={handleTestLocationInsert}
                className="mt-4 w-full py-3 px-4 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Test Location Insert
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
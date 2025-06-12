import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Filter, Search, Star, Camera, Armchair as Wheelchair, Volume2, Eye, DoorOpen, Plus } from 'lucide-react';
import { GoogleMap } from '../components/GoogleMap';
import { useLocations } from '../hooks/useDatabase';
import { searchLocations, Location } from '../lib/database';
import { showToast } from '../components/Toaster';

const getRatingColor = (rating: number) => {
  if (rating >= 4) return 'text-green-600 bg-green-100';
  if (rating >= 3) return 'text-yellow-600 bg-yellow-100';
  if (rating >= 2) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

const getFeatureIcon = (feature: string) => {
  switch (feature) {
    case 'wheelchair-accessible':
      return <Wheelchair className="w-4 h-4" />;
    case 'audio-cues':
    case 'audio-announcements':
      return <Volume2 className="w-4 h-4" />;
    case 'visual-aids':
    case 'braille-menu':
      return <Eye className="w-4 h-4" />;
    case 'automatic-doors':
      return <DoorOpen className="w-4 h-4" />;
    default:
      return <MapPin className="w-4 h-4" />;
  }
};

const categoryDisplayNames: Record<string, string> = {
  'all': 'All Categories',
  'restaurant': 'Restaurants',
  'retail': 'Retail Stores',
  'public-service': 'Public Services',
  'transportation': 'Transportation',
  'entertainment': 'Entertainment',
  'healthcare': 'Healthcare',
  'recreation': 'Recreation',
  'other': 'Other',
};

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const { locations: allLocations, loading: locationsLoading } = useLocations();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showMobileMap, setShowMobileMap] = useState(false);

  // Get unique categories from locations
  const categories = ['all', ...Array.from(new Set(allLocations.map(l => l.category)))];

  // Filter locations based on search and category
  useEffect(() => {
    const filterLocations = async () => {
      if (!searchQuery && categoryFilter === 'all') {
        setFilteredLocations(allLocations);
        return;
      }

      setSearchLoading(true);
      try {
        const results = await searchLocations(
          searchQuery,
          categoryFilter === 'all' ? undefined : categoryFilter
        );
        setFilteredLocations(results);
      } catch (error) {
        console.error('Error searching locations:', error);
        showToast('error', 'Failed to search locations');
        setFilteredLocations(allLocations);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(filterLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, categoryFilter, allLocations]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    // On mobile, show the map when a location is selected
    if (window.innerWidth < 768) {
      setShowMobileMap(true);
    }
  };

  const handleAddReview = () => {
    navigate('/review');
  };

  const handleAddReviewForLocation = (location: Location) => {
    // Navigate to review page with location pre-filled
    const params = new URLSearchParams({
      location: location.name,
      address: location.address
    });
    navigate(`/review?${params.toString()}`);
  };

  const toggleMobileView = () => {
    setShowMobileMap(!showMobileMap);
  };

  if (locationsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Locations</h3>
          <p className="text-gray-600">Fetching accessibility data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Mobile Toggle Buttons */}
      <div className="md:hidden bg-white border-b border-gray-200 p-2 flex justify-center space-x-2">
        <button
          onClick={() => setShowMobileMap(false)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            !showMobileMap
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setShowMobileMap(true)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            showMobileMap
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Map View
        </button>
      </div>

      {/* Sidebar - Hidden on mobile when map is shown */}
      <div className={`w-full md:w-96 bg-white shadow-lg flex flex-col ${
        showMobileMap ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Search and Filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            />
            {searchLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {categoryDisplayNames[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Location List */}
        <div className="flex-1 overflow-y-auto">
          {filteredLocations.length === 0 ? (
            <div className="p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No locations found</h3>
              <p className="text-gray-500 text-sm">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          ) : (
            filteredLocations.map((location) => (
              <div
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedLocation?.id === location.id ? 'bg-emerald-50 border-emerald-200' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex-1 pr-2">{location.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 flex-shrink-0 ${getRatingColor(location.overall_rating)}`}>
                    <Star className="w-3 h-3 fill-current" />
                    <span>{location.overall_rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {categoryDisplayNames[location.category] || location.category} • {location.total_reviews} review{location.total_reviews !== 1 ? 's' : ''}
                  </p>
                  {selectedLocation?.id === location.id && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map Area - Always visible on desktop, toggleable on mobile */}
      <div className={`flex-1 relative ${
        showMobileMap ? 'flex' : 'hidden md:flex'
      }`}>
        <GoogleMap
          locations={filteredLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          center={{ lat: 40.7589, lng: -73.9851 }} // NYC center
          zoom={12}
        />

        {/* Selected Location Detail Card */}
        {selectedLocation && (
          <div className="absolute bottom-6 left-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-md">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{selectedLocation.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedLocation.address}</p>
                <p className="text-xs text-gray-500">
                  {categoryDisplayNames[selectedLocation.category] || selectedLocation.category}
                </p>
              </div>
              <div className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 ${getRatingColor(selectedLocation.overall_rating)}`}>
                <Star className="w-4 h-4 fill-current" />
                <span>{selectedLocation.overall_rating.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>{selectedLocation.total_reviews}</strong> accessibility review{selectedLocation.total_reviews !== 1 ? 's' : ''}
              </p>
              
              {/* Rating breakdown */}
              <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= selectedLocation.overall_rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  ({selectedLocation.overall_rating.toFixed(1)}/5.0)
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => handleAddReviewForLocation(selectedLocation)}
                className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Add Review</span>
              </button>
              <button 
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`;
                  window.open(url, '_blank');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Directions
              </button>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute top-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Accessibility Rating</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Excellent (4.0+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-gray-600">Good (3.0-3.9)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-xs text-gray-600">Fair (2.0-2.9)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">Poor (1.0-1.9)</span>
            </div>
          </div>
        </div>

        {/* Floating Add Review Button */}
        <button
          onClick={handleAddReview}
          className="absolute bottom-6 right-6 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          title="Add accessibility review"
        >
          <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Mobile Back to List Button */}
        {showMobileMap && (
          <button
            onClick={() => setShowMobileMap(false)}
            className="md:hidden absolute top-6 left-6 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            ← Back to List
          </button>
        )}
      </div>
    </div>
  );
};
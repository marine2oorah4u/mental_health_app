import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { MapPin, Plus, Filter, Star, Phone, Mail, Globe, Navigation2, MessageSquare, Camera, X, Eye, ExternalLink, MapPinned, ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LocationSubmissionForm } from '../components/LocationSubmissionForm';
import { LocationReviewForm } from '../components/LocationReviewForm';
import { LocationReviews } from '../components/LocationReviews';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Location {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  description: string;
  contact_phone: string;
  contact_email: string;
  website: string;
  is_verified: boolean;
  location_accessibility_features?: AccessibilityFeature[];
  review_count?: number;
  avg_accessibility_rating?: number;
}

interface AccessibilityFeature {
  id: string;
  feature_category: string;
  feature_name: string;
  is_available: boolean;
  notes: string;
}

const FEATURE_CATEGORIES = [
  { id: 'mobility', name: 'Mobility', icon: '♿' },
  { id: 'sensory', name: 'Sensory', icon: '👂' },
  { id: 'vision', name: 'Vision', icon: '👁️' },
  { id: 'hearing', name: 'Hearing', icon: '🔊' },
  { id: 'cognitive', name: 'Cognitive', icon: '🧠' },
];

const LOCATION_TYPES = [
  { id: 'camp', name: 'Scout Camp' },
  { id: 'service_center', name: 'Service Center' },
  { id: 'meeting_location', name: 'Meeting Location' },
  { id: 'outdoor_area', name: 'Outdoor Area' },
];

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click: (e) => {
      console.log('Map clicked at:', e.latlng.lat, e.latlng.lng);
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function AccessibleLocations() {
  const { user } = useAuth();
  const { currentColors } = useTheme();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviewsPanel, setShowReviewsPanel] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    type: 'all',
    accessibility: 'all',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
    getUserLocation();
    if (user) loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favorite_locations')
      .select('location_id')
      .eq('user_id', user.id);
    if (data) {
      setFavorites(new Set(data.map(f => f.location_id)));
    }
  };

  const toggleFavorite = async (locationId: string) => {
    if (!user) return;

    if (favorites.has(locationId)) {
      await supabase
        .from('favorite_locations')
        .delete()
        .eq('user_id', user.id)
        .eq('location_id', locationId);
      setFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(locationId);
        return newSet;
      });
    } else {
      await supabase
        .from('favorite_locations')
        .insert({ user_id: user.id, location_id: locationId });
      setFavorites(prev => new Set(prev).add(locationId));
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getDistanceText = (location: Location): string => {
    if (!userLocation) return '';
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      location.latitude,
      location.longitude
    );
    return `${Math.round(distance)} miles away`;
  };

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('accessible_locations')
        .select(`
          *,
          location_accessibility_features (
            id,
            feature_category,
            feature_name,
            is_available,
            notes
          )
        `)
        .eq('is_verified', true)
        .order('name');

      if (error) throw error;

      setLocations(data || []);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    console.log('handleMapClick called', { lat, lng, hasUser: !!user });
    if (user) {
      setClickedCoords({ lat, lng });
      setTimeout(() => setClickedCoords(null), 8000);
    } else {
      console.log('No user logged in, map click ignored');
    }
  };

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    setShowSidePanel(true);
    setShowReviewForm(false);
    setShowReviewsPanel(false);
    setClickedCoords(null);
  };

  const closeSidePanel = () => {
    setShowSidePanel(false);
    setShowReviewForm(false);
    setShowReviewsPanel(false);
    setSelectedLocation(null);
  };

  const filteredLocations = locations.filter(location => {
    if (filters.type !== 'all' && location.type !== filters.type) return false;
    if (filters.accessibility !== 'all') {
      const hasFeature = location.location_accessibility_features?.some(
        f => f.feature_category === filters.accessibility && f.is_available
      );
      if (!hasFeature) return false;
    }
    return true;
  });

  const michiganCenter = { lat: 44.3148, lng: -85.6024 };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Navigation2 className="w-8 h-8" />
            Accessible Locations
          </h1>
          <p className="page-description">
            Click any marker for details{user ? ' • Click empty areas to suggest new locations' : ' • Login to suggest new locations'}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: currentColors.primary }}>{locations.length}</div>
            <div style={{ color: currentColors.textMuted }}>Locations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: currentColors.accent }}>{filteredLocations.length}</div>
            <div style={{ color: currentColors.textMuted }}>Showing</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b" style={{ backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }}>
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold mb-1" style={{ color: currentColors.textMuted }}>Location Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="input text-sm w-full"
                  style={{ backgroundColor: currentColors.surface, color: currentColors.text, borderColor: currentColors.border }}
                >
                  <option value="all">All Types</option>
                  {LOCATION_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold mb-1" style={{ color: currentColors.textMuted }}>Accessibility Features</label>
                <select
                  value={filters.accessibility}
                  onChange={(e) => setFilters({ ...filters, accessibility: e.target.value })}
                  className="input text-sm w-full"
                  style={{ backgroundColor: currentColors.surface, color: currentColors.text, borderColor: currentColors.border }}
                >
                  <option value="all">All Features</option>
                  {FEATURE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="relative" style={{ height: '700px' }}>
            <MapContainer
              center={[michiganCenter.lat, michiganCenter.lng]}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              dragging={true}
              touchZoom={true}
              doubleClickZoom={true}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onMapClick={handleMapClick} />
              {filteredLocations.map(location => (
                location.latitude && location.longitude && (
                  <Marker
                    key={location.id}
                    position={[location.latitude, location.longitude]}
                    eventHandlers={{
                      click: () => handleMarkerClick(location),
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-bold text-lg">{location.name}</h3>
                        <p className="text-sm text-gray-600">{location.city}, {location.state}</p>
                        <button
                          onClick={() => handleMarkerClick(location)}
                          className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          View Details
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>

            {filteredLocations.length === 0 && !loading && (
              <div className="absolute inset-0 bg-opacity-90 flex items-center justify-center z-[1000] pointer-events-none" style={{ backgroundColor: currentColors.background }}>
                <div className="text-center p-8">
                  <Filter className="w-12 h-12 mx-auto mb-3" style={{ color: currentColors.textMuted }} />
                  <p className="text-lg font-semibold" style={{ color: currentColors.text }}>No locations match your filters</p>
                  <p className="text-sm mt-1" style={{ color: currentColors.textMuted }}>Try adjusting your search criteria</p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Side Panel */}
        {showSidePanel && selectedLocation && (
          <div
            className="fixed top-0 right-0 h-full z-[2000] shadow-2xl transition-transform duration-300 overflow-auto"
            style={{
              width: '480px',
              backgroundColor: currentColors.surface,
              transform: showSidePanel ? 'translateX(0)' : 'translateX(100%)'
            }}
          >
            <div className="sticky top-0 z-10 p-4 border-b flex items-center justify-between" style={{ backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }}>
              <div className="flex-1 pr-4">
                <h2 className="text-xl font-black truncate" style={{ color: currentColors.text }}>{selectedLocation.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ backgroundColor: currentColors.surface, color: currentColors.textMuted }}>
                    {selectedLocation.type.replace('_', ' ')}
                  </span>
                  {selectedLocation.is_verified && (
                    <span className="text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1" style={{ backgroundColor: currentColors.accent + '20', color: currentColors.accent }}>
                      <Star className="w-3 h-3 fill-current" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={closeSidePanel}
                className="p-2 rounded-lg hover:bg-opacity-80 transition-colors flex-shrink-0"
                style={{ backgroundColor: currentColors.surface }}
              >
                <X className="w-5 h-5" style={{ color: currentColors.text }} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {!showReviewForm && !showReviewsPanel && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowReviewsPanel(true)}
                      className="flex items-center justify-center gap-2 p-3 rounded-lg border font-semibold text-sm hover:scale-105 transition-transform"
                      style={{ backgroundColor: currentColors.primary, color: 'white', borderColor: currentColors.primary }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      View Reviews
                    </button>
                    {user && (
                      <button
                        onClick={() => toggleFavorite(selectedLocation.id)}
                        className="flex items-center justify-center gap-2 p-3 rounded-lg border font-semibold text-sm hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: favorites.has(selectedLocation.id) ? currentColors.accent : currentColors.cardBackground,
                          color: favorites.has(selectedLocation.id) ? 'white' : currentColors.text,
                          borderColor: currentColors.accent
                        }}
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(selectedLocation.id) ? 'fill-current' : ''}`} />
                        {favorites.has(selectedLocation.id) ? 'Saved' : 'Save'}
                      </button>
                    )}
                  </div>

                  <div className="p-3 rounded-lg" style={{ backgroundColor: currentColors.cardBackground }}>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: currentColors.textMuted }}>Address</div>
                    <div className="text-sm" style={{ color: currentColors.text }}>
                      {selectedLocation.address}<br />
                      {selectedLocation.city}, {selectedLocation.state} {selectedLocation.zip_code}
                      {userLocation && (
                        <div className="mt-2 flex items-center gap-1 text-xs font-medium" style={{ color: currentColors.primary }}>
                          <Navigation2 className="w-3 h-3" />
                          {getDistanceText(selectedLocation)}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedLocation.description && (
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }}>
                      <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: currentColors.primary }}>About</div>
                      <p className="text-sm leading-relaxed" style={{ color: currentColors.textMuted }}>{selectedLocation.description}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: currentColors.textMuted }}>Contact</div>
                    {selectedLocation.contact_phone && (
                      <a href={`tel:${selectedLocation.contact_phone}`} className="flex items-center gap-2 p-2 rounded hover:opacity-80 transition-opacity" style={{ backgroundColor: currentColors.cardBackground }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: currentColors.primary + '20' }}>
                          <Phone className="w-4 h-4" style={{ color: currentColors.primary }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: currentColors.text }}>{selectedLocation.contact_phone}</span>
                      </a>
                    )}

                    {selectedLocation.contact_email && (
                      <a href={`mailto:${selectedLocation.contact_email}`} className="flex items-center gap-2 p-2 rounded hover:opacity-80 transition-opacity" style={{ backgroundColor: currentColors.cardBackground }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: currentColors.accent + '20' }}>
                          <Mail className="w-4 h-4" style={{ color: currentColors.accent }} />
                        </div>
                        <span className="text-sm font-medium break-all" style={{ color: currentColors.text }}>{selectedLocation.contact_email}</span>
                      </a>
                    )}

                    {selectedLocation.website && (
                      <a href={selectedLocation.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded hover:opacity-80 transition-opacity" style={{ backgroundColor: currentColors.cardBackground }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: currentColors.secondary + '20' }}>
                          <Globe className="w-4 h-4" style={{ color: currentColors.secondary }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: currentColors.text }}>Visit Website</span>
                        <ExternalLink className="w-3 h-3 ml-auto" style={{ color: currentColors.textMuted }} />
                      </a>
                    )}
                  </div>

                  {selectedLocation.location_accessibility_features && selectedLocation.location_accessibility_features.length > 0 && (
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: currentColors.cardBackground, borderColor: currentColors.accent }}>
                      <div className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2" style={{ color: currentColors.accent }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentColors.accent }}></span>
                        Accessibility Features
                      </div>
                      <div className="space-y-2">
                        {FEATURE_CATEGORIES.map(category => {
                          const features = selectedLocation.location_accessibility_features?.filter(
                            f => f.feature_category === category.id && f.is_available
                          );
                          if (!features || features.length === 0) return null;
                          return (
                            <div key={category.id} className="p-2 rounded text-sm" style={{ backgroundColor: currentColors.surface }}>
                              <div className="font-bold mb-1 flex items-center gap-1" style={{ color: currentColors.text }}>
                                <span>{category.icon}</span>
                                {category.name}
                              </div>
                              <ul className="space-y-1 text-xs">
                                {features.map(feature => (
                                  <li key={feature.id} className="flex items-start gap-1">
                                    <span style={{ color: currentColors.accent }}>✓</span>
                                    <span style={{ color: currentColors.textMuted }}>{feature.feature_name}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {user && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm"
                      style={{ backgroundColor: currentColors.accent, color: 'white' }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Write a Review
                    </button>
                  )}
                </>
              )}

              {showReviewForm && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold" style={{ color: currentColors.text }}>Write Review</h3>
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-1 rounded-lg font-semibold text-sm"
                      style={{ backgroundColor: currentColors.surface, color: currentColors.text }}
                    >
                      Cancel
                    </button>
                  </div>
                  <LocationReviewForm
                    locationId={selectedLocation.id}
                    onSuccess={() => {
                      setShowReviewForm(false);
                      loadLocations();
                    }}
                  />
                </div>
              )}

              {showReviewsPanel && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: currentColors.text }}>
                      <MessageSquare className="w-5 h-5" style={{ color: currentColors.primary }} />
                      Reviews
                    </h3>
                    <button
                      onClick={() => setShowReviewsPanel(false)}
                      className="px-3 py-1 rounded-lg font-semibold text-sm"
                      style={{ backgroundColor: currentColors.surface, color: currentColors.text }}
                    >
                      Back
                    </button>
                  </div>
                  <LocationReviews locationId={selectedLocation.id} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {clickedCoords && user && !showAddForm && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] p-5 rounded-xl shadow-2xl border-4 max-w-md pointer-events-auto" style={{
          backgroundColor: currentColors.accent,
          borderColor: currentColors.primary,
          boxShadow: `0 0 30px ${currentColors.accent}80`
        }}>
          <div className="flex items-center gap-3">
            <MapPinned className="w-6 h-6" style={{ color: 'white' }} />
            <div className="flex-1">
              <p className="font-bold text-base" style={{ color: 'white' }}>Suggest a new location here?</p>
              <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>Lat: {clickedCoords.lat.toFixed(4)}, Lng: {clickedCoords.lng.toFixed(4)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setClickedCoords(null);
                }}
                className="btn-sm text-sm font-bold whitespace-nowrap px-4 py-2 rounded-lg hover:scale-110 transition-transform"
                style={{ backgroundColor: 'white', color: currentColors.primary }}
              >
                Yes
              </button>
              <button
                onClick={() => setClickedCoords(null)}
                className="btn-sm text-sm font-semibold px-4 py-2 rounded-lg hover:scale-110 transition-transform"
                style={{ backgroundColor: currentColors.primary, color: 'white' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <LocationSubmissionForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            loadLocations();
          }}
          initialCoords={clickedCoords}
        />
      )}
    </div>
  );
}

import { useState } from 'react';
import { X, MapPin, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface LocationSubmissionFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const LOCATION_TYPES = [
  { value: 'camp', label: 'Scout Camp' },
  { value: 'service_center', label: 'Service Center' },
  { value: 'meeting_location', label: 'Meeting Location' },
  { value: 'outdoor_area', label: 'Outdoor Area' },
];

const ACCESSIBILITY_FEATURES = [
  { category: 'mobility', features: [
    { name: 'Wheelchair Accessible Entrance', emoji: '🚪' },
    { name: 'Wheelchair Accessible Restrooms', emoji: '🚻' },
    { name: 'Wheelchair Accessible Cabins', emoji: '🏕️' },
    { name: 'Paved Pathways', emoji: '🛤️' },
    { name: 'Accessible Parking', emoji: '🅿️' },
    { name: 'Elevator', emoji: '🛗' },
    { name: 'Ramps', emoji: '♿' },
  ]},
  { category: 'sensory', features: [
    { name: 'Quiet Room', emoji: '🤫' },
    { name: 'Sensory-Friendly Activities', emoji: '🎨' },
    { name: 'Noise Reduction Options', emoji: '🔇' },
    { name: 'Calm Down Space', emoji: '😌' },
  ]},
  { category: 'vision', features: [
    { name: 'Tactile Signage', emoji: '👆' },
    { name: 'Braille Materials', emoji: '⠃' },
    { name: 'High Contrast Signage', emoji: '🔲' },
    { name: 'Large Print Materials', emoji: '🔍' },
  ]},
  { category: 'hearing', features: [
    { name: 'Visual Fire Alarms', emoji: '🚨' },
    { name: 'Hearing Loop System', emoji: '🔊' },
    { name: 'Sign Language Interpreter Available', emoji: '🤟' },
    { name: 'Written Instructions', emoji: '📝' },
  ]},
  { category: 'cognitive', features: [
    { name: 'Visual Schedules Available', emoji: '📅' },
    { name: 'Simplified Instructions', emoji: '✏️' },
    { name: 'Extra Support Staff', emoji: '👥' },
  ]},
];

export function LocationSubmissionForm({ onClose, onSuccess }: LocationSubmissionFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'camp',
    address: '',
    city: '',
    state: 'MI',
    zip_code: '',
    latitude: '',
    longitude: '',
    description: '',
    contact_phone: '',
    contact_email: '',
    website: '',
    photo_url: '',
  });
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let photoUrl = formData.photo_url;

      // Upload photo if provided
      if (photoFile) {
        setUploading(true);
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('location-photos')
          .upload(fileName, photoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('location-photos')
          .getPublicUrl(fileName);

        photoUrl = publicUrl;
        setUploading(false);
      }
      const { data: location, error: locationError } = await supabase
        .from('accessible_locations')
        .insert({
          ...formData,
          photo_url: photoUrl,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          submitted_by: user.id,
        })
        .select()
        .single();

      if (locationError) throw locationError;

      if (selectedFeatures.size > 0 && location) {
        const features = Array.from(selectedFeatures).map(featureName => {
          const category = ACCESSIBILITY_FEATURES.find(cat =>
            cat.features.some(f => f.name === featureName)
          )?.category || 'mobility';

          return {
            location_id: location.id,
            feature_category: category,
            feature_name: featureName,
            is_available: true,
          };
        });

        const { error: featuresError } = await supabase
          .from('location_accessibility_features')
          .insert(features);

        if (featuresError) throw featuresError;
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error submitting location:', error);
      alert('Error submitting location: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = new Set(selectedFeatures);
    if (newFeatures.has(feature)) {
      newFeatures.delete(feature);
    } else {
      newFeatures.add(feature);
    }
    setSelectedFeatures(newFeatures);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[10000] overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Submit New Location
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium mb-1">
                Location Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input w-full"
                placeholder="e.g., Camp Example"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input w-full"
              >
                {LOCATION_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input w-full"
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="input w-full"
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                className="input w-full"
                placeholder="12345"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="input w-full"
                  placeholder="42.9644"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="input w-full"
                  placeholder="-83.2047"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Tip: Find coordinates on Google Maps by right-clicking a location
            </p>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input w-full"
                rows={3}
                placeholder="Brief description of the location..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="input w-full"
                placeholder="(123) 456-7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="input w-full"
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="input w-full"
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium">
                📷 Location Photo (Optional)
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  {photoPreview ? (
                    <div className="space-y-2">
                      <img src={photoPreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                      <p className="text-sm text-gray-600">Click to change photo</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload from your device</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  className="input w-full text-sm"
                  placeholder="https://example.com/photo.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Or use free stock photos from <a href="https://www.pexels.com" target="_blank" className="text-blue-600 hover:underline">Pexels</a>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Accessibility Features</h3>
            <p className="text-sm text-gray-600">
              Select all accessibility features available at this location
            </p>

            {ACCESSIBILITY_FEATURES.map(({ category, features }) => (
              <div key={category}>
                <h4 className="font-medium text-sm text-gray-700 mb-2 capitalize">
                  {category} Accessibility
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {features.map(feature => (
                    <label
                      key={feature.name}
                      className="flex items-center gap-2 p-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFeatures.has(feature.name)}
                        onChange={() => toggleFeature(feature.name)}
                        className="rounded"
                      />
                      <span className="text-xl">{feature.emoji}</span>
                      <span className="text-sm text-gray-900">{feature.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Your submission will be reviewed before appearing on the map.
              Please ensure all information is accurate.
            </p>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary flex items-center gap-2"
            disabled={loading || uploading}
          >
            {uploading ? (
              <>
                <Upload className="w-5 h-5 animate-pulse" />
                Uploading Photo...
              </>
            ) : loading ? (
              'Submitting...'
            ) : (
              <>
                <Check className="w-5 h-5" />
                Submit Location
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

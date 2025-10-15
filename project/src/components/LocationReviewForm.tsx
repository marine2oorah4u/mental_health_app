import { useState } from 'react';
import { Star, X, Camera, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface LocationReviewFormProps {
  locationId: string;
  locationName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function LocationReviewForm({ locationId, locationName, onClose, onSuccess }: LocationReviewFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    review_text: '',
    overall_rating: 0,
    mobility_rating: 0,
    sensory_rating: 0,
    vision_rating: 0,
    hearing_rating: 0,
    cognitive_rating: 0,
    visit_date: '',
  });

  const handleRatingClick = (category: string, rating: number) => {
    setFormData(prev => ({ ...prev, [category]: rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to submit a review');
      return;
    }

    if (formData.overall_rating === 0) {
      setError('Please provide an overall rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('location_reviews')
        .insert({
          location_id: locationId,
          user_id: user.id,
          ...formData,
          is_verified: false,
        });

      if (insertError) throw insertError;

      onSuccess();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const RatingStars = ({ value, onChange, label }: { value: number; onChange: (rating: number) => void; label: string }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 w-24">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 ${
                rating <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Write a Review</h2>
            <p className="text-sm text-gray-600 mt-1">{locationName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <RatingStars
              value={formData.overall_rating}
              onChange={(rating) => handleRatingClick('overall_rating', rating)}
              label="Overall"
            />
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Accessibility Ratings (Optional)
            </label>
            <div className="space-y-3">
              <RatingStars
                value={formData.mobility_rating}
                onChange={(rating) => handleRatingClick('mobility_rating', rating)}
                label="Mobility"
              />
              <RatingStars
                value={formData.sensory_rating}
                onChange={(rating) => handleRatingClick('sensory_rating', rating)}
                label="Sensory"
              />
              <RatingStars
                value={formData.vision_rating}
                onChange={(rating) => handleRatingClick('vision_rating', rating)}
                label="Vision"
              />
              <RatingStars
                value={formData.hearing_rating}
                onChange={(rating) => handleRatingClick('hearing_rating', rating)}
                label="Hearing"
              />
              <RatingStars
                value={formData.cognitive_rating}
                onChange={(rating) => handleRatingClick('cognitive_rating', rating)}
                label="Cognitive"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Review Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="input w-full"
              placeholder="Sum up your experience"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.review_text}
              onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
              className="input w-full min-h-[150px]"
              placeholder="Share details about your experience at this location..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date of Visit
            </label>
            <input
              type="date"
              value={formData.visit_date}
              onChange={(e) => setFormData(prev => ({ ...prev, visit_date: e.target.value }))}
              className="input"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Your review will be published after verification by our team. This helps ensure all reviews
              are authentic and helpful for other Scout leaders and families.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

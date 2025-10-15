import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Calendar, User, Camera, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Review {
  id: string;
  title: string;
  review_text: string;
  overall_rating: number;
  mobility_rating?: number;
  sensory_rating?: number;
  vision_rating?: number;
  hearing_rating?: number;
  cognitive_rating?: number;
  visit_date?: string;
  helpful_count: number;
  created_at: string;
  user_id: string;
}

interface Photo {
  id: string;
  photo_url: string;
  caption?: string;
  category?: string;
  accessibility_category?: string;
  created_at: string;
}

interface LocationReviewsProps {
  locationId: string;
  onWriteReview: () => void;
}

export function LocationReviews({ locationId, onWriteReview }: LocationReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reviews' | 'photos'>('reviews');

  useEffect(() => {
    loadReviewsAndPhotos();
  }, [locationId]);

  const loadReviewsAndPhotos = async () => {
    try {
      const [reviewsRes, photosRes] = await Promise.all([
        supabase
          .from('location_reviews')
          .select('*')
          .eq('location_id', locationId)
          .order('created_at', { ascending: false }),
        supabase
          .from('location_photos')
          .select('*')
          .eq('location_id', locationId)
          .order('created_at', { ascending: false })
      ]);

      if (reviewsRes.data) setReviews(reviewsRes.data);
      if (photosRes.data) setPhotos(photosRes.data);
    } catch (error) {
      console.error('Error loading reviews and photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpfulVote = async (reviewId: string) => {
    if (!user) {
      alert('Please sign in to vote on reviews');
      return;
    }

    try {
      const { error } = await supabase
        .from('review_helpful_votes')
        .insert({ review_id: reviewId, user_id: user.id });

      if (error) {
        if (error.code === '23505') {
          alert('You have already marked this review as helpful');
        } else {
          throw error;
        }
      } else {
        loadReviewsAndPhotos();
      }
    } catch (error) {
      console.error('Error voting on review:', error);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length).toFixed(1)
    : '0';

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading reviews...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl font-bold text-gray-800">{avgRating}</div>
            <div>
              {renderStars(Math.round(parseFloat(avgRating)))}
              <div className="text-sm text-gray-600 mt-1">{reviews.length} reviews</div>
            </div>
          </div>
        </div>
        <button onClick={onWriteReview} className="btn btn-primary flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Write Review
        </button>
      </div>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'reviews'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'photos'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Photos ({photos.length})
        </button>
      </div>

      {activeTab === 'reviews' ? (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="card bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {renderStars(review.overall_rating)}
                      {review.visit_date && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Visited {new Date(review.visit_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800">{review.title}</h3>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-3">{review.review_text}</p>

                {(review.mobility_rating || review.sensory_rating || review.vision_rating ||
                  review.hearing_rating || review.cognitive_rating) && (
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <div className="text-xs font-semibold text-gray-700 mb-2">Accessibility Ratings:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {review.mobility_rating && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Mobility:</span>
                          {renderStars(review.mobility_rating)}
                        </div>
                      )}
                      {review.sensory_rating && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Sensory:</span>
                          {renderStars(review.sensory_rating)}
                        </div>
                      )}
                      {review.vision_rating && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Vision:</span>
                          {renderStars(review.vision_rating)}
                        </div>
                      )}
                      {review.hearing_rating && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Hearing:</span>
                          {renderStars(review.hearing_rating)}
                        </div>
                      )}
                      {review.cognitive_rating && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Cognitive:</span>
                          {renderStars(review.cognitive_rating)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleHelpfulVote(review.id)}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    Helpful ({review.helpful_count})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No photos yet</p>
            </div>
          ) : (
            photos.map((photo) => (
              <div key={photo.id} className="card p-0 overflow-hidden group cursor-pointer">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img
                    src={photo.photo_url}
                    alt={photo.caption || 'Location photo'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {photo.caption && (
                  <div className="p-2">
                    <p className="text-xs text-gray-700">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

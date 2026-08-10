import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, Quote } from 'lucide-react';
import { Review } from '../data/products';

interface ReviewsProps {
  reviews: Review[];
  isAdmin?: boolean;
  onAddReview?: (review: { name: string; rating: number; review: string }) => void | Promise<void>;
  onRemoveReview?: (id: string) => void | Promise<void>;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews, isAdmin, onAddReview, onRemoveReview }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !reviewText.trim()) return;
    setError('');
    try {
      await onAddReview?.({ name: name.trim(), rating, review: reviewText.trim() });
      setName('');
      setRating(5);
      setReviewText('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your review. Please try again.');
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-orange-500', 'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <section id="reviews" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Customer <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Reviews</span>
          </h2>
          <p className="text-gray-400 text-lg">See what our customers have to say about EMOREV</p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 hover:border-orange-500/20 transition-all group"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-orange-500/10 group-hover:text-orange-500/20 transition-colors" />

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${getAvatarColor(review.name)} flex items-center justify-center text-white font-bold text-sm`}>
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">{review.name}</h4>
                  <p className="text-gray-500 text-xs">{review.date}</p>
                </div>
                {isAdmin && onRemoveReview && (
                  <button
                    onClick={() => onRemoveReview(review.id)}
                    className="ml-auto text-gray-600 hover:text-red-400 transition-colors text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= review.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-700'}`}
                  />
                ))}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">{review.review}</p>
            </motion.div>
          ))}
        </div>

        {/* Leave Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-800/50"
        >
          <h3 className="text-xl font-bold text-white mb-6 text-center">Leave Your Feedback</h3>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center"
            >
              <p className="text-green-400 font-semibold">Thank you for your review! 🎉</p>
            </motion.div>
          )}

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      className={`w-8 h-8 ${star <= rating ? 'text-orange-400 fill-orange-400' : 'text-gray-700'} transition-colors`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Your Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                placeholder="Share your experience with EMOREV..."
                required
              />
            </div>

            <motion.button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl text-sm tracking-wider uppercase hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-4 h-4" />
              Submit Review
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;

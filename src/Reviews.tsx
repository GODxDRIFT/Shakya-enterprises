// src/Reviews.tsx
import { useState } from 'react';
import { Star, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export interface Review {
  id: string;
  productId: string;
  rating: number;
  title: string;
  text: string;
  name: string;
  location: string;
  date: string;
  helpful: number;
}

const REVIEWS_KEY = 'shakya_reviews_v1';

export const loadReviews = (): Review[] => {
  try { return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]'); }
  catch { return []; }
};
export const saveReviews = (reviews: Review[]) => {
  try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews)); }
  catch {}
};

// ── Star display ──────────────────────────────────────────────────────────
export const Stars = ({ rating, size = 14, interactive = false, onChange }: {
  rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i} size={size}
          className={cn("transition-colors", (hover || rating) >= i ? "text-brand-gold fill-brand-gold" : "text-brand-charcoal/20", interactive && "cursor-pointer")}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange?.(i)}
        />
      ))}
    </div>
  );
};

// ── Compact badge for product cards ──────────────────────────────────────
export const RatingBadge = ({ productId, reviews }: { productId: string; reviews: Review[] }) => {
  const productReviews = reviews.filter(r => r.productId === productId);
  if (productReviews.length === 0) return null;
  const avg = productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length;
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <Stars rating={Math.round(avg)} size={10} />
      <span className="text-[9px] text-brand-charcoal/50 font-bold">({productReviews.length})</span>
    </div>
  );
};

// ── Review form ───────────────────────────────────────────────────────────
export const ReviewForm = ({ productId, onSubmit }: { productId: string; onSubmit: (r: Review) => void }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!rating) { setError('Please select a star rating.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!text.trim() || text.length < 10) { setError('Review must be at least 10 characters.'); return; }
    setError('');
    const review: Review = {
      id: `rev_${Date.now()}`,
      productId, rating, title: title.trim(), text: text.trim(),
      name: name.trim(), location: location.trim(),
      date: new Date().toISOString(), helpful: 0,
    };
    onSubmit(review);
    setSubmitted(true);
  };

  if (submitted) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
      <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
      <p className="serif text-lg text-brand-charcoal">Thank you for your review!</p>
      <p className="text-xs text-brand-charcoal/50 mt-1">Your feedback helps other customers.</p>
    </motion.div>
  );

  return (
    <div className="border-t border-brand-charcoal/8 pt-5 mt-5">
      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50 mb-4">Write a Review</p>
      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
      <div className="space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 mb-2">Your Rating *</p>
          <Stars rating={rating} size={22} interactive onChange={setRating} />
        </div>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Review title (optional)" className="w-full border-b border-brand-charcoal/15 pb-2 text-sm bg-transparent focus:outline-none focus:border-brand-olive transition-colors placeholder:text-brand-charcoal/25" />
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Share your experience with this product *" rows={3} className="w-full border border-brand-charcoal/15 p-3 text-sm bg-transparent focus:outline-none focus:border-brand-olive transition-colors placeholder:text-brand-charcoal/25 resize-none" />
        <div className="grid grid-cols-2 gap-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name *" className="border-b border-brand-charcoal/15 pb-2 text-sm bg-transparent focus:outline-none focus:border-brand-olive transition-colors placeholder:text-brand-charcoal/25" />
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" className="border-b border-brand-charcoal/15 pb-2 text-sm bg-transparent focus:outline-none focus:border-brand-olive transition-colors placeholder:text-brand-charcoal/25" />
        </div>
        <button onClick={handleSubmit} className="w-full py-3 bg-brand-charcoal text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand-olive transition-colors">
          Submit Review
        </button>
      </div>
    </div>
  );
};

// ── Review list ───────────────────────────────────────────────────────────
export const ReviewList = ({ productId, reviews, onHelpful }: {
  productId: string; reviews: Review[]; onHelpful: (id: string) => void;
}) => {
  const productReviews = reviews.filter(r => r.productId === productId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (productReviews.length === 0) return (
    <p className="text-sm text-brand-charcoal/40 italic py-4">No reviews yet. Be the first!</p>
  );
  const avg = productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length;
  return (
    <div>
      {/* Average */}
      <div className="flex items-center gap-4 mb-5 pb-4 border-b border-brand-charcoal/8">
        <div className="text-center">
          <p className="serif text-4xl font-bold text-brand-charcoal">{avg.toFixed(1)}</p>
          <Stars rating={Math.round(avg)} size={12} />
          <p className="text-[9px] text-brand-charcoal/40 mt-1">{productReviews.length} review{productReviews.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map(star => {
            const count = productReviews.filter(r => r.rating === star).length;
            const pct = productReviews.length ? (count / productReviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-[10px] text-brand-charcoal/50 w-3">{star}</span>
                <div className="flex-1 bg-brand-charcoal/8 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-gold h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[9px] text-brand-charcoal/40 w-4">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Individual reviews */}
      <div className="space-y-5 max-h-64 overflow-y-auto pr-1">
        {productReviews.map(r => (
          <div key={r.id} className="border-b border-brand-charcoal/6 pb-5 last:border-0">
            <div className="flex justify-between items-start mb-1">
              <Stars rating={r.rating} size={12} />
              <span className="text-[9px] text-brand-charcoal/30">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            {r.title && <p className="text-sm font-bold text-brand-charcoal mb-1">{r.title}</p>}
            <p className="text-sm text-brand-charcoal/70 leading-relaxed mb-2">{r.text}</p>
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-brand-charcoal/50">{r.name}{r.location && `, ${r.location}`}</p>
              <button onClick={() => onHelpful(r.id)} className="flex items-center gap-1 text-[9px] text-brand-charcoal/30 hover:text-brand-charcoal transition-colors">
                <ThumbsUp size={10} /> {r.helpful > 0 ? `${r.helpful} helpful` : 'Helpful?'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

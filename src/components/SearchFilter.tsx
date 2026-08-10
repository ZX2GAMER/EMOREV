import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchFilterProps {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  showDiscountOnly: boolean;
  setShowDiscountOnly: (s: boolean) => void;
  showNewOnly: boolean;
  setShowNewOnly: (s: boolean) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  open, onClose, searchQuery, setSearchQuery,
  activeCategory, setActiveCategory,
  priceRange, setPriceRange,
  showDiscountOnly, setShowDiscountOnly,
  showNewOnly, setShowNewOnly,
}) => {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 left-0 right-0 z-40 px-4"
    >
      <div className="max-w-3xl mx-auto bg-gray-950/95 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 shadow-2xl">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors"
            autoFocus
          />
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            {['all', 'women', 'men', 'kids'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="flex-1 accent-orange-500"
            />
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="flex-1 accent-orange-500"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDiscountOnly}
              onChange={(e) => setShowDiscountOnly(e.target.checked)}
              className="accent-orange-500 w-4 h-4"
            />
            <span className="text-sm text-gray-400">On Sale</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showNewOnly}
              onChange={(e) => setShowNewOnly(e.target.checked)}
              className="accent-orange-500 w-4 h-4"
            />
            <span className="text-sm text-gray-400">New Arrivals</span>
          </label>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            setSearchQuery('');
            setActiveCategory('all');
            setPriceRange([0, 500]);
            setShowDiscountOnly(false);
            setShowNewOnly(false);
          }}
          className="mt-4 text-xs text-orange-400 hover:text-orange-300 transition-colors"
        >
          Reset all filters
        </button>
      </div>
    </motion.div>
  );
};

export default SearchFilter;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow?: () => void;
}

const QuickView: React.FC<QuickViewProps> = ({ product, onClose, onBuyNow }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-4xl md:w-full md:h-auto bg-gray-950 border border-orange-500/20 rounded-2xl z-50 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-900/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="md:flex">
              {/* Image */}
              <div className="md:w-1/2 relative">
                <img src={product.image} alt={product.name} className="w-full h-64 md:h-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.discount && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">-{product.discount}%</span>
                  )}
                  {product.isNew && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">NEW</span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="md:w-1/2 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>

                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="w-4 h-4 text-orange-400 fill-orange-400" />
                  ))}
                  <span className="text-gray-500 text-sm">(4.8) • 120+ reviews</span>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  {product.salePrice ? (
                    <>
                      <span className="text-orange-400 font-bold text-3xl">${product.salePrice.toFixed(2)}</span>
                      <span className="text-gray-500 line-through text-lg">${product.price.toFixed(2)}</span>
                      <span className="bg-red-500/10 text-red-400 text-sm font-bold px-2 py-1 rounded-lg">Save ${(product.price - product.salePrice).toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-white font-bold text-3xl">${product.price.toFixed(2)}</span>
                  )}
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">{product.description}</p>

                {/* Size Selection */}
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-2">Size: {selectedSize && <span className="text-white font-semibold">{selectedSize}</span>}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.size.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock */}
                <p className="text-sm text-gray-500 mb-6">
                  {product.stock > 0 ? (
                    <span className="text-green-400">✓ In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="text-red-400">✗ Out of Stock</span>
                  )}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || product.stock === 0}
                    className={`flex-1 py-4 rounded-xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
                      addedToCart
                        ? 'bg-green-500 text-white'
                        : !selectedSize || product.stock === 0
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: selectedSize && product.stock > 0 ? 1.02 : 1 }}
                    whileTap={{ scale: selectedSize && product.stock > 0 ? 0.98 : 1 }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {addedToCart ? '✓ Added!' : 'Add to Cart'}
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      if (selectedSize && product.stock > 0) {
                        addToCart(product, selectedSize);
                        onBuyNow?.();
                      }
                    }}
                    disabled={!selectedSize || product.stock === 0}
                    className={`flex-1 py-4 rounded-xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
                      !selectedSize || product.stock === 0
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/25'
                    }`}
                    whileHover={{ scale: selectedSize && product.stock > 0 ? 1.02 : 1 }}
                    whileTap={{ scale: selectedSize && product.stock > 0 ? 0.98 : 1 }}
                  >
                    Buy Now
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickView;

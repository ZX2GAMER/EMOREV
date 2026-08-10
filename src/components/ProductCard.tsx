import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye, Zap } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onBuyNow?: () => void;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, onBuyNow, index = 0 }) => {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.size.length === 1) {
      addToCart(product, product.size[0]);
    } else {
      setShowSizes(true);
      return;
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.size.length === 1) {
      addToCart(product, product.size[0]);
    } else {
      setShowSizes(true);
      return;
    }
    onBuyNow?.();
  };

  const confirmAddToCart = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    addToCart(product, size);
    setShowSizes(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const confirmBuyNow = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    addToCart(product, size);
    setShowSizes(false);
    onBuyNow?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800/50 hover:border-purple-500/30 transition-all duration-500"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowSizes(false); }}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full"
            >
              -{product.discount}%
            </motion.span>
          )}
          {product.isNew && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full"
            >
              NEW
            </motion.span>
          )}
        </div>

        {/* Overlay Buttons */}
        <motion.div
          className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
            className="w-11 h-11 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors text-gray-800"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setLiked(!liked)}
            className={`w-11 h-11 backdrop-blur rounded-full flex items-center justify-center transition-colors ${
              liked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-800 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} />
          </motion.button>
        </motion.div>

        {/* Stock indicator */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3 right-3 bg-yellow-500/90 backdrop-blur text-black text-xs font-bold text-center py-1 rounded-full">
            Only {product.stock} left!
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-1 truncate">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map(star => (
            <Star key={star} className="w-3 h-3 text-orange-400 fill-orange-400" />
          ))}
          <span className="text-gray-500 text-xs ml-1">(4.8)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.salePrice ? (
            <>
              <span className="text-orange-400 font-bold text-lg">${product.salePrice.toFixed(2)}</span>
              <span className="text-gray-500 line-through text-sm">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-white font-bold text-lg">${product.price.toFixed(2)}</span>
          )}
        </div>

        {/* Add to Cart / Size Selector */}
        {showSizes ? (
          <div className="space-y-2">
            <p className="text-xs text-gray-400">Select Size:</p>
            <div className="flex flex-wrap gap-1.5">
              {product.size.map(size => (
                <button
                  key={size}
                  onClick={(e) => confirmAddToCart(e, size)}
                  className="px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg hover:bg-orange-500 transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  const firstSize = product.size[0];
                  confirmBuyNow(e, firstSize);
                }}
                className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1"
              >
                <Zap className="w-3 h-3" />
                Buy Now
              </button>
              <button
                onClick={() => setShowSizes(false)}
                className="px-3 py-2 text-xs text-gray-500 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <motion.button
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-1 ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="w-3 h-3" />
              {addedToCart ? '✓ Added' : 'Add'}
            </motion.button>
            <motion.button
              onClick={handleBuyNow}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 flex items-center justify-center gap-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className="w-3 h-3" />
              Buy Now
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;

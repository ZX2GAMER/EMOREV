import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../data/products';
import ProductCard from './ProductCard';
import { Flame } from 'lucide-react';

interface SaleSectionProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onBuyNow?: () => void;
}

const SaleSection: React.FC<SaleSectionProps> = ({ products, onQuickView, onBuyNow }) => {
  const saleProducts = products.filter(p => p.discount && p.discount > 0);

  return (
    <section id="sale" className="py-20 px-4 bg-gradient-to-b from-gray-950 via-red-950/10 to-gray-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-red-500 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Hot <span className="text-red-500">Sale</span>
            </h2>
            <Flame className="w-8 h-8 text-red-500 animate-pulse" />
          </div>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Don't miss these incredible deals on premium fashion
          </p>

          {/* Animated Sale Banner */}
          <motion.div
            className="mt-6 inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-6 py-2"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-red-400 font-bold text-sm tracking-wider">UP TO {Math.max(...saleProducts.map(p => p.discount || 0))}% OFF</span>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {saleProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <ProductCard product={product} onQuickView={onQuickView} onBuyNow={onBuyNow} index={i} />
            </motion.div>
          ))}
        </div>

        {saleProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No sale items available right now</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SaleSection;

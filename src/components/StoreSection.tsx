import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../data/products';
import ProductCard from './ProductCard';
import { Grid, List } from 'lucide-react';

interface StoreSectionProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onBuyNow?: () => void;
}

const StoreSection: React.FC<StoreSectionProps> = ({ products, onQuickView, onBuyNow }) => {
  const [activeTab, setActiveTab] = useState<'women' | 'men' | 'kids'>('women');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'newest'>('newest');

  const tabs = [
    { id: 'women' as const, label: 'Women', emoji: '👩', gradient: 'from-pink-500 to-purple-500' },
    { id: 'men' as const, label: 'Men', emoji: '👨', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'kids' as const, label: 'Kids', emoji: '👶', gradient: 'from-yellow-400 to-green-400' },
  ];

  let filtered = products.filter(p => p.category === activeTab);

  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'price-asc': return (a.salePrice || a.price) - (b.salePrice || b.price);
      case 'price-desc': return (b.salePrice || b.price) - (a.salePrice || a.price);
      case 'newest': return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default: return 0;
    }
  });

  return (
    <section id="store" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">EMOREV</span>{' '}
            Store
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Discover our curated collection of premium fashion for everyone
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-bold text-sm tracking-wider uppercase transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <p className="text-gray-500 text-sm">{filtered.length} products</p>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-orange-500/50"
            >
              <option value="newest">Newest</option>
              <option value="name">Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <div className="flex bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {viewMode === 'grid' ? (
          <motion.div
            key={activeTab}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} onQuickView={onQuickView} onBuyNow={onBuyNow} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div key={activeTab} className="space-y-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800/50 hover:border-orange-500/30 transition-all"
              >
                <img src={product.image} alt={product.name} className="w-32 h-40 object-cover" />
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{product.name}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {product.discount && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{product.discount}%</span>
                      )}
                      {product.isNew && (
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      {product.salePrice ? (
                        <>
                          <span className="text-orange-400 font-bold text-lg">${product.salePrice.toFixed(2)}</span>
                          <span className="text-gray-500 line-through">${product.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-white font-bold text-lg">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(product);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-bold hover:from-orange-600 hover:to-red-600 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found in this category</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StoreSection;

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Product } from './data/products';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import StoreSection from './components/StoreSection';
import SaleSection from './components/SaleSection';
import Reviews from './components/Reviews';
import Cart from './components/Cart';
import SearchFilter from './components/SearchFilter';
import QuickView from './components/QuickView';
import AdminDashboard from './components/AdminDashboard';
import Checkout from './components/Checkout';
import CustomerSupport from './components/CustomerSupport';
import WhatsAppButton from './components/WhatsAppButton';
import AskQuestionChat from './components/AskQuestionChat';
import Footer from './components/Footer';

const AppContent: React.FC = () => {
  const { products, reviews, loading, storeError, websiteSettings, addReview, removeReview } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);

  const logoColors = useMemo(() => {
    const selected = websiteSettings.logoColors.length > 0 ? websiteSettings.logoColors : ['#ef4444'];
    return Array.from({ length: 6 }, (_, i) => selected[i % selected.length]);
  }, [websiteSettings.logoColors]);

  useEffect(() => {
    document.title = websiteSettings.websiteTitle || websiteSettings.websiteName || 'EMOREV';
    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute('content', websiteSettings.websiteDescription || 'EMOREV premium fashion store');
  }, [websiteSettings.websiteTitle, websiteSettings.websiteName, websiteSettings.websiteDescription]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const price = p.salePrice || p.price;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      const matchesDiscount = !showDiscountOnly || p.discount !== undefined;
      const matchesNew = !showNewOnly || p.isNew;
      return matchesSearch && matchesCategory && matchesPrice && matchesDiscount && matchesNew;
    });
  }, [products, searchQuery, activeCategory, priceRange, showDiscountOnly, showNewOnly]);

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const handleAddReview = useCallback(async (review: { name: string; rating: number; review: string }) => {
    await addReview(review);
  }, [addReview]);

  const handleRemoveReview = useCallback(async (id: string) => {
    await removeReview(id);
  }, [removeReview]);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundColor: websiteSettings.backgroundColor || '#000000',
        backgroundImage: websiteSettings.backgroundImage ? `url(${websiteSettings.backgroundImage})` : undefined,
        backgroundAttachment: websiteSettings.backgroundImage ? 'fixed' : undefined,
        backgroundSize: websiteSettings.backgroundImage ? 'cover' : undefined,
        backgroundPosition: websiteSettings.backgroundImage ? 'center' : undefined,
        ['--emorev-color-1' as string]: logoColors[0],
        ['--emorev-color-2' as string]: logoColors[1],
        ['--emorev-color-3' as string]: logoColors[2],
        ['--emorev-color-4' as string]: logoColors[3],
        ['--emorev-color-5' as string]: logoColors[4],
        ['--emorev-color-6' as string]: logoColors[5],
      }}
    >
      <style>{`
        @keyframes emorevGlobalColorCycle {
          0%, 15% { background-image: linear-gradient(90deg, var(--emorev-color-1), var(--emorev-color-2)); }
          16.66%, 31% { background-image: linear-gradient(90deg, var(--emorev-color-2), var(--emorev-color-3)); }
          33.33%, 48% { background-image: linear-gradient(90deg, var(--emorev-color-3), var(--emorev-color-4)); }
          50%, 65% { background-image: linear-gradient(90deg, var(--emorev-color-4), var(--emorev-color-5)); }
          66.66%, 81% { background-image: linear-gradient(90deg, var(--emorev-color-5), var(--emorev-color-6)); }
          83.33%, 100% { background-image: linear-gradient(90deg, var(--emorev-color-6), var(--emorev-color-1)); }
        }
        .emorev-dynamic-logo,
        .emorev-cycle {
          animation: emorevGlobalColorCycle 60s ease-in-out infinite;
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          transition: filter 800ms ease, text-shadow 800ms ease;
          filter: drop-shadow(0 0 16px color-mix(in srgb, var(--emorev-color-1), transparent 45%));
        }
      `}</style>
      <Navbar
        onCartClick={() => setCartOpen(true)}
        onSearchClick={() => setSearchOpen(!searchOpen)}
        onAdminClick={() => setAdminOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <SearchFilter
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        showDiscountOnly={showDiscountOnly}
        setShowDiscountOnly={setShowDiscountOnly}
        showNewOnly={showNewOnly}
        setShowNewOnly={setShowNewOnly}
      />

      {(loading || storeError) && (
        <div className={`fixed left-4 right-4 top-24 z-40 mx-auto max-w-xl rounded-xl border px-4 py-3 text-center text-sm backdrop-blur-xl ${
          storeError
            ? 'border-red-500/30 bg-red-950/80 text-red-200'
            : 'border-orange-500/30 bg-gray-950/80 text-orange-200'
        }`}>
          {storeError || 'Loading EMOREV products from Supabase...'}
        </div>
      )}

      <Hero />

      {/* Filtered Products Section (shown when searching) */}
      {(searchQuery || activeCategory !== 'all' || showDiscountOnly || showNewOnly) && (
        <section className="py-20 px-4 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                Search Results
                <span className="text-orange-400 ml-2 text-lg">({filteredProducts.length})</span>
              </h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {searchQuery && (
                  <span className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="ml-2 text-orange-400 hover:text-orange-300">✕</button>
                  </span>
                )}
                {activeCategory !== 'all' && (
                  <span className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                    Category: {activeCategory}
                    <button onClick={() => setActiveCategory('all')} className="ml-2 text-orange-400 hover:text-orange-300">✕</button>
                  </span>
                )}
                {showDiscountOnly && (
                  <span className="bg-red-500/10 text-red-400 text-xs px-3 py-1 rounded-full">
                    On Sale
                    <button onClick={() => setShowDiscountOnly(false)} className="ml-2 text-red-300 hover:text-red-200">✕</button>
                  </span>
                )}
                {showNewOnly && (
                  <span className="bg-orange-500/10 text-orange-400 text-xs px-3 py-1 rounded-full">
                    New Arrivals
                    <button onClick={() => setShowNewOnly(false)} className="ml-2 text-orange-300 hover:text-orange-200">✕</button>
                  </span>
                )}
              </div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={product} onQuickView={handleQuickView} index={i} onBuyNow={() => setCheckoutOpen(true)} />
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No products match your search</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); setShowDiscountOnly(false); setShowNewOnly(false); }}
                  className="mt-4 text-orange-400 hover:text-orange-300 text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <StoreSection products={products} onQuickView={handleQuickView} onBuyNow={() => setCheckoutOpen(true)} />
      <SaleSection products={products} onQuickView={handleQuickView} onBuyNow={() => setCheckoutOpen(true)} />

      {/* New Arrivals Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              New <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Arrivals</span>
            </h2>
            <p className="text-gray-400 text-lg">The freshest drops from EMOREV</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.filter(p => p.isNew).map((product, i) => (
              <ProductCard key={product.id} product={product} onQuickView={handleQuickView} onBuyNow={() => setCheckoutOpen(true)} index={i} />
            ))}
          </div>

          {products.filter(p => p.isNew).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No new arrivals yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>

      <Reviews
        reviews={reviews}
        onAddReview={handleAddReview}
        onRemoveReview={handleRemoveReview}
      />

      {/* Newsletter */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-orange-500/5 border-y border-orange-500/10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Stay in the <span className="text-orange-400">Fast Lane</span>
            </h2>
            <p className="text-gray-400 mb-6">Subscribe to get exclusive deals, early access to new drops, and fashion inspiration</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors"
              />
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl text-sm hover:from-orange-600 hover:to-red-600 transition-all whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-3">Need Help?</h3>
            <p className="text-gray-400 mb-6">Our support team is here to assist you with any questions or concerns.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => setSupportOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl text-sm hover:from-orange-600 hover:to-red-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📧 Contact Support
              </motion.button>
              <motion.button
                onClick={() => window.open(`https://wa.me/1234567890?text=Hello%20EMOREV`, '_blank')}
                className="px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl text-sm hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💬 WhatsApp Support
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onBuyNow={() => { setQuickViewProduct(null); setCheckoutOpen(true); }} />
      <AdminDashboard open={adminOpen} onClose={() => setAdminOpen(false)} />
      <Checkout open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <CustomerSupport open={supportOpen} onClose={() => setSupportOpen(false)} />
      <AskQuestionChat />
      <WhatsAppButton />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onCartClick: () => void;
  onSearchClick: () => void;
  onAdminClick: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick, onSearchClick, onAdminClick, activeSection, setActiveSection }) => {
  const { totalItems } = useCart();
  const { isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'store', label: 'Store' },
    { id: 'sale', label: 'Sale' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-orange-500/20' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => { setActiveSection('hero'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                EMOREV
              </span>
              <motion.div
                className="w-2 h-2 bg-orange-400 rounded-full ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => { setActiveSection(link.id); document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                  className={`text-sm tracking-wider uppercase transition-all relative py-1 ${
                    activeSection === link.id ? 'text-orange-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"
                      layoutId="activeTab"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3 md:gap-5">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSearchClick}
                className="text-gray-300 hover:text-orange-400 transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onCartClick}
                className="text-gray-300 hover:text-orange-400 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setUserOpen(!userOpen)}
                  className="text-gray-300 hover:text-orange-400 transition-colors flex items-center gap-1"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-3 h-3 hidden md:block" />
                </motion.button>

                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-orange-500/20 rounded-xl overflow-hidden shadow-2xl"
                    >
                      <div className="py-2">
                        {isAdmin ? (
                          <>
                            <div className="px-4 py-2 border-b border-gray-800">
                              <p className="text-xs text-orange-400 font-bold">ADMIN MODE</p>
                            </div>
                            <button
                              onClick={() => { onAdminClick(); setUserOpen(false); }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-400 transition-colors"
                            >
                              Dashboard
                            </button>
                            <button
                              onClick={() => { logout(); setUserOpen(false); }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            >
                              Logout
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => { onAdminClick(); setUserOpen(false); }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-400 transition-colors"
                          >
                            Admin Login
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-gray-300 hover:text-orange-400"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    setActiveSection(link.id);
                    document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
                    setMobileOpen(false);
                  }}
                  className={`text-2xl font-bold tracking-wider uppercase ${
                    activeSection === link.id ? 'text-orange-400' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

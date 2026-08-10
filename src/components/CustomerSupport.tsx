import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send, CheckCircle, Mail, User, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CustomerSupportProps {
  open: boolean;
  onClose: () => void;
}

const CustomerSupport: React.FC<CustomerSupportProps> = ({ open, onClose }) => {
  const { addQuestion } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    orderInfo: '',
  });

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await addQuestion({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        orderInfo: formData.orderInfo || undefined,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '', orderInfo: '' });
        onClose();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your support message. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-gray-950 border border-orange-500/20 rounded-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Customer Support</h2>
                  <p className="text-gray-500 text-xs">We're here to help!</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400 text-sm">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-300">
                    {error}
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Order Information (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.orderInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, orderInfo: e.target.value }))}
                    placeholder="Order # or product name"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Your Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="How can we help you today?"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
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
                  Send Message
                </motion.button>

                <p className="text-xs text-gray-500 text-center">
                  Our support team typically responds within 24 hours
                </p>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomerSupport;

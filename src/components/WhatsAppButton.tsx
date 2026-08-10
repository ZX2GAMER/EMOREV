import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const WhatsAppButton: React.FC = () => {
  const { settings } = useStore();

  const handleWhatsAppClick = () => {
    const phoneNumber = settings.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent('Hello EMOREV, I would like to ask about a product.');
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <style>{`
        @keyframes whatsappPulse {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
            transform: scale(1.05);
          }
        }
        .whatsapp-pulse {
          animation: whatsappPulse 2s ease-in-out infinite;
        }
      `}</style>

      <motion.button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-4 bg-[#25D366] text-white rounded-full shadow-2xl whatsapp-pulse group"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
      >
        <MessageCircle className="w-6 h-6" fill="currentColor" />
        <span className="font-bold text-sm hidden md:inline whitespace-nowrap">
          Chat on WhatsApp
        </span>
        
        {/* Tooltip for mobile */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap md:hidden pointer-events-none">
          Chat with us
          <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      </motion.button>
    </>
  );
};

export default WhatsAppButton;

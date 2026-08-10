import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800/50">
      {/* Racing stripe */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500" />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
              EMOREV
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Premium fashion meets futuristic racing aesthetics. Elevate your style with our curated collections.
            </p>
            <div className="flex gap-3">
              {['IG', 'TW', 'FB', 'YT'].map((label, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-400 hover:bg-gray-800 transition-colors text-xs font-bold"
                >
                  {label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Women', 'Men', 'Kids', 'Sale', 'New Arrivals'].map(link => (
                <li key={link}>
                  <a href="#store" className="text-gray-500 text-sm hover:text-orange-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {['Shipping Info', 'Returns & Exchanges', 'Size Guide', 'FAQ', 'Contact Us'].map(link => (
                <li key={link}>
                  <a href="#" className="text-gray-500 text-sm hover:text-orange-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-500 text-sm">
                <Mail className="w-4 h-4 text-orange-400" />
                support@emorev.com
              </li>
              <li className="flex items-center gap-2 text-gray-500 text-sm">
                <Phone className="w-4 h-4 text-orange-400" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-2 text-gray-500 text-sm">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5" />
                123 Fashion Avenue<br />New York, NY 10001
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © 2024 EMOREV Fashion. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-600 text-xs">
            <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  open: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

const Cart: React.FC<CartProps> = ({ open, onClose, onCheckout }) => {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, discount, total } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gray-950 border-l border-orange-500/20 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-orange-400" />
                <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Your cart is empty</p>
                  <p className="text-gray-600 text-sm mt-2">Start shopping to add items</p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.selectedSize}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 bg-gray-900/50 rounded-xl p-4 border border-gray-800/50"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm">{item.name}</h4>
                      <p className="text-gray-500 text-xs mt-1">Size: {item.selectedSize}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white font-bold text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="text-gray-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <p className="text-orange-400 font-bold">
                        ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-800 space-y-4">
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">You save</span>
                    <span className="text-green-400 font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg">
                  <span className="text-gray-300 font-semibold">Subtotal</span>
                  <span className="text-white font-bold">${total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl text-sm tracking-wider uppercase hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/25"
                >
                  Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-3 border border-gray-700 text-gray-400 rounded-xl text-sm hover:border-red-500/50 hover:text-red-400 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;

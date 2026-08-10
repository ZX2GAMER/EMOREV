import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Building, CheckCircle, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutProps {
  open: boolean;
  onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ open, onClose }) => {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState<'payment' | 'success'>('payment');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    bankName: '',
    accountNumber: '',
  });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
      clearCart();
    }, 2000);
  };

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setFormData(prev => ({ ...prev, expiry: value }));
  };

  const handleCvvInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData(prev => ({ ...prev, cvv: value }));
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-gray-950 border border-orange-500/20 rounded-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-950 z-10">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-400" />
                  Secure Checkout
                </h2>
                <p className="text-gray-500 text-sm mt-1">Complete your order securely</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {step === 'payment' ? (
              <form onSubmit={handleSubmit}>
                {/* Order Summary */}
                <div className="p-6 border-b border-gray-800">
                  <h3 className="text-white font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {items.map(item => (
                      <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          {item.name} × {item.quantity} ({item.selectedSize})
                        </span>
                        <span className="text-white font-medium">
                          ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t border-gray-800">
                    <span className="text-gray-300 font-semibold">Total</span>
                    <span className="text-orange-400 font-bold text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="p-6 border-b border-gray-800">
                  <h3 className="text-white font-semibold mb-4">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === 'card'
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                      }`}
                    >
                      <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-orange-400' : 'text-gray-500'}`} />
                      <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-orange-400' : 'text-gray-400'}`}>
                        Credit/Debit Card
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === 'bank'
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                      }`}
                    >
                      <Building className={`w-6 h-6 ${paymentMethod === 'bank' ? 'text-orange-400' : 'text-gray-500'}`} />
                      <span className={`text-sm font-medium ${paymentMethod === 'bank' ? 'text-orange-400' : 'text-gray-400'}`}>
                        Bank Transfer
                      </span>
                    </button>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="p-6 space-y-4">
                  {paymentMethod === 'card' ? (
                    <>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="text"
                            value={formData.cardNumber}
                            onChange={handleCardInput}
                            placeholder="1234 5678 9012 3456"
                            className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Cardholder Name</label>
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={(e) => setFormData(prev => ({ ...prev, cardName: e.target.value }))}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Expiry Date</label>
                          <input
                            type="text"
                            value={formData.expiry}
                            onChange={handleExpiryInput}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors text-center"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">CVV</label>
                          <div className="relative">
                            <input
                              type="password"
                              value={formData.cvv}
                              onChange={handleCvvInput}
                              placeholder="123"
                              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors text-center tracking-widest"
                              required
                            />
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        Your card information is encrypted and secure. We never store your full card details.
                      </p>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Bank Name</label>
                        <input
                          type="text"
                          value={formData.bankName}
                          onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                          placeholder="Your Bank Name"
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Account Number</label>
                        <input
                          type="text"
                          value={formData.accountNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                          placeholder="1234567890"
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                          required
                        />
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                          <Building className="w-4 h-4 text-orange-400" />
                          EMOREV Bank Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-400">Bank: Chase Bank</p>
                          <p className="text-gray-400">Account: 1234567890</p>
                          <p className="text-gray-400">Routing: 021000021</p>
                          <p className="text-gray-400">Reference: Your order number</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl text-sm tracking-wider uppercase hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: processing ? 1 : 1.02 }}
                    whileTap={{ scale: processing ? 1 : 0.98 }}
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Pay ${total.toFixed(2)}
                      </>
                    )}
                  </motion.button>

                  {/* Security badges */}
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                      <Lock className="w-3 h-3" />
                      SSL Secured
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                      <CreditCard className="w-3 h-3" />
                      PCI Compliant
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              /* Success Screen */
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                <p className="text-gray-400 mb-6">
                  Thank you for your order. You will receive a confirmation email shortly.
                </p>
                <div className="bg-gray-900/50 rounded-xl p-4 mb-6 border border-gray-800">
                  <p className="text-sm text-gray-400">Order Number</p>
                  <p className="text-white font-mono font-bold text-lg">#EMV-{Date.now().toString().slice(-8)}</p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl text-sm tracking-wider uppercase hover:from-orange-600 hover:to-red-600 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Shopping
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Checkout;

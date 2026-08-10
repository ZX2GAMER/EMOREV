import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '../data/products';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  total: number;
  discount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('emorev-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('emorev-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, size: string, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedSize: size }];
    });
  }, []);

  const removeFromCart = useCallback((id: string, size: string) => {
    setItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  }, []);

  const updateQuantity = useCallback((id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id && item.selectedSize === size ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
  const discount = items.reduce((sum, item) => {
    if (item.salePrice) {
      return sum + (item.price - item.salePrice) * item.quantity;
    }
    return sum;
  }, 0);
  const total = subtotal;

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, subtotal, total, discount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

import { useState, useMemo } from 'react';
import { CartContext } from './CartContext';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  function save(updated) {
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  }

  function isInCart(hotelId) {
    return items.some((item) => item.hotelId === hotelId);
  }

  function addToCart(item) {
    if (isInCart(item.hotelId)) return;
    save([...items, item]);
  }

  function removeFromCart(hotelId) {
    save(items.filter((item) => item.hotelId !== hotelId));
  }

  function clearCart() {
    save([]);
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + item.pricePerNight * item.nights,
    0
  );

  const value = useMemo(
    () => ({ items, isInCart, addToCart, removeFromCart, clearCart, totalPrice }),
    [items]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
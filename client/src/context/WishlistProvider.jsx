import { useState } from 'react';
import { WishlistContext } from './WishlistContext';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });

  function save(updated) {
    setItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  }

  function isInWishlist(type, id) {
    return items.some((item) => item.type === type && item.id === id);
  }

  function toggleWishlist(type, id, data) {
    if (isInWishlist(type, id)) {
      save(items.filter((item) => !(item.type === type && item.id === id)));
    } else {
      save([...items, { type, id, data }]);
    }
  }

  function clearWishlist() {
    save([]);
  }

  return (
    <WishlistContext.Provider value={{ items, isInWishlist, toggleWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
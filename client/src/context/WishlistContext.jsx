import { createContext, useContext } from 'react';

export const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}
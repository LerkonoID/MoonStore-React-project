import { useContext, useCallback } from 'react';
import { CartContext } from '../context/CartContext';

export function useAddToCart() {
  const { addToCart } = useContext(CartContext);
  return useCallback((product) => addToCart(product), [addToCart]);
}
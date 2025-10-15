import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export const useAddToCart = () => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return handleAddToCart;
};

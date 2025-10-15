import React from 'react';
import '../styles/ProductCard.css';
import { useAddToCart } from '../hooks/useAddToCart';

const ProductCard = ({ product }) => {
  const addToCart = useAddToCart();

  return (
    <div className="product-card">
      <div className="product-img-wrapper">
        <img src={product.image} alt={product.title} className="product-img" />
      </div>
      <h3 className="product-title">{product.title}</h3>
      <p className="product-price">${product.price}</p>
      <button
        className="add-btn"
        onClick={(e) => {
        e.stopPropagation(); 
        e.preventDefault();  
        addToCart(product);
        }}>
         Додати в корзину
      </button>
    </div>
  );
};

export default ProductCard;


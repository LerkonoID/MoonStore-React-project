import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';
import { useAddToCart } from '../hooks/useAddToCart';

const ProductCard = ({ product }) => {
  const addToCart = useAddToCart();

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-img-wrapper">
          <img
            src={product.image_url || product.image}
            alt={product.name || product.title}
            className="product-img"
          />
        </div>
        <h3 className="product-title">{product.name || product.title}</h3>
      </Link>

      <p className="product-price">${product.price}</p>

      <button
        className="add-btn"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          addToCart({
            id: product.id,
            title: product.name || product.title,
            price: product.price,
            image: product.image_url || product.image,
            category: product.category_name || product.category,
          });
        }}
      >
        Додати в корзину
      </button>
    </div>
  );
};

export default ProductCard;
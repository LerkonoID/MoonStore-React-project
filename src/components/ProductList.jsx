import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader.jsx';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import '../styles/ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter ? product.category === categoryFilter : true) &&
    (minPrice ? product.price >= parseFloat(minPrice) : true) &&
    (maxPrice ? product.price <= parseFloat(maxPrice) : true)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0;
  });

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="hero-section">
        <h1>Ласкаво просимо до <span>MoonStore</span> 🛍</h1>
        <p>Знайдіть найкращі товари за найкращими цінами</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Пошук товарів..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>🔍</button>
        </div>
      </div>

      <div className="content-wrapper">
        <aside className="filters">
          <h3>Фільтри</h3>
          <label>
            Мін. ціна:
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </label>
          <label>
            Макс. ціна:
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </label>
          <label>
            Сортування:
            <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
              <option value="">Без сортування</option>
              <option value="asc">Ціна ↑</option>
              <option value="desc">Ціна ↓</option>
            </select>
          </label>
          <label>
            Категорії:
            <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
              <option value="">Усі</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
        </aside>

        <div className="product-grid">
          {sortedProducts.map(product => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductList;

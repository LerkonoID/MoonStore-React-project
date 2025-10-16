import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { useAddToCart } from '../hooks/useAddToCart';
import { formatCurrency } from '../utils/format';

const PER_PAGE_DEFAULT = 8;

const ProductList = () => {
  const [items, setItems] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(PER_PAGE_DEFAULT);

  const addToCart = useAddToCart();

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    Promise.all([
      axios.get('https://fakestoreapi.com/products'),
      axios.get('https://fakestoreapi.com/products/categories'),
    ])
      .then(([prodRes, catRes]) => {
        if (cancelled) return;
        setItems(prodRes.data);
        setCategories(['all', ...catRes.data]);
      })
      .catch(() => !cancelled && setError('Не удалось загрузить товары'))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      const byCategory = category === 'all' || p.category === category;
      const byQuery = !q || p.title.toLowerCase().includes(q);
      return byCategory && byQuery;
    });
  }, [items, query, category]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  React.useEffect(() => {
    setPage(1);
  }, [query, category, perPage]);

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className="container" style={{ padding: 16 }}>
      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: '1fr 220px 140px',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <input
          type="search"
          placeholder="Пошук товарів…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,.12)',
            background: '#121418',
            color: '#fff',
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,.12)',
            background: '#121418',
            color: '#fff',
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? 'Усі категорії' : c}
            </option>
          ))}
        </select>

        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,.12)',
            background: '#121418',
            color: '#fff',
          }}
        >
          {[8, 12, 16, 24].map((n) => (
            <option key={n} value={n}>
              {n} на сторінку
            </option>
          ))}
        </select>
      </div>

      <div className="product-grid">
        {pageItems.map((p) => (
          <article key={p.id} className="product-card">
            <Link
              to={`/product/${p.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  height: 180,
                  display: 'grid',
                  placeItems: 'center',
                  background: '#1c1f25',
                  borderRadius: 8,
                }}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    maxHeight: 160,
                    maxWidth: '90%',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <h3 style={{ fontSize: 16, margin: '10px 0 6px' }}>{p.title}</h3>
            </Link>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontWeight: 700 }}>{formatCurrency(p.price)}</span>
              <button
                className="btn btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(p);
                }}
              >
                Додати
              </button>
            </div>
          </article>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 16,
        }}
      >
        <button
          className="btn btn-sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={safePage === 1}
        >
          ‹‹ Назад
        </button>
        <span style={{ opacity: 0.8 }}>
          Сторінка {safePage} з {totalPages} (всього {total})
        </span>
        <button
          className="btn btn-sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={safePage === totalPages}
        >
          Вперед ››
        </button>
      </div>
    </div>
  );
};

export default ProductList;
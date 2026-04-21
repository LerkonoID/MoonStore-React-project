import React from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import { useAddToCart } from '../hooks/useAddToCart';
import { formatCurrency } from '../utils/format';
import '../styles/ProductDetail.css';

const API_URL = 'http://localhost:5000';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = React.useState(null);
  const [related, setRelated] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const addToCart = useAddToCart();

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);

    axios.get(`${API_URL}/api/products/${id}`)
      .then(res => {
        if (cancelled) return;

        setProduct(res.data);

        return axios.get(`${API_URL}/api/products`).then(r => {
          if (cancelled) return;

        const filtered = r.data.filter(
        (p) => String(p.category_id) === String(res.data.category_id)
        );

          setRelated(filtered.slice(0, 8));
        });
      })
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <p>Товар не знайдено.</p>;

  return (
    <div className="container pd-page">
      <section className="pd-main">
        <div className="pd-gallery">
          <div className="pd-gallery__frame">
            <img src={product.image_url} alt={product.name} className="pd-thumb" />
          </div>
        </div>

        <div className="pd-info">
          <h1 className="pd-title">{product.name}</h1>
          <div className="pd-price">{formatCurrency(product.price)}</div>
          <p className="pd-desc">{product.description}</p>
          <div className="pd-meta">Категорія: {product.category_name}</div>

          <button
            className="btn btn-primary"
            onClick={() =>
              addToCart({
                id: product.id,
                title: product.name,
                price: product.price,
                image: product.image_url,
                category: product.category_name,
              })
            }
          >
            Додати в корзину
          </button>
        </div>
      </section>

      {related.length > 0 && (
        <section className="pd-related">
          <h2 className="section-title">Схожі товари</h2>

          <div className="related-grid">
            {related.map(item => (
              <article key={item.id} className="related-card">
                <Link to={`/product/${item.id}`} className="related-card__link">
                  <div className="related-card__imgwrap">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="related-card__thumb"
                    />
                  </div>
                  <h3 className="related-card__title">{item.name}</h3>
                </Link>

                <div className="related-card__row">
                  <span className="related-card__price">{formatCurrency(item.price)}</span>
                  <button
                    className="btn btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({
                        id: item.id,
                        title: item.name,
                        price: item.price,
                        image: item.image_url,
                        category: item.category_name,
                      });
                    }}
                  >
                    Додати
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
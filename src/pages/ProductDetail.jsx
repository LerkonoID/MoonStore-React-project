import React from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import { useAddToCart } from '../hooks/useAddToCart';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = React.useState(null);
  const [related, setRelated] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const addToCart = useAddToCart();

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);

    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then(res => {
        if (cancelled) return;
        setProduct(res.data);
        return axios.get(
          `https://fakestoreapi.com/products/category/${res.data.category}`
        ).then(r => {
          if (cancelled) return;
          const filtered = r.data.filter(p => p.id !== res.data.id);
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
            <img src={product.image} alt={product.title} className="pd-thumb" />
          </div>
        </div>

        <div className="pd-info">
          <h1 className="pd-title">{product.title}</h1>
          <div className="pd-price">${product.price}</div>
          <p className="pd-desc">{product.description}</p>
          <div className="pd-meta">Категорія: {product.category}</div>

          <button className="btn btn-primary" onClick={() => addToCart(product)}>
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
                      src={item.image}
                      alt={item.title}
                      className="related-card__thumb"
                    />
                  </div>
                  <h3 className="related-card__title">{item.title}</h3>
                </Link>

                <div className="related-card__row">
                  <span className="related-card__price">${item.price}</span>
                  <button
                    className="btn btn-sm"
                    onClick={(e) => { e.preventDefault(); addToCart(item); }}
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

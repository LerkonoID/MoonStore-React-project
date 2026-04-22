import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/format';
import '../styles/OrderDetail.css';

const API_URL = 'http://localhost:5000';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/api/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order detail:', err);
      setError('Не вдалося загрузити деталі замовлення.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Очікує', color: '#ff9800' },
      confirmed: { label: 'Підтверджено', color: '#2196f3' },
      shipped: { label: 'Відправлено', color: '#9c27b0' },
      delivered: { label: 'Доставлено', color: '#4caf50' },
      cancelled: { label: 'Скасовано', color: '#f44336' },
    };
    return statusMap[status] || { label: status, color: '#666' };
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="order-detail-page">
        <div className="error-message">
          ⚠️ {error}
          <Link to="/orders" className="btn btn-sm">
            Назад до замовлень
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="error-message">
          Замовлення не знайдено
          <Link to="/orders" className="btn btn-sm">
            Назад до замовлень
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusBadge(order.order_status);
  const orderDate = new Date(order.created_at).toLocaleDateString('uk-UA');
  const subtotal = order.items?.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0) || 0;
  const shipping = order.total_amount - subtotal;

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <div>
          <h1>Замовлення #{order.id}</h1>
          <p className="order-date">📅 {orderDate}</p>
        </div>
        <div 
          className="status-badge-large"
          style={{ backgroundColor: statusInfo.color }}
        >
          {statusInfo.label}
        </div>
      </div>

      <Link to="/orders" className="back-link">
        ← Назад до замовлень
      </Link>

      {/* Информация о доставке */}
      <section className="section delivery-info">
        <h2>Інформація про доставку</h2>
        <div className="info-grid">
          <div className="info-item">
            <strong>Адреса:</strong>
            <p>{order.delivery_address}</p>
          </div>
          <div className="info-item">
            <strong>Місто:</strong>
            <p>{order.delivery_city}</p>
          </div>
          <div className="info-item">
            <strong>Поштовий індекс:</strong>
            <p>{order.delivery_postal_code}</p>
          </div>
          <div className="info-item">
            <strong>Спосіб доставки:</strong>
            <p>{order.delivery_method}</p>
          </div>
        </div>
      </section>

      {/* Товари в замовленні */}
      <section className="section order-items">
        <h2>Товари в замовленні</h2>
        {order.items && order.items.length > 0 ? (
          <div className="items-table">
            <div className="items-header">
              <div className="col-image">Зображення</div>
              <div className="col-name">Назва товару</div>
              <div className="col-qty">Кількість</div>
              <div className="col-price">Ціна за одиницю</div>
              <div className="col-total">Сума</div>
            </div>

            {order.items.map(item => (
              <div key={item.id} className="items-row">
                <div className="col-image">
                  <img src={item.image_url} alt={item.name} />
                </div>
                <div className="col-name">
                  <Link to={`/product/${item.product_id}`}>
                    {item.name}
                  </Link>
                </div>
                <div className="col-qty">
                  {item.quantity} шт.
                </div>
                <div className="col-price">
                  {formatCurrency(item.unit_price)}
                </div>
                <div className="col-total">
                  <strong>{formatCurrency(item.unit_price * item.quantity)}</strong>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Немає товарів у замовленні</p>
        )}
      </section>

      {/* Сумма */}
      <section className="section order-summary">
        <h2>Підсумок</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <span>Сума товарів:</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div className="summary-item">
            <span>Доставка:</span>
            <strong>{formatCurrency(shipping)}</strong>
          </div>
          <div className="summary-item total">
            <span>Разом:</span>
            <strong className="total-price">{formatCurrency(order.total_amount)}</strong>
          </div>
        </div>
      </section>

      {/* Платеж */}
      {order.transactions && (
        <section className="section payment-info">
          <h2>Інформація про платіж</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>Спосіб оплати:</strong>
              <p className="payment-method">{order.transactions.payment_method}</p>
            </div>
            <div className="info-item">
              <strong>Статус платежу:</strong>
              <p className={`payment-status ${order.transactions.transaction_status}`}>
                {order.transactions.transaction_status}
              </p>
            </div>
            <div className="info-item">
              <strong>Сума платежу:</strong>
              <p>{formatCurrency(order.transactions.amount)}</p>
            </div>
            {order.transactions.created_at && (
              <div className="info-item">
                <strong>Дата платежу:</strong>
                <p>{new Date(order.transactions.created_at).toLocaleString('uk-UA')}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Кнопки действий */}
      <div className="action-buttons">
        <Link to="/orders" className="btn btn-primary">
          Назад до замовлень
        </Link>
        <Link to="/" className="btn btn-secondary">
          Продовжити покупки
        </Link>
      </div>
    </div>
  );
};

export default OrderDetail;
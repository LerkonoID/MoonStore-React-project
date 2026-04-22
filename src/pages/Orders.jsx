import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/format';
import '../styles/Orders.css';

const API_URL = 'http://localhost:5000';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Временно используем hardcoded user_id
  const userId = 9; // TODO: заменить на user?.id когда будет авторизация

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/api/orders/user/${userId}`);
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      
      if (err.response?.status === 404) {
        setOrders([]);
      } else {
        setError('Не вдалося загрузити замовлення. Спробуйте ще раз.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Фильтрировать заказы по статусу
  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.order_status === selectedStatus);

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

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Мої замовлення</h1>
        <Link to="/" className="btn btn-sm">
          ← На головну
        </Link>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={fetchOrders} className="btn btn-sm">
            Спробувати ще раз
          </button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="orders-empty">
          <h2>У вас немає замовлень</h2>
          <p>Розпочніть покупки в нашому магазині</p>
          <Link to="/" className="btn btn-primary">
            Перейти до каталогу
          </Link>
        </div>
      ) : (
        <>
          {/* Фильтр по статусу */}
          <div className="orders-filter">
            <label>Фільтр за статусом:</label>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-filter"
            >
              <option value="all">Усі замовлення</option>
              <option value="pending">Очікує</option>
              <option value="confirmed">Підтверджено</option>
              <option value="shipped">Відправлено</option>
              <option value="delivered">Доставлено</option>
              <option value="cancelled">Скасовано</option>
            </select>
          </div>

          {/* Список замовлень */}
          <div className="orders-list">
            {filteredOrders.map(order => {
              const statusInfo = getStatusBadge(order.order_status);
              const orderDate = new Date(order.created_at).toLocaleDateString('uk-UA');

              return (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <h3>Замовлення #{order.id}</h3>
                      <p className="order-date">📅 {orderDate}</p>
                    </div>
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: statusInfo.color }}
                    >
                      {statusInfo.label}
                    </div>
                  </div>

                  <div className="order-card-body">
                    <div className="order-info">
                      <p>
                        <strong>Адреса:</strong> {order.delivery_address}, {order.delivery_city}
                      </p>
                      <p>
                        <strong>Поштовий індекс:</strong> {order.delivery_postal_code}
                      </p>
                      <p>
                        <strong>Спосіб доставки:</strong> {order.delivery_method}
                      </p>
                    </div>

                    <div className="order-amount">
                      <p className="total-label">Сума:</p>
                      <p className="total-price">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>
                  </div>

                  <div className="order-card-footer">
                    <Link 
                      to={`/order/${order.id}`}
                      className="btn btn-sm"
                    >
                      Деталі замовлення →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredOrders.length === 0 && (
            <div className="no-results">
              <p>Немає замовлень з цим ст��тусом</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
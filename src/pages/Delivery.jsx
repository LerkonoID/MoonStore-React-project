import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "../styles/Delivery.css";

const STORAGE_KEY = 'deliveryForm';
const API_URL = 'http://localhost:5000';

// Временно захардкодим user_id (позже будет из UserContext)
const CURRENT_USER_ID = 9;

function formatUaPhone(input) {
  const digits = (input || '').replace(/\D/g, '');
  let res = '+380 ';
  const d = digits.startsWith('380') ? digits.slice(3) : digits;

  if (d.length === 0) return '+380 ';
  res += '(' + d.slice(0, 2);
  if (d.length >= 2) res += ') ';
  if (d.length >= 3) res += d.slice(2, 5);
  if (d.length >= 5) res += '-' + d.slice(5, 7);
  if (d.length >= 7) res += '-' + d.slice(7, 9);
  return res;
}

const Delivery = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);

  const [formData, setFormData] = useState({
    name: "",
    phone: "+380 ",
    email: "",
    address: "",
    city: "",
    postal_code: "",
    payment: "cash",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Загрузить сохранённые данные из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch {}
    }
  }, []);

  // Сохранять данные в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Проверить если корзина пуста
  if (!cartItems.length) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Корзина пуста</h2>
        <p>Додайте товари перед оформленням замовлення</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, phone: formatUaPhone(value) }));
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Вкажіть ім'я";
    if (!/^\+380\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/.test(formData.phone))
      next.phone = "Телефон у форматі +380 (XX) XXX-XX-XX";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = "Некоректний email";
    if (!formData.address.trim() || formData.address.trim().length < 5)
      next.address = "Вкажіть адресу (мінімум 5 символів)";
    if (!formData.city.trim()) next.city = "Вкажіть місто";
    if (!formData.postal_code.trim()) next.postal_code = "Вкажіть індекс";
    
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    setServerError(null);

    try {
      // Подготовить данные заказа
      const orderData = {
        buyer_id: CURRENT_USER_ID,
        delivery_address: formData.address,
        delivery_city: formData.city,
        delivery_postal_code: formData.postal_code,
        delivery_method: formData.delivery_method || "Нова Пошта",
        payment_method: formData.payment,
        items: cartItems.map(item => ({
        product_id: Number(item.id),
        quantity: Number(item.quantity),
      }))
      };

      console.log("📤 Отправляю заказ:", orderData);

      // Отправить на backend
      const response = await axios.post(`${API_URL}/api/orders`, orderData);

      console.log("✅ Заказ создан:", response.data);

      // Очистить корзину
      clearCart();

      // Очистить форму из localStorage
      localStorage.removeItem(STORAGE_KEY);

      // Перенаправить на Success
      navigate("/success");

    } catch (error) {
      console.error("❌ Ошибка при создании заказа:", error);
      
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else if (error.message === 'Network Error') {
        setServerError("Нема підключення до сервера. Переконайтесь що backend запущений на http://localhost:5000");
      } else {
        setServerError("Помилка при оформленні замовлення. Спробуйте ще раз.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="delivery-page">
      <h2>Оформлення замовлення</h2>

      {/* Показать сумму товаров */}
      <div style={{ 
        marginBottom: "20px", 
        padding: "10px",
        background: "#1c1f25",
        borderRadius: "8px",
        color: "#ccc"
      }}>
        <p>Товарів у корзині: <b>{cartItems.length}</b></p>
        <p>Сума: <b>${Number(totalPrice || 0).toFixed(2)}</b></p>
      </div>

      {/* Показать ошибки сервера */}
      {serverError && (
        <div style={{
          marginBottom: "20px",
          padding: "10px",
          background: "#8b3a3a",
          color: "#fca5a5",
          borderRadius: "8px",
          border: "1px solid #fca5a5"
        }}>
          ⚠️ {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="delivery-form" noValidate>
        <label>
          Прізвище та ім'я:
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            disabled={isLoading}
          />
          {errors.name && <small style={{color:'#fca5a5'}}>{errors.name}</small>}
        </label>

        <label>
          Телефон:
          <input
            type="tel"
            name="phone"
            required
            inputMode="numeric"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+380 (XX) XXX-XX-XX"
            aria-invalid={!!errors.phone}
            disabled={isLoading}
          />
          {errors.phone && <small style={{color:'#fca5a5'}}>{errors.phone}</small>}
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            disabled={isLoading}
          />
          {errors.email && <small style={{color:'#fca5a5'}}>{errors.email}</small>}
        </label>

        <label>
          Місто:
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="Київ, Харків, Львів..."
            aria-invalid={!!errors.city}
            disabled={isLoading}
          />
          {errors.city && <small style={{color:'#fca5a5'}}>{errors.city}</small>}
        </label>

        <label>
          Поштовий індекс:
          <input
            type="text"
            name="postal_code"
            required
            value={formData.postal_code}
            onChange={handleChange}
            placeholder="01001"
            aria-invalid={!!errors.postal_code}
            disabled={isLoading}
          />
          {errors.postal_code && <small style={{color:'#fca5a5'}}>{errors.postal_code}</small>}
        </label>

        <label>
          Адреса доставки:
          <textarea
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="Вулиця, будинок, квартира..."
            aria-invalid={!!errors.address}
            disabled={isLoading}
          />
          {errors.address && <small style={{color:'#fca5a5'}}>{errors.address}</small>}
        </label>

        <label>
          Спосіб доставки:
          <select
            name="delivery_method"
            value={formData.delivery_method || "Нова Пошта"}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="Нова Пошта">Нова Пошта</option>
            <option value="Укрпошта">Укрпошта</option>
            <option value="self_pickup">Самовивіз</option>
          </select>
        </label>

        <label>
          Спосіб оплати:
          <select
            name="payment"
            value={formData.payment}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="cash">Готівка при отриманні</option>
            <option value="credit_card">Карта банку</option>
            <option value="paypal">PayPal</option>
          </select>
        </label>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? "⏳ Обробка..." : "✅ Підтвердити замовлення"}
        </button>
      </form>
    </div>
  );
};

export default Delivery;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Delivery.css";

const STORAGE_KEY = 'deliveryForm';

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
  const [formData, setFormData] = useState({
    name: "",
    phone: "+380 ",
    email: "",
    address: "",
    payment: "cash",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

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
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Замовлення:", formData);
    navigate("/success");
  };

  return (
    <div className="delivery-page">
      <h2>Оформлення замовлення</h2>
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
          />
          {errors.email && <small style={{color:'#fca5a5'}}>{errors.email}</small>}
        </label>

        <label>
          Адреса доставки:
          <textarea
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            aria-invalid={!!errors.address}
          />
          {errors.address && <small style={{color:'#fca5a5'}}>{errors.address}</small>}
        </label>

        <label>
          Спосіб оплати:
          <select
            name="payment"
            value={formData.payment}
            onChange={handleChange}
          >
            <option value="cash">Готівка при отриманні</option>
            <option value="card">Карта банку</option>
            <option value="cod">Післяплати</option>
          </select>
        </label>

        <button type="submit" className="submit-btn">
          Підтвердити замовлення
        </button>
      </form>
    </div>
  );
};

export default Delivery;
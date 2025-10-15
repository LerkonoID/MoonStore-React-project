import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Delivery.css";

const Delivery = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    payment: "cash",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Заказ:", formData);
    navigate("/success");
  };

  return (
    <div className="delivery-page">
      <h2>Оформлення замовлення</h2>
      <form onSubmit={handleSubmit} className="delivery-form">
        <label>
          Призвище та ім'я:
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Телефон:
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Адреса доставки:
          <textarea
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
          />
        </label>

        <label>
          Спосіб оплаты:
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
          Подтвердіть замовлення
        </button>
      </form>
    </div>
  );
};

export default Delivery;

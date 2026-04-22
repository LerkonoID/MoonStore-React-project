import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Success = () => {
  useEffect(() => {
    // Очистить сохранённую форму
    localStorage.removeItem('deliveryForm');
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
      <h1>✅ Дякуємо за замовлення!</h1>
      <p style={{ fontSize: "16px", opacity: 0.8 }}>
        Ваше замовлення успішно оформлено. 
        <br />
        Незабаром ми зв'яжемося з вами за телефоном для уточнення деталей.
      </p>
      
      <div style={{ marginTop: "30px" }}>
        <Link 
          to="/" 
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            marginRight: "10px"
          }}
        >
          На головну
        </Link>
        
        <Link 
          to="/orders" 
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#2196F3",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none"
          }}
        >
          Мої замовлення
        </Link>
      </div>
    </div>
  );
};

export default Success;
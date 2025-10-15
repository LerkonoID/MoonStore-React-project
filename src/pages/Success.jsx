import React from "react";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Дякуємо за замовлення!</h2>
      <p>Ваше замовлення успішно оформлено, незабаром ми зв'яжемося з вами.</p>
      <Link to="/">Повернутися на головну</Link>
    </div>
  );
};

export default Success;
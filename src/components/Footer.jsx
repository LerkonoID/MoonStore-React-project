import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTelegramPlane } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("🚀");
  };

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__logo">
          <h2>MoonStore</h2>
          <p>Кращі товари - для кращих людей</p>
        </div>

        <div className="footer__nav">
          <h3>Меню</h3>
          <ul>
            <li><Link to="/">Головна</Link></li>
            <li><Link to="/about">Про нас</Link></li>
            <li><Link to="/cart">Корзина</Link></li>
          </ul>
        </div>

        <div className="footer__contacts">
          <h3>Контакти</h3>
          <p>🚚 Вантажні перевезення до 2х тонн!</p>
          <p>📞 +380 98 538 51 38</p>
          <p>✉ moonshopinfo@gmail.com</p>
          <p>📍 Київ, Україна</p>
        </div>

        <div className="footer__subscribe">
          <h3>Роззсилка</h3>
          <form onSubmit={handleSubscribe}>
            <input type="email" placeholder="Ваш email" required />
            <button type="submit">Відправити</button>
          </form>
          <div className="footer__social">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTelegramPlane /></a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} MoonStore. Усі права захищені.</p>
      </div>
    </footer>
  );
};

export default Footer;

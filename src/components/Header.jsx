import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import "../styles/Header.css";

const ROLE_LABELS = {
  admin: '👑 Admin',
  operator: '🔧 Operator',
  seller: '🏪 Seller',
  buyer: '👤',
  guest: '👁 Guest',
};

const Header = () => {
  const { totalItems } = useContext(CartContext);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">MoonStore</Link>
      </div>

      <nav className="header__nav">
        <Link to="/">Головна</Link>
        <Link to="/about">Про нас</Link>
        {user && <Link to="/orders">Замовлення</Link>}
        {user && (user.role === 'admin' || user.role === 'operator') && (
          <Link to="/admin">Адмін</Link>
        )}
      </nav>

      <div className="header__right">
        {user ? (
          <div className="header__user">
            <span className="header__role">{ROLE_LABELS[user.role] || user.role}</span>
            <span className="header__username">{user.username}</span>
            <button className="header__logout" onClick={handleLogout}>
              Вийти
            </button>
          </div>
        ) : (
          <div className="header__auth">
            <Link to="/login" className="header__auth-link">Вхід</Link>
            <Link to="/register" className="header__auth-link header__auth-link--register">
              Реєстрація
            </Link>
          </div>
        )}
        <Link to="/cart" className="header__cart">
          🛒 {totalItems}
        </Link>
      </div>
    </header>
  );
};

export default Header;
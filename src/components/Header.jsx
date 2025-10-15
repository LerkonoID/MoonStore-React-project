import React, {useContext} from "react";
import { Link } from "react-router-dom";
import {CartContext} from "../context/CartContext";
import "../styles/Header.css";

const Header = () => {
 const {totalItems} = useContext(CartContext)

 return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">MoonStore</Link>
      </div>
      
      <nav className="header__nav">
        <Link to="/">Головна</Link>
        <Link to="/about">Про нас</Link>
      </nav>

      <div className="header__right">
        <Link to="/cart" className="header__cart">
          🛒 {totalItems}
        </Link>
      </div>
    </header>
  );
};

export default Header
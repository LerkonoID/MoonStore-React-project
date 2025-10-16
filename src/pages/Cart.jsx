import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import { formatCurrency } from '../utils/format';
import '../styles/Cart.css';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    updateQuantity,
    totalItems,
    totalPrice
  } = useContext(CartContext);

  const subtotal = Number(totalPrice || 0);

  const handleChangeQty = (id, next) => {
    const current = cartItems.find(i => i.id === id)?.quantity || 1;
    updateQuantity(id, next - current);
  };

  if (!cartItems.length) {
    return (
      <div className="cart-empty">
        <h2>Корзина пуста</h2>
        <p>Перейдите в каталог, чтобы добавить товары.</p>
        <Link to="/" className="cart-summary__checkout" style={{ display:'inline-block', marginTop: 12 }}>В каталог</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <section aria-label="Cart items" className="cart-list" role="list">
        {cartItems.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onChangeQty={handleChangeQty}
            onRemove={removeFromCart}
          />
        ))}
        <div style={{ textAlign: 'right', marginTop: 8, opacity: .8 }}>
          Промежуточный итог: <b>{formatCurrency(subtotal)}</b>
        </div>
      </section>

      <CartSummary
        subtotal={subtotal}
        totalItems={totalItems}
        onClear={clearCart}
      />
    </div>
  );
};

export default Cart;
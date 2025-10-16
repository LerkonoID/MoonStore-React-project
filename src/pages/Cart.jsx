import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    updateQuantity,
    totalItems,
    totalPrice
  } = useContext(CartContext);

  if (cartItems.length === 0) {
    return <h2>Корзина пуста</h2>;
  }

  const total = Number(totalPrice);

  return (
    <div>
      <h2>Ваша корзина</h2>
      <p>Товаров: {totalItems}</p>
      <p>Общая сумма: {formatCurrency(total)}</p>

      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            {item.title} — {formatCurrency(item.price)} × {item.quantity}
            <div>
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              <button onClick={() => removeFromCart(item.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>

      <button onClick={clearCart}>Очистить корзину</button>

      <Link to="/delivery">
        <button>Оформить заказ</button>
      </Link>
    </div>
  );
};

export default Cart;
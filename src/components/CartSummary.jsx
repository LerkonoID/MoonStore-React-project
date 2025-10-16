import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export default function CartSummary({ subtotal, totalItems, onClear }) {
  const FREE_SHIPPING_THRESHOLD = 100; // USD
  const SHIPPING_COST = 7.99;

  const eligibleForFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = eligibleForFree ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const left = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <aside className="cart-summary">
      <h2 className="cart-summary__title">Итоги заказа</h2>

      <div className="cart-summary__row">
        <span>Товары ({totalItems})</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="cart-summary__ship">
        <div className="cart-summary__ship-head">
          <span>Доставка</span>
          <span>{shipping === 0 ? 'Бесплатно' : formatCurrency(shipping)}</span>
        </div>

        <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <div className="progress__bar" style={{ width: `${progress}%` }} />
        </div>

        <p className="cart-summary__hint">
          {eligibleForFree
            ? 'Поздравляем! Доставка бесплатно.'
            : <>Добавьте ещё {formatCurrency(left)} для бесплатной доставки</>}
        </p>
      </div>

      <div className="cart-summary__total">
        <span>Итого</span>
        <span>{formatCurrency(total)}</span>
      </div>

      <Link to="/delivery" className="cart-summary__checkout">
        Перейти к оформлению
      </Link>

      <button type="button" className="cart-summary__clear" onClick={onClear}>
        Очистить корзину
      </button>

      <Link className="cart-summary__continue" to="/">Продолжить покупки</Link>
    </aside>
  );
}
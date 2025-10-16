import React from 'react';
import QuantityStepper from './QuantityStepper';
import { formatCurrency } from '../utils/format';

export default function CartItem({ item, onChangeQty, onRemove }) {
  const lineTotal = Number(item.price) * Number(item.quantity || 1);

  return (
    <article className="cart-item" role="listitem">
      <div className="cart-item__media">
        <img src={item.image} alt={item.title} loading="lazy" />
      </div>

      <div className="cart-item__body">
        <h3 className="cart-item__title">{item.title}</h3>
        <div className="cart-item__meta">
          <span className="cart-item__price">{formatCurrency(item.price)}</span>
        </div>
        <div className="cart-item__controls">
          <QuantityStepper
            value={item.quantity}
            onChange={(q) => onChangeQty(item.id, q)}
            aria-label={`Quantity for ${item.title}`}
          />
          <button className="cart-item__remove" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.title}`}>
            Удалить
          </button>
        </div>
      </div>

      <div className="cart-item__sum">
        <span>{formatCurrency(lineTotal)}</span>
      </div>
    </article>
  );
}
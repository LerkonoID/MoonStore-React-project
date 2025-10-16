import React from 'react';

export default function QuantityStepper({ value, min = 1, max = 99, onChange, 'aria-label': ariaLabel = 'Quantity' }) {
  const clamp = (n) => Math.max(min, Math.min(max, n));

  const dec = () => onChange(clamp(value - 1));
  const inc = () => onChange(clamp(value + 1));

  const onInput = (e) => {
    const n = Number(e.target.value.replace(/\D/g, '')) || min;
    onChange(clamp(n));
  };

  return (
    <div className="qty">
      <button type="button" 
      className="qty__btn" 
      aria-label="Decrease quantity" 
      onClick={dec} 
      disabled={value <= min}>−
    </button>

    <input className="qty__input" 
      inputMode="numeric" 
      aria-label={ariaLabel} 
      value={value} 
      onChange={onInput} 
    />
    <button type="button" 
      className="qty__btn" 
      aria-label="Increase quantity"
       onClick={inc} disabled={value >= max}>+
    </button>
    </div>
  );
}
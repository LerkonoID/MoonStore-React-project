import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ maxWidth: 720, margin: '40px auto', padding: 20 }}>
    <h1>404 — Сторінку не знайдено</h1>
    <p>На жаль, такої сторінки не існує.</p>
    <Link to="/">На головну</Link>
  </div>
);

export default NotFound;
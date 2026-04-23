import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import '../styles/Auth.css';

const API_URL = 'http://localhost:5000';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    city: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!formData.username.trim()) next.username = "Вкажіть ім'я користувача";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = 'Некоректний email';
    if (formData.password.length < 6) next.password = 'Пароль мінімум 6 символів';
    if (formData.password !== formData.confirmPassword)
      next.confirmPassword = 'Паролі не збігаються';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setIsLoading(true);

    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...payload } = formData;
      const { data } = await axios.post(`${API_URL}/api/auth/register`, payload);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Помилка реєстрації. Спробуйте ще раз.';
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Реєстрація</h2>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {serverError && <div className="auth-error">⚠️ {serverError}</div>}

        <label>
          Ім'я користувача:
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="username"
          />
          {errors.username && <small style={{ color: '#fca5a5' }}>{errors.username}</small>}
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="email"
          />
          {errors.email && <small style={{ color: '#fca5a5' }}>{errors.email}</small>}
        </label>

        <label>
          Повне ім'я (необов'язково):
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="name"
          />
        </label>

        <label>
          Телефон (необов'язково):
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="tel"
          />
        </label>

        <label>
          Місто (необов'язково):
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="address-level2"
          />
        </label>

        <label>
          Пароль:
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="new-password"
          />
          {errors.password && <small style={{ color: '#fca5a5' }}>{errors.password}</small>}
        </label>

        <label>
          Підтвердіть пароль:
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <small style={{ color: '#fca5a5' }}>{errors.confirmPassword}</small>
          )}
        </label>

        <button type="submit" className="auth-submit" disabled={isLoading}>
          {isLoading ? '⏳ Реєстрація...' : 'Зареєструватись'}
        </button>
      </form>

      <p className="auth-footer">
        Вже є акаунт?{' '}
        <Link to="/login">Увійти</Link>
      </p>
    </div>
  );
};

export default Register;

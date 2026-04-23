import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import '../styles/Auth.css';

const API_URL = 'http://localhost:5000';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, formData);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Помилка входу. Спробуйте ще раз.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Вхід до акаунту</h2>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {error && <div className="auth-error">⚠️ {error}</div>}

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
            autoComplete="current-password"
          />
        </label>

        <button type="submit" className="auth-submit" disabled={isLoading}>
          {isLoading ? '⏳ Вхід...' : 'Увійти'}
        </button>
      </form>

      <p className="auth-footer">
        Немає акаунту?{' '}
        <Link to="/register">Зареєструватись</Link>
      </p>
    </div>
  );
};

export default Login;

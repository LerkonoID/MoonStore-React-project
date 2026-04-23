import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Loader from '../components/Loader';
import '../styles/Admin.css';

const API_URL = 'http://localhost:5000';

const ROLE_OPTIONS = ['admin', 'operator', 'seller', 'buyer', 'guest'];

const Admin = () => {
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Guard: only admin and operator can access
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin' && user.role !== 'operator') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'operator')) {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          setError(null);
          const { data } = await axios.get(`${API_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(data);
        } catch (err) {
          setError(err.response?.data?.message || 'Не вдалося завантажити користувачів');
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [user, token]);

  const handleRoleChange = async (userId, newRole) => {
    if (user.role !== 'admin') return;
    setUpdatingId(userId);
    setSuccessMsg(null);
    try {
      await axios.put(
        `${API_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u))
      );
      setSuccessMsg('Роль оновлено');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка оновлення ролі');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    if (user.role !== 'admin') return;
    setUpdatingId(userId);
    setSuccessMsg(null);
    try {
      await axios.put(
        `${API_URL}/api/admin/users/${userId}/status`,
        { is_active: currentStatus ? 0 : 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId ? { ...u, is_active: currentStatus ? 0 : 1 } : u
        )
      );
      setSuccessMsg('Статус оновлено');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка оновлення статусу');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'operator')) return null;
  if (loading) return <Loader />;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Адмін панель</h1>
        <span className="admin-badge">
          {user.role === 'admin' ? '👑 Адміністратор' : '🔧 Оператор'}
        </span>
      </div>

      {error && (
        <div className="admin-error">⚠️ {error}</div>
      )}
      {successMsg && (
        <div className="admin-success">✅ {successMsg}</div>
      )}

      <section className="admin-section">
        <h2>Користувачі ({users.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Активний</th>
                {user.role === 'admin' && <th>Дії</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id} className={!u.is_active ? 'admin-row--inactive' : ''}>
                  <td>{u.user_id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    {user.role === 'admin' ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.user_id, e.target.value)}
                        disabled={updatingId === u.user_id || u.user_id === user.user_id}
                        className="admin-select"
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    ) : (
                      u.role
                    )}
                  </td>
                  <td>
                    <span className={u.is_active ? 'status-active' : 'status-inactive'}>
                      {u.is_active ? 'Так' : 'Ні'}
                    </span>
                  </td>
                  {user.role === 'admin' && (
                    <td>
                      <button
                        className="admin-btn"
                        onClick={() => handleToggleActive(u.user_id, u.is_active)}
                        disabled={updatingId === u.user_id || u.user_id === user.user_id}
                      >
                        {u.is_active ? 'Деактивувати' : 'Активувати'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Admin;

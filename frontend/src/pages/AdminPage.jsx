import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiFetch } from '../api/api';
import PrivateRoute from '../components/PrivateRoute';

// Страница админа: список пользователей, возможность удалить и изменить флаг администратора
export default function AdminPage() {
  const user = useSelector(s => s.auth.user);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    if (!user.is_administrator) return;
    fetchUsers();
  }, [user]);

  async function fetchUsers() {
    try {
      const data = await apiFetch('/auth/admin/users/');
      setUsers(data);
    } catch (err) {
      setError(err.payload || err.message);
    }
  }

  async function removeUser(id) {
    if (!window.confirm('Удалить пользователя?')) return;
    try {
      await apiFetch(`/auth/admin/users/${id}/`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Ошибка: ' + (err.payload || err.message));
    }
  }

  async function toggleAdmin(u) {
    try {
      const res = await apiFetch(`/auth/admin/users/${u.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_administrator: !u.is_administrator })
      });
      setUsers(users.map(x => x.id === u.id ? res : x));
    } catch (err) {
      alert('Ошибка: ' + (err.payload || err.message));
    }
  }

  // Рендерим только если авторизован и админ
  return (
    <PrivateRoute adminOnly={true}>
      <div>
        <h2>Административная панель</h2>
        {error && <div style={{ color: 'red' }}>{JSON.stringify(error)}</div>}
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Логин</th>
              <th>Полное имя</th>
              <th>Email</th>
              <th>Админ</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.full_name}</td>
                <td>{u.email}</td>
                <td>{u.is_administrator ? 'Да' : 'Нет'}</td>
                <td>
                  <button onClick={() => toggleAdmin(u)} style={{ marginRight: 6 }}>
                    {u.is_administrator ? 'Убрать админ' : 'Сделать админом'}
                  </button>
                  <button onClick={() => removeUser(u.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PrivateRoute>
  );
}
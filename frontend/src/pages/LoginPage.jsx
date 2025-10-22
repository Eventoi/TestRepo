import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/authReducer';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [form, setForm] = useState({ username:'', password:'' });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await dispatch(login(form));
      // при входе, редирект на /storage (или /admin если админ)
      // приходит user из состояния store. Запрашивается me снова
      nav('/storage');
    } catch (err) {
      setError(err.payload?.detail || err.message || 'Ошибка при входе');
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Вход</h2>
      <form onSubmit={submit}>
        <div>
          <label>Логин</label><br />
          <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
        </div>
        <div>
          <label>Пароль</label><br />
          <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Войти</button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}
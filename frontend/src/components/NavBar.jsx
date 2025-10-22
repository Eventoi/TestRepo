import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authReducer';

// показывает разные ссылки в зависимости от аутентификации
export default function NavBar() {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const doLogout = async () => {
    await dispatch(logout());
    nav('/');
  };

  return (
    <nav style={{ padding: '8px 16px', borderBottom: '1px solid #ddd' }}>
      <Link to="/" style={{ marginRight: 12 }}>My Cloud</Link>
      {user ? (
        <>
          <Link to="/storage" style={{ marginRight: 12 }}>Хранилище</Link>
          {user.is_administrator && <Link to="/admin" style={{ marginRight: 12 }}>Админ</Link>}
          <span style={{ marginRight: 12 }}>Привет, {user.full_name || user.username}</span>
          <button onClick={doLogout}>Выход</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: 12 }}>Вход</Link>
          <Link to="/register">Регистрация</Link>
        </>
      )}
    </nav>
  );
}
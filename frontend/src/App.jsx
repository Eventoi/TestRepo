import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import StoragePage from './pages/StoragePage';
import { useDispatch } from 'react-redux';
import { fetchMe } from './store/authReducer';

// Основа. Задаёт маршруты
export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // получается информация о текущем пользователе, если есть сессия
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <div>
      <NavBar />
      <main style={{ padding: '16px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/storage" element={<StoragePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
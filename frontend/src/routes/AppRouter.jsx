import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../features/auth/authSlice';

import LoginPage from '../features/auth/LoginPage';
import FilesList from '../features/files/FilesList';

const AppRouter = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  // При загрузке приложения пробуем получить пользователя (если сессия есть)
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/" element={user ? <FilesList /> : <Navigate to="/login" />} />
        {/* Тут позже можно добавить маршруты */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
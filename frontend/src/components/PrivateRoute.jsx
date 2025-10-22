// Небольшой компонент-обёртка. В React Router v6 используется логика в элементах,
// поэтому это просто вспомогательная функция возвращающая либо элемент, либо Redirect
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, adminOnly=false }) {
  const user = useSelector(s => s.auth.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !user.is_administrator) {
    return <Navigate to="/" replace />;
  }
  return children;
}
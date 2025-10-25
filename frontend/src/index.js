// Точка входа в React-приложение
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import App from './App';

// Создание корня приложения
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендер приложения с Redux и Router
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

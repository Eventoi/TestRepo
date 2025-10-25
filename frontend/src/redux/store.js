// Хранилище Redux. Состояние всего приложения
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import filesReducer from './filesSlice';
import usersReducer from './usersSlice';

// Создание трех редьюсеров
const store = configureStore({
  reducer: {
    auth: authReducer,      // для авторизации и данных пользователя
    files: filesReducer,    // для списка файлов
    users: usersReducer     // для списка пользователей (админ)
  }
});

export default store;

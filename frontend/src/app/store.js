import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // авторизация
    // сюда потом можно добавить редьюсеры для файлов и др.
  },
});

export default store;
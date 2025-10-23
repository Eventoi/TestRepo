import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

// Асинхронный экшен для логина
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await api.login(username, password);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Ошибка входа');
    }
  }
);

// Асинхронный экшен для получения информации о пользователе (me)
export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, thunkAPI) => {
    try {
      const response = await api.me();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Ошибка получения данных');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
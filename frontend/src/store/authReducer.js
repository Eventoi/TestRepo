import { apiFetch } from '../api/api';

// начальное состояние
const initialState = {
  user: null,  // объект пользователя {id, username, full_name, email, is_administrator, storage_rel_path}
  loading: false,
  error: null
};

// action types
const START = 'auth/START';
const SUCCESS = 'auth/SUCCESS';
const FAIL = 'auth/FAIL';
const LOGOUT = 'auth/LOGOUT';

// редьюсер
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case START:
      return { ...state, loading: true, error: null };
    case SUCCESS:
      return { ...state, loading: false, user: action.payload, error: null };
    case FAIL:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT:
      return { ...state, user: null };
    default:
      return state;
  }
}

// попробовать получить текущего юзера (me)
export const fetchMe = () => async dispatch => {
  dispatch({ type: START });
  try {
    const data = await apiFetch('/auth/me/');
    dispatch({ type: SUCCESS, payload: data });
  } catch (err) {
    // если нет сессии — просто оставляем user null, без ошибки
    dispatch({ type: FAIL, payload: null });
  }
};

// регистрация
export const register = ({ username, full_name, email, password }) => async dispatch => {
  dispatch({ type: START });
  try {
    await apiFetch('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ username, full_name, email, password })
    });
    // по ТЗ достаточно предложить логинить
    dispatch({ type: SUCCESS, payload: null });
  } catch (err) {
    dispatch({ type: FAIL, payload: err.payload || err.message });
    throw err;
  }
};

// логин
export const login = ({ username, password }) => async dispatch => {
  dispatch({ type: START });
  try {
    const data = await apiFetch('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    // backend возвращает user в data.user
    dispatch({ type: SUCCESS, payload: data.user });
  } catch (err) {
    dispatch({ type: FAIL, payload: err.payload || err.message });
    throw err;
  }
};

// логаут
export const logout = () => async dispatch => {
  try {
    await apiFetch('/auth/logout/', { method: 'POST' });
  } catch (e) {
    // игнорируем ошибки logout
  }
  dispatch({ type: LOGOUT });
};
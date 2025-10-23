const API_URL = 'http://localhost:8000/api'; // адрес backend-а

// вспомогательная функция для fetch с сессией (cookies)
async function fetchWithCredentials(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // важно для сессий
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || 'Ошибка запроса');
  }
  return response.json();
}

export default {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/users/login/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || 'Ошибка логина');
    }
    return response.json();
  },

  me: () => fetchWithCredentials(`${API_URL}/users/me/`),

  logout: () =>
    fetchWithCredentials(`${API_URL}/users/logout/`, { method: 'POST' }),
};
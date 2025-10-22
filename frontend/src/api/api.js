// простая обёртка для fetch (включает cookies). Возвращает JSON или ошибку
const API_BASE = process.env.REACT_APP_API_BASE || '/api';

async function parseJSON(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch (e) {
    return text;
  }
}

export async function apiFetch(path, options = {}) {
  const url = API_BASE + path;
  const opts = {
    credentials: 'include', // сессии cookie
    headers: {
      Accept: 'application/json',
      // Content-Type добавляется только если body — не FormData
      ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {})
    },
    ...options
  };
  const res = await fetch(url, opts);
  const data = await parseJSON(res);
  if (!res.ok) {
    const err = new Error(data?.detail || 'Ошибка сети');
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api',
  timeout: 15_000,
});

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
};

export const saveSession = (token) => {
  sessionStorage.setItem('token', token);
  setAuthToken(token);
};

export const clearSession = () => {
  sessionStorage.removeItem('token');
  setAuthToken(null);
};

export const parseJwt = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const getSession = () => {
  const token = sessionStorage.getItem('token');
  const payload = token ? parseJwt(token) : null;
  if (!token || !payload || payload.exp * 1000 <= Date.now()) {
    clearSession();
    return null;
  }
  setAuthToken(token);
  return { token, payload };
};

import axios from 'axios';

// Laravel server ka root URL (.env -> VITE_API_URL)
export const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';

// Har API call is instance se hogi — baseURL mein /api prefix already laga hai
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { Accept: 'application/json' },
});

// Request interceptor: agar token saved hai to har request ke saath bhejo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: token expire/invalid ho jaye (401) to login par bhej do
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Error ko readable message mein badalne ka helper — har page yehi use karta hai
export function apiError(error) {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 404) {
      return 'Endpoint nahi mila (404) — yeh route abhi Laravel mein banana hai! PRACTICE-GUIDE.md dekho.';
    }
    if (status === 401) {
      return 'Unauthorized (401) — token missing ya invalid hai. Login kar ke try karo.';
    }
    if (data?.message) return data.message;
    return `Server error (${status})`;
  }
  return 'Server se connection nahi ho raha — kya `php artisan serve` chal raha hai?';
}

// Laravel 422 validation errors ({ errors: { field: [msgs] } }) ko flat list banao
export function validationErrors(error) {
  const errors = error.response?.data?.errors;
  if (!errors) return [];
  return Object.values(errors).flat();
}

export default api;

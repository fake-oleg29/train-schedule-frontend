import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const PUBLIC_ROUTES = ['/auth/login', '/auth/register'];

api.interceptors.request.use(
  (config) => {
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      config.url?.includes(route)
    );

    if (!isPublicRoute) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      error.config?.url?.includes(route)
    );

    if (error.response?.status === 401 && !isPublicRoute) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
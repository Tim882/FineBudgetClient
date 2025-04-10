import axios from 'axios';
import authService from '../services/auth.service';

const api = axios.create({
  baseURL: 'http://your-api-url.com/api'
});

api.interceptors.request.use(
  (config) => {
    const user = authService.getCurrentUser();
    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const user = authService.getCurrentUser();
      if (user?.refreshToken) {
        try {
          const authData = await authService.refreshToken(user.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${authData.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          await authService.logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
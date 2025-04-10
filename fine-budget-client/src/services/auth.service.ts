import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse, LoginData, RegisterData, ForgotPasswordData, ResetPasswordData, User } from '../types/auth';

const API_URL = 'http://your-api-url.com/api/auth';

interface CurrentUser {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/login`, data);
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('user');
  },

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await axios.post(`${API_URL}/forgot-password`, data);
  },

  async resetPassword(data: ResetPasswordData): Promise<void> {
    await axios.post(`${API_URL}/reset-password`, data);
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  getCurrentUser(): CurrentUser | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    const authData: AuthResponse = JSON.parse(userStr);
    const decoded = jwtDecode<{ sub: string; email: string; name?: string; exp: number }>(authData.accessToken);
    const user: User = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name
    };

    return { 
      user, 
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken
    };
  },

  isTokenExpired(token: string): boolean {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp * 1000 < Date.now();
  }
};

export default authService;
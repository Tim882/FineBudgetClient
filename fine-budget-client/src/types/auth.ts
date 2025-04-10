export interface User {
    id: string;
    email: string;
    name?: string;
  }
  
  export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface RegisterData extends LoginData {
    name?: string;
  }
  
  export interface ForgotPasswordData {
    email: string;
  }
  
  export interface ResetPasswordData {
    token: string;
    newPassword: string;
  }
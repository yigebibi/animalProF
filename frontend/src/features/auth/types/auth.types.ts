// 认证模块类型定义

import { User } from '../../../types';

// 登录请求类型
export interface LoginRequest {
  email: string;
  password: string;
}

// 登录响应类型
export interface LoginResponse {
  access_token: string;
  user: User;
}

// 注册请求类型
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// 注册响应类型
export interface RegisterResponse {
  access_token: string;
  user: User;
}

// 忘记密码请求类型
export interface ForgotPasswordRequest {
  email: string;
}

// 重置密码请求类型
export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// 忘记密码请求类型
export interface ForgotPasswordRequest {
  email: string;
}

// 重置密码请求类型
export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// 验证规则类型
export interface ValidationRules {
  email: {
    required: string;
    pattern: RegExp;
    message: string;
  };
  password: {
    required: string;
    minLength: number;
    message: string;
  };
  username: {
    required: string;
    minLength: number;
    maxLength: number;
    message: string;
  };
}

// 认证状态类型
export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../pages/LoginPage';
import authSlice from '../../../store/slices/authSlice';
import { api } from '../../../store/services/api';

function renderWithProviders(ui: React.ReactElement) {
  const store = configureStore({
    reducer: {
      auth: authSlice,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
}

describe('LoginPage', () => {
  it('should render login form with all fields', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByLabelText(/邮箱地址/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();
  });

  it('should validate form fields', async () => {
    renderWithProviders(<LoginPage />);

    const loginButton = screen.getByRole('button', { name: /登录/i });
    fireEvent.click(loginButton);

    // 等待表单验证错误
    await waitFor(() => {
      expect(screen.getByText(/邮箱地址/i)).toBeInTheDocument();
      expect(screen.getByText(/密码/i)).toBeInTheDocument();
    });
  });

  it('should display remember me checkbox', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByLabelText(/记住我/i)).toBeInTheDocument();
  });

  it('should navigate to register page when clicking register link', () => {
    renderWithProviders(<LoginPage />);

    const registerLink = screen.getByRole('link', { name: /立即注册/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.getAttribute('href')).toEqual('/auth/register');
  });

  it('should navigate to forgot password page when clicking forgot password link', () => {
    renderWithProviders(<LoginPage />);

    const forgotPasswordLink = screen.getByRole('link', { name: /忘记密码/i });
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink.getAttribute('href')).toEqual('/auth/forgot-password');
  });
});
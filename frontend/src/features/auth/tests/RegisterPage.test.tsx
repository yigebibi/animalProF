import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi } from 'vitest';
import RegisterPage from '../pages/RegisterPage';
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

describe('RegisterPage', () => {
  it('should render register form with all fields', () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/邮箱地址/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/确认密码/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /立即注册/i })).toBeInTheDocument();
  });

  it('should validate form fields', async () => {
    renderWithProviders(<RegisterPage />);

    const registerButton = screen.getByRole('button', { name: /立即注册/i });
    fireEvent.click(registerButton);

    // 等待表单验证错误
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /立即注册/i })).toBeDisabled();
    });
  });

  it('should check password strength indicator', () => {
    renderWithProviders(<RegisterPage />);

    const passwordInput = screen.getByLabelText(/密码/i);
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(screen.getByText(/密码强度/i)).toBeInTheDocument();
  });

  it('should validate password match', async () => {
    renderWithProviders(<RegisterPage />);

    const passwordInput = screen.getByLabelText(/密码/i);
    const confirmPasswordInput = screen.getByLabelText(/确认密码/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });

    await waitFor(() => {
      expect(screen.getByText(/密码不一致/i)).toBeInTheDocument();
    });
  });

  it('should navigate to login page when clicking login link', () => {
    renderWithProviders(<RegisterPage />);

    const loginLink = screen.getByRole('link', { name: /去登录/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.getAttribute('href')).toEqual('/auth/login');
  });
});
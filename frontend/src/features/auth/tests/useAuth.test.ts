import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../../hooks/useAuth';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../../../store/slices/authSlice';
import { api } from '../../../store/services/api';
import { BrowserRouter } from 'react-router-dom';

// 创建测试包装器
function Wrapper({ children }: { children: React.ReactNode }) {
  const store = configureStore({
    reducer: {
      auth: authSlice,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
}

describe('useAuth', () => {
  it('should return initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should expose login function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    expect(typeof result.current.login).toBe('function');
  });

  it('should expose register function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    expect(typeof result.current.register).toBe('function');
  });

  it('should expose logout function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    expect(typeof result.current.logout).toBe('function');
  });

  it('should expose clearError function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    expect(typeof result.current.clearError).toBe('function');
  });
});
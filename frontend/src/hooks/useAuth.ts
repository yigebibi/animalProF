import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { setCredentials, logout, setUser, setLoading, setError, clearError as clearErrorAction } from '../store/slices/authSlice';
import { useLoginMutation, useRegisterMutation, useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from '../store/services/api';
import { LoginRequest, RegisterRequest, UpdateProfileRequest, ChangePasswordRequest } from '../types/api';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [loginMutation, { isLoading: loginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: registerLoading }] = useRegisterMutation();
  const [updateProfileMutation, { isLoading: updateProfileLoading }] = useUpdateProfileMutation();
  const [changePasswordMutation, { isLoading: changePasswordLoading }] = useChangePasswordMutation();
  const {
    data: profile,
    error: profileError,
    isFetching: profileLoading,
    refetch: refetchProfile,
  } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (profile) {
      dispatch(setUser(profile));
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (!profileError || !token) {
      return;
    }

    const status = 'status' in profileError ? profileError.status : undefined;
    if (status === 401 || status === 403) {
      dispatch(logout());
    }
  }, [dispatch, profileError, token]);

  const login = async (
    credentials: LoginRequest,
    rememberMe: boolean = false,
    onSuccess?: () => void,
    onError?: (err: any) => void
  ) => {
    dispatch(setLoading(true));
    dispatch(clearErrorAction());

    try {
      const response = await loginMutation(credentials).unwrap();

      dispatch(setCredentials(response));
      dispatch(setUser(response.user));

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberedUser', JSON.stringify({
          email: credentials.email,
          timestamp: new Date().toISOString()
        }));
      }

      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.error || err.message || '登录失败';
      dispatch(setError(errorMessage));
      onError?.(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (
    credentials: RegisterRequest,
    onSuccess?: () => void,
    onError?: (err: any) => void
  ) => {
    dispatch(setLoading(true));
    dispatch(clearErrorAction());

    try {
      const response = await registerMutation(credentials).unwrap();

      dispatch(setCredentials(response));
      dispatch(setUser(response.user));
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.error || err.message || '注册失败';
      dispatch(setError(errorMessage));
      onError?.(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const updateProfile = async (data: UpdateProfileRequest, onSuccess?: () => void, onError?: (err: any) => void) => {
    dispatch(setLoading(true));
    dispatch(clearErrorAction());

    try {
      const response = await updateProfileMutation(data).unwrap();
      dispatch(setUser(response));
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.error || err.message || '更新失败';
      dispatch(setError(errorMessage));
      onError?.(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const changePassword = async (data: ChangePasswordRequest, onSuccess?: () => void, onError?: (err: any) => void) => {
    dispatch(setLoading(true));
    dispatch(clearErrorAction());

    try {
      await changePasswordMutation(data).unwrap();
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.error || err.message || '密码修改失败';
      dispatch(setError(errorMessage));
      onError?.(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const clearError = () => {
    dispatch(clearErrorAction());
  };

  return {
    token,
    user,
    isAuthenticated,
    isLoading:
      isLoading ||
      loginLoading ||
      registerLoading ||
      updateProfileLoading ||
      changePasswordLoading ||
      (!!token && !user && profileLoading),
    error,
    login,
    register,
    logout: handleLogout,
    updateProfile,
    changePassword,
    refetchProfile,
    clearError,
  };
};

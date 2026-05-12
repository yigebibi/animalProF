import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { RegisterRequest } from '../types/auth.types';

export const useRegister = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (credentials: RegisterRequest) => {
    setLoading(true);
    setError(null);

    try {
      await register(credentials, () => {
        navigate('/');
      }, (err) => {
        setError(err.error || err.message || '注册失败');
      });
    } catch (err: any) {
      setError(err.error || err.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    register: handleRegister,
    loading,
    error,
    clearError,
  };
};
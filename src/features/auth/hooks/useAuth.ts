import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../stores/authStore';

export const useAuth = (requireAuth: boolean = true) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authStore.isLoading) {
      if (requireAuth && !authStore.isAuthenticated) {
        navigate('/auth');
      } else if (!requireAuth && authStore.isAuthenticated) {
        navigate('/');
      }
    }
  }, [authStore.isAuthenticated, authStore.isLoading, navigate, requireAuth]);

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    login: authStore.login.bind(authStore),
    register: authStore.register.bind(authStore),
    logout: authStore.logout.bind(authStore),
  };
};
import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useApi<T>(apiFunc: (...args: any[]) => Promise<T>) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState({ data: null, isLoading: true, error: null });
        const data = await apiFunc(...args);
        setState({ data, isLoading: false, error: null });
        return data;
      } catch (error) {
        const message = error instanceof AxiosError 
          ? error.response?.data?.message || error.message
          : 'An unexpected error occurred';
        setState({ data: null, isLoading: false, error: message });
        throw error;
      }
    },
    [apiFunc]
  );

  return {
    ...state,
    execute,
  };
}
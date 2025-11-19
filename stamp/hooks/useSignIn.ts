import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, SignInRequest } from '@/lib/api';

export const useSignIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const signIn = async (data: SignInRequest) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.signIn(data);

      // Store token in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));

      // Redirect based on role
      if (response.user.role === 'admin') {
        router.push('/admin/scan');
      } else {
        router.push('/home');
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
    error,
    setError,
  };
};

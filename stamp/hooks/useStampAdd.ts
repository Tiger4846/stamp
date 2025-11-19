import { useState } from 'react';
import { stampApi, StampAddRequest, StampAddResponse } from '@/lib/api';

export const useStampAdd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const addStamp = async (data: StampAddRequest): Promise<StampAddResponse | null> => {
    setIsLoading(true);
    setError('');

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await stampApi.addStamp(data, token);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add stamp';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addStamp,
    isLoading,
    error,
    setError,
  };
};

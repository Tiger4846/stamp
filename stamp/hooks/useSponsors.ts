import { useState, useEffect } from 'react';
import { sponsorApi, stampsApi, Sponsor, UserStamp } from '@/lib/api';

export const useSponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [completedSponsors, setCompletedSponsors] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchSponsorsAndStamps = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await sponsorApi.listSponsors();
      setSponsors(response.sponsors);

      const token = localStorage.getItem('token');
      if (token) {
        const stampsResponse = await stampsApi.getUserStamps(token);
        const completedIds = new Set(
          stampsResponse.stamps.map((stamp: UserStamp) => stamp.sponsorId)
        );
        setCompletedSponsors(completedIds);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sponsors';
      setError(errorMessage);
      console.error('Error fetching sponsors:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorsAndStamps();
  }, []);

  return {
    sponsors,
    completedSponsors,
    isLoading,
    error,
    refetch: fetchSponsorsAndStamps,
  };
};

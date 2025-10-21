import { useState, useEffect, useCallback } from 'react';
import { BASE_URL } from '@/config/app.config';

const useStories = () => {
  const [stories, setStories] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFollowedStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/api/stories/following`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      setStories(data.stories || {});
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch stories';
      setError(errorMessage);
      console.error('Fetch stories error:', err);
      setStories({});
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStory = useCallback(
    async (storyId) => {
      try {
        const res = await fetch(`${BASE_URL}/api/stories/${storyId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        await fetchFollowedStories();
        return data;
      } catch (err) {
        const errorMessage = err.message || 'Failed to delete story';
        setError(errorMessage);
        console.error('Delete story error:', err);
        throw err;
      }
    },
    [fetchFollowedStories]
  );

  const refreshStories = useCallback(() => {
    fetchFollowedStories();
  }, [fetchFollowedStories]);

  useEffect(() => {
    fetchFollowedStories();
  }, [fetchFollowedStories]);

  return {
    stories,
    loading,
    error,
    fetchFollowedStories: refreshStories,
    deleteStory,
    refreshStories,
  };
};

export default useStories;

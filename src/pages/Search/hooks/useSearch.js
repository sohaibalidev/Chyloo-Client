import { useState, useCallback } from 'react';
import { BASE_URL } from '@/config/app.config';

export const useSearch = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = useCallback(async (searchQuery) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/search/?q=${encodeURIComponent(searchQuery)}`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setUsers(data.users || []);
        setPosts(data.posts || []);
      } else {
        setError('Failed to fetch results');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setUsers([]);
    setPosts([]);
    setError(null);
  }, []);

  return {
    users,
    posts,
    loading,
    error,
    fetchResults: {
      execute: fetchResults,
      clear: clearResults,
    },
  };
};

export default useSearch;

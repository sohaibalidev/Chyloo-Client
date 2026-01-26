import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BASE_URL } from '@/config/app.config';

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateUser } = useAuth();

  const updateProfile = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/settings/profile`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || 'Failed to update profile';
        throw new Error(errorMessage);
      }

      if (data.success) {
        updateUser(data.user);
        return data;
      }
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatar = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/settings/avatar`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || 'Failed to delete avatar';
        throw new Error(errorMessage);
      }

      if (data.success) {
        updateUser(data.user);
        return data;
      }
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    deleteAvatar,
    loading,
    error,
  };
};

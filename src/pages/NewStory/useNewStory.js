import { useState } from 'react';
import { BASE_URL } from '@/config/app.config';

const useNewStory = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const createStory = async (formData) => {
    try {
      setUploading(true);
      setError(null);

      console.log('Sending request to:', `${BASE_URL}/api/stories`);

      const response = await fetch(`${BASE_URL}/api/stories`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        const errorMessage = data.error || data.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      if (!data.message) {
        throw new Error('Invalid response from server');
      }

      return data;
    } catch (err) {
      console.error('Error creating story:', err);
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    createStory,
    uploading,
    error,
  };
};

export default useNewStory;

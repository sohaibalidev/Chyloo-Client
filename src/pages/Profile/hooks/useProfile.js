import { useState, useCallback } from 'react';
import { BASE_URL } from '@/config/app.config';

export const useProfile = (username, thisUser) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/api/users/${username}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsFollowing(data.user.isFollowed || false);
        await fetchUserPosts(data.user._id);

        if (thisUser && thisUser._id === data.user._id) {
          await fetchSavedPosts(data.user._id);
        }
      } else {
        setError(data.message || 'Failed to fetch user profile');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [username, thisUser]);

  const fetchUserPosts = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/posts/user/${userId}/all`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
    }
  };

  const fetchSavedPosts = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/posts/user/${userId}/saved`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSavedPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Error fetching saved posts:', err);
    }
  };

  const handleFollow = async () => {
    if (followLoading || !user) return;

    try {
      setFollowLoading(true);
      const method = isFollowing ? 'DELETE' : 'POST';

      const response = await fetch(`${BASE_URL}/api/users/${user._id}/follow`, {
        method,
        credentials: 'include',
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        setUser((prev) => ({
          ...prev,
          followerCount: isFollowing ? prev.followerCount - 1 : prev.followerCount + 1,
          isFollowed: !isFollowing,
        }));
      } else {
        throw new Error('Failed to update follow status');
      }
    } catch (err) {
      setError('Error updating follow status');
      console.error('Follow error:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  return {
    user,
    posts,
    savedPosts,
    activeTab,
    loading,
    error,
    viewMode,
    isFollowing,
    followLoading,
    setActiveTab,
    setViewMode,
    handleFollow,
    fetchUserProfile,
  };
};

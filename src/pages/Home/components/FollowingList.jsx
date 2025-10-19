import { useState, useEffect } from 'react';
import UserCard from '@/components/UserCard';
import { BASE_URL } from '@/config/app.config';
import styles from '../styles/Following.module.css';

const FollowingList = ({ user }) => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleUnfollow = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/${userId}/follow`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to unfollow user');
      }

      setFollowing((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  useEffect(() => {
    if (!user.following) return;
    setFollowing(user.following);
    setLoading(false);
  }, [user.following]);

  if (loading) {
    return (
      <div className={styles.followingList}>
        <h3>Following</h3>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.followingItemSkeleton}>
            <div className={styles.followingAvatarSkeleton}></div>
            <div className={styles.followingUsernameSkeleton}></div>
            <div className={styles.unfollowBtnSkeleton}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.followingList}>
      <h3>Following</h3>
      {following.map((user) => (
        <div key={user._id} className={styles.followingItem}>
          <UserCard key={user._id} user={user} imageSize={3} />
          <button className={styles.unfollowBtn} onClick={() => handleUnfollow(user._id)}>
            Unfollow
          </button>
        </div>
      ))}

      {following.length === 0 && (
        <div className={styles.noFollowing}>
          <p>You're not following anyone yet</p>
        </div>
      )}
    </div>
  );
};

export default FollowingList;

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from './hooks/useProfile.js';
import ProfileSkeleton from './components/ProfileSkeleton.jsx';
import ProfileHeader from './components/ProfileHeader.jsx';
import ProfileContent from './components/ProfileContent.jsx';
import styles from './styles/Profile.module.css';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const {
    user,
    posts,
    savedPosts,
    activeTab,
    loading,
    error,
    viewMode,
    followStatus,
    followLoading,
    setActiveTab,
    setViewMode,
    handleFollow,
    fetchUserProfile,
  } = useProfile(username, currentUser);

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const handleProfileUpdate = () => {
    fetchUserProfile();
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !user) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileErrorMessage}>{error || 'User not found'}</div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <ProfileHeader
        user={user}
        currentUser={currentUser}
        followStatus={followStatus}
        followLoading={followLoading}
        onFollow={handleFollow}
        onProfileUpdate={handleProfileUpdate}
      />

      <ProfileContent
        user={user}
        followStatus={followStatus}
        currentUser={currentUser}
        posts={posts}
        savedPosts={savedPosts}
        activeTab={activeTab}
        viewMode={viewMode}
        onTabChange={setActiveTab}
        onViewModeChange={setViewMode}
      />
    </div>
  );
};

export default Profile;
import { MessageCircle, UserCheck, UserPlus, Settings, CheckCircle, Calendar } from 'lucide-react';
import { BASE_URL } from '@/config/app.config.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import textEnhancer from '@/helpers/textEnhancer'
import placeholderColor from '@/helpers/placeholderColor';
import styles from '../styles/ProfileHeader.module.css';

const ProfileHeader = ({
  user,
  currentUser,
  isFollowing,
  followLoading,
  onFollow,
  onProfileUpdate,
}) => {
  const [messageLoading, setMessageLoading] = useState(false);
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleMessageClick = async () => {
    if (messageLoading) return;

    setMessageLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/messages/conversation/${user._id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      const { conversation } = await response.json();

      navigate(`/messages/?conversation=${conversation._id}`);
    } catch (error) {
      console.error('Error creating/fetching conversation:', error);
    } finally {
      setMessageLoading(false);
    }
  };

  return (
    <>
      <div className={styles.profileHeader}>
        <ProfileAvatar user={user} />

        <div className={styles.userProfileInfo}>
          <div className={styles.profileNameSection}>
            <h1 className={styles.profileName}>{user.name}</h1>
            {user.isVerified && (
              <span className={styles.profileVerifiedBadge}>
                <CheckCircle size={16} stroke='var(--primary-accent)' fill='none' strokeWidth={2} />
              </span>
            )}
          </div>

          <p className={styles.profileUsername}>@{user.username}</p>
          {user.bio && (
            <p
              className={styles.profileBio}
              dangerouslySetInnerHTML={{ __html: textEnhancer(user.bio) }}
            />
          )}

          <div className={styles.profileMeta}>
            <span className={styles.profileMetaItem}>
              <Calendar size={14} />
              {formatJoinDate(user.createdAt)}
            </span>
          </div>

          <ProfileStats user={user} postsCount={0} />
        </div>

        <ProfileActions
          user={user}
          currentUser={currentUser}
          isFollowing={isFollowing}
          followLoading={followLoading}
          onFollow={onFollow}
          onSettingsClick={handleSettingsClick}
          onMessageClick={handleMessageClick}
        />
      </div>
    </>
  );
};

const ProfileAvatar = ({ user }) => {
  const [imgError, setImgError] = useState(false);

  const handleImgError = () => setImgError(true);

  const showPlaceholder = !user.avatar || imgError;

  return (
    <div className={styles.profileAvatar}>
      {showPlaceholder ? (
        <div
          className={styles.profileAvatarPlaceholder}
          style={{ backgroundColor: placeholderColor(user.username) }}
        >
          {user.username?.charAt(0).toUpperCase()}
        </div>
      ) : (
        <img src={user.avatar} alt={user.username} onError={handleImgError} />
      )}
    </div>
  );
};

const ProfileStats = ({ user, postsCount }) => (
  <div className={styles.profileStats}>
    <div className={styles.profileStat}>
      <span className={styles.profileStatNumber}>{formatNumber(user.followerCount || 0)}</span>
      <span className={styles.profileStatLabel}>Followers</span>
    </div>
    <div className={styles.profileStat}>
      <span className={styles.profileStatNumber}>{formatNumber(user.followingCount || 0)}</span>
      <span className={styles.profileStatLabel}>Following</span>
    </div>
    <div className={styles.profileStat}>
      <span className={styles.profileStatNumber}>{formatNumber(postsCount)}</span>
      <span className={styles.profileStatLabel}>Posts</span>
    </div>
  </div>
);

const ProfileActions = ({
  user,
  currentUser,
  isFollowing,
  followLoading,
  onFollow,
  onSettingsClick,
  onMessageClick,
}) => {
  if (!currentUser) return null;

  return (
    <div className={styles.profileActions}>
      {currentUser._id !== user._id ? (
        <>
          <button
            className={`${styles.profileFollowBtn} ${isFollowing ? styles.following : ''}`}
            onClick={onFollow}
            disabled={followLoading}
          >
            {followLoading ? (
              <div className={styles.profileLoadingSpinner}></div>
            ) : (
              <>
                {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                {isFollowing ? 'Following' : 'Follow'}
              </>
            )}
          </button>
          <button className={styles.profileMessageBtn} onClick={onMessageClick} disabled={false}>
            <MessageCircle size={16} />
            Message
          </button>
        </>
      ) : (
        <button className={styles.profileEditProfileBtn} onClick={onSettingsClick}>
          <Settings size={16} />
          Settings
        </button>
      )}
    </div>
  );
};

const formatJoinDate = (dateString) => {
  const date = new Date(dateString);
  return `Joined ${date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })}`;
};

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export default ProfileHeader;
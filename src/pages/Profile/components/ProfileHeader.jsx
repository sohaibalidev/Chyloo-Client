import { MessageCircle, UserCheck, UserPlus, Settings, CheckCircle, Calendar, Clock, X } from 'lucide-react';
import { BASE_URL } from '@/config/app.config.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import textEnhancer from '@/utils/textEnhancer'
import placeholderColor from '@/utils/placeholderColor';
import styles from '../styles/ProfileHeader.module.css';

const ProfileHeader = ({
  user,
  currentUser,
  followStatus,
  followLoading,
  onFollow,
  onProfileUpdate,
}) => {
  const [messageLoading, setMessageLoading] = useState(false);
  const [showAvatarZoom, setShowAvatarZoom] = useState(false);
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

      navigate(`/messages/${conversation._id}`);
    } catch (error) {
      console.error('Error creating/fetching conversation:', error);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleAvatarClick = () => {
    if (user.avatar) {
      setShowAvatarZoom(true);
    }
  };

  const closeAvatarZoom = () => {
    setShowAvatarZoom(false);
  };

  return (
    <>
      <div className={styles.profileHeader}>
        <ProfileAvatar user={user} onAvatarClick={handleAvatarClick} />

        <div className={styles.userProfileInfo}>
          <div className={styles.profileNameSection}>
            <h1 className={styles.profileName}>{user.name}</h1>
            {user.isVerified && (
              <span className={styles.profileVerifiedBadge} title={`${user.name} is a verified user`}>
                <CheckCircle size={16} stroke='var(--primary-accent)' fill='none' strokeWidth={2} />
              </span>
            )}
            {user.accountStatus === 'private' && (
              <span className={styles.profilePrivateBadge} title="Private Account">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
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
          followStatus={followStatus}
          followLoading={followLoading}
          onFollow={onFollow}
          onSettingsClick={handleSettingsClick}
          onMessageClick={handleMessageClick}
        />
      </div>

      {showAvatarZoom && (
        <AvatarZoomModal
          avatarUrl={user.avatar}
          username={user.username}
          onClose={closeAvatarZoom}
        />
      )}
    </>
  );
};

const ProfileAvatar = ({ user, onAvatarClick }) => {
  const [imgError, setImgError] = useState(false);

  const handleImgError = () => setImgError(true);

  const showPlaceholder = !user.avatar || imgError;

  return (
    <div
      className={`${styles.profileAvatar} ${user.avatar ? styles.clickableAvatar : ''}`}
      onClick={user.avatar ? onAvatarClick : undefined}
    >
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

const AvatarZoomModal = ({ avatarUrl, username, onClose }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <img
        src={avatarUrl}
        alt={`${username}'s avatar`}
        className={styles.image}
      />
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
  followStatus,
  followLoading,
  onFollow,
  onSettingsClick,
  onMessageClick,
}) => {
  if (!currentUser) return null;

  const getFollowButtonText = () => {
    switch (followStatus) {
      case 'accepted':
        return { text: 'Following', icon: <UserCheck size={16} />, className: styles.following };
      case 'pending':
        return { text: 'Requested', icon: <Clock size={16} />, className: styles.pending };
      default:
        return { text: 'Follow', icon: <UserPlus size={16} />, className: '' };
    }
  };

  const followButtonInfo = getFollowButtonText();

  return (
    <div className={styles.profileActions}>
      {currentUser._id !== user._id ? (
        <>
          <button
            className={`${styles.profileFollowBtn} ${followButtonInfo.className}`}
            onClick={onFollow}
            disabled={followLoading}
          >
            {followLoading ? (
              <div className={styles.profileLoadingSpinner}></div>
            ) : (
              <>
                {followButtonInfo.icon}
                {followButtonInfo.text}
              </>
            )}
          </button>
          <button
            className={styles.profileMessageBtn}
            onClick={onMessageClick}
          >
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
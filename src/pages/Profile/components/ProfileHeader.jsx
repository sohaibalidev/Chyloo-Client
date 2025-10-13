import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, UserCheck, UserPlus, Settings, CheckCircle, Calendar } from 'lucide-react';
import getPlaceholderColor from '@/helpers/getPlaceholderColor';
import EditProfile from './EditProfile';
import styles from '../styles/ProfileHeader.module.css';

const ProfileHeader = ({
  user,
  currentUser,
  isFollowing,
  followLoading,
  onFollow,
  onProfileUpdate,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
  };

  const handleProfileUpdate = (new_username) => {
    if (new_username) {
      navigate(`/profile/${new_username}`);
      return;
    }
    onProfileUpdate();
    setIsEditModalOpen(false);
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
          {user.bio && <p className={styles.profileBio}>{user.bio}</p>}

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
          onEditClick={handleEditClick}
        />
      </div>

      <EditProfile
        user={user}
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        onUpdate={handleProfileUpdate}
      />
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
          style={{ backgroundColor: getPlaceholderColor(user.username) }}
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
  onEditClick,
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
          <button className={styles.profileMessageBtn}>
            <MessageCircle size={16} />
            Message
          </button>
        </>
      ) : (
        <button className={styles.profileEditProfileBtn} onClick={onEditClick}>
          <Settings size={16} />
          Edit Profile
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

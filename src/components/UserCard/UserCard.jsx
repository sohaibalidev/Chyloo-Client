import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import placeholderColor from '@/helpers/placeholderColor';
import styles from './UserCard.module.css';

const UserCard = ({
  user,
  showName = true,
  showUsername = true,
  clickable = true,
  background = false,
  imageSize = 2,
  isVerified = true,
  className = '',
}) => {
  if (!user) return null;

  const getSizeClass = () => {
    switch (imageSize) {
      case 1:
        return styles.sizeSmall;
      case 3:
        return styles.sizeLarge;
      case 4:
        return styles.sizeXLarge;
      default:
        return styles.sizeMedium;
    }
  };

  const getVerifiedIconSize = () => {
    switch (imageSize) {
      case 1:
        return 12;
      case 3:
        return 18;
      case 4:
        return 20;
      default:
        return 16;
    }
  };

  const cardContent = (
    <div
      className={`${styles.UserCard} ${
        background ? styles.withBackground : ''
      } ${getSizeClass()} ${className}`}
    >
      {user.avatar ? (
        <img src={user.avatar} alt={user.name || user.username} />
      ) : (
        <div
          className={styles.avatarFallback}
          style={{ backgroundColor: placeholderColor(user.username) }}
        >
          {user.username?.charAt(0).toUpperCase()}
        </div>
      )}

      <div className={styles.infoContainer}>
        {showName && user.name && (
          <div className={styles.nameContainer}>
            <h3 className={styles.userName}>{user.name}</h3>
            {isVerified && user.isVerified && (
              <span className={styles.verifiedBadge}>
                <CheckCircle
                  size={getVerifiedIconSize()}
                  stroke='var(--primary-accent)'
                  fill='none'
                  strokeWidth={2}
                />
              </span>
            )}
          </div>
        )}

        {showUsername && user.username && <p className={styles.userUsername}>@{user.username}</p>}
      </div>
    </div>
  );

  if (clickable && user.username) {
    return (
      <Link to={`/profile/${user.username}`} className={styles.linkWrapper}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default UserCard;

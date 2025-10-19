import styles from '../styles/ProfileSkeleton.module.css';

const ProfileSkeleton = () => {
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileSkeleton}>
        <div className={styles.profileHeaderSkeleton}>
          <div className={styles.profileAvatarSkeleton}></div>
          <div className={styles.profileInfoSkeleton}>
            <div className={styles.profileSkeletonLine}></div>
            <div className={`${styles.profileSkeletonLine} ${styles.short}`}></div>
          </div>
        </div>
        <div className={styles.profileStatsSkeleton}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.profileStatSkeleton}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;

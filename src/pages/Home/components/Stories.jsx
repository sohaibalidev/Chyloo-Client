import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import getPlaceholderColor from '@/utils/placeholderColor';
import useStories from '../hooks/useStories';
import styles from '../styles/Stories.module.css';

const Stories = () => {
  const { stories, loading, error } = useStories();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const selectedUser = selectedUserId ? stories[selectedUserId] : null;
  const currentStory = selectedUser?.stories?.[currentIndex];

  const closeStory = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setSelectedUserId(null);
    setCurrentIndex(0);
    setProgress(0);
  }, []);

  const nextStory = useCallback(() => {
    if (!selectedUser) return;
    if (currentIndex < selectedUser.stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      closeStory();
    }
  }, [selectedUser, currentIndex, closeStory]);

  const prevStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!selectedUser) return;
      if (e.key === 'ArrowRight') nextStory();
      if (e.key === 'ArrowLeft') prevStory();
      if (e.key === 'Escape') closeStory();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedUser, nextStory, prevStory, closeStory]);

  useEffect(() => {
    if (!currentStory) return;

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    const duration = (currentStory.media.duration || 7) * 1000;
    const updateInterval = 50;
    const totalSteps = duration / updateInterval;
    const increment = 100 / totalSteps;

    startTimeRef.current = Date.now();

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(progressIntervalRef.current);
          nextStory();
          return 0;
        }
        return newProgress;
      });
    }, updateInterval);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [currentStory, nextStory]);

  const handleProgressClick = useCallback((index) => {
    if (!selectedUser) return;
    setCurrentIndex(index);
    setProgress(0);
  }, [selectedUser]);

  const renderAvatar = (user, size = 'normal') => {
    const { avatar, username, name } = user;
    const displayName = name || username;
    const firstLetter = displayName?.charAt(0)?.toUpperCase() || 'U';

    if (avatar) {
      return (
        <img
          src={avatar}
          alt={username}
          className={size === 'normal' ? styles.avatar : styles.userAvatar}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }

    return (
      <div
        className={size === 'normal' ? styles.avatarPlaceholder : styles.userAvatarPlaceholder}
        style={{ backgroundColor: getPlaceholderColor(username) }}
      >
        {firstLetter}
      </div>
    );
  };

  if (loading && Object.keys(stories).length === 0)
    return <div className={styles.loading}>Loading stories...</div>;
  if (error && Object.keys(stories).length === 0)
    return <div className={styles.error}>Error loading stories: {error}</div>;
  if (Object.keys(stories).length === 0 && !loading)
    return <div className={styles.noStories}>No stories available</div>;

  return (
    <div className={styles.storiesContainer}>
      <div className={styles.storiesList}>
        {Object.values(stories).map((userData) => (
          <div
            key={userData.user._id}
            className={styles.storyItem}
            onClick={() => {
              setSelectedUserId(userData.user._id);
              setCurrentIndex(0);
              setProgress(0);
            }}
          >
            <div className={styles.avatarContainer}>
              <div className={styles.storyRing} />
              {renderAvatar(userData.user)}
            </div>
            <span className={styles.username}>@{userData.user.username}</span>
          </div>
        ))}
      </div>

      {selectedUser && currentStory && (
        <div className={styles.storyViewer}>
          <div
            className={styles.storyOverlay}
            onClick={(e) => e.target === e.currentTarget && closeStory()}
          />
          <div className={styles.storyContent}>
            <div className={styles.progressContainer}>
              {selectedUser.stories.map((_, i) => (
                <div
                  key={i}
                  className={styles.progressBar}
                  onClick={() => handleProgressClick(i)}
                >
                  <div
                    className={styles.progressFill}
                    style={{
                      width:
                        i < currentIndex
                          ? '100%'
                          : i === currentIndex
                            ? `${progress}%`
                            : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            <div className={styles.storyHeader}>
              <Link to={`/profile/${selectedUser.user.username}`} className={styles.userLink} onClick={closeStory}>
                <div className={styles.userInfo}>
                  {renderAvatar(selectedUser.user, 'small')}
                  <span className={styles.userName}>{selectedUser.user.username}</span>
                </div>
              </Link>
              <button className={styles.closeButton} onClick={closeStory}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.mediaContainer}>
              {currentStory.media.type === 'image' ? (
                <img
                  src={currentStory.media.url}
                  alt="Story"
                  className={styles.storyMedia}
                />
              ) : (
                <video
                  src={currentStory.media.url}
                  className={styles.storyMedia}
                  autoPlay
                  muted
                  playsInline
                  onEnded={nextStory}
                />
              )}
            </div>

            <div className={styles.navSection}>
              <div
                className={styles.navArea}
                onClick={prevStory}
              />
              <div
                className={styles.navArea}
                onClick={nextStory}
              />
            </div>

            {currentStory.caption && (
              <div className={styles.caption}>{currentStory.caption}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
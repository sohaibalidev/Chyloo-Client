import { Grid, List, Bookmark, Users } from 'lucide-react';
import PostCard from '@/components/PostCard';
import styles from '../styles/ProfileContent.module.css';

const ProfileContent = ({
  user,
  currentUser,
  posts,
  savedPosts,
  activeTab,
  viewMode,
  onTabChange,
  onViewModeChange,
}) => {
  const displayPosts = activeTab === 'posts' ? posts : savedPosts;
  const isEmpty = displayPosts.length === 0;

  return (
    <div className={styles.profileContent}>
      <div className={styles.profileNavigation}>
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          showSaved={!!currentUser && currentUser._id === user._id}
        />

        <ProfileViewOptions viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>

      <div className={`${styles.profilePostsContainer} ${styles[viewMode]}`}>
        {isEmpty ? (
          <EmptyState activeTab={activeTab} username={user.username} />
        ) : (
          displayPosts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

const ProfileTabs = ({ activeTab, onTabChange, showSaved }) => (
  <div className={styles.profileTabs}>
    <button
      className={`${styles.profileTab} ${activeTab === 'posts' ? styles.active : ''}`}
      onClick={() => onTabChange('posts')}
    >
      <Grid size={18} />
      Posts
    </button>
    {showSaved && (
      <button
        className={`${styles.profileTab} ${activeTab === 'saved' ? styles.active : ''}`}
        onClick={() => onTabChange('saved')}
      >
        <Bookmark size={18} />
        Saved
      </button>
    )}
  </div>
);

const ProfileViewOptions = ({ viewMode, onViewModeChange }) => (
  <div className={styles.profileViewOptions}>
    <button
      className={`${styles.profileViewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
      onClick={() => onViewModeChange('grid')}
    >
      <Grid size={18} />
    </button>
    <button
      className={`${styles.profileViewBtn} ${viewMode === 'list' ? styles.active : ''}`}
      onClick={() => onViewModeChange('list')}
    >
      <List size={18} />
    </button>
  </div>
);

const EmptyState = ({ activeTab, username }) => (
  <div className={styles.profileEmptyState}>
    {activeTab === 'posts' ? (
      <>
        <Users size={48} />
        <h3>No posts yet</h3>
        <p>When {username} shares posts, they'll appear here.</p>
      </>
    ) : (
      <>
        <Bookmark size={48} />
        <h3>No saved posts</h3>
        <p>Posts that you save will appear here.</p>
      </>
    )}
  </div>
);

export default ProfileContent;

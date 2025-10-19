import styles from '../styles/Tabs.module.css';

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.searchTabs}>
      <button
        className={`${styles.searchTab} ${activeTab === 'users' ? styles.searchActive : ''}`}
        onClick={() => setActiveTab('users')}
      >
        Users
      </button>
      <button
        className={`${styles.searchTab} ${activeTab === 'posts' ? styles.searchActive : ''}`}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </button>
    </div>
  );
};

export default Tabs;

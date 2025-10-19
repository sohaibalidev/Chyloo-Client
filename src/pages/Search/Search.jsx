import { useState } from 'react';
import SearchBar from './components/SearchBar';
import Tabs from './components/Tabs';
import UserCard from '@/components/UserCard';
import PostCard from '@/components/PostCard';
import { useSearch } from './hooks/useSearch';
import styles from './styles/Search.module.css';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const { users, posts, loading, error, fetchResults } = useSearch();

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    if (searchQuery.trim() === '') {
      fetchResults.clear();
      return;
    }
    fetchResults.execute(searchQuery);
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchHeader}>
        <SearchBar onSearch={handleSearch} />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className={styles.searchResults}>
        {loading && <div className={styles.loading}>Searching...</div>}

        {error && <div className={styles.errorMessage}>{error}</div>}

        {!loading && !error && query && (
          <>
            {activeTab === 'users' && (
              <div className={styles.usersContainer}>
                {users.length === 0 ? (
                  <div className={styles.noResults}>No users found</div>
                ) : (
                  <div className={styles.usersGrid}>
                    {users.map((user) => (
                      <UserCard key={user._id} background={true} user={user} imageSize={4} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className={styles.postsContainer}>
                {posts.length === 0 ? (
                  <div className={styles.noResults}>No posts found</div>
                ) : (
                  <div className={styles.postsList}>
                    {posts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

import { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import PostCard from '@/components/PostCard';
import { BASE_URL } from '@/config/app.config';
import styles from '../styles/Feed.module.css';

const Feed = () => {
  const [feedPosts, setFeedPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedDaysLimit, setFeedDaysLimit] = useState(5);

  const [explorePosts, setExplorePosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setFeedLoading(true);
        const res = await fetch(`${BASE_URL}/api/feed`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch feed');
        const data = await res.json();

        if (Array.isArray(data.posts) && data.posts.length > 0) {
          setFeedPosts(data.posts);
          setFeedDaysLimit(data.feedDaysLimit || 5);
        }
      } catch (err) {
        console.error('Error fetching feed:', err);
      } finally {
        setFeedLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const fetchExplore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const res = await fetch(`${BASE_URL}/api/feed/explore?page=${page}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch explore');
      const data = await res.json();

      if (!data.posts || data.posts.length === 0) {
        setHasMore(false);
      } else {
        setExplorePosts((prev) => [...prev, ...data.posts]);
        setPage((prev) => prev + 1);

        if (data.pagination && data.pagination.hasMore === false) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('Error fetching explore:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore, loadingMore]);

  useEffect(() => {
    fetchExplore();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 400 &&
        !loadingMore &&
        hasMore
      ) {
        fetchExplore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchExplore, hasMore, loadingMore]);

  return (
    <div className={styles.feedContainer}>
      {feedLoading && feedPosts.length === 0 && (
        <div className='feed-skeletons'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.postSkeleton}><div className={styles.postSkeletonChild}></div></div>
          ))}
        </div>
      )}

      {feedPosts.length > 0 && feedPosts.map((post) => <PostCard key={post._id} post={post} />)}

      {!feedLoading && feedPosts.length > 0 && (
        <div className={styles.caughtUp}>
          <div className={styles.caughtUpIcon}>
            <Check size={28} />
          </div>
          <div>
            <h3>You're all caught up!</h3>
            <p>You've seen all new posts from the last {feedDaysLimit} days</p>
          </div>
        </div>
      )}

      {explorePosts.length > 0 &&
        explorePosts.map((post) => <PostCard key={post._id} post={post} />)}

      {loadingMore && explorePosts.length > 0 && (
        <div className={styles.loadingPosts}>
          <p>Loading more...</p>
        </div>
      )}

      {!hasMore && explorePosts.length > 0 && (
        <div className={styles.noMorePosts}>
          <p>No more posts to load</p>
        </div>
      )}
    </div>
  );
};

export default Feed;

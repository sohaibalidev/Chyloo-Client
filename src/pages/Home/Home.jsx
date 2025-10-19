import { useAuth } from '@/context/AuthContext';
import Stories from './components/Stories';
import Feed from './components/Feed';
import FollowingList from './components/FollowingList';
import UserCard from '@/components/UserCard';
import { useEffect } from 'react';
import styles from './styles/Home.module.css';

const Home = () => {
  const { user, checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <div className={styles.dashboardMain}>
          <div className={styles.storiesSection}>
            <Stories />
          </div>

          <div className={styles.feedSection}>
            <Feed />
          </div>
        </div>

        <div className={styles.dashboardSidebar}>
          <UserCard user={user} background={true} imageSize={4} />
          <FollowingList user={user} />
        </div>
      </div>
    </div>
  );
};

export default Home;

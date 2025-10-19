import { WifiOff } from 'lucide-react';
import styles from './OfflineScreen.module.css';

export default function OfflineScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.statusCard}>
        <WifiOff size={64} className={`${styles.statusIcon} ${styles.statusIconError}`} />
        <h1 className={styles.statusTitle}>No Internet Connection</h1>
        <p className={styles.statusDescription}>
          Please check your network connection and try again.
        </p>
      </div>
    </div>
  );
}

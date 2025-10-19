import { ServerOff, RefreshCw } from 'lucide-react';
import styles from './ServerDownScreen.module.css';

export default function ServerDownScreen({ retry, isChecking }) {
  return (
    <div className={styles.container}>
      <div className={styles.statusCard}>
        <ServerOff size={64} className={`${styles.statusIcon} ${styles.statusIconError}`} />
        <h1 className={styles.statusTitle}>Server Unavailable</h1>
        <p className={styles.statusDescription}>
          The server isn’t responding at the moment. Click “Check Server Status” to try waking it up.
        </p>
        <button onClick={retry} disabled={isChecking} className={styles.retryBtn}>
          {isChecking ? (
            <>
              <RefreshCw size={20} className={styles.spinning} />
              Checking Status...
            </>
          ) : (
            <>
              <RefreshCw size={20} />
              Check Server Status
            </>
          )}
        </button>
      </div>
    </div>
  );
}

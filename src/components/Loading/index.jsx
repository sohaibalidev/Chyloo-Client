import styles from './Loading.module.css';

const LoadingScreen = () => {
  return (
    <div className={styles.screen}>
      <img 
        src="/favicon.png" 
        alt="Chyloo" 
        className={styles.simpleLogo}
      />
    </div>
  );
};

export default LoadingScreen;

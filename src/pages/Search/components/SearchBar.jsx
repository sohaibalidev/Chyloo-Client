import { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import styles from '../styles/SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const isDesktop = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 992;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const handler = setTimeout(() => {
      if (isMounted) {
        onSearch(inputValue.trim());
      }
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(handler);
    };
  }, [inputValue]);

  return (
    <div className={styles.searchBar}>
      <Search className={styles.searchIcon} size={20} strokeWidth={2} />
      <input
        type='text'
        placeholder='Search...'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={styles.searchInput}
        autoFocus={isDesktop}
      />
      {inputValue && (
        <X
          className={styles.clearIcon}
          size={20}
          strokeWidth={2}
          onClick={() => setInputValue('')}
        />
      )}
    </div>
  );
};

export default SearchBar;

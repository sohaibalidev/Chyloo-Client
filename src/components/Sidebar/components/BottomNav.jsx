import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import styles from '../Sidebar.module.css';

const BottomNav = ({ navItems, onMenuClick }) => {
  const bottomNavItems = navItems.filter(item =>
    ['Home', 'Search', 'PlusSquare', 'Notifications', 'Profile'].includes(item.icon)
  );

  return (
    <nav className={styles.bottomNav} aria-label="Mobile navigation">
      <button
        className={`${styles.bottomNavLink} ${styles.bottomNavButton}`}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={20} />
        <span className={styles.bottomNavLabel}>Menu</span>
      </button>

      {bottomNavItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.bottomNavLink} ${isActive ? styles.active : ''}`
          }
          aria-label={label}
          end={to === '/'}
        >
          {icon}
          <span className={styles.bottomNavLabel}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;

import { NavLink } from 'react-router-dom';
import styles from '../Sidebar.module.css';

const SidebarNav = ({ navItems, isCollapsed, isMobile, onItemClick }) => {
  const handleClick = () => {
    if (isMobile && onItemClick) {
      onItemClick();
    }
  };

  return (
    <nav className={styles.sidebarNav} aria-label="Main navigation">
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.sidebarLink} ${isActive ? styles.active : ''}`
          }
          title={isCollapsed ? label : ''}
          onClick={handleClick}
          aria-label={label}
          end={to === '/'}
        >
          {icon}
          {!isCollapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNav;

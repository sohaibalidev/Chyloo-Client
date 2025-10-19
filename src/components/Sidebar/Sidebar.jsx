import {
  Menu,
  Home,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Sun,
  Moon,
  PlusSquare,
  X,
} from 'lucide-react';
import { useSidebar } from './useSidebar';
import BottomNav from './components/BottomNav';
import SidebarNav from './components/SidebarNav';
import { useTheme } from '@/context/ThemeContext';
import styles from './Sidebar.module.css';

const Icon = ({ name, size = 20 }) => {
  const icons = {
    Home: <Home size={size} />,
    Search: <Search size={size} />,
    MessageSquare: <MessageSquare size={size} />,
    PlusSquare: <PlusSquare size={size} />,
    User: <User size={size} />,
    Bell: <Bell size={size} />,
    Settings: <Settings size={size} />,
  };

  return icons[name] || null;
};

export default function Sidebar() {
  const {
    isCollapsed,
    isMobile,
    toggleSidebar,
    navItems,
    isSidebarOpen,
    closeSidebar,
    openSidebar,
    logout,
  } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  const navItemsWithIcons = navItems.map((item) => ({
    ...item,
    icon: <Icon name={item.icon} size={item.size} />,
  }));

  if (isMobile) {
    return (
      <>
        <BottomNav navItems={navItemsWithIcons} onMenuClick={openSidebar} />
        {isSidebarOpen && (
          <div
            className={styles.mobileSidebarOverlay}
            onClick={closeSidebar}
          >
            <div
              className={styles.mobileSidebarContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.mobileSidebarHeader}>
                <div className={styles.sidebarLogo}>Chyloo</div>
                <button
                  className={styles.sidebarClose}
                  onClick={closeSidebar}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <SidebarNav
                navItems={navItemsWithIcons}
                isCollapsed={false}
                isMobile={isMobile}
                onItemClick={closeSidebar}
              />

              <div className={styles.mobileSidebarFooter}>
                <button
                  className={styles.sidebarLogout}
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  <span>
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </button>

                <button
                  className={styles.sidebarLogout}
                  onClick={logout}
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
    >
      <div className={styles.sidebarHeader}>
        {!isCollapsed && (
          <div className={styles.sidebarLogo} aria-label="Chyloo">
            Chyloo
          </div>
        )}
        <button
          className={styles.sidebarToggle}
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu size={18} />
        </button>
      </div>

      <div className={styles.sidebarNavContainer}>
        <SidebarNav
          navItems={navItemsWithIcons}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
        />

        <div className={styles.sidebarFooter}>
          <button
            className={styles.sidebarLogout}
            onClick={toggleTheme}
            title={isCollapsed ? 'Toggle Theme' : ''}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {!isCollapsed && (
              <span>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>

          <button
            className={styles.sidebarLogout}
            onClick={logout}
            title={isCollapsed ? 'Logout' : ''}
            aria-label="Logout"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
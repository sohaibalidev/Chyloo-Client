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
} from 'lucide-react';
import { useSidebar } from './sidebar';
import BottomNav from './components/BottomNav';
import SidebarNav from './components/SidebarNav';
import { useTheme } from '@/context/ThemeContext';
import './index.css';

const Icon = ({ name, size }) => {
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
  const { logout, isCollapsed, isMobile, toggleSidebar, navItems } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  const navItemsWithIcons = navItems.map((item) => ({
    ...item,
    icon: <Icon name={item.icon} size={item.size} />,
  }));

  if (isMobile) {
    return <BottomNav navItems={navItemsWithIcons} />;
  }

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className='sidebar-header'>
        {!isCollapsed && <div className='sidebar-logo'>Chyloo</div>}
        <button className='sidebar-toggle' onClick={toggleSidebar}>
          <Menu size={18} />
        </button>
      </div>

      <div className='sidebar-nav-container'>
        <SidebarNav navItems={navItemsWithIcons} isCollapsed={isCollapsed} />

        <div className='sidebar-nav'>
          {/* Theme Toggle */}
          <div
            className='sidebar-logout'
            onClick={toggleTheme}
            title={isCollapsed ? 'Toggle Theme' : ''}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {!isCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </div>

          {/* Logout Button */}
          <div className='sidebar-logout' onClick={logout} title={isCollapsed ? 'Logout' : ''}>
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </div>
        </div>
      </div>
    </aside>
  );
}

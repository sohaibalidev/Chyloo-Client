import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useSidebar = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(
    JSON.parse(localStorage.getItem('isCollapsed')) || false
  );
  const [isMobile, setIsMobile] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: 'Home', size: 20 },
    { to: '/search', label: 'Search', icon: 'Search', size: 20 },
    { to: '/messages', label: 'Messages', icon: 'MessageSquare', size: 20 },
    { to: '/posts/new', label: 'NewPost', icon: 'PlusSquare', size: 20 },
    { to: `/profile/${user.username}`, label: 'Profile', icon: 'User', size: 20 },
    { to: '/notifications', label: 'Notifications', icon: 'Bell', size: 20 },
    { to: '/settings', label: 'Settings', icon: 'Settings', size: 20 },
  ];

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
        localStorage.setItem('isCollapsed', 'true');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (!isMobile) {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      localStorage.setItem('isCollapsed', newState.toString());
    }
  };

  return {
    user,
    logout,
    isCollapsed,
    isMobile,
    toggleSidebar,
    navItems,
  };
};

export default useSidebar;

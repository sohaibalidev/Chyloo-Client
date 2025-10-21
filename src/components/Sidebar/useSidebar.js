import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useSidebar = () => {
  const { user, logout } = useAuth();
  const [sidebarState, setSidebarState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar') || 'expanded';
    }
    return 'expanded';
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: 'Home', size: 20 },
    { to: '/search', label: 'Search', icon: 'Search', size: 20 },
    { to: '/messages', label: 'Messages', icon: 'MessageSquare', size: 20 },
    { to: '/posts/new', label: 'New Post', icon: 'PlusSquare', size: 20 },
    { to: '/stories/new', label: 'New Story', icon: 'CircleDashed', size: 20 },
    { to: `/profile/${user?.username}`, label: 'Profile', icon: 'User', size: 20 },
    { to: '/notifications', label: 'Notifications', icon: 'Bell', size: 20 },
    { to: '/settings', label: 'Settings', icon: 'Settings', size: 20 },
  ];

  useEffect(() => {
    let resizeTimeout;

    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (mobile) {
        setSidebarState('collapsed');
        localStorage.setItem('sidebar', 'collapsed');
        setIsSidebarOpen(false);
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 150);
    };

    checkMobile();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    const handleSidebarChange = (event) => {
      if (event.detail?.sidebar && event.detail.sidebar !== sidebarState && !isMobile) {
        setSidebarState(event.detail.sidebar);
        localStorage.setItem('sidebar', event.detail.sidebar);
      }
    };

    window.addEventListener('sidebarChange', handleSidebarChange);
    return () => window.removeEventListener('sidebarChange', handleSidebarChange);
  }, [sidebarState, isMobile]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsSidebarOpen((prev) => !prev);
      return;
    }

    const newState = sidebarState === 'collapsed' ? 'expanded' : 'collapsed';
    setSidebarState(newState);
    localStorage.setItem('sidebar', newState);

    window.dispatchEvent(
      new CustomEvent('sidebarChange', {
        detail: { sidebar: newState },
      })
    );
  }, [isMobile, sidebarState]);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    if (isMobile) {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  return {
    user,
    logout,
    isCollapsed: sidebarState === 'collapsed',
    isMobile,
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    navItems,
    sidebarState,
  };
};

export default useSidebar;

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from '@/config/app.config';

export const useSidebar = () => {
  const { user, logout } = useAuth();
  const [sidebarState, setSidebarState] = useState(localStorage.getItem('sidebar') || 'expanded');
  const [isMobile, setIsMobile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: 'Home', size: 20 },
    { to: '/search', label: 'Search', icon: 'Search', size: 20 },
    { to: '/messages', label: 'Messages', icon: 'MessageSquare', size: 20 },
    { to: '/posts/new', label: 'NewPost', icon: 'PlusSquare', size: 20 },
    { to: `/profile/${user?.username}`, label: 'Profile', icon: 'User', size: 20 },
    { to: '/notifications', label: 'Notifications', icon: 'Bell', size: 20 },
    { to: '/settings', label: 'Settings', icon: 'Settings', size: 20 },
  ];

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarState('collapsed');
        localStorage.setItem('sidebar', 'collapsed');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (user?.settings?.sidebar) {
      setSidebarState(user.settings.sidebar);
      localStorage.setItem('sidebar', user.settings.sidebar);
    }
  }, [user]);

  const toggleSidebar = async () => {
    if (isMobile) return;

    const newState = sidebarState === 'collapsed' ? 'expanded' : 'collapsed';
    setSidebarState(newState);
    localStorage.setItem('sidebar', newState);

    if (!user?._id) return;

    try {
      setIsSaving(true);
      const res = await fetch(`${BASE_URL}/api/users/settings`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sidebar: newState }),
      });

      if (!res.ok) throw new Error('Failed to update sidebar setting');
    } catch (err) {
      console.error('Sidebar sync failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user,
    logout,
    isCollapsed: sidebarState === 'collapsed',
    isMobile,
    isSaving,
    toggleSidebar,
    navItems,
  };
};

export default useSidebar;

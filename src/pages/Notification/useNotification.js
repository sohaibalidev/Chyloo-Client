import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { BASE_URL } from '@/config/app.config';

export const NOTIFICATION_TYPES = {
  LIKE_POST: 'like_post',
  LIKE_COMMENT: 'like_comment',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  FOLLOW_ACCEPT: 'follow_accept',
  FOLLOW_REQUEST: 'follow_request',
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const { socket } = useSocket();

  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/api/notifications?page=${pageNum}&limit=20`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');

      const result = await response.json();

      if (result.success) {
        if (append) {
          setNotifications((prev) => [...prev, ...result.data.notifications]);
        } else {
          setNotifications(result.data.notifications);
        }
        setUnreadCount(result.data.pagination.unreadCount || 0);
        setHasMore(pageNum < result.data.pagination.pages);
        setPage(pageNum);
      } else {
        throw new Error(result.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNotificationAction = async (notification) => {
    try {
      const response = await fetch(`${BASE_URL}/api/notifications/${notification._id}/action`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to process notification action');

      const result = await response.json();

      if (result.success) {
        return result.data.actionUrl;
      }
      return null;
    } catch (error) {
      console.error('Error handling notification click:', error);
      setError('Failed to process notification');
      return null;
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to mark as read');

      setNotifications((prev) =>
        prev.map((notif) => (notif._id === notificationId ? { ...notif, isRead: true } : notif))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/notifications/read-all`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to mark all as read');

      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
      setError('Failed to mark all as read');
    }
  };

  const handleFollowRequest = async (notification, action) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/${notification.senderId._id}/${action}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`Failed to ${action} follow request`);

      const result = await response.json();

      if (result.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== notification._id));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        throw new Error(result.message || `Failed to ${action} follow request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing follow request:`, error);
      setError(`Failed to ${action} follow request`);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete notification');

      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Failed to delete notification');
    }
  };

  const deleteMultipleNotifications = async (notificationIds) => {
    try {
      const response = await fetch(`${BASE_URL}/api/notifications/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ notificationIds }),
      });

      if (!response.ok) throw new Error('Failed to delete notifications');

      setNotifications((prev) => prev.filter((n) => !notificationIds.includes(n._id)));
    } catch (error) {
      console.error('Error deleting notifications:', error);
      setError('Failed to delete notifications');
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchNotifications(page + 1, true);
    }
  };

  const refetch = () => {
    fetchNotifications(1, false);
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleNotificationRead = (data) => {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === data.notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    socket.on('new_notification', handleNewNotification);
    socket.on('notification_read', handleNotificationRead);

    return () => {
      socket.off('new_notification', handleNewNotification);
      socket.off('notification_read', handleNotificationRead);
    };
  }, [socket]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    hasMore,
    error,
    page,

    fetchNotifications,
    handleNotificationAction,
    markAsRead,
    markAllAsRead,
    handleFollowRequest,
    deleteNotification,
    deleteMultipleNotifications,
    loadMore,
    refetch,

    totalCount: notifications.length,
  };
};

export const notificationUtils = {
  formatTime: (dateString) => {
    if (!dateString) return 'Recently';

    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  },

  getNotificationType: (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.LIKE_POST:
      case NOTIFICATION_TYPES.LIKE_COMMENT:
        return 'like';
      case NOTIFICATION_TYPES.COMMENT:
        return 'comment';
      case NOTIFICATION_TYPES.FOLLOW:
        return 'follow';
      case NOTIFICATION_TYPES.FOLLOW_ACCEPT:
        return 'follow_accept';
      case NOTIFICATION_TYPES.FOLLOW_REQUEST:
        return 'follow_request';
      default:
        return 'general';
    }
  },

  shouldShowActions: (type) => {
    return type === NOTIFICATION_TYPES.FOLLOW_REQUEST;
  },

  isFollowRequest: (type) => {
    return type === NOTIFICATION_TYPES.FOLLOW_REQUEST;
  },
};

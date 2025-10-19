import { useState, useEffect } from 'react';
import { BASE_URL } from '@/config/app.config';
import {
    Bell,
    Check,
    CheckCheck,
    User,
    Heart,
    MessageCircle,
    UserPlus,
    Inbox
} from 'lucide-react';
import styles from './Notification.module.css';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async (pageNum = 1, append = false) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}/api/notifications?page=${pageNum}&limit=20`,
                { credentials: 'include' }
            );
            const result = await response.json();

            if (result.success) {
                if (append) {
                    setNotifications(prev => [...prev, ...result.data.notifications]);
                } else {
                    setNotifications(result.data.notifications);
                }
                setUnreadCount(result.data.pagination.unreadCount);
                setHasMore(pageNum < result.data.pagination.pages);
                setPage(pageNum);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            // Get the action URL and redirect
            const response = await fetch(
                `${BASE_URL}/api/notifications/${notification._id}/action`,
                { credentials: 'include' }
            );
            const result = await response.json();

            if (result.success) {
                window.location.href = result.data.actionUrl;
            }
        } catch (error) {
            console.error('Error handling notification click:', error);
        }
    };

    const handleMarkAsRead = async (notificationId, e) => {
        e.stopPropagation();

        try {
            await fetch(
                `${BASE_URL}/api/notifications/${notificationId}/read`,
                { method: 'PUT', credentials: 'include' }
            );

            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === notificationId ? { ...notif, isRead: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await fetch(
                `${BASE_URL}/api/notifications/read-all`,
                { method: 'PUT', credentials: 'include' }
            );

            setNotifications(prev =>
                prev.map(notif => ({ ...notif, isRead: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleAcceptFollow = async (notification, e) => {
        e.stopPropagation();

        try {
            await fetch(
                `${BASE_URL}/api/follow/${notification.senderId._id}/accept`,
                {
                    method: 'POST',
                    credentials: 'include'
                }
            );

            // Remove the follow request notification after accepting
            setNotifications(prev =>
                prev.filter(notif => notif._id !== notification._id)
            );

            // You might want to create a new notification for follow acceptance
        } catch (error) {
            console.error('Error accepting follow request:', error);
        }
    };

    const handleDeclineFollow = async (notification, e) => {
        e.stopPropagation();

        try {
            await fetch(
                `${BASE_URL}/api/follow/${notification.senderId._id}/decline`,
                {
                    method: 'POST',
                    credentials: 'include'
                }
            );

            // Remove the follow request notification after declining
            setNotifications(prev =>
                prev.filter(notif => notif._id !== notification._id)
            );
        } catch (error) {
            console.error('Error declining follow request:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like_post':
            case 'like_comment':
                return <Heart className={styles.icon} />;
            case 'comment':
                return <MessageCircle className={styles.icon} />;
            case 'follow':
            case 'follow_request':
            case 'follow_accept':
                return <UserPlus className={styles.icon} />;
            default:
                return <Bell className={styles.icon} />;
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInHours * 60);
            return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
        }
        if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return date.toLocaleDateString();
    };

    const loadMore = () => {
        fetchNotifications(page + 1, true);
    };

    if (loading && notifications.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <Bell className="animate-spin" size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Notifications</h1>
                <div className={styles.actions}>
                    {unreadCount > 0 && (
                        <>
                            <span className={styles.unreadCount}>
                                {unreadCount} unread
                            </span>
                            <button
                                onClick={handleMarkAllAsRead}
                                className={styles.markAllButton}
                                disabled={unreadCount === 0}
                            >
                                Mark all as read
                            </button>
                        </>
                    )}
                </div>
            </div>

            {notifications.length === 0 ? (
                <div className={styles.emptyState}>
                    <Inbox className={styles.emptyIcon} size={64} />
                    <h3 className={styles.emptyTitle}>No notifications yet</h3>
                    <p className={styles.emptyDescription}>
                        When you get notifications, they'll show up here.
                        You'll see things like likes, comments, and follow requests.
                    </p>
                </div>
            ) : (
                <>
                    <div className={styles.notificationsList}>
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''
                                    }`}
                            >
                                <div className={styles.avatar}>
                                    {notification.senderId?.avatar ? (
                                        <img
                                            src={notification.senderId.avatar}
                                            alt={notification.senderId.username}
                                            className={styles.avatar}
                                        />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>
                                            <User size={24} />
                                        </div>
                                    )}
                                </div>

                                <div className={styles.content}>
                                    <div className={styles.messageRow}>
                                        {getNotificationIcon(notification.type)}
                                        <p className={styles.message}>
                                            {notification.message}
                                        </p>
                                    </div>

                                    <p className={styles.timestamp}>
                                        {formatTime(notification.createdAt)}
                                    </p>

                                    {notification.type === 'follow_request' && (
                                        <div className={styles.followActions}>
                                            <button
                                                onClick={(e) => handleAcceptFollow(notification, e)}
                                                className={styles.acceptButton}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={(e) => handleDeclineFollow(notification, e)}
                                                className={styles.declineButton}
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}

                                    <div className={styles.actionsRow}>
                                        {!notification.isRead && (
                                            <button
                                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                                                className={styles.readButton}
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                        {notification.isRead && (
                                            <div className={styles.statusIndicator}>
                                                <CheckCheck size={16} className={styles.readStatus} />
                                                <span>Read</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {hasMore && (
                        <div className={styles.loadMore}>
                            <button
                                onClick={loadMore}
                                className={styles.loadMoreButton}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Load more notifications'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default NotificationsPage;
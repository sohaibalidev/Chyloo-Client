import { useState } from 'react';
import { useNotifications, notificationUtils, NOTIFICATION_TYPES } from './useNotification';
import textEnhancer from '@/utils/textEnhancer';
import SEO from '@/components/SEO';
import {
    Bell,
    CheckCheck,
    User,
    Heart,
    MessageCircle,
    UserPlus,
    Inbox,
    UserCheck,
    Settings,
    Filter,
    Search,
    Trash2,
    Archive
} from 'lucide-react';
import styles from './Notification.module.css';

const Notifications = () => {
    const {
        notifications,
        unreadCount,
        loading,
        hasMore,
        error,
        handleNotificationAction,
        markAsRead,
        markAllAsRead,
        handleFollowRequest,
        deleteMultipleNotifications,
        loadMore
    } = useNotifications();

    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const getNotificationIcon = (type) => {
        const iconProps = { className: styles.icon };
        switch (type) {
            case NOTIFICATION_TYPES.LIKE_POST:
            case NOTIFICATION_TYPES.LIKE_COMMENT:
                return <Heart {...iconProps} />;
            case NOTIFICATION_TYPES.COMMENT:
                return <MessageCircle {...iconProps} />;
            case NOTIFICATION_TYPES.FOLLOW:
                return <UserPlus {...iconProps} />;
            case NOTIFICATION_TYPES.FOLLOW_ACCEPT:
                return <UserCheck {...iconProps} />;
            case NOTIFICATION_TYPES.FOLLOW_REQUEST:
                return <User {...iconProps} />;
            default:
                return <Bell {...iconProps} />;
        }
    };

    const filteredNotifications = notifications.filter(notification => {
        const matchesFilter = filter === 'all' ||
            (filter === 'unread' && !notification.isRead) ||
            (filter === 'follow' && notification.type.includes('follow'));

        const matchesSearch = searchQuery === '' ||
            (notification.message && notification.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (notification.senderId?.username && notification.senderId.username.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFilter && matchesSearch;
    });

    const handleNotificationClick = async (notification) => {
        const actionUrl = await handleNotificationAction(notification);
        if (actionUrl) {
            window.location.href = actionUrl;
        }
    };

    const handleAcceptFollowRequest = async (notification, e) => {
        e.stopPropagation();
        await handleFollowRequest(notification, 'accept');
    };

    const handleRejectFollowRequest = async (notification, e) => {
        e.stopPropagation();
        await handleFollowRequest(notification, 'reject');
    };

    if (loading && notifications.length === 0) {
        return (
            <div className={styles.container}>
                <SEO
                    title="Notifications"
                    description="Stay updated with the latest activity"
                    path="/notifications"
                />
                <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}>
                        <Bell className={styles.spinning} size={32} />
                    </div>
                    <p>Loading your notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Notifications"
                description="Stay updated with the latest activity — likes, comments, and mentions all in one place on Chyloo."
                path="/notifications"
            />

            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerMain}>
                        <div className={styles.titleSection}>
                            <Bell className={styles.titleIcon} size={28} />
                            <h1 className={styles.title}>Notifications</h1>
                            {unreadCount > 0 && (
                                <span className={styles.unreadBadge}>
                                    {unreadCount}
                                </span>
                            )}
                        </div>

                        <div className={styles.actions}>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className={styles.markAllButton}
                                    disabled={unreadCount === 0}
                                >
                                    <CheckCheck size={16} />
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={styles.controls}>
                        <div className={styles.searchBox}>
                            <Search className={styles.searchIcon} size={18} />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.filterTabs}>
                            {['all', 'unread', 'follow'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`${styles.filterTab} ${filter === tab ? styles.active : ''}`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className={styles.errorState}>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className={styles.retryButton}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {filteredNotifications.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Inbox className={styles.emptyIcon} size={80} />
                        <h3 className={styles.emptyTitle}>
                            {searchQuery ? 'No matching notifications' : 'No notifications yet'}
                        </h3>
                        <p className={styles.emptyDescription}>
                            {searchQuery
                                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                                : 'When you get notifications, they\'ll show up here. You\'ll see things like likes, comments, and new followers.'
                            }
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className={styles.clearSearchButton}
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className={styles.notificationsList}>
                            {filteredNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification._id}
                                    notification={notification}
                                    onClick={handleNotificationClick}
                                    onMarkAsRead={markAsRead}
                                    onAcceptFollow={handleAcceptFollowRequest}
                                    onRejectFollow={handleRejectFollowRequest}
                                    getNotificationIcon={getNotificationIcon}
                                    formatTime={notificationUtils.formatTime}
                                />
                            ))}
                        </div>

                        {hasMore && (
                            <div className={styles.loadMore}>
                                <button
                                    onClick={loadMore}
                                    className={styles.loadMoreButton}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className={styles.loadingDots}>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            Loading...
                                        </>
                                    ) : (
                                        'Load more notifications'
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

const NotificationItem = ({
    notification,
    onClick,
    onMarkAsRead,
    onAcceptFollow,
    onRejectFollow,
    getNotificationIcon,
    formatTime
}) => {
    const handleClick = (e) => {
        if (e.target.type === 'checkbox' ||
            e.target.closest('button') ||
            e.target.closest(`.${styles.notificationCheckbox}`)) {
            return;
        }
        onClick(notification);
    };

    return (
        <div
            onClick={handleClick}
            className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
        >
            <div className={styles.avatar}>
                {notification.senderId?.avatar ? (
                    <img
                        src={notification.senderId.avatar}
                        alt={notification.senderId.username || 'User'}
                        className={styles.avatarImage}
                    />
                ) : (
                    <div className={styles.avatarPlaceholder}>
                        <User size={20} />
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.messageRow}>
                    {getNotificationIcon(notification.type)}
                    <span
                        className={styles.message}
                        dangerouslySetInnerHTML={{
                            __html: textEnhancer(notification.message || 'New notification')
                        }}
                    />
                </div>

                <div className={styles.footer}>
                    <p className={styles.timestamp}>
                        {formatTime(notification.createdAt)}
                    </p>

                    <div className={styles.actionsRow}>
                        {notificationUtils.isFollowRequest(notification.type) && (
                            <div className={styles.followActions}>
                                <button
                                    onClick={(e) => onAcceptFollow(notification, e)}
                                    className={styles.acceptButton}
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={(e) => onRejectFollow(notification, e)}
                                    className={styles.declineButton}
                                >
                                    Decline
                                </button>
                            </div>
                        )}
                        {!notification.isRead && !notificationUtils.isFollowRequest(notification.type) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkAsRead(notification._id);
                                }}
                                className={styles.readButton}
                            >
                                Mark as read
                            </button>
                        )}
                        {notification.isRead && !notificationUtils.isFollowRequest(notification.type) && (
                            <div className={styles.statusIndicator}>
                                <CheckCheck size={14} className={styles.readStatus} />
                                <span>Read</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {!notification.isRead && (
                <div className={styles.unreadIndicator}></div>
            )}
        </div>
    );
};

export default Notifications;
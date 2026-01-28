import { useState, useMemo } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import placeholderColor from '@/utils/placeholderColor';
import styles from '../styles/ConversationList.module.css';

const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      if (conv.isGroup) {
        return conv.groupName?.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        const otherMember = conv.members?.find((member) => member._id !== currentUser?._id);
        return (
          otherMember?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          otherMember?.username?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    });
  }, [conversations, searchTerm, currentUser]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 86400000) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } else if (diff < 604800000) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getDisplayInfo = (conversation) => {
    if (conversation.isGroup) {
      return {
        name: conversation.groupName,
        avatar: conversation.groupIcon,
        isGroup: true,
      };
    } else {
      const otherMember = conversation.members?.find((member) => member._id !== currentUser?._id);
      return {
        name: otherMember?.name || 'Unknown User',
        avatar: otherMember?.avatar,
        username: otherMember?.username,
        isGroup: false,
      };
    }
  };

  const getLastMessage = (conversation) => {
    return conversation.lastMessageId || conversation.lastMessage;
  };

  const getHasNewMessages = (conversation) => {
    return conversation.hasNewMessages || false;
  };

  return (
    <div className={styles.conversationList}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2>Messages</h2>
        </div>
        <div className={styles.searchContainer}>
          <input
            type='text'
            placeholder='Search conversations...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.searchIcon}>
            <Search size={20} strokeWidth={1.8} />
          </div>
        </div>
      </div>

      <div className={styles.conversations}>
        {filteredConversations.map((conversation) => {
          const displayInfo = getDisplayInfo(conversation);
          const isSelected = selectedConversation?._id === conversation._id;
          const lastMessage = getLastMessage(conversation);
          const hasNewMessages = getHasNewMessages(conversation);

          return (
            <div
              key={conversation._id}
              className={`${styles.conversationItem} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className={styles.avatarContainer}>
                {displayInfo.avatar ? (
                  <img
                    src={displayInfo.avatar}
                    alt={displayInfo.name || 'User avatar'}
                    className={styles.avatar}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const next = e.target.nextSibling;
                      if (next) next.style.display = 'flex';
                    }}
                  />
                ) : null}

                <div
                  className={styles.profileAvatarPlaceholder}
                  style={{
                    backgroundColor: placeholderColor(displayInfo.name),
                    display: displayInfo.avatar ? 'none' : 'flex',
                  }}
                >
                  {displayInfo.name?.charAt(0).toUpperCase()}
                </div>
                {displayInfo.isGroup && (
                  <div className={styles.groupBadge}>
                    <span>Group</span>
                  </div>
                )}

                {hasNewMessages && (
                  <div className={styles.newMessageIndicator}></div>
                )}
              </div>

              <div className={styles.conversationInfo}>
                <div className={styles.conversationHeader}>
                  <h4 className={styles.conversationName}>{displayInfo.name}</h4>
                  {lastMessage && (
                    <span className={styles.time}>{formatTime(lastMessage.createdAt)}</span>
                  )}
                </div>

                <div className={styles.lastMessage}>
                  {lastMessage ? (
                    <>
                      <span className={styles.lastText}>
                        {lastMessage.text ||
                          (lastMessage.media?.length > 0 ? `Media` : 'Message sent')}
                      </span>
                      {hasNewMessages && (
                        <span className={styles.newMessageBadge}>New</span>
                      )}
                    </>
                  ) : (
                    <span className={styles.noMessages}>Start a conversation</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredConversations.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>
              {searchTerm ? (
                <Search size={36} strokeWidth={1.8} />
              ) : (
                <MessageSquare size={36} strokeWidth={1.8} />
              )}
            </div>
            <p>{searchTerm ? 'No conversations found' : 'No conversations yet'}</p>
            {!searchTerm && (
              <span className={styles.noResultsHint}>
                Start a new conversation to begin messaging
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
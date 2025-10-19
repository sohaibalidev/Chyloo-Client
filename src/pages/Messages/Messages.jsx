import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from '@/config/app.config.js';
import { MessageSquare, X } from 'lucide-react';
import { io } from 'socket.io-client';
import debounce from 'lodash/debounce';
import ConversationList from './components/ConversationList';
import MessageArea from './components/MessageArea';
import MessageInput from './components/MessageInput';
import styles from './styles/Messages.module.css';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typingUsers, setTypingUsers] = useState({});
  const socketRef = useRef(null);
  const { user } = useAuth();
  const previousConversationRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (user) {
      socketRef.current = io(BASE_URL, {
        withCredentials: true,
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setError('Failed to connect to chat server');
      });

      socketRef.current.on('newMessage', handleNewMessage);
      socketRef.current.on('messageSeen', handleMessageSeen);
      socketRef.current.on('messageDeleted', handleMessageDeleted);
      socketRef.current.on('userTyping', handleUserTyping);
      socketRef.current.on('userStoppedTyping', handleUserStoppedTyping);

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id);
      joinConversation(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    const previousConversation = previousConversationRef.current;
    return () => {
      if (previousConversation) {
        leaveConversation(previousConversation._id);
      }
    };
  }, [selectedConversation]);

  useEffect(() => {
    previousConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/messages/conversations`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to load conversations');
      const { conversations: data } = await response.json();
      setConversations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId) => {
    setMessagesLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/messages/${chatId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to load messages');
      const { messages: data } = await response.json();
      setMessages(data);

      // Mark unread messages as seen
      const unreadMessages = data.filter(
        (msg) =>
          msg.senderId._id !== user?._id &&
          (!msg.seenBy || !msg.seenBy.some((seenUser) => seenUser._id === user?._id))
      );

      if (unreadMessages.length > 0) {
        unreadMessages.forEach((msg) => {
          markAsSeen(msg._id);
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  const joinConversation = (chatId) => {
    if (socketRef.current) {
      socketRef.current.emit('joinConversation', chatId);
    }
  };

  const leaveConversation = (chatId) => {
    if (socketRef.current) {
      socketRef.current.emit('leaveConversation', chatId);
    }
  };

  const handleNewMessage = useCallback(
    (message) => {
      setMessages((prev) => {
        // Check if message already exists to avoid duplicates
        if (prev.some((msg) => msg._id === message._id)) {
          return prev;
        }
        return [...prev, message];
      });

      if (message.senderId._id !== user?._id && message.chatId === selectedConversation?._id) {
        markAsSeen(message._id);
      }
      updateConversationList(message);
    },
    [user, selectedConversation]
  );

  const handleMessageSeen = useCallback(({ messageId, seenBy }) => {
    setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, seenBy } : msg)));
  }, []);

  const handleMessageDeleted = useCallback(({ messageId }) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.lastMessage?._id === messageId) {
          const updatedConv = { ...conv };
          delete updatedConv.lastMessage;
          return updatedConv;
        }
        return conv;
      })
    );
  }, []);

  const handleUserTyping = useCallback(({ userId, userName }) => {
    setTypingUsers((prev) => ({
      ...prev,
      [userId]: userName,
    }));
  }, []);

  const handleUserStoppedTyping = useCallback(({ userId }) => {
    setTypingUsers((prev) => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  }, []);

  const updateConversationList = useCallback((message) => {
    setConversations((prev) => {
      const otherConversations = prev.filter((conv) => conv._id !== message.chatId._id);
      return [
        {
          ...message.chatId,
          lastMessage: message,
        },
        ...otherConversations,
      ];
    });
  }, []);

  const markAsSeen = useRef(
    debounce(async (messageId) => {
      try {
        await fetch(`${BASE_URL}/api/messages/${messageId}/seen`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (err) {
        console.error('Failed to mark as seen:', err);
      }
    }, 300)
  ).current;

  const sendMessage = async (text, media = []) => {
    if (!selectedConversation || !user) return;

    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('chatId', selectedConversation._id);

      media.forEach((file) => {
        formData.append('media', file);
      });

      const response = await fetch(`${BASE_URL}/api/messages`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send message');
      }

      const { message: newMessage } = await response.json();
      return newMessage;
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw to handle in MessageInput component
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/messages/${messageId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete message');
      }
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw to handle in MessageArea component
    }
  };

  const handleTypingStart = useCallback(() => {
    if (socketRef.current && selectedConversation && user) {
      socketRef.current.emit('typingStart', {
        chatId: selectedConversation._id,
        userId: user._id,
        userName: user.name,
      });
    }
  }, [selectedConversation, user]);

  const handleTypingStop = useCallback(() => {
    if (socketRef.current && selectedConversation && user) {
      socketRef.current.emit('typingStop', {
        chatId: selectedConversation._id,
        userId: user._id,
      });
    }
  }, [selectedConversation, user]);

  const handleConversationSelect = useCallback(
    (conversation) => {
      if (selectedConversation?._id === conversation._id) return;

      if (selectedConversation) {
        leaveConversation(selectedConversation._id);
      }

      setSelectedConversation(conversation);
      setMessages([]);
      setTypingUsers({});
    },
    [selectedConversation]
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className={styles.messagesContainer}>
      {error && (
        <div className={styles.errorBanner}>
          <span className={styles.errorText}>{error}</span>
          <button onClick={() => setError('')} className={styles.closeError}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>
      )}

      <div className={styles.messagesLayout}>
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleConversationSelect}
          currentUser={user}
        />

        <div className={styles.chatArea}>
          {selectedConversation ? (
            <>
              <MessageArea
                messages={messages}
                conversation={selectedConversation}
                currentUser={user}
                typingUsers={typingUsers}
                onDeleteMessage={deleteMessage}
                loading={messagesLoading}
              />
              <MessageInput
                onSendMessage={sendMessage}
                onTypingStart={handleTypingStart}
                onTypingStop={handleTypingStop}
                disabled={!user}
              />
            </>
          ) : (
            <div className={styles.noConversation}>
              <div className={styles.noConversationIcon}>
                <MessageSquare size={40} strokeWidth={1.6} />
              </div>
              <h3>Select a conversation</h3>
              <p>Choose a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;

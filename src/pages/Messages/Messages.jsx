import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { BASE_URL } from '@/config/app.config.js';
import { MessageSquare, X } from 'lucide-react';
import SEO from '@/components/SEO';
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

  const { socket } = useSocket();
  const { user } = useAuth();
  const previousConversationRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', handleNewMessage);
    socket.on('conversationSeen', handleConversationSeen);
    socket.on('messageDeleted', handleMessageDeleted);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);
    socket.on('refreshConversationList', handleRefreshConversationList);

    return () => {
      socket.off('newMessage');
      socket.off('conversationSeen');
      socket.off('messageDeleted');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
      socket.off('refreshConversationList');
    };
  }, [socket]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id);
      joinConversation(selectedConversation._id, user?._id);
      markConversationAsSeen(selectedConversation._id);
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

  const handleRefreshConversationList = useCallback(() => {
    console.log('Refreshing conversation list...');
    loadConversations();
  }, []);

  const loadMessages = async (chatId) => {
    setMessagesLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/messages/${chatId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to load messages');
      const { messages: data } = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  const markConversationAsSeen = useRef(
    debounce(async (chatId) => {
      try {
        await fetch(`${BASE_URL}/api/messages/seen`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatId }),
        });
      } catch (err) {
        console.error('Failed to mark conversation as seen:', err);
      }
    }, 300)
  ).current;

  const joinConversation = (chatId) => {
    if (socket) {
      socket.emit('joinConversation', chatId);
    }
  };

  const leaveConversation = (chatId) => {
    if (socket) {
      socket.emit('leaveConversation', chatId);
    }
  };

  const handleNewMessage = useCallback((data) => {
    const { message, conversationStatus } = data;
    setMessages((prev) => {
      if (prev.some((msg) => msg._id === message._id)) return prev;
      return [...prev, message];
    });
    updateConversationList(message, conversationStatus);
  }, []);

  const handleConversationSeen = useCallback(({ chatId, seenBy, userId }) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === chatId ? { ...conv, seenBy, hasNewMessages: !seenBy.includes(userId) } : conv
      )
    );
  }, []);

  const handleMessageDeleted = useCallback(({ messageId, deleteType }) => {
    if(deleteType === 'everyone') {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg._id === messageId) {
            return { ...msg, text: '', media: [], isDeletedForEveryone: true };
          }
          return msg;
        })
      );
      return;
    }

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg._id === messageId) {
          return { ...msg, text: '', media: [], isDeletedForEveryone: false };
        }
        return msg;
      })
    );

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

  const updateConversationList = useCallback((message, conversationStatus) => {
    setConversations((prev) => {
      const otherConversations = prev.filter((conv) => conv._id !== message.chatId._id);
      return [
        {
          ...message.chatId,
          lastMessage: message,
          seenBy: conversationStatus?.seenBy || [],
          hasNewMessages: conversationStatus?.hasNewMessages || false,
        },
        ...otherConversations,
      ];
    });
  }, []);

  const sendMessage = async (text, media = []) => {
    if (!selectedConversation || !user) return;

    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('chatId', selectedConversation._id);
      media.forEach((file) => formData.append('media', file));

      const response = await fetch(`${BASE_URL}/api/messages`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to send message');
      const { message: newMessage } = await response.json();
      return newMessage;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMessage = async (messageId, deleteType) => {
    try {
      console.log('Deleting message:', { messageId, deleteType });
      const response = await fetch(
        `${BASE_URL}/api/messages/${messageId}?deleteType=${deleteType}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      if (!response.ok) throw new Error('Failed to delete message');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleTypingStart = useCallback(() => {
    if (socket && selectedConversation && user) {
      socket.emit('typingStart', {
        chatId: selectedConversation._id,
        userId: user._id,
        userName: user.name,
      });
    }
  }, [socket, selectedConversation, user]);

  const handleTypingStop = useCallback(() => {
    if (socket && selectedConversation && user) {
      socket.emit('typingStop', {
        chatId: selectedConversation._id,
        userId: user._id,
      });
    }
  }, [socket, selectedConversation, user]);

  const handleConversationSelect = useCallback(
    (conversation) => {
      if (selectedConversation?._id === conversation._id) return;
      if (selectedConversation) leaveConversation(selectedConversation._id);
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
    <>
      <SEO
        title='Messages'
        description='Chat privately with your friends and followers on Chyloo - stay connected and never miss a conversation.'
        path='/messages'
      />

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
    </>
  );
};

export default Messages;

import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Trash2, X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import textEnhancer from '@/utils/textEnhancer'
import placeholderColor from '@/utils/placeholderColor';
import styles from '../styles/MessageArea.module.css';

const MessageArea = ({
  messages,
  conversation,
  currentUser,
  typingUsers,
  onDeleteMessage,
  loading,
}) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, message: null });
  const [mediaPopup, setMediaPopup] = useState({ open: false, media: null, type: null });
  const videoRef = useRef(null);
  const [videoState, setVideoState] = useState({
    playing: false,
    muted: false,
    progress: 0,
    duration: 0,
  });

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ visible: false, x: 0, y: 0, message: null });
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mediaPopup.open || mediaPopup.type !== 'video') return;

    const updateProgress = () => {
      setVideoState((prev) => ({
        ...prev,
        progress: video.currentTime,
        duration: video.duration,
      }));
    };

    const handlePlay = () => setVideoState((prev) => ({ ...prev, playing: true }));
    const handlePause = () => setVideoState((prev) => ({ ...prev, playing: false }));
    const handleEnded = () => setVideoState((prev) => ({ ...prev, playing: false, progress: 0 }));

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [mediaPopup.open, mediaPopup.type]);

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatMessageDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isConsecutive = (currentMsg, previousMsg) => {
    if (!previousMsg) return false;

    const timeDiff = new Date(currentMsg.createdAt) - new Date(previousMsg.createdAt);
    return currentMsg.senderId?._id === previousMsg.senderId?._id && timeDiff < 300000;
  };

  const shouldShowDateSeparator = (currentMsg, previousMsg) => {
    if (!previousMsg) return true;

    const currentDate = new Date(currentMsg.createdAt).toDateString();
    const previousDate = new Date(previousMsg.createdAt).toDateString();
    return currentDate !== previousDate;
  };

  const getDisplayInfo = () => {
    if (!conversation) return { name: '', avatar: '', isGroup: false };

    if (conversation.isGroup) {
      return {
        name: conversation.groupName || 'Group Chat',
        avatar: conversation.groupIcon,
        isGroup: true,
      };
    } else {
      const otherMember = conversation.members?.find((member) => member._id !== currentUser?._id);
      return {
        name: otherMember?.name || 'Unknown User',
        avatar: otherMember?.avatar,
        isGroup: false,
      };
    }
  };

  const handleMessageRightClick = (e, message) => {
    e.preventDefault();
    const isOwnMessage = message.senderId?._id === currentUser?._id;

    if (isOwnMessage) {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        message: message,
      });
    }
  };

  const handleDeleteMessage = async () => {
    if (contextMenu.message && onDeleteMessage) {
      try {
        await onDeleteMessage(contextMenu.message._id);
      } catch (error) {
        console.error('Failed to delete message:', error);
      } finally {
        setContextMenu({ visible: false, x: 0, y: 0, message: null });
      }
    }
  };

  const openMediaPopup = (media, type) => {
    setMediaPopup({ open: true, media, type });
    setVideoState({ playing: false, muted: false, progress: 0, duration: 0 });
  };

  const closeMediaPopup = () => {
    setMediaPopup({ open: false, media: null, type: null });
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (videoState.playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoState.muted;
    setVideoState((prev) => ({ ...prev, muted: !prev.muted }));
  };

  const handleProgressClick = (e) => {
    if (!videoRef.current || !videoState.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * videoState.duration;
  };

  const handlePopupClick = (e) => {
    if (e.target === e.currentTarget) {
      closeMediaPopup();
    }
  };

  const displayInfo = getDisplayInfo();

  const typingIndicator = Object.keys(typingUsers).length > 0 && (
    <div className={styles.typingIndicator}>
      <div className={styles.typingDots}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className={styles.typingText}>
        {Object.values(typingUsers).join(', ')}{' '}
        {Object.keys(typingUsers).length === 1 ? 'is' : 'are'} typing...
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.messageArea}>
        <div className={styles.chatHeader}>
          <div className={styles.chatInfo}>
            <div
              className={styles.profileAvatarPlaceholder}
              style={{ backgroundColor: placeholderColor(displayInfo.name) }}
            >
              {displayInfo.name?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.chatDetails}>
              <h3 className={styles.chatName}>{displayInfo.name}</h3>
              {displayInfo.isGroup && (
                <p className={styles.memberCount}>{conversation?.members?.length || 0} members</p>
              )}
            </div>
          </div>
        </div>
        <div className={styles.loadingMessages}>
          <div className={styles.spinner}></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.messageArea}>
      <div className={styles.chatHeader}>
        <div className={styles.chatInfo}>
          {displayInfo.avatar ? (
            <img
              src={displayInfo.avatar}
              alt={displayInfo.name || 'User avatar'}
              className={styles.chatAvatar}
              onError={(e) => {
                e.target.style.display = 'none';
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
          <div className={styles.chatDetails}>
            <h3 className={styles.chatName}>{displayInfo.name}</h3>
            {displayInfo.isGroup && (
              <p className={styles.memberCount}>{conversation?.members?.length || 0} members</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.messagesContainer} ref={messagesContainerRef}>
        {messages.length === 0 ? (
          <div className={styles.noMessages}>
            <div className={styles.noMessagesIcon}>
              <MessageSquare size={40} strokeWidth={1.8} />
            </div>
            <h4>No messages yet</h4>
            <p>Start the conversation by sending a message!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isMe = message.senderId?._id === currentUser?._id;
            const consecutive = isConsecutive(message, messages[index - 1]);
            const showDateSeparator = shouldShowDateSeparator(message, messages[index - 1]);

            return (
              <div key={message._id || index}>
                {showDateSeparator && (
                  <div className={styles.dateSeparator}>
                    <span>{formatMessageDate(message.createdAt)}</span>
                  </div>
                )}

                <div
                  className={`${styles.messageWrapper} ${consecutive ? styles.consecutive : ''}`}
                  onContextMenu={(e) => handleMessageRightClick(e, message)}
                >
                  <div
                    className={`${styles.message} ${isMe ? styles.myMessage : styles.theirMessage}`}
                  >
                    {!isMe && !consecutive && conversation.isGroup && (
                      <>
                        {message.senderId?.avatar ? (
                          <img
                            src={message.senderId.avatar}
                            alt={message.senderId.name}
                            className={styles.messageAvatar}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            className={styles.messageAvatarPlaceholder}
                            style={{ backgroundColor: placeholderColor(message.senderId?.name) }}
                          >
                            {message.senderId?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </>
                    )}

                    <div className={styles.messageContent}>
                      {!isMe && !consecutive && conversation.isGroup && (
                        <span className={styles.senderName}>
                          {message.senderId?.name || 'Unknown User'}
                        </span>
                      )}

                      {message.text && (
                        <div
                          className={styles.textContent}
                          dangerouslySetInnerHTML={{ __html: textEnhancer(message.text) }}
                        />
                      )}

                      {message.media && message.media.length > 0 && (
                        <div className={styles.mediaContent}>
                          {message.media.map((media, mediaIndex) => (
                            <div key={mediaIndex} className={styles.mediaItem}>
                              {media.type === 'image' && (
                                <img
                                  src={media.url}
                                  alt='Shared content'
                                  className={styles.mediaImage}
                                  loading='lazy'
                                  onClick={() => openMediaPopup(media, 'image')}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                              {media.type === 'video' && (
                                <div className={styles.videoContainer}>
                                  <video
                                    controls
                                    className={styles.mediaVideo}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      openMediaPopup(media, 'video');
                                    }}
                                  >
                                    <source src={media.url} type='video/mp4' />
                                    Your browser does not support the video tag.
                                  </video>
                                  <div
                                    className={styles.videoOverlay}
                                    onClick={() => openMediaPopup(media, 'video')}
                                  >
                                    <Play size={48} className={styles.playIcon} />
                                  </div>
                                </div>
                              )}
                              {media.type === 'audio' && (
                                <audio controls className={styles.mediaAudio}>
                                  <source src={media.url} type='audio/mpeg' />
                                  Your browser does not support the audio tag.
                                </audio>
                              )}
                              {media.type === 'file' && (
                                <div className={styles.mediaFile}>
                                  <span className={styles.fileIcon}>📎</span>
                                  <a
                                    href={media.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className={styles.fileLink}
                                  >
                                    Download File
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className={styles.messageMeta}>
                        <span className={styles.messageTime}>
                          {formatMessageTime(message.createdAt)}
                        </span>
                        {/* REMOVED: Seen indicator since it's now at conversation level */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {typingIndicator}
        <div ref={messagesEndRef} />
      </div>

      {contextMenu.visible && (
        <div
          className={styles.contextMenu}
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <button onClick={handleDeleteMessage} className={styles.contextMenuItem}>
            <Trash2 size={16} strokeWidth={1.8} />
            <span>Delete Message</span>
          </button>
        </div>
      )}

      {/* Media Popup */}
      {mediaPopup.open && (
        <div className={styles.mediaPopup} onClick={handlePopupClick}>
          <div className={styles.mediaPopupContent}>
            <button className={styles.closeButton} onClick={closeMediaPopup}>
              <X size={24} />
            </button>

            {mediaPopup.type === 'image' && (
              <img
                src={mediaPopup.media.url}
                alt='Enlarged content'
                className={styles.popupImage}
              />
            )}

            {mediaPopup.type === 'video' && (
              <div className={styles.videoPlayer}>
                <video
                  ref={videoRef}
                  src={mediaPopup.media.url}
                  className={styles.popupVideo}
                  muted={videoState.muted}
                  onClick={togglePlayPause}
                />

                <div className={styles.videoControls}>
                  <button className={styles.controlButton} onClick={togglePlayPause}>
                    {videoState.playing ? <Pause size={20} /> : <Play size={20} />}
                  </button>

                  <div className={styles.progressBar} onClick={handleProgressClick}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${(videoState.progress / videoState.duration) * 100}%` }}
                    />
                  </div>

                  <button className={styles.controlButton} onClick={toggleMute}>
                    {videoState.muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageArea;

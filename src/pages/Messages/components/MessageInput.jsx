import { useState, useRef, useEffect } from 'react';
import { Paperclip, X } from 'lucide-react';
import styles from '../styles/MessageInput.module.css';

const MessageInput = ({ onSendMessage, onTypingStart, onTypingStop, disabled }) => {
  const [message, setMessage] = useState('');
  const [media, setMedia] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    if (newMessage.trim() && onTypingStart) {
      onTypingStart();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (onTypingStop) {
          onTypingStop();
        }
      }, 1000);
    } else if (!newMessage.trim() && onTypingStop) {
      onTypingStop();
    }
  };

  const handleBlur = () => {
    if (onTypingStop) {
      onTypingStop();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() && media.length === 0) return;

    setIsUploading(true);
    try {
      await onSendMessage(message.trim(), media);
      setMessage('');
      setMedia([]);

      if (onTypingStop) {
        onTypingStop();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const maxSize = 40 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size too large. Maximum 10MB allowed.');
        return false;
      }
      return true;
    });

    setMedia((prev) => [...prev, ...validFiles]);
    e.target.value = '';
  };

  const removeMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.messageInputContainer}>
      {media.length > 0 && (
        <div className={styles.mediaPreview}>
          {media.map((file, index) => (
            <div key={index} className={styles.mediaPreviewItem}>
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt='Preview'
                  className={styles.mediaPreviewImage}
                />
              ) : (
                <div className={styles.mediaPreviewFile}>
                  <span className={styles.fileIcon}>📎</span>
                  <span className={styles.fileName}>{file.name}</span>
                </div>
              )}
              <button
                onClick={() => removeMedia(index)}
                className={styles.removeMedia}
                type='button'
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <div className={styles.inputActions}>
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className={styles.mediaButton}
            disabled={isUploading || disabled}
          >
            <Paperclip size={18} strokeWidth={2} />
          </button>

          <input
            type='file'
            ref={fileInputRef}
            onChange={handleMediaSelect}
            multiple
            accept='image/*,video/*,audio/*'
            className={styles.fileInput}
            disabled={disabled}
          />
        </div>

        <div className={styles.textInputContainer}>
          <textarea
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
            placeholder={disabled ? 'Please log in to send messages' : 'Type a message...'}
            className={styles.textInput}
            rows='1'
            disabled={isUploading || disabled}
          />
        </div>

        <button
          type='submit'
          disabled={(!message.trim() && media.length === 0) || isUploading || disabled}
          className={styles.sendButton}
        >
          {isUploading ? <div className={styles.spinner}></div> : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

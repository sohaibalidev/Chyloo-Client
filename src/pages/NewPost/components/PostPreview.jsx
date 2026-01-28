import { Globe, Users, Lock, Heart, MessageCircle, User, Image, Video, File } from 'lucide-react';
import styles from '../styles/PostPreview.module.css';

const PostPreview = ({ caption, media, visibility }) => {
  const getVisibilityIcon = (vis) => {
    switch (vis) {
      case 'public':
        return <Globe size={14} />;
      case 'followers':
        return <Users size={14} />;
      case 'private':
        return <Lock size={14} />;
      default:
        return <Globe size={14} />;
    }
  };

  const getVisibilityText = (vis) => {
    switch (vis) {
      case 'public':
        return 'Public';
      case 'followers':
        return 'Followers';
      case 'private':
        return 'Private';
      default:
        return 'Public';
    }
  };

  const getFileType = (file) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'file';
  };

  const getFileIcon = (file) => {
    const type = getFileType(file);
    switch (type) {
      case 'image':
        return <Image size={16} />;
      case 'video':
        return <Video size={16} />;
      default:
        return <File size={16} />;
    }
  };

  return (
    <div className={styles.postPreview}>
      <h3 className={styles.previewTitle}>Preview</h3>

      <div className={styles.previewCard}>
        <div className={styles.previewHeader}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <User size={20} />
            </div>
            <div>
              <div className={styles.username}>You</div>
              <div className={styles.visibility}>
                {getVisibilityIcon(visibility)}
                {getVisibilityText(visibility)}
              </div>
            </div>
          </div>
        </div>

        {caption && <div className={styles.previewCaption}>{caption}</div>}

        {media.length > 0 && (
          <div className={styles.previewMedia}>
            {media.slice(0, 4).map((file, index) => (
              <div key={index} className={styles.previewMediaItem}>
                {getFileType(file) === 'image' ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className={styles.previewThumbnail}
                  />
                ) : (
                  <div className={styles.previewFile}>
                    {getFileIcon(file)}
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            ))}
            {media.length > 4 && (
              <div className={styles.moreFiles}>+{media.length - 4} more files</div>
            )}
          </div>
        )}

        <div className={styles.previewEngagement}>
          <div className={styles.engagementStats}>
            <span className={styles.engagementItem}>
              <Heart size={14} />0 likes
            </span>
            <span className={styles.engagementItem}>
              <MessageCircle size={14} />0 comments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;

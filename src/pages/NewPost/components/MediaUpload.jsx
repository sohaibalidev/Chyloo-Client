import { useRef } from 'react';
import { Upload, File, Image, Video, X } from 'lucide-react';
import styles from '../styles/MediaUpload.module.css';

const MediaUpload = ({ media, onMediaUpload, onRemoveMedia }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(
      (file) =>
        file.type.startsWith('image/') ||
        file.type.startsWith('video/') ||
        file.type.includes('pdf') ||
        file.type.includes('document')
    );

    if (validFiles.length > 0) {
      onMediaUpload(validFiles);
    }

    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length > 0) {
      onMediaUpload(validFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
        return <Image size={20} />;
      case 'video':
        return <Video size={20} />;
      default:
        return <File size={20} />;
    }
  };

  return (
    <div className={styles.mediaUpload}>
      <label className={styles.label}>
        <Image size={16} />
        Media
      </label>

      <div
        className={styles.dropZone}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={styles.dropZoneContent}>
          <Upload size={32} className={styles.uploadIcon} />
          <p>Drag & drop files here or click to browse</p>
          <small>Supports images, videos, and documents</small>
        </div>
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept='image/*,video/*,.pdf,.doc,.docx'
          onChange={handleFileSelect}
          className={styles.fileInput}
        />
      </div>

      {media.length > 0 && (
        <div className={styles.mediaPreview}>
          <h4>Selected Files ({media.length})</h4>
          <div className={styles.mediaGrid}>
            {media.map((file, index) => (
              <div key={index} className={styles.mediaItem}>
                <div className={styles.mediaThumbnail}>
                  {getFileType(file) === 'image' ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className={styles.thumbnailImage}
                    />
                  ) : (
                    <div className={styles.fileThumbnail}>{getFileIcon(file)}</div>
                  )}
                </div>
                <button
                  type='button'
                  onClick={() => onRemoveMedia(index)}
                  className={styles.removeMediaBtn}
                >
                  <X size={14} />
                </button>
                <span className={styles.fileName}>{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;

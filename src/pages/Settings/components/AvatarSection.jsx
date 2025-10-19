import { useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import styles from '../styles/AvatarSection.module.css';

const AvatarSection = ({ user, avatarPreview, onAvatarChange, onRemoveAvatar, error, isLoading }) => {
    const [imgError, setImgError] = useState(false);

    const handleAvatarFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                onAvatarChange(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const showPlaceholder = !avatarPreview || imgError;

    return (
        <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
                {showPlaceholder ? (
                    <div className={styles.avatarPlaceholder}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                ) : (
                    <img
                        src={avatarPreview}
                        alt="Avatar"
                        className={styles.avatar}
                        onError={() => setImgError(true)}
                    />
                )}
                <div className={styles.avatarActions}>
                    <button
                        className={styles.avatarButton}
                        onClick={() => document.getElementById('avatar-upload').click()}
                        disabled={isLoading}
                    >
                        <Camera size={16} />
                        Change
                    </button>
                    {user.avatar && (
                        <button
                            className={`${styles.avatarButton} ${styles.removeButton}`}
                            onClick={onRemoveAvatar}
                            disabled={isLoading}
                        >
                            <Trash2 size={16} />
                            Remove
                        </button>
                    )}
                </div>
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className={styles.fileInput}
                />
                {error && <div className={styles.error}>{error}</div>}
            </div>
        </div>
    );
};

export default AvatarSection;
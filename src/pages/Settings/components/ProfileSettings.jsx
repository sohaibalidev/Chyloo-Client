import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import AvatarSection from './AvatarSection';
import styles from '../styles/ProfileSettings.module.css';

const ProfileSettings = ({ user, onUpdate }) => {
    const [profileForm, setProfileForm] = useState({
        name: user.name,
        username: user.username,
        bio: user.bio || '',
    });
    const [avatarPreview, setAvatarPreview] = useState(user.avatar);
    const [avatarFile, setAvatarFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [apiError, setApiError] = useState('');

    const { updateProfile, deleteAvatar, loading: profileLoading } = useUpdateProfile();

    useEffect(() => {
        setProfileForm({
            name: user.name,
            username: user.username,
            bio: user.bio || '',
        });
        setAvatarPreview(user.avatar);
    }, [user]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        // Clear API error when user starts typing
        if (apiError) {
            setApiError('');
        }
    };

    const handleAvatarChange = (file) => {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
        setErrors(prev => ({ ...prev, avatar: '' }));
        // Clear API error when avatar changes
        if (apiError) {
            setApiError('');
        }
    };

    const handleRemoveAvatar = async () => {
        try {
            await deleteAvatar();
            setAvatarPreview('');
            setAvatarFile(null);
            window.dispatchEvent(new CustomEvent('profileUpdated'));
            onUpdate();
        } catch (error) {
            setErrors(prev => ({ ...prev, avatar: error.message }));
        }
    };

    const validateProfile = () => {
        const errors = {};
        if (!profileForm.name.trim()) errors.name = 'Name is required';
        if (!profileForm.username.trim()) errors.username = 'Username is required';
        if (profileForm.username.length < 3) errors.username = 'Username must be at least 3 characters';
        if (profileForm.bio.length > 160) errors.bio = 'Bio must be 160 characters or less';
        return errors;
    };

    const handleSaveProfile = async () => {
        // Clear previous errors
        setErrors({});
        setApiError('');

        const validationErrors = validateProfile();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSaving(true);
        try {
            const submitData = new FormData();
            submitData.append('name', profileForm.name.trim());
            submitData.append('username', profileForm.username.trim());
            submitData.append('bio', profileForm.bio.trim());

            if (avatarFile) {
                submitData.append('avatar', avatarFile);
            }

            await updateProfile(submitData);

            window.dispatchEvent(new CustomEvent('profileUpdated', {
                detail: {
                    username: profileForm.username.trim(),
                    name: profileForm.name.trim(),
                    bio: profileForm.bio.trim()
                }
            }));

            onUpdate(profileForm.username.trim());
        } catch (error) {
            console.error('Failed to update profile:', error);
            // Set API error message
            setApiError(error.message);
            // Revert avatar preview on error
            if (avatarFile) {
                setAvatarPreview(user.avatar);
                setAvatarFile(null);
            }
        } finally {
            setSaving(false);
        }
    };

    const isLoading = profileLoading || saving;

    return (
        <div className={styles.tabContent}>
            <h3>Profile Settings</h3>

            {/* API Error Message */}
            {apiError && (
                <div className={styles.apiError}>
                    {apiError}
                </div>
            )}

            <AvatarSection
                user={user}
                avatarPreview={avatarPreview}
                onAvatarChange={handleAvatarChange}
                onRemoveAvatar={handleRemoveAvatar}
                error={errors.avatar}
                isLoading={isLoading}
            />

            <div className={styles.formGroup}>
                <label>Name *</label>
                <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className={errors.name ? styles.errorInput : ''}
                />
                {errors.name && <div className={styles.error}>{errors.name}</div>}
            </div>

            <div className={styles.formGroup}>
                <label>Username *</label>
                <input
                    type="text"
                    name="username"
                    value={profileForm.username}
                    onChange={handleProfileChange}
                    className={errors.username ? styles.errorInput : ''}
                />
                {errors.username && <div className={styles.error}>{errors.username}</div>}
            </div>

            <div className={styles.formGroup}>
                <label>Bio</label>
                <textarea
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    rows="3"
                    maxLength="160"
                    className={errors.bio ? styles.errorInput : ''}
                />
                <div className={styles.charCount}>
                    {profileForm.bio.length}/160
                </div>
                {errors.bio && <div className={styles.error}>{errors.bio}</div>}
            </div>

            <button
                className={styles.saveButton}
                onClick={handleSaveProfile}
                disabled={isLoading}
            >
                <Save size={16} />
                {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
        </div>
    );
};

export default ProfileSettings;
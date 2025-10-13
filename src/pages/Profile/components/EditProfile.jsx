import { useState, useRef, useEffect } from 'react';
import { X, Camera, Trash2, Save, Loader, AlertCircle, BadgeCheck } from 'lucide-react';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import styles from '../styles/EditProfile.module.css';

const EditProfile = ({ user, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isVerified, setIsVerified] = useState(user.isVerified || false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { updateProfile, deleteAvatar, loading, error: hookError } = useUpdateProfile();

  useEffect(() => {
    if (isOpen) {
      setFormErrors({});
      setFormData({
        name: user.name,
        username: user.username,
        bio: user.bio || '',
      });
      setAvatarPreview(user.avatar);
      setAvatarFile(null);
      setIsVerified(user.isVerified || false);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (hookError) {
      setFormErrors({ general: hookError });
    }
  }, [hookError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleToggleVerification = async () => {
    setVerificationLoading(true);
    setIsVerified(!isVerified);
    setVerificationLoading(false);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (formData.bio.length > 160) {
      errors.bio = 'Bio must be 160 characters or less';
    }

    return errors;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormErrors((prev) => ({
          ...prev,
          avatar: 'Please select an image file',
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          avatar: 'Image must be smaller than 5MB',
        }));
        return;
      }

      setAvatarFile(file);
      setFormErrors((prev) => ({
        ...prev,
        avatar: '',
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.onerror = () => {
        setFormErrors((prev) => ({
          ...prev,
          avatar: 'Error reading image file',
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setFormErrors((prev) => ({
        ...prev,
        avatar: '',
      }));

      await deleteAvatar();
      setAvatarPreview('');
      setAvatarFile(null);
      onUpdate();
    } catch (error) {
      console.error('Failed to remove avatar:', error);
      setFormErrors((prev) => ({
        ...prev,
        avatar: error.message || 'Failed to remove avatar',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setFormErrors({});

      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('username', formData.username.trim());
      submitData.append('bio', formData.bio.trim());
      submitData.append('isVerified', isVerified);

      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      }

      await updateProfile(submitData);

      onUpdate(formData.username.trim());
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleClose = () => {
    setFormErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit Profile</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.editForm}>
          {formErrors.general && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} />
              <span>{formErrors.general}</span>
            </div>
          )}

          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              {avatarPreview ? (
                <img src={avatarPreview} alt='Avatar preview' className={styles.avatarPreview} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}

              <div className={styles.avatarActions}>
                <button
                  type='button'
                  className={styles.avatarButton}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={16} />
                  Change
                </button>
                {user.avatar && (
                  <button
                    type='button'
                    className={`${styles.avatarButton} ${styles.removeButton}`}
                    onClick={handleRemoveAvatar}
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleAvatarChange}
                className={styles.fileInput}
              />

              {formErrors.avatar && (
                <div className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {formErrors.avatar}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='name' className={styles.label}>
              Name *
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              className={`${styles.input} ${formErrors.name ? styles.inputError : ''}`}
              required
              maxLength='30'
            />
            <div className={styles.fieldInfo}>
              <span className={styles.charCount}>{formData.name.length}/30</span>
              {formErrors.name && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {formErrors.name}
                </span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='username' className={styles.label}>
              Username *
            </label>
            <input
              type='text'
              id='username'
              name='username'
              value={formData.username}
              onChange={handleInputChange}
              className={`${styles.input} ${formErrors.username ? styles.inputError : ''}`}
              required
              minLength='3'
              maxLength='20'
              pattern='[a-zA-Z0-9_]+'
              title='Username can only contain letters, numbers, and underscores'
            />
            <div className={styles.fieldInfo}>
              <span className={styles.charCount}>{formData.username.length}/20</span>
              {formErrors.username && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {formErrors.username}
                </span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='bio' className={styles.label}>
              Bio
            </label>
            <textarea
              id='bio'
              name='bio'
              value={formData.bio}
              onChange={handleInputChange}
              className={`${styles.textarea} ${formErrors.bio ? styles.inputError : ''}`}
              rows='3'
              maxLength='160'
              placeholder='Tell everyone about yourself...'
            />
            <div className={styles.fieldInfo}>
              <span className={styles.charCount}>{formData.bio.length}/160</span>
              {formErrors.bio && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {formErrors.bio}
                </span>
              )}
            </div>
          </div>

          {/* Real Verification Toggle */}
          <div className={styles.verificationSection}>
            <label className={styles.verificationLabel}>
              <span>Account Verification</span>
              <div className={styles.verificationToggle}>
                <button
                  type='button'
                  className={`${styles.toggleButton} ${isVerified ? styles.verified : ''}`}
                  onClick={handleToggleVerification}
                  disabled={verificationLoading || loading}
                >
                  {verificationLoading ? (
                    <Loader size={14} className={styles.spinner} />
                  ) : (
                    <BadgeCheck size={14} />
                  )}
                  <span>
                    {verificationLoading
                      ? 'Updating...'
                      : isVerified
                      ? 'Verified'
                      : 'Verify Account'}
                  </span>
                </button>
              </div>
            </label>
            <p className={styles.verificationNote}>
              {isVerified
                ? 'Your account is verified. Users will see a verification badge.'
                : 'Get your account verified to build trust with other users.'}
            </p>
            {formErrors.verification && (
              <div className={styles.fieldError}>
                <AlertCircle size={12} />
                {formErrors.verification}
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type='button'
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={loading || verificationLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className={styles.saveButton}
              disabled={loading || verificationLoading}
            >
              {loading ? (
                <>
                  <Loader size={16} className={styles.spinner} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

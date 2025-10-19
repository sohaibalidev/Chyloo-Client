import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/config/app.config';
import { Loader2 } from 'lucide-react';
import CaptionEditor from './components/CaptionEditor';
import MediaUpload from './components/MediaUpload';
import VisibilitySelector from './components/VisibilitySelector';
import PostPreview from './components/PostPreview';
import styles from './styles/NewPost.module.css';

const NewPost = () => {
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState([]);
  const [visibility, setVisibility] = useState('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleMediaUpload = (files) => {
    setMedia((prev) => [...prev, ...files]);
  };

  const removeMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim() && media.length === 0) {
      setError('Please add a caption or media to create a post');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('visibility', visibility);

      media.forEach((file) => {
        formData.append('media', file);
      });

      const response = await fetch(`${BASE_URL}/api/posts/`, {
        credentials: 'include',
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Failed to create post');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = (caption.trim() || media.length > 0) && !isSubmitting;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.editorSection}>
            <CaptionEditor
              value={caption}
              onChange={setCaption}
              placeholder="What's on your mind?"
            />

            <MediaUpload
              media={media}
              onMediaUpload={handleMediaUpload}
              onRemoveMedia={removeMedia}
            />

            <VisibilitySelector value={visibility} onChange={setVisibility} />

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.actions}>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className={styles.cancelBtn}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type='submit' className={styles.submitBtn} disabled={!canSubmit}>
                {isSubmitting ? (
                  <>
                    <Loader2 className={styles.spinning} size={18} />
                    Publishing...
                  </>
                ) : (
                  'Publish Post'
                )}
              </button>
            </div>
          </div>

          <div className={styles.previewSection}>
            <PostPreview caption={caption} media={media} visibility={visibility} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;

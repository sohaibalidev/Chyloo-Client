import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import useNewStory from './useNewStory';
import styles from './NewStory.module.css';

const NewStory = () => {
    const [media, setMedia] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { createStory } = useNewStory();

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            alert('Please select an image or video file');
            return;
        }

        if (file.size > 40 * 1024 * 1024) {
            alert('File size must be less than 40MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setMedia(e.target.result);
            setSelectedFile(file);
            setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            const input = fileInputRef.current;
            if (input) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                input.files = dataTransfer.files;
                handleFileSelect({ target: { files: dataTransfer.files } });
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Submit triggered');

        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }

        try {
            setUploading(true);
            console.log('Starting upload...');

            const formData = new FormData();
            formData.append('media', selectedFile);
            formData.append('caption', caption);

            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value instanceof File ? `${value.name} (${value.type})` : value);
            }

            const result = await createStory(formData);
            console.log('Story created successfully:', result);

            navigate('/');
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.message || 'Failed to upload story');
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const resetForm = () => {
        setMedia(null);
        setMediaType(null);
        setCaption('');
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Create New Story</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {!media ? (
                    <div
                        className={styles.uploadArea}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className={styles.uploadContent}>
                            <div className={styles.uploadIcon}>
                                <ImagePlus size={48} strokeWidth={1.5} />
                            </div>
                            <h3 className={styles.uploadTitle}>Upload Photo or Video</h3>
                            <p className={styles.uploadText}>Drag and drop or click to select</p>
                            <p className={styles.uploadHint}>
                                Supports: JPG, PNG, MP4, MOV (Max 40MB)
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileSelect}
                            className={styles.fileInput}
                            disabled={uploading}
                        />
                    </div>
                ) : (
                    <div className={styles.previewContainer}>
                        <div className={styles.previewHeader}>
                            <h2>Story Preview</h2>
                            <button
                                type="button"
                                onClick={resetForm}
                                className={styles.closePreviewButton}
                                disabled={uploading}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.preview}>
                            {mediaType === 'image' ? (
                                <img src={media} alt="Preview" className={styles.previewMedia} />
                            ) : (
                                <video
                                    src={media}
                                    controls
                                    className={styles.previewMedia}
                                />
                            )}
                        </div>

                        <div className={styles.captionSection}>
                            <label htmlFor="caption" className={styles.captionLabel}>
                                Add Caption (Optional)
                            </label>
                            <textarea
                                id="caption"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="What's happening?"
                                className={styles.captionInput}
                                maxLength={150}
                                rows={3}
                                disabled={uploading}
                            />
                            <div className={styles.charCount}>
                                {caption.length}/150
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button
                                type="button"
                                onClick={resetForm}
                                className={styles.cancelButton}
                                disabled={uploading}
                            >
                                Choose Different
                            </button>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <div className={styles.spinner}></div>
                                        Uploading...
                                    </>
                                ) : (
                                    'Share Story'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default NewStory;
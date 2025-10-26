import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    X,
} from 'lucide-react';
import { usePostPopup } from '../hooks/usePostPopup.js';
import textEnhancer from '@/utils/textEnhancer';
import UserCard from '@/components/UserCard';
import styles from '../styles/PostPopup.module.css';

const PostPopup = ({ post, onClose }) => {
    const {
        activeMediaIndex,
        videoStates,
        isLiked,
        isSaved,
        likesCount,
        isLiking,
        videoRefs,
        mediaContainerRef,
        handleMediaScroll,
        scrollToMedia,
        navigateMedia,
        toggleVideoPlayback,
        handleVideoClick,
        handleVideoEnded,
        handleLike,
        handleSave,
        formatDate,
    } = usePostPopup(post);

    if (!post || !post._id) {
        return (
            <div className={styles.overlay}>
                <div className={styles.popup}>Post not available</div>
            </div>
        );
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <div className={styles.popupContent}>
                    <div className={styles.mediaSection}>
                        {post.media && post.media.length > 0 && (
                            <div className={styles.postMedia}>
                                {post.media.length > 1 && (
                                    <div className={styles.mediaIndicators}>
                                        {post.media.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`${styles.mediaIndicator} ${activeMediaIndex === index ? styles.active : ''
                                                    }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    scrollToMedia(index);
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                )}

                                {post.media.length > 1 && (
                                    <>
                                        {activeMediaIndex > 0 && (
                                            <button
                                                className={`${styles.navBtn} ${styles.navBtnLeft}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigateMedia('prev');
                                                }}
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                        )}
                                        {activeMediaIndex < post.media.length - 1 && (
                                            <button
                                                className={`${styles.navBtn} ${styles.navBtnRight}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigateMedia('next');
                                                }}
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        )}
                                    </>
                                )}

                                <div
                                    id={`post-popup-media-container-${post._id}`}
                                    className={styles.mediaContainer}
                                    onScroll={handleMediaScroll}
                                >
                                    {post.media.map((mediaItem, index) => (
                                        <div key={mediaItem._id || index} className={styles.mediaItem}>
                                            {mediaItem.type === 'image' ? (
                                                <img src={mediaItem.url} alt={post.caption} />
                                            ) : (
                                                <div
                                                    className={styles.videoContainer}
                                                    onClick={(e) => handleVideoClick(index, e)}
                                                >
                                                    <video
                                                        ref={(el) => {
                                                            const videoId = `post-popup-${post._id}-${index}`;
                                                            videoRefs.current[videoId] = el;
                                                        }}
                                                        data-video-id={`post-popup-${post._id}-${index}`}
                                                        muted={false}
                                                        loop={true}
                                                        onEnded={() => handleVideoEnded(index)}
                                                    >
                                                        <source src={mediaItem.url} type='video/mp4' />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                    <div className={styles.videoControls}>
                                                        <button
                                                            className={styles.videoPlayBtn}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleVideoPlayback(index);
                                                            }}
                                                        >
                                                            {videoStates[`post-popup-${post._id}-${index}`]?.isPlaying ? (
                                                                <Pause size={24} />
                                                            ) : (
                                                                <Play size={24} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.contentSection}>
                        <div className={styles.popupHeader}>
                            <UserCard user={post.user} showUsername={false} showName={true} />
                            <button className={styles.postMore}>
                                <MoreHorizontal size={18} />
                            </button>
                        </div>

                        <div className={styles.commentsContainer}>
                            <div className={styles.commentItem}>
                                <div className={styles.commentHeader}>
                                    <a
                                        href={`/profile/${post.user?.username || 'unknown'}`}
                                        className={styles.commentUsername}
                                        onClick={(e) => handleProfileClick(post.user?.username || 'unknown', e)}
                                    >
                                        @{post.user?.username || 'unknown'}
                                    </a>
                                </div>
                                <div
                                    className={styles.commentText}
                                    dangerouslySetInnerHTML={{ __html: textEnhancer(post.caption || '') }}
                                />
                                <div className={styles.commentTime}>{formatDate(post.createdAt)}</div>
                            </div>

                            {post.comments?.map((comment) => (
                                <div key={comment._id} className={styles.commentItem}>
                                    <div className={styles.commentHeader}>
                                        <a
                                            href={`/profile/${comment.user?.username || 'unknown'}`}
                                            className={styles.commentUsername}
                                            onClick={(e) => handleProfileClick(comment.user?.username || 'unknown', e)}
                                        >
                                            @{comment.user?.username || 'unknown'}
                                        </a>
                                    </div>
                                    <div className={styles.commentText}>{comment.text}</div>
                                    <div className={styles.commentTime}>{formatDate(comment.createdAt)}</div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.popupActions}>
                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.actionBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike();
                                    }}
                                >
                                    <Heart size={24} fill={isLiked ? 'red' : 'none'} stroke={isLiked ? 'red' : 'white'} />
                                </button>
                                <button className={styles.actionBtn}>
                                    <MessageCircle size={24} />
                                </button>
                                <button className={styles.actionBtn}>
                                    <Send size={24} />
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${styles.saveBtn}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSave();
                                    }}
                                >
                                    <Bookmark size={24} fill={isSaved ? 'white' : 'none'} />
                                </button>
                            </div>

                            <div className={styles.likesCount}>{likesCount} likes</div>
                            <div className={styles.postTime}>{formatDate(post.createdAt)}</div>
                        </div>

                        <div className={styles.addComment}>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className={styles.commentInput}
                            />
                            <button className={styles.postCommentBtn}>Post</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostPopup;
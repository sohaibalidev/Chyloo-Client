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
} from 'lucide-react';
import { usePostCard } from './usePostCard.js';
import { Link } from 'react-router-dom';
import textEnhancer from '@/utils/textEnhancer';
import UserCard from '@/components/UserCard';
import styles from './PostCard.module.css';

const PostCard = ({ post }) => {
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
  } = usePostCard(post);

  if (!post || !post._id) {
    return <div className={styles.postCard}>Post not available</div>;
  }

  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <UserCard user={post.user} showUsername={false} showName={true} />

        <button className={styles.postMore}>
          <MoreHorizontal size={18} />
        </button>
      </div>

      {post.media && post.media.length > 0 && (
        <div className={styles.postMedia}>
          {post.media.length > 1 && (
            <div className={styles.mediaIndicators}>
              {post.media.map((_, index) => (
                <div
                  key={index}
                  className={`${styles.mediaIndicator} ${activeMediaIndex === index ? styles.active : ''
                    }`}
                  onClick={() => scrollToMedia(index)}
                ></div>
              ))}
            </div>
          )}

          {post.media.length > 1 && (
            <>
              {activeMediaIndex > 0 && (
                <button
                  className={`${styles.navBtn} ${styles.navBtnLeft}`}
                  onClick={() => navigateMedia('prev')}
                >
                  <ChevronLeft size={16} />
                </button>
              )}
              {activeMediaIndex < post.media.length - 1 && (
                <button
                  className={`${styles.navBtn} ${styles.navBtnRight}`}
                  onClick={() => navigateMedia('next')}
                >
                  <ChevronRight size={16} />
                </button>
              )}
            </>
          )}

          <div
            id={`post-media-container-${post._id}`}
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
                        const videoId = `post-${post._id}-${index}`;
                        videoRefs.current[videoId] = el;
                      }}
                      data-video-id={`post-${post._id}-${index}`}
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
                        {videoStates[`post-${post._id}-${index}`]?.isPlaying ? (
                          <Pause size={20} />
                        ) : (
                          <Play size={20} />
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

      <div className={styles.postActions}>
        <button className={styles.actionBtn} onClick={handleLike}>
          <Heart size={20} fill={isLiked ? 'red' : 'none'} stroke={isLiked ? 'red' : 'white'} />
        </button>
        <button className={styles.actionBtn}>
          <MessageCircle size={20} />
        </button>
        <button className={styles.actionBtn}>
          <Send size={20} />
        </button>
        <button className={`${styles.actionBtn} ${styles.saveBtn}`} onClick={handleSave}>
          <Bookmark size={20} fill={isSaved ? 'white' : 'none'} />
        </button>
      </div>

      <div className={styles.postLikes}>{likesCount} likes</div>

      <div className={styles.postCaption}>
        <Link
          to={`/profile/${post.user?.username || 'unknown'}`}
          className={styles.postUsername}
        >
          @{post.user?.username || 'unknown'}
        </Link>{' '}
        <span
          dangerouslySetInnerHTML={{ __html: textEnhancer(post.caption || '') }}
        />
      </div>

      {post.comments && post.comments.length > 0 && (
        <div className={styles.postComments}>
          {post.comments.slice(0, 2).map((comment) => (
            <div key={comment._id} className={styles.comment}>
              <span className={styles.commentUsername}>@{comment.user?.username || 'unknown'}</span>
              <span>{comment.text}</span>
            </div>
          ))}
          {post.commentsCount > 2 && (
            <div className={styles.viewAllComments}>View all {post.commentsCount} comments</div>
          )}
        </div>
      )}

      <div className={styles.postTime}>{formatDate(post.createdAt)}</div>
    </div>
  );
};

export default PostCard;
import { useState, useRef, useEffect } from 'react';
import { BASE_URL } from '@/config/app.config';

export const usePostCard = (post) => {
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [isSaved, setIsSaved] = useState(post?.isSaved || false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [videoStates, setVideoStates] = useState({});
  const [isLiking, setIsLiking] = useState(false);

  const likeRequestRef = useRef(null);
  const videoRefs = useRef({});
  const mediaContainerRef = useRef(null);
  const observerRef = useRef();

  useEffect(() => {
    if (!post?.media) return;

    const initialVideoStates = {};
    post.media.forEach((mediaItem, index) => {
      if (mediaItem.type === 'video') {
        const videoId = `post-${post._id}-${index}`;
        initialVideoStates[videoId] = {
          isPlaying: false,
          isMuted: true,
          showControls: false,
        };
      }
    });
    setVideoStates(initialVideoStates);
  }, [post]);

  useEffect(() => {
    if (!post?.media || Object.keys(videoRefs.current).length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = entry.target.dataset.videoId;
          if (!videoId || !videoId.startsWith(`post-${post._id}`)) return;

          if (!entry.isIntersecting) {
            const video = videoRefs.current[videoId];
            if (video && !video.paused) {
              video.pause();
              setVideoStates((prev) => ({
                ...prev,
                [videoId]: {
                  ...prev[videoId],
                  isPlaying: false,
                },
              }));
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.entries(videoRefs.current).forEach(([videoId, video]) => {
      if (video && videoId.startsWith(`post-${post._id}`)) {
        observerRef.current.observe(video);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [post]);

  useEffect(() => {
    if (post?._id) {
      mediaContainerRef.current = document.getElementById(`post-media-container-${post._id}`);
    }
  }, [post]);

  const handleMediaScroll = (event) => {
    const container = event.target;
    const scrollPosition = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const newIndex = Math.round(scrollPosition / containerWidth);

    post.media.forEach((mediaItem, index) => {
      if (mediaItem.type === 'video' && index !== newIndex) {
        const videoId = `post-${post._id}-${index}`;
        const video = videoRefs.current[videoId];
        if (video && !video.paused) {
          video.pause();
          setVideoStates((prev) => ({
            ...prev,
            [videoId]: {
              ...prev[videoId],
              isPlaying: false,
            },
          }));
        }
      }
    });

    setActiveMediaIndex(newIndex);
  };

  const scrollToMedia = (index) => {
    if (!mediaContainerRef.current) return;

    mediaContainerRef.current.scrollTo({
      left: index * mediaContainerRef.current.clientWidth,
      behavior: 'smooth',
    });
  };

  const navigateMedia = (direction) => {
    let newIndex;
    if (direction === 'next') {
      newIndex = Math.min(activeMediaIndex + 1, post.media.length - 1);
    } else {
      newIndex = Math.max(activeMediaIndex - 1, 0);
    }

    scrollToMedia(newIndex);
  };

  const toggleVideoPlayback = (mediaIndex) => {
    const videoId = `post-${post._id}-${mediaIndex}`;
    const video = videoRefs.current[videoId];

    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => {
          setVideoStates((prev) => ({
            ...prev,
            [videoId]: {
              ...prev[videoId],
              isPlaying: true,
            },
          }));
        })
        .catch((error) => {
          console.error('Error playing video:', error);
        });
    } else {
      video.pause();
      setVideoStates((prev) => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          isPlaying: false,
        },
      }));
    }
  };

  const handleVideoClick = (mediaIndex, event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleVideoPlayback(mediaIndex);
  };

  const handleVideoEnded = (mediaIndex) => {
    const videoId = `post-${post._id}-${mediaIndex}`;
    setVideoStates((prev) => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        isPlaying: false,
      },
    }));
  };

  const handleLike = async () => {
    if (!post?._id || isLiking) return;

    const prevLiked = isLiked;
    const prevLikes = likesCount;

    if (likeRequestRef.current) {
      likeRequestRef.current.abort();
    }

    const controller = new AbortController();
    likeRequestRef.current = controller;

    setIsLiking(true);
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      const res = await fetch(`${BASE_URL}/api/posts/${post._id}/like`, {
        method: 'POST',
        credentials: 'include',
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Failed to like post');
      const data = await res.json();

      if (data.success === true) {
        if (data.isLiked !== !prevLiked) {
          setIsLiked(data.isLiked);
          setLikesCount(data.likesCount || (data.isLiked ? prevLikes + 1 : prevLikes - 1));
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        setIsLiked(prevLiked);
        setLikesCount(prevLikes);
      }
    } finally {
      setIsLiking(false);
      likeRequestRef.current = null;
    }
  };

  const handleSave = async () => {
    if (!post?._id) return;

    const prevState = isSaved;
    setIsSaved(!isSaved);

    try {
      const res = await fetch(`${BASE_URL}/api/posts/${post._id}/save`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to save post');
      const data = await res.json();

      setIsSaved(data.savedPosts.includes(post._id));
    } catch (err) {
      console.error(err);
      setIsSaved(prevState);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return {
    // State
    activeMediaIndex,
    selectedPost,
    videoStates,
    isLiked,
    isSaved,
    likesCount,
    isLiking,

    // Refs
    videoRefs,
    mediaContainerRef,

    // Handlers
    handleMediaScroll,
    scrollToMedia,
    navigateMedia,
    toggleVideoPlayback,
    handleVideoClick,
    handleVideoEnded,
    setSelectedPost,
    handleLike,
    handleSave,
    formatDate,
  };
};

import { useState, useEffect, useRef } from 'react';
import { BASE_URL } from '@/config/app.config';
import '../styles/Stories.css';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserStories, setSelectedUserStories] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/stories`, {
          credentials: 'include',
        });
        const data = await response.json();
        setStories(data.stories);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const openStory = (userStories) => {
    setSelectedUserStories(userStories);
    setCurrentStoryIndex(0);
    setProgress(0);
  };

  const closeStory = () => {
    setSelectedUserStories(null);
    setCurrentStoryIndex(0);
    setProgress(0);
    clearInterval(progressInterval.current);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const nextStory = () => {
    if (selectedUserStories && currentStoryIndex < selectedUserStories.stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const startProgress = (duration) => {
    clearInterval(progressInterval.current);
    setProgress(0);

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval.current);
          nextStory();
          return 0;
        }
        return prev + 100 / (duration * 10);
      });
    }, 100);
  };

  useEffect(() => {
    if (selectedUserStories) {
      const currentStory = selectedUserStories.stories[currentStoryIndex];
      startProgress(currentStory.duration);

      const timeout = setTimeout(() => {
        nextStory();
      }, currentStory.duration * 1000);

      return () => {
        clearTimeout(timeout);
        clearInterval(progressInterval.current);
      };
    }
  }, [selectedUserStories, currentStoryIndex]);

  const handleVideoLoad = (event) => {
    if (event.target) {
      event.target.play().catch((error) => {
        console.error('Error playing video:', error);
      });
    }
  };

  if (loading) {
    return (
      <div className='stories-container'>
        <div className='stories-scroll'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='story-skeleton'>
              <div className='story-avatar-skeleton'></div>
              <div className='story-username-skeleton'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='stories-container'>
        <div className='stories-scroll'>
          {stories.map((userStories) => (
            <div key={userStories.id} className='story-item' onClick={() => openStory(userStories)}>
              <div className='story-avatar'>
                <img src={userStories.avatar} alt={userStories.username} />
              </div>
              <span className='story-username'>{userStories.username}</span>
            </div>
          ))}

          {!stories.length ? 'No Active Stories' : null}
        </div>
      </div>

      {selectedUserStories && (
        <div className='story-modal' onClick={closeStory}>
          <div className='story-modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='story-progress-container'>
              {selectedUserStories.stories.map((story, index) => (
                <div key={story.id} className='story-progress-track'>
                  <div
                    className={`story-progress-bar ${index === currentStoryIndex ? 'active' : ''} ${
                      index < currentStoryIndex ? 'completed' : ''
                    }`}
                    style={{
                      width:
                        index === currentStoryIndex
                          ? `${progress}%`
                          : index < currentStoryIndex
                          ? '100%'
                          : '0%',
                    }}
                  ></div>
                </div>
              ))}
            </div>

            {selectedUserStories.stories[currentStoryIndex] && (
              <>
                {selectedUserStories.stories[currentStoryIndex].type === 'image' ? (
                  <img
                    src={selectedUserStories.stories[currentStoryIndex].image}
                    alt={selectedUserStories.username}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={selectedUserStories.stories[currentStoryIndex].image}
                    onLoadedMetadata={handleVideoLoad}
                    autoPlay
                    muted
                    playsInline
                  />
                )}
              </>
            )}

            <div className='story-modal-header'>
              <div className='story-modal-avatar'>
                <img src={selectedUserStories.avatar} alt={selectedUserStories.username} />
              </div>
              <span>{selectedUserStories.username}</span>
            </div>

            <div
              className='story-nav-left'
              onClick={(e) => {
                e.stopPropagation();
                prevStory();
              }}
            >
              ‹
            </div>
            <div
              className='story-nav-right'
              onClick={(e) => {
                e.stopPropagation();
                nextStory();
              }}
            >
              ›
            </div>

            {selectedUserStories.stories[currentStoryIndex]?.caption && (
              <div className='story-caption'>
                {selectedUserStories.stories[currentStoryIndex].caption}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;

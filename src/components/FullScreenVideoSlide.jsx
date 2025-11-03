import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { parseFormatting } from '../utils/formatText';

// Utility to extract YouTube video ID from various URL formats
function getYouTubeId(url) {
  if (!url) return null;

  // Match youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // Match youtu.be/VIDEO_ID
  const shortMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Match youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  return null;
}

export default function FullScreenVideoSlide({ scene, onVideoEnd }) {
  const videoRef = useRef(null);
  const [isYouTube, setIsYouTube] = useState(false);
  const [youtubeId, setYoutubeId] = useState(null);

  // Detect if video is a YouTube URL
  useEffect(() => {
    if (scene.video) {
      const ytId = getYouTubeId(scene.video);
      setIsYouTube(!!ytId);
      setYoutubeId(ytId);
    }
  }, [scene.video]);

  // Handle regular video (non-YouTube) playback
  useEffect(() => {
    if (isYouTube) return; // Skip for YouTube videos

    const video = videoRef.current;
    if (!video) return;

    // Auto-play when component mounts
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Video autoplay failed:', error);
        // Fallback: try playing on user interaction
      });
    }

    // Handle video end event
    const handleEnded = () => {
      console.log('[FullScreenVideoSlide] Video ended, advancing to next slide');
      if (onVideoEnd) {
        onVideoEnd();
      }
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [onVideoEnd, isYouTube]);

  // Handle YouTube video end event via postMessage API
  useEffect(() => {
    if (!isYouTube || !scene.loop) return;

    // Listen for YouTube player messages
    const handleMessage = (event) => {
      if (event.origin !== 'https://www.youtube.com') return;

      try {
        const data = JSON.parse(event.data);
        // YT.PlayerState.ENDED = 0
        if (data.event === 'onStateChange' && data.info === 0) {
          console.log('[FullScreenVideoSlide] YouTube video ended, advancing to next slide');
          if (onVideoEnd) {
            onVideoEnd();
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isYouTube, scene.loop, onVideoEnd]);

  // Text position options: 'bottom-edge' (default), 'top-edge', 'middle', 'middle-top', 'middle-bottom'
  const textPosition = scene.textPosition || 'bottom-edge';

  // Define position-specific classes
  const getPositionClasses = () => {
    switch (textPosition) {
      case 'top-edge':
        return {
          containerClass: 'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 via-black/60 to-transparent px-12 pt-16 pb-24 pointer-events-none',
          justifyClass: 'justify-start'
        };
      case 'middle':
        return {
          containerClass: 'absolute inset-0 flex items-center justify-center px-12 py-16 pointer-events-none',
          justifyClass: 'justify-center',
          hasBackground: true
        };
      case 'middle-top':
        return {
          containerClass: 'absolute top-[20%] left-0 right-0 px-12 py-8 pointer-events-none',
          justifyClass: 'justify-start',
          hasBackground: true
        };
      case 'middle-bottom':
        return {
          containerClass: 'absolute bottom-[20%] left-0 right-0 px-12 py-8 pointer-events-none',
          justifyClass: 'justify-end',
          hasBackground: true
        };
      case 'bottom-edge':
      default:
        return {
          containerClass: 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-12 pt-24 pb-16 pointer-events-none',
          justifyClass: 'justify-end'
        };
    }
  };

  const { containerClass, hasBackground } = getPositionClasses();

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black"
    >
      {/* Full-screen video - centered and cropped proportionally */}
      {scene.video ? (
        isYouTube ? (
          // YouTube embed
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${scene.muted !== false ? 1 : 0}&loop=${scene.loop ? 1 : 0}&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            className="absolute inset-0 w-full h-full"
            style={{
              border: 'none',
              pointerEvents: 'none'
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
          />
        ) : (
          // Regular video file
          <video
            ref={videoRef}
            src={scene.video}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              objectFit: 'cover',
              objectPosition: 'center center'
            }}
            playsInline
            muted={scene.muted !== false} // Default to muted for autoplay
            loop={scene.loop === true} // Default to no loop
            preload="auto"
          />
        )
      ) : (
        // Fallback if no video is provided
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/50 text-2xl">No video provided</div>
        </div>
      )}

      {/* Text overlay - positioned based on textPosition field */}
      {scene.title && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className={containerClass}
        >
          <div className={`max-w-6xl mx-auto ${hasBackground ? 'bg-black/70 backdrop-blur-sm rounded-2xl px-12 py-8' : ''}`}>
            <h2
              className="font-bold text-white text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              style={{
                fontSize: `clamp(3rem, ${Math.max(4, Math.min(10, 400 / Math.max(1, (scene.title?.length || 1))))}vw, 10rem)`
              }}
            >
              {scene.title}
            </h2>
            {scene.subtitle && (
              <p
                className="text-white/90 text-center mt-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                style={{
                  fontSize: `clamp(1.5rem, ${Math.max(2, Math.min(5, 200 / Math.max(1, (scene.subtitle?.length || 1))))}vw, 5rem)`
                }}
                dangerouslySetInnerHTML={{ __html: parseFormatting(scene.subtitle) }}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Video controls indicator (shows muted status) */}
      {scene.muted !== false && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute top-8 right-8 bg-black/50 backdrop-blur rounded-full p-3 pointer-events-none"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </div>
  );
}

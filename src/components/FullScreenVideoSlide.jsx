import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function FullScreenVideoSlide({ scene, onVideoEnd }) {
  const videoRef = useRef(null);

  useEffect(() => {
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
  }, [onVideoEnd]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="relative w-screen h-screen overflow-hidden bg-black"
    >
      {/* Full-screen video - centered and cropped proportionally */}
      {scene.video ? (
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
      ) : (
        // Fallback if no video is provided
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/50 text-2xl">No video provided</div>
        </div>
      )}

      {/* Optional: Text overlay at bottom */}
      {scene.title && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-12 pointer-events-none"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center">
            {scene.title}
          </h2>
          {scene.subtitle && (
            <p className="text-xl md:text-2xl text-white/80 text-center mt-4">
              {scene.subtitle}
            </p>
          )}
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
    </motion.div>
  );
}

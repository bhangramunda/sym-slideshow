import { motion } from 'framer-motion';

export default function FullScreenImageSlide({ scene }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="relative w-screen h-screen overflow-hidden bg-black"
    >
      {/* Full-screen image - centered and cropped proportionally */}
      {scene.image ? (
        <motion.img
          src={scene.image}
          alt={scene.title || 'Full screen image'}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
        />
      ) : (
        // Fallback if no image is provided
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/50 text-2xl">No image provided</div>
        </div>
      )}

      {/* Optional: Subtle text overlay at bottom (can be hidden if not needed) */}
      {scene.title && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-12"
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
    </motion.div>
  );
}

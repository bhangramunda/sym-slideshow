import { motion } from 'framer-motion';
import { parseFormatting } from '../utils/formatText';

export default function FullScreenImageSlide({ scene }) {
  return (
    <div
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

      {/* Text overlay - guaranteed visible on screen */}
      {scene.title && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-12 pt-24 pb-16"
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              {scene.title}
            </h2>
            {scene.subtitle && (
              <p
                className="text-xl md:text-3xl text-white/90 text-center mt-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                dangerouslySetInnerHTML={{ __html: parseFormatting(scene.subtitle) }}
              />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

import { motion } from 'framer-motion';
import KineticText from './KineticText';

// Calculate dynamic font size based on text length
const getDynamicFontSize = (text, baseSize, minSize, maxSize) => {
  if (!text) return baseSize;
  const length = text.length;

  // Scale factor: shorter text = larger font
  // Target: ~40-60 chars per line at base size
  let scale = 1.0;

  if (length < 40) {
    // Very short text: increase up to 1.5x
    scale = 1.0 + (40 - length) / 40 * 0.5;
  } else if (length < 80) {
    // Short text: slightly increase
    scale = 1.0 + (80 - length) / 80 * 0.3;
  } else if (length > 150) {
    // Long text: slightly decrease
    scale = 1.0 - (length - 150) / 300 * 0.3;
  }

  const calculatedSize = baseSize * scale;
  return Math.max(minSize, Math.min(maxSize, calculatedSize));
};

export default function TestimonialSlide({ scene }) {
  // Calculate dynamic sizes based on content length
  const quoteFontSize = getDynamicFontSize(scene.quote, 5, 3.5, 7); // base 5rem (text-5xl)
  const authorFontSize = getDynamicFontSize(scene.author, 1.5, 1.25, 2.5); // base 1.5rem (text-2xl)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-bg animate-gradientShift" />

      {/* Background Image with Blend Mode */}
      {scene.image && (
        <motion.img
          src={scene.image}
          alt=""
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
        />
      )}

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute particle"
            style={{
              left: `${(i * 67 + 10) % 90}%`,
              top: `${(i * 43 + 15) % 85}%`,
              width: `${8 + (i % 5) * 2}px`,
              height: `${8 + (i % 5) * 2}px`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, 8 * Math.sin(i * 0.5), 0],
              opacity: [0.15, 0.6, 0.15],
              scale: [0.9, 1.05, 0.9],
            }}
            transition={{
              duration: 7 + (i % 4),
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Testimonial Content - increased width to 75% of viewport */}
      <div className="relative z-10 w-[75vw] mx-auto px-8 text-center">
        {/* Quote Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-8xl text-tgteal mb-8 leading-none"
        >
          "
        </motion.div>

        {/* Testimonial Quote */}
        <div
          className="font-bold text-white leading-tight mb-12"
          style={{
            fontSize: `${quoteFontSize}rem`,
            wordBreak: 'keep-all',
            hyphens: 'none',
            overflowWrap: 'break-word',
            whiteSpace: 'normal'
          }}
        >
          <KineticText text={scene.quote} />
        </div>

        {/* Author Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="space-y-2"
        >
          <div
            className="font-semibold text-tgteal"
            style={{
              fontSize: `${authorFontSize}rem`,
              wordBreak: 'normal',
              hyphens: 'none'
            }}
          >
            {scene.author}
          </div>
          <div className="text-xl text-white/70" style={{ wordBreak: 'normal', hyphens: 'none' }}>
            {scene.role}
          </div>
          {scene.company && (
            <div className="text-lg text-white/50" style={{ wordBreak: 'normal', hyphens: 'none' }}>
              {scene.company}
            </div>
          )}
        </motion.div>

        {/* Optional Rating Stars */}
        {scene.rating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex justify-center gap-2 mt-8"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 1.3 + i * 0.1,
                  type: 'spring',
                  stiffness: 300,
                }}
                className={`text-3xl ${
                  i < scene.rating ? 'text-tgteal' : 'text-white/20'
                }`}
              >
                ★
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
    </motion.div>
  );
}

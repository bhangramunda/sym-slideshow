import { motion } from 'framer-motion';
import KineticText from './KineticText';
import { parseFormatting } from '../utils/formatText';

export default function ClientLogosSlide({ scene }) {
  // Determine grid layout based on number of logos
  const getGridConfig = (count) => {
    // Much larger heights for better logo visibility
    if (count === 1) return { cols: 'grid-cols-1', size: 'h-96', gap: 'gap-12' }; // Very large, single (384px)
    if (count === 2) return { cols: 'grid-cols-2', size: 'h-80', gap: 'gap-12' }; // Large, 2 columns (320px)
    if (count === 3) return { cols: 'grid-cols-3', size: 'h-72', gap: 'gap-10' }; // Large, 3 columns (288px)
    if (count <= 6) return { cols: 'grid-cols-3', size: 'h-64', gap: 'gap-10' }; // Medium, max 3 columns (256px)
    if (count <= 9) return { cols: 'grid-cols-3', size: 'h-56', gap: 'gap-8' }; // Smaller, 3 columns (224px)
    // Many logos: smallest size, 3 columns max, tighter spacing (192px)
    return { cols: 'grid-cols-3', size: 'h-48', gap: 'gap-6' };
  };

  const gridConfig = getGridConfig(scene.logos?.length || 0);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black flex flex-col items-center justify-center"
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
          className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-screen"
        />
      )}

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute particle"
            style={{
              left: `${(i * 73 + 10) % 90}%`,
              top: `${(i * 47 + 15) % 85}%`,
              width: `${8 + (i % 4) * 2}px`,
              height: `${8 + (i % 4) * 2}px`,
            }}
            animate={{
              y: [0, -18, 0],
              x: [0, 10 * Math.sin(i * 0.6), 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [0.85, 1.1, 0.85],
            }}
            transition={{
              duration: 8 + (i % 3),
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-[85vw] mx-auto px-8 text-center">
        {/* Title */}
        <div className="text-7xl md:text-8xl font-bold text-white mb-6 break-words hyphens-none">
          <KineticText text={scene.title} />
        </div>

        {/* Subtitle */}
        {scene.subtitle && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-3xl md:text-4xl text-white/80 mb-20 max-w-4xl mx-auto break-words hyphens-none"
            dangerouslySetInnerHTML={{ __html: parseFormatting(scene.subtitle) }}
          />
        )}

        {/* Logo Grid */}
        <div className={`grid ${gridConfig.cols} ${gridConfig.gap}`}>
          {scene.logos?.map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.8 + index * 0.1,
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              {/* Glassmorphism Card */}
              <div className={`relative bg-white/5 backdrop-blur border border-white/20 rounded-2xl p-6 ${gridConfig.size} flex items-center justify-center transition-all duration-300 group-hover:bg-white/10 group-hover:border-tgteal/50 overflow-hidden`}>
                {/* Glow Effect on Hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-tgteal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.2 }}
                />

                {/* Logo Image */}
                <img
                  src={logo.url || logo.public_url}
                  alt={logo.display_name || logo.name}
                  className={`relative z-10 ${scene.fitLogos ? 'w-full h-full' : 'max-w-full max-h-full'} object-contain p-4 group-hover:scale-105 transition-transform duration-300`}
                  style={{ filter: 'brightness(0) invert(1)' }} // Convert logos to white for dark background
                />
              </div>

              {/* Animated Border Glow */}
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-tgteal via-tgmagenta to-tgviolet rounded-2xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300 -z-10"
                animate={{
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: index * 0.2,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Optional Footer Text */}
        {scene.footer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-16 text-xl text-white/60"
          >
            {scene.footer}
          </motion.div>
        )}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
    </div>
  );
}

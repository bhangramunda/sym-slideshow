import { motion } from 'framer-motion';
import KineticText from './KineticText';
import { parseFormatting } from '../utils/formatText';

export default function LogoGridSlide({ scene }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
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
      <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
        {/* Title */}
        <div className="text-5xl md:text-6xl font-bold text-white mb-4 break-words hyphens-none">
          <KineticText text={scene.title} />
        </div>

        {/* Subtitle */}
        {scene.subtitle && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-white/80 mb-16 max-w-3xl mx-auto break-words hyphens-none"
            dangerouslySetInnerHTML={{ __html: parseFormatting(scene.subtitle) }}
          />
        )}

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {scene.logos.map((logo, index) => (
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
              <div className="relative bg-white/5 backdrop-blur border border-white/20 rounded-2xl p-8 h-32 flex items-center justify-center transition-all duration-300 group-hover:bg-white/10 group-hover:border-tgteal/50 overflow-hidden">
                {/* Glow Effect on Hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-tgteal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.2 }}
                />

                {/* Logo - Using text as placeholder, replace with actual images */}
                <div className="relative z-10 text-2xl font-bold text-white/90 group-hover:text-white transition-colors break-words hyphens-none">
                  {logo.name}
                </div>
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
            className="mt-16 text-lg text-white/60"
          >
            {scene.footer}
          </motion.div>
        )}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
    </motion.div>
  );
}

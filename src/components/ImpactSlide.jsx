import { motion } from 'framer-motion';
import { parseFormatting } from '../utils/formatText';

export default function ImpactSlide({ scene }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="relative w-screen h-screen overflow-hidden bg-black"
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

      {/* Fireworks/Celebration Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => {
          const startX = Math.random() * 100;
          const startY = 50 + Math.random() * 30;
          const endX = startX + (Math.random() - 0.5) * 60;
          const endY = startY - Math.random() * 40;
          const delay = Math.random() * 2;
          const duration = 1.5 + Math.random() * 1;

          return (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${startX}%`,
                top: `${startY}%`,
                background: [
                  'rgba(0, 212, 255, 0.8)',
                  'rgba(106, 27, 154, 0.8)',
                  'rgba(255, 107, 107, 0.8)',
                  'rgba(255, 234, 0, 0.8)',
                ][i % 4],
                boxShadow: '0 0 10px currentColor',
              }}
              animate={{
                x: [`0%`, `${(endX - startX) * 10}px`],
                y: [`0%`, `${(endY - startY) * 10}px`],
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1, 0],
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeOut',
              }}
            />
          );
        })}
      </div>

      {/* Radial Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 212, 255, 0.2) 0%, transparent 60%)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center px-20">
        <div className="text-center max-w-7xl">
          {/* Main Impact Number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1.2,
              ease: [0.34, 1.56, 0.64, 1],
              type: 'spring',
            }}
            className="relative mb-8"
          >
            {/* Glow behind number */}
            <motion.div
              className="absolute inset-0 blur-3xl opacity-60"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.6), rgba(106, 27, 154, 0.6))',
                }}
              />
            </motion.div>

            {/* The Number */}
            <div className="relative font-black text-white leading-none break-words hyphens-none" style={{ fontSize: 'clamp(8rem, 20vw, 24rem)' }}>
              {scene.impactNumber || scene.title}
            </div>

            {/* Sparkle effects around number */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-4 h-4"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 30}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <path
                    d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                    fill="currentColor"
                    className="text-tgteal"
                  />
                </svg>
              </motion.div>
            ))}
          </motion.div>

          {/* Description Text */}
          {scene.description && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-5xl md:text-6xl font-bold text-white/90 leading-tight mb-8 break-words hyphens-none"
              dangerouslySetInnerHTML={{ __html: parseFormatting(scene.description) }}
            />
          )}

          {/* Subtitle/Context */}
          {scene.subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-3xl md:text-4xl text-white/70 leading-relaxed break-words hyphens-none"
              dangerouslySetInnerHTML={{ __html: parseFormatting(scene.subtitle) }}
            />
          )}

          {/* Optional Badge/Label */}
          {scene.badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-10 inline-block"
            >
              <div className="bg-gradient-to-r from-tgteal to-tgmagenta text-white text-2xl font-bold px-8 py-4 rounded-full shadow-[0_0_40px_rgba(0,212,255,0.5)] animate-glow">
                {scene.badge}
              </div>
            </motion.div>
          )}

          {/* Optional CTA */}
          {scene.cta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-12"
            >
              <div className="inline-block bg-white/10 backdrop-blur border border-white/30 rounded-full px-10 py-5 text-2xl font-semibold text-white hover:bg-white/20 transition-all duration-300 shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_50px_rgba(0,212,255,0.5)] animate-glow cursor-pointer">
                {scene.cta}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.7)]" />

      {/* Bottom shine effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-tgteal to-transparent"
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scaleX: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}

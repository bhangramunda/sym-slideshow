import { motion } from 'framer-motion';
import { parseFormatting } from '../utils/formatText';

export default function ImpactSlide({ scene, fireworksIntensity }) {
  // Determine fireworks count based on intensity setting
  const getFireworksCount = () => {
    // Check for per-slide override first
    const intensity = scene.fireworks === 'default' || !scene.fireworks
      ? fireworksIntensity
      : scene.fireworks;

    switch (intensity) {
      case 'none': return 0;
      case 'light': return 5;
      case 'medium': return 8;
      case 'heavy': return 15;
      case 'random': return Math.floor(Math.random() * 8) + 8; // 8-15
      default: return 8; // fallback to medium
    }
  };

  const fireworksCount = getFireworksCount();

  return (
    <div
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

      {/* Enhanced Fireworks - Shooting from bottom with explosions */}
      {fireworksCount > 0 && (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Launch trails - rockets shooting up from bottom */}
        {Array.from({ length: fireworksCount }).map((_, i) => {
          const launchX = 10 + (i * 12) + Math.random() * 8; // Spread across width
          const explodeY = 15 + Math.random() * 35; // Explode at different heights
          const delay = i * 0.4; // Staggered launches
          const colors = [
            'rgba(0, 212, 255, 0.9)',
            'rgba(106, 27, 154, 0.9)',
            'rgba(255, 107, 107, 0.9)',
            'rgba(255, 234, 0, 0.9)',
            'rgba(255, 140, 0, 0.9)',
            'rgba(0, 255, 150, 0.9)',
          ];
          const color = colors[i % colors.length];

          return (
            <div key={`firework-${i}`}>
              {/* Launch trail */}
              <motion.div
                className="absolute w-1 h-16 rounded-full"
                style={{
                  left: `${launchX}%`,
                  bottom: 0,
                  background: `linear-gradient(to top, ${color}, transparent)`,
                  boxShadow: `0 0 15px ${color}`,
                }}
                animate={{
                  y: [`0%`, `-${100 - explodeY}vh`],
                  opacity: [0, 1, 0.8, 0],
                  scaleY: [0.5, 1, 0.8, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
              />

              {/* Explosion burst - multiple particles radiating out */}
              {Array.from({ length: 16 }).map((_, particleIdx) => {
                const angle = (particleIdx / 16) * Math.PI * 2;
                const distance = 80 + Math.random() * 60;
                const offsetX = Math.cos(angle) * distance;
                const offsetY = Math.sin(angle) * distance;

                return (
                  <motion.div
                    key={`particle-${i}-${particleIdx}`}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${launchX}%`,
                      top: `${explodeY}%`,
                      background: color,
                      boxShadow: `0 0 12px ${color}`,
                    }}
                    animate={{
                      x: [0, offsetX],
                      y: [0, offsetY],
                      opacity: [0, 0, 1, 1, 0],
                      scale: [0, 0, 1.5, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: delay + 1.2, // Explode after launch
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: 'easeOut',
                    }}
                  />
                );
              })}

              {/* Explosion flash */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: `${launchX}%`,
                  top: `${explodeY}%`,
                  width: '120px',
                  height: '120px',
                  marginLeft: '-60px',
                  marginTop: '-60px',
                  background: `radial-gradient(circle, ${color}, transparent)`,
                  filter: 'blur(20px)',
                }}
                animate={{
                  opacity: [0, 0, 0.8, 0],
                  scale: [0, 0, 1.5, 2],
                }}
                transition={{
                  duration: 1.5,
                  delay: delay + 1.2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeOut',
                }}
              />
            </div>
          );
        })}
      </div>
      )}

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
    </div>
  );
}

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

  // Calculate timing to ensure all fireworks complete before slide ends
  // Fireworks cycle: delay (variable) + launch (0.8-2.2s) + explosion (2s) = variable
  // Max launch duration: 2.2s, explosion: 2s = 4.2s for animation
  // We want them to finish 1 second before the slide duration ends
  const slideDuration = (scene.durationSec ?? 20); // seconds
  const maxLaunchDuration = 2.2; // maximum launch time (background fireworks)
  const explosionDuration = 2.0; // explosion animation duration
  const maxAnimationTime = maxLaunchDuration + explosionDuration; // 4.2s
  const safetyBuffer = 1.0; // finish 1 second before slide ends
  const availableTime = slideDuration - safetyBuffer;

  // Distribute fireworks evenly across the available time
  // Last firework should start early enough to complete its full animation
  const maxDelayTime = Math.max(0, availableTime - maxAnimationTime);

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
          // Create depth layers: background (far), midground, foreground (close)
          const depth = Math.random()
          const isBackground = depth < 0.33
          const isMidground = depth >= 0.33 && depth < 0.66
          const isForeground = depth >= 0.66

          const launchX = 10 + Math.random() * 80; // Random position across width (10-90%)

          // Depth-based properties
          let explodeY, launchDuration, particleCount, particleDistance, particleSize, flashSize

          if (isBackground) {
            // Far fireworks: high, slow, large
            explodeY = 10 + Math.random() * 20; // 10-30% from top
            launchDuration = 1.5 + Math.random() * 0.3; // 1.5-1.8s
            particleCount = 24
            particleDistance = 120 + Math.random() * 80; // 120-200px
            particleSize = 4
            flashSize = 200
          } else if (isMidground) {
            // Medium fireworks
            explodeY = 25 + Math.random() * 20; // 25-45% from top
            launchDuration = 1.0 + Math.random() * 0.3; // 1.0-1.3s
            particleCount = 20
            particleDistance = 90 + Math.random() * 60; // 90-150px
            particleSize = 3
            flashSize = 160
          } else {
            // Close fireworks: low, fast, smaller
            explodeY = 40 + Math.random() * 25; // 40-65% from top
            launchDuration = 0.7 + Math.random() * 0.2; // 0.7-0.9s
            particleCount = 16
            particleDistance = 70 + Math.random() * 40; // 70-110px
            particleSize = 2.5
            flashSize = 120
          }

          // Spread firework launches across the available time
          const delay = Math.random() * Math.max(0, maxDelayTime);

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
                  duration: launchDuration,
                  delay,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
              />

              {/* Explosion burst - multiple particles radiating out */}
              {Array.from({ length: particleCount }).map((_, particleIdx) => {
                const angle = (particleIdx / particleCount) * Math.PI * 2;
                const offsetX = Math.cos(angle) * particleDistance;
                const offsetY = Math.sin(angle) * particleDistance;

                return (
                  <motion.div
                    key={`particle-${i}-${particleIdx}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${launchX}%`,
                      top: `${explodeY}%`,
                      width: `${particleSize}px`,
                      height: `${particleSize}px`,
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
                      delay: delay + launchDuration, // Explode after launch completes
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
                  width: `${flashSize}px`,
                  height: `${flashSize}px`,
                  marginLeft: `${-flashSize / 2}px`,
                  marginTop: `${-flashSize / 2}px`,
                  background: `radial-gradient(circle, ${color}, transparent)`,
                  filter: 'blur(20px)',
                }}
                animate={{
                  opacity: [0, 0, 0.8, 0],
                  scale: [0, 0, 1.5, 2],
                }}
                transition={{
                  duration: 1.5,
                  delay: delay + launchDuration,
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

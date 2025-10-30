import { motion } from 'framer-motion';
import KineticText from './KineticText';

export default function SplitContentSlide({ scene }) {
  const isLeftImage = scene.layout === 'image-left';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="relative w-screen h-screen overflow-hidden bg-black"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-bg animate-gradientShift opacity-60" />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute particle"
            style={{
              left: `${(i * 71 + 8) % 92}%`,
              top: `${(i * 41 + 12) % 88}%`,
              width: `${7 + (i % 5) * 2}px`,
              height: `${7 + (i % 5) * 2}px`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10 * Math.sin(i * 0.5), 0],
              opacity: [0.15, 0.6, 0.15],
              scale: [0.85, 1.15, 0.85],
            }}
            transition={{
              duration: 7.5 + (i % 4),
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Split Content Layout */}
      <div className={`relative z-10 h-full flex ${isLeftImage ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Image Side */}
        <motion.div
          initial={{ x: isLeftImage ? -100 : 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="w-1/2 relative overflow-hidden"
        >
          {scene.image && (
            <>
              <motion.img
                src={scene.image}
                alt=""
                initial={{ scale: 1.2 }}
                animate={{ scale: 1.0 }}
                transition={{ duration: 20, ease: 'linear' }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-${isLeftImage ? 'r' : 'l'} from-transparent via-transparent to-black/80`}
              />
            </>
          )}
        </motion.div>

        {/* Content Side */}
        <div className="w-1/2 flex items-center justify-center p-16">
          <div className="max-w-2xl">
            {/* Title */}
            <div className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight break-words hyphens-none">
              <KineticText text={scene.title} />
            </div>

            {/* Subtitle/Description */}
            {scene.subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl text-white/80 leading-relaxed mb-8"
              >
                {scene.subtitle.split('\n').map((line, i) => (
                  <p key={i} className={`${i > 0 ? 'mt-4' : ''} break-words hyphens-none`}>
                    {line}
                  </p>
                ))}
              </motion.div>
            )}

            {/* Bullet Points */}
            {scene.points && (
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="space-y-4 mb-10"
              >
                {scene.points.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.0 + index * 0.15,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    className="flex items-start gap-4 text-lg text-white/90"
                  >
                    <motion.span
                      className="text-2xl text-tgteal flex-shrink-0 mt-1"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        delay: 1.2 + index * 0.15,
                        repeat: Infinity,
                        repeatType: 'loop',
                        repeatDelay: 3,
                      }}
                    >
                      •
                    </motion.span>
                    <span className="break-words hyphens-none">{point}</span>
                  </motion.li>
                ))}
              </motion.ul>
            )}

            {/* CTA Button */}
            {scene.cta && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
              >
                <div className="inline-block bg-white/10 backdrop-blur border border-white/30 rounded-full px-10 py-5 text-xl font-semibold text-white hover:bg-white/20 transition-all duration-300 shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_50px_rgba(0,212,255,0.5)] cursor-pointer animate-glow">
                  {scene.cta}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]" />
    </motion.div>
  );
}

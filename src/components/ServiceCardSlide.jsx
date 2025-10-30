import { motion } from 'framer-motion';
import KineticText from './KineticText';

export default function ServiceCardSlide({ scene }) {
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
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute particle"
            style={{
              left: `${(i * 61 + 5) % 95}%`,
              top: `${(i * 37 + 10) % 90}%`,
              width: `${6 + (i % 6) * 2}px`,
              height: `${6 + (i % 6) * 2}px`,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, 12 * Math.sin(i * 0.4), 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-6xl md:text-7xl font-bold text-white mb-4 break-words hyphens-none">
            <KineticText text={scene.title} />
          </div>
          {scene.subtitle && (
            <motion.div
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-2xl text-white/80 break-words hyphens-none"
            >
              {scene.subtitle}
            </motion.div>
          )}
        </div>

        {/* Service Cards Grid */}
        <div className={`grid ${scene.services.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-8`}>
          {scene.services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.9 + index * 0.2,
                type: 'spring',
                stiffness: 150,
              }}
              className="group relative"
            >
              {/* Glassmorphism Card */}
              <div className="relative bg-white/5 backdrop-blur border border-white/20 rounded-3xl p-8 h-full transition-all duration-500 group-hover:bg-white/10 group-hover:border-tgteal/60 group-hover:transform group-hover:scale-105 overflow-hidden">
                {/* Animated Background Gradient */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(106, 27, 154, 0.1) 100%)',
                  }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  {service.icon && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 1.1 + index * 0.2,
                        type: 'spring',
                        stiffness: 200,
                      }}
                      className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300"
                    >
                      {service.icon}
                    </motion.div>
                  )}

                  {/* Title */}
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-tgteal transition-colors duration-300 break-words hyphens-none">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-lg text-white/70 leading-relaxed mb-6 break-words hyphens-none">
                    {service.description}
                  </p>

                  {/* Features List */}
                  {service.features && (
                    <ul className="space-y-3">
                      {service.features.map((feature, fIndex) => (
                        <motion.li
                          key={fIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: 1.3 + index * 0.2 + fIndex * 0.1,
                          }}
                          className="flex items-start gap-3 text-white/80"
                        >
                          <span className="text-tgteal text-xl mt-1 flex-shrink-0">✓</span>
                          <span className="break-words hyphens-none">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}

                  {/* Optional Badge */}
                  {service.badge && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.5 + index * 0.2 }}
                      className="absolute top-8 right-8 bg-gradient-to-r from-tgteal to-tgmagenta text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg"
                    >
                      {service.badge}
                    </motion.div>
                  )}
                </div>

                {/* Glow Effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-tgteal via-tgmagenta to-tgviolet rounded-3xl opacity-0 blur-xl -z-10"
                  animate={{
                    opacity: [0, 0.4, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Optional CTA */}
        {scene.cta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.0 }}
            className="text-center mt-12"
          >
            <div className="inline-block bg-white/10 backdrop-blur border border-white/30 rounded-full px-10 py-4 text-xl font-semibold text-white hover:bg-white/20 transition-all duration-300 shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_50px_rgba(0,212,255,0.5)] animate-glow">
              {scene.cta}
            </div>
          </motion.div>
        )}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
    </motion.div>
  );
}

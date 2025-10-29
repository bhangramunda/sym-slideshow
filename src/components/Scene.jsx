import React from 'react'
import { motion } from 'framer-motion'
import KineticText from './KineticText.jsx'
import TestimonialSlide from './TestimonialSlide.jsx'
import LogoGridSlide from './LogoGridSlide.jsx'
import ServiceCardSlide from './ServiceCardSlide.jsx'
import SplitContentSlide from './SplitContentSlide.jsx'
import cx from 'classnames'

// Default/Hero slide layout
function DefaultSlide({ scene }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Background gradient */}
      <div className='absolute inset-0 gradient-bg animate-gradientShift' />

      {/* Optional overlay image placeholder */}
      {scene.image && (
        <motion.img
          src={scene.image}
          alt="placeholder"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1.0, opacity: 0.2 }}
          transition={{ duration: 2.0, ease: 'easeOut' }}
        />
      )}

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            style={{
              top: `${(i * 47) % 100}%`,
              left: `${(i * 89) % 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10 * Math.sin(i), 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl px-6 text-center">
        <KineticText text={scene.title} className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-[0_0_20px_rgba(0,212,255,0.35)]" />
        {scene.subtitle && (
          <motion.p
            className="mt-6 text-xl md:text-2xl text-white/90 leading-relaxed"
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {scene.subtitle}
          </motion.p>
        )}
        {scene.cta && (
          <motion.div
            className="mt-10 inline-flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur border border-white/30 text-white uppercase tracking-widest text-sm shadow-lg animate-glow">
              {scene.cta}
            </div>
          </motion.div>
        )}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ boxShadow: 'inset 0 0 250px rgba(0,0,0,0.55)' }} />
    </motion.div>
  )
}

// Main Scene component - routes to appropriate slide type
export default function Scene({ scene, isActive }) {
  if (!isActive) return null

  // Route to appropriate slide type based on scene.type
  switch (scene.type) {
    case 'testimonial':
      return <TestimonialSlide scene={scene} />
    case 'logo-grid':
      return <LogoGridSlide scene={scene} />
    case 'service-card':
      return <ServiceCardSlide scene={scene} />
    case 'split-content':
      return <SplitContentSlide scene={scene} />
    case 'hero':
    default:
      return <DefaultSlide scene={scene} />
  }
}

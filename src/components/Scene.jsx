import React from 'react'
import { motion } from 'framer-motion'
import KineticText from './KineticText.jsx'
import TestimonialSlide from './TestimonialSlide.jsx'
import LogoGridSlide from './LogoGridSlide.jsx'
import ServiceCardSlide from './ServiceCardSlide.jsx'
import SplitContentSlide from './SplitContentSlide.jsx'
import SlideTransition from './SlideTransition.jsx'
import { parseFormatting } from '../utils/formatText.js'
import cx from 'classnames'

// Calculate dynamic font size based on text length
const getDynamicFontSize = (text, baseSize, minSize, maxSize) => {
  if (!text) return baseSize;
  const length = text.length;

  // Scale factor: shorter text = larger font
  let scale = 1.0;

  if (length < 30) {
    // Very short text: increase up to 1.5x
    scale = 1.0 + (30 - length) / 30 * 0.5;
  } else if (length < 60) {
    // Short text: slightly increase
    scale = 1.0 + (60 - length) / 60 * 0.3;
  } else if (length > 100) {
    // Long text: slightly decrease
    scale = 1.0 - (length - 100) / 200 * 0.3;
  }

  const calculatedSize = baseSize * scale;
  return Math.max(minSize, Math.min(maxSize, calculatedSize));
};

// Default/Hero slide layout
function DefaultSlide({ scene }) {
  // Calculate dynamic sizes with much larger base for hero impact
  const titleFontSize = getDynamicFontSize(scene.title, 8, 6, 12); // base 8rem, up to 12rem for short titles
  const subtitleFontSize = getDynamicFontSize(scene.subtitle, 2.5, 2, 4); // base 2.5rem, up to 4rem
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
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              ease: 'easeInOut',
              repeatType: 'loop'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl px-6 text-center">
        <KineticText
          text={scene.title}
          className="font-extrabold text-white drop-shadow-[0_0_20px_rgba(0,212,255,0.35)]"
          style={{ fontSize: `${titleFontSize}rem` }}
        />
        {scene.subtitle && (
          <motion.div
            className="mt-6 text-white/90 leading-relaxed"
            style={{ fontSize: `${subtitleFontSize}rem` }}
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.6, duration: 0.8 }}
            dangerouslySetInnerHTML={{ __html: parseFormatting(scene.subtitle) }}
          />
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

// Main Scene component - routes to appropriate slide type with transition
export default function Scene({ scene, isActive }) {
  if (!isActive) return null

  // Get slide content based on type
  let SlideContent
  switch (scene.type) {
    case 'testimonial':
      SlideContent = <TestimonialSlide scene={scene} />
      break
    case 'logo-grid':
      SlideContent = <LogoGridSlide scene={scene} />
      break
    case 'service-card':
      SlideContent = <ServiceCardSlide scene={scene} />
      break
    case 'split-content':
      SlideContent = <SplitContentSlide scene={scene} />
      break
    case 'hero':
    default:
      SlideContent = <DefaultSlide scene={scene} />
  }

  // Wrap with transition
  return (
    <SlideTransition transition={scene.transition}>
      {SlideContent}
    </SlideTransition>
  )
}

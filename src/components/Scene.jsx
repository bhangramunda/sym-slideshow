import React from 'react'
import { motion } from 'framer-motion'
import KineticText from './KineticText.jsx'
import TestimonialSlide from './TestimonialSlide.jsx'
import LogoGridSlide from './LogoGridSlide.jsx'
import ServiceCardSlide from './ServiceCardSlide.jsx'
import SplitContentSlide from './SplitContentSlide.jsx'
import FullScreenImageSlide from './FullScreenImageSlide.jsx'
import FullScreenVideoSlide from './FullScreenVideoSlide.jsx'
import ImpactSlide from './ImpactSlide.jsx'
import SlideTransition from './SlideTransition.jsx'
import { AnimatedText, AnimatedTextChars } from './BuildAnimation.jsx'
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
function DefaultSlide({ scene, buildScope, buildStyle }) {
  // Calculate dynamic sizes with much larger base for hero impact
  const titleFontSize = getDynamicFontSize(scene.title, 8, 6, 12); // base 8rem, up to 12rem for short titles
  const subtitleFontSize = getDynamicFontSize(scene.subtitle, 2.5, 2, 4); // base 2.5rem, up to 4rem

  // Determine which build animation to use
  const scope = scene.buildScope || buildScope || 'components'
  const style = scene.buildStyle || buildStyle || 'classic'

  // Choose the right title component based on scope/style
  const TitleComponent = () => {
    if (scope === 'off' || style === 'off') {
      return (
        <div
          className="font-extrabold text-white drop-shadow-[0_0_20px_rgba(0,212,255,0.35)]"
          style={{ fontSize: `${titleFontSize}rem` }}
        >
          {scene.title}
        </div>
      )
    }

    if (scope === 'elements' && style === 'typewriter') {
      return (
        <AnimatedTextChars
          text={scene.title}
          style={style}
          className="font-extrabold text-white drop-shadow-[0_0_20px_rgba(0,212,255,0.35)]"
          textStyle={{ fontSize: `${titleFontSize}rem` }}
        />
      )
    }

    if (scope === 'elements') {
      return (
        <AnimatedText
          text={scene.title}
          style={style}
          className="font-extrabold text-white drop-shadow-[0_0_20px_rgba(0,212,255,0.35)]"
          textStyle={{ fontSize: `${titleFontSize}rem` }}
        />
      )
    }

    // Default: components scope with KineticText (classic style) or simple animation
    if (style === 'classic') {
      return (
        <KineticText
          text={scene.title}
          className="font-extrabold text-white drop-shadow-[0_0_20px_rgba(0,212,255,0.35)]"
          style={{ fontSize: `${titleFontSize}rem` }}
        />
      )
    }

    // Component-level animation (non-classic)
    return (
      <motion.div
        className="font-extrabold text-white drop-shadow-[0_0_20px_rgba(0,212,255,0.35)]"
        style={{ fontSize: `${titleFontSize}rem` }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8 }}
      >
        {scene.title}
      </motion.div>
    )
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center">

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
        <TitleComponent />
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
    </div>
  )
}

// Main Scene component - routes to appropriate slide type with transition
export default function Scene({ scene, isActive, buildScope, buildStyle, onVideoEnd, aspectRatio }) {
  if (!isActive) return null

  // Get slide content based on type
  let SlideContent
  switch (scene.type) {
    case 'testimonial':
      SlideContent = <TestimonialSlide scene={scene} buildScope={buildScope} buildStyle={buildStyle} />
      break
    case 'logo-grid':
      SlideContent = <LogoGridSlide scene={scene} buildScope={buildScope} buildStyle={buildStyle} />
      break
    case 'service-card':
      SlideContent = <ServiceCardSlide scene={scene} buildScope={buildScope} buildStyle={buildStyle} />
      break
    case 'split-content':
      SlideContent = <SplitContentSlide scene={scene} buildScope={buildScope} buildStyle={buildStyle} />
      break
    case 'fullscreen-image':
      SlideContent = <FullScreenImageSlide scene={scene} />
      break
    case 'fullscreen-video':
      SlideContent = <FullScreenVideoSlide scene={scene} onVideoEnd={onVideoEnd} />
      break
    case 'impact':
      SlideContent = <ImpactSlide scene={scene} />
      break
    case 'hero':
    default:
      SlideContent = <DefaultSlide scene={scene} buildScope={buildScope} buildStyle={buildStyle} />
  }

  // Wrap with transition
  return (
    <SlideTransition transition={scene.transition}>
      {SlideContent}
    </SlideTransition>
  )
}

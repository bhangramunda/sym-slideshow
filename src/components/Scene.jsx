import React from 'react'
import { motion } from 'framer-motion'
import KineticText from './KineticText.jsx'
import TestimonialSlide from './TestimonialSlide.jsx'
import LogoGridSlide from './LogoGridSlide.jsx'
import ClientLogosSlide from './ClientLogosSlide.jsx'
import ServiceCardSlide from './ServiceCardSlide.jsx'
import SplitContentSlide from './SplitContentSlide.jsx'
import FullScreenImageSlide from './FullScreenImageSlide.jsx'
import FullScreenVideoSlide from './FullScreenVideoSlide.jsx'
import ImpactSlide from './ImpactSlide.jsx'
import SlideTransition from './SlideTransition.jsx'
import { AnimatedText, AnimatedTextChars } from './BuildAnimation.jsx'
import { parseFormatting } from '../utils/formatText.js'
import cx from 'classnames'

// Calculate dynamic font size based on text length with smooth curve
const getDynamicFontSize = (text, baseSize, minSize, maxSize) => {
  if (!text) return baseSize;
  const length = text.length;

  // Smooth scaling curve using logarithmic approach
  // Prevents extreme sizes for very short text while maintaining dynamic range
  let scale = 1.0;

  if (length <= 5) {
    // Very short (1-5 chars): cap at 1.35x to prevent giant single words
    scale = 1.35;
  } else if (length < 20) {
    // Short (6-20 chars): scale from 1.35x down to 1.15x
    scale = 1.35 - ((length - 5) / 15) * 0.2;
  } else if (length < 40) {
    // Medium-short (20-40 chars): scale from 1.15x down to 1.0x
    scale = 1.15 - ((length - 20) / 20) * 0.15;
  } else if (length < 80) {
    // Medium-long (40-80 chars): stay at base size
    scale = 1.0;
  } else if (length < 120) {
    // Long (80-120 chars): scale down from 1.0x to 0.85x
    scale = 1.0 - ((length - 80) / 40) * 0.15;
  } else {
    // Very long (120+ chars): scale down from 0.85x to 0.7x, with floor
    scale = Math.max(0.7, 0.85 - ((length - 120) / 80) * 0.15);
  }

  const calculatedSize = baseSize * scale;
  return Math.max(minSize, Math.min(maxSize, calculatedSize));
};

// Default/Hero slide layout
function DefaultSlide({ scene, buildScope, buildStyle }) {
  // Calculate dynamic sizes with much larger base for hero impact
  const titleFontSize = getDynamicFontSize(scene.title, 10, 7, 14); // base 10rem, up to 14rem for short titles
  const subtitleFontSize = getDynamicFontSize(scene.subtitle, 5, 3.5, 7); // base 5rem, up to 7rem for short subtitles

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
      <div className="relative z-10 w-[85vw] mx-auto px-6 text-center">
        {/* Featured Image - displayed above title */}
        {scene.featuredImage && (
          <motion.div
            className="mb-12 flex justify-center"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <img
              src={scene.featuredImage}
              alt="Featured"
              className="max-w-[80%] max-h-[40vh] object-contain drop-shadow-[0_0_30px_rgba(0,212,255,0.3)]"
            />
          </motion.div>
        )}
        <TitleComponent />
        {scene.subtitle && (
          <motion.div
            className="mt-12 text-white/90 leading-relaxed"
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
export default function Scene({ scene, isActive, buildScope, buildStyle, onVideoEnd, aspectRatio, fireworksIntensity }) {
  // Safety check: ensure scene exists
  if (!scene) {
    console.error('[Scene] Scene prop is undefined!');
    return null;
  }

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
    case 'client-logos':
      SlideContent = <ClientLogosSlide scene={scene} buildScope={buildScope} buildStyle={buildStyle} />
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
      SlideContent = <ImpactSlide scene={scene} fireworksIntensity={fireworksIntensity} />
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

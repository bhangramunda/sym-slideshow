import React from 'react'
import { motion } from 'framer-motion'

/**
 * Build Animation System
 * Animates elements within a slide as they appear
 *
 * Scopes:
 * - off: No animation
 * - components: Animate each logical component (title, subtitle, CTA, etc.)
 * - elements: Animate individual words/items within components
 * - sections: Animate large visual sections (columns, blocks)
 *
 * Styles:
 * - off: Instant appearance
 * - classic: Word-by-word rise & fade (like KineticText)
 * - cascadingFade: Staggered fade-in
 * - scalingCascade: Scale + fade with stagger
 * - slideIn: Slide from direction + fade
 * - blurFocus: Blur to sharp with stagger
 * - typewriter: Character-by-character reveal
 */

// Animation style definitions
const BUILD_STYLES = {
  off: {
    container: {
      hidden: { opacity: 1 },
      visible: { opacity: 1, transition: { duration: 0 } }
    },
    item: {
      hidden: { opacity: 1 },
      visible: { opacity: 1, transition: { duration: 0 } }
    }
  },

  classic: {
    // Current KineticText behavior - word by word rise & fade
    container: {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.015, delayChildren: 0.05 * i }
      })
    },
    item: {
      hidden: { opacity: 0, y: 12, filter: 'blur(4px)', scale: 0.98 },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        transition: { type: 'spring', stiffness: 500, damping: 35 }
      }
    }
  },

  cascadingFade: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
      }
    },
    item: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.6, ease: 'easeOut' }
      }
    }
  },

  scalingCascade: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.15 }
      }
    },
    item: {
      hidden: { opacity: 0, scale: 1.3 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
      }
    }
  },

  slideIn: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
      }
    },
    item: {
      hidden: { opacity: 0, x: -50 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.6, 0.01, 0.05, 0.95] }
      }
    }
  },

  blurFocus: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
      }
    },
    item: {
      hidden: { opacity: 0, filter: 'blur(15px)' },
      visible: {
        opacity: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.8, ease: 'easeOut' }
      }
    }
  },

  typewriter: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: 0.05 }
      }
    },
    item: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.1, ease: 'linear' }
      }
    }
  }
}

// Main BuildAnimation wrapper component
export default function BuildAnimation({
  children,
  scope = 'components',
  style = 'classic',
  index = 0
}) {
  // If scope is 'off' or style is 'off', render without animation
  if (scope === 'off' || style === 'off') {
    return <>{children}</>
  }

  const animation = BUILD_STYLES[style] || BUILD_STYLES.classic

  // For 'components' scope, wrap the entire content
  if (scope === 'components') {
    return (
      <motion.div
        variants={animation.container}
        initial="hidden"
        animate="visible"
        custom={index}
      >
        {children}
      </motion.div>
    )
  }

  // For 'elements' and 'sections' scope, we need to split content
  // This will be handled by individual slide components
  return (
    <motion.div
      variants={animation.container}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      {children}
    </motion.div>
  )
}

// Helper component for animating individual items (words, elements, sections)
export function BuildItem({ children, style = 'classic' }) {
  const animation = BUILD_STYLES[style] || BUILD_STYLES.classic

  return (
    <motion.span
      variants={animation.item}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.span>
  )
}

// Helper to split text into words for element-level animation
export function AnimatedText({ text, style = 'classic', className = '', textStyle = {} }) {
  const words = text.split(' ')
  const animation = BUILD_STYLES[style] || BUILD_STYLES.classic

  return (
    <motion.div
      className={className}
      style={{
        ...textStyle
      }}
      variants={animation.container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={animation.item}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            marginRight: '0.25em',
            willChange: 'transform, opacity'
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Helper to split text into characters for typewriter effect
export function AnimatedTextChars({ text, style = 'typewriter', className = '', textStyle = {} }) {
  const chars = text.split('')
  const animation = BUILD_STYLES[style] || BUILD_STYLES.typewriter

  return (
    <motion.div
      className={className}
      style={{
        ...textStyle
      }}
      variants={animation.container}
      initial="hidden"
      animate="visible"
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          variants={animation.item}
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            willChange: 'transform, opacity'
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  )
}

export { BUILD_STYLES }

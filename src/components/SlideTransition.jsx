import { motion } from 'framer-motion';

// Transition definitions - easily modifiable
export const TRANSITIONS = {
  none: {
    name: 'None',
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
    transition: { duration: 0 }
  },

  fade: {
    name: 'Fade',
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.8, ease: 'easeInOut' }
  },

  blurFade: {
    name: 'Blur Fade',
    initial: { opacity: 0, filter: 'blur(20px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(20px)' },
    transition: { duration: 1, ease: 'easeOut' }
  },

  shatter: {
    name: 'Shatter',
    initial: {
      opacity: 0,
      scale: 0.3,
      rotateX: 90,
      rotateY: 45,
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
    },
    exit: {
      opacity: 0,
      scale: 1.2,
      rotateX: -90,
    },
    transition: {
      duration: 1.2,
      ease: [0.6, 0.01, 0.05, 0.95],
      scale: { type: 'spring', stiffness: 100 }
    }
  },

  glitch: {
    name: 'Glitch',
    initial: {
      opacity: 0,
      x: -100,
      skewX: 20,
      filter: 'hue-rotate(180deg) saturate(3)',
    },
    animate: {
      opacity: 1,
      x: 0,
      skewX: 0,
      filter: 'hue-rotate(0deg) saturate(1)',
    },
    exit: {
      opacity: 0,
      x: 100,
      skewX: -20,
      filter: 'hue-rotate(180deg) saturate(3)',
    },
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      opacity: { duration: 0.3 },
      x: {
        duration: 0.6,
        ease: [0.87, 0, 0.13, 1]
      },
      skewX: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  },

  spiral: {
    name: 'Spiral',
    initial: {
      opacity: 0,
      scale: 0,
      rotate: -720,
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
    },
    exit: {
      opacity: 0,
      scale: 0,
      rotate: 720,
    },
    transition: {
      duration: 1.5,
      ease: [0.43, 0.13, 0.23, 0.96],
      rotate: { duration: 1.8, ease: 'easeInOut' }
    }
  },

  explode: {
    name: 'Explode',
    initial: {
      opacity: 0,
      scale: 3,
      filter: 'blur(40px) brightness(2)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px) brightness(1)',
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      filter: 'blur(30px) brightness(0.5)',
    },
    transition: {
      duration: 1,
      ease: 'easeOut',
      scale: { type: 'spring', stiffness: 80, damping: 15 }
    }
  },

  liquid: {
    name: 'Liquid',
    initial: {
      opacity: 0,
      scaleY: 0.3,
      scaleX: 1.5,
      y: 100,
      filter: 'blur(15px)',
    },
    animate: {
      opacity: 1,
      scaleY: 1,
      scaleX: 1,
      y: 0,
      filter: 'blur(0px)',
    },
    exit: {
      opacity: 0,
      scaleY: 0.3,
      scaleX: 1.5,
      y: -100,
      filter: 'blur(15px)',
    },
    transition: {
      duration: 1.4,
      ease: [0.34, 1.56, 0.64, 1],
      filter: { duration: 1, ease: 'easeOut' }
    }
  }
};

// Get transition key list for dropdown
export const TRANSITION_OPTIONS = Object.keys(TRANSITIONS);

// Wrapper component that applies the transition
export default function SlideTransition({ transition = 'fade', children }) {
  const config = TRANSITIONS[transition] || TRANSITIONS.fade;

  return (
    <motion.div
      initial={config.initial}
      animate={config.animate}
      exit={config.exit}
      transition={config.transition}
      style={{
        width: '100%',
        height: '100%',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {children}
    </motion.div>
  );
}

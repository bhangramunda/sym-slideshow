import React from 'react'
import { motion } from 'framer-motion'

export default function KineticText({ text, className = '' }) {
  const letters = Array.from(text)
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.025, delayChildren: 0.05 * i }
    })
  }
  const child = {
    hidden: {
      opacity: 0,
      y: 12,
      filter: 'blur(4px)',
      scale: 0.98
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: { type: 'spring', stiffness: 500, damping: 35 }
    }
  }
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((char, i) => (
        <motion.span key={i} variants={child} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {char}
        </motion.span>
      ))}
    </motion.div>
  )
}

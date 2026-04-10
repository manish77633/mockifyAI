import { motion } from 'framer-motion'

export const FadeIn = ({ children, delay = 0, duration = 0.4, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
    className={className}
  >
    {children}
  </motion.div>
)

export const SlideIn = ({ children, direction = 'left', delay = 0, className = '' }) => {
  const directions = {
    left: { x: -20 },
    right: { x: 20 },
    up: { y: 20 },
    down: { y: -20 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const ScaleIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay }}
    className={className}
  >
    {children}
  </motion.div>
)

export const Stagger = ({ children, staggerDelay = 0.1, className = '' }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
)

export const StaggerChild = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    className={className}
  >
    {children}
  </motion.div>
)

export const HoverScale = ({ children, scale = 1.02, className = '' }) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: scale - 0.02 }}
    className={className}
  >
    {children}
  </motion.div>
)

export const FloatingElement = ({ children, intensity = 5, duration = 3, className = '' }) => (
  <motion.div
    animate={{
      y: [-intensity, intensity, -intensity],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
)

export const TypewriterText = ({ text, speed = 50, className = '' }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.05,
            delay: index * (speed / 1000)
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  ) 
}

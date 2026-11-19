import { motion } from 'framer-motion'

const draw = (i = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 1.8, delay: 0.3 + i * 0.25, ease: 'easeInOut' },
})

const svg = { viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }

/* Sila — balanced stacked stones: grounded, steady discipline */
export function SilaIcon() {
  return (
    <svg {...svg} aria-hidden="true">
      <motion.path d="M10 39 C 10 34, 38 34, 38 39 C 38 42, 10 42, 10 39 Z" {...draw(0)} />
      <motion.path d="M14 30.5 C 14 26.5, 34 26.5, 34 30.5 C 34 33.5, 14 33.5, 14 30.5 Z" {...draw(1)} />
      <motion.path d="M18 22.5 C 18 19.5, 30 19.5, 30 22.5 C 30 25, 18 25, 18 22.5 Z" {...draw(2)} />
      <motion.path d="M21 15.5 C 21 13.3, 27 13.3, 27 15.5 C 27 17.4, 21 17.4, 21 15.5 Z" {...draw(3)} />
      <motion.path d="M24 10 L 24 7 M 20 9 L 19 7.4 M 28 9 L 29 7.4" {...draw(4)} />
    </svg>
  )
}

/* Samadhi — a seated meditating figure: concentration */
export function SamadhiIcon() {
  return (
    <svg {...svg} aria-hidden="true">
      <motion.circle cx="24" cy="11" r="3.6" {...draw(0)} />
      <motion.path d="M24 15 C 20 15.5, 18.5 19, 19 25 L 19.5 30 M 24 15 C 28 15.5, 29.5 19, 29 25 L 28.5 30" {...draw(1)} />
      <motion.path d="M19 22 C 15 24, 13 27, 15 30.5 C 17 31.5, 21 31, 24 31 C 27 31, 31 31.5, 33 30.5 C 35 27, 33 24, 29 22" {...draw(2)} />
      <motion.path d="M10 36 C 16 32.5, 32 32.5, 38 36 C 32 38.5, 16 38.5, 10 36 Z" {...draw(3)} />
      <motion.path d="M8 18 A 17 17 0 0 1 40 18" strokeDasharray="1.5 3" {...draw(4)} />
    </svg>
  )
}

/* Panna — the bodhi leaf: wisdom and awakening */
export function PannaIcon() {
  return (
    <svg {...svg} aria-hidden="true">
      <motion.path d="M24 41 C 24 41, 10 31, 10 20 C 10 13, 16 8.5, 24 8.5 C 32 8.5, 38 13, 38 20 C 38 31, 24 41, 24 41 Z" {...draw(0)} />
      <motion.path d="M24 41 L 24 4" {...draw(1)} />
      <motion.path d="M24 33 L 16.5 26 M 24 27 L 15 19 M 24 21 L 17 14 M 24 33 L 31.5 26 M 24 27 L 33 19 M 24 21 L 31 14" {...draw(2)} />
      <motion.path d="M24 4 C 22 6, 22 6.5, 24 8.5" {...draw(3)} />
    </svg>
  )
}

/*
  Motion effects inspired by React Bits (reactbits.dev) and Aceternity UI (ui.aceternity.com):
  - Card3D / Layer  → Aceternity "3D Card Effect"
  - TiltedCard      → React Bits "Tilted Card"
  - CircularText    → React Bits "Circular Text"
  - BlurText        → React Bits "Blur Text"
  - TextGenerate    → Aceternity "Text Generate Effect"
  - Spotlight       → Aceternity "Spotlight"
  Re-implemented with framer-motion so they share the site's calm easing.
*/
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]
const soft = { stiffness: 70, damping: 18, mass: 0.8 }

/* Aceternity-style 3D card: children placed on <Layer z> float at different depths */
export function Card3D({ children, className = '', max = 10, sway = true }) {
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const srx = useSpring(rx, soft), sry = useSpring(ry, soft)
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2)
  }
  const leave = () => { rx.set(0); ry.set(0) }
  return (
    <div className={`c3d ${className}`} onPointerMove={move} onPointerLeave={leave}>
      <div className={sway ? 'c3d-sway' : 'c3d-still'}>
        <motion.div className="c3d-body" style={{ rotateX: srx, rotateY: sry }}>
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export function Layer({ z = 0, className = '', children, style }) {
  return (
    <div className={`c3d-layer ${className}`} style={{ transform: `translateZ(${z}px)`, ...style }}>
      {children}
    </div>
  )
}

/* React Bits-style tilted card with a gentle lift and moving sheen */
export function TiltedCard({ children, className = '', max = 12, scale = 1.04 }) {
  const rx = useMotionValue(0), ry = useMotionValue(0), s = useMotionValue(1)
  const gx = useMotionValue(50), gy = useMotionValue(50)
  const srx = useSpring(rx, soft), sry = useSpring(ry, soft), ss = useSpring(s, soft)
  const sheen = useTransform([gx, gy], ([x, y]) =>
    `radial-gradient(circle at ${x}% ${y}%, rgba(255,248,236,.38), rgba(255,248,236,0) 55%)`)
  return (
    <div className={`tilted ${className}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
        ry.set((px - 0.5) * max * 2); rx.set(-(py - 0.5) * max * 2); s.set(scale)
        gx.set(px * 100); gy.set(py * 100)
      }}
      onPointerLeave={() => { rx.set(0); ry.set(0); s.set(1) }}>
      <motion.div className="tilted-inner" style={{ rotateX: srx, rotateY: sry, scale: ss }}>
        {children}
        <motion.span className="tilted-sheen" style={{ background: sheen }} />
      </motion.div>
    </div>
  )
}

/* React Bits-style circular text badge */
export function CircularText({ text, size = 150, className = '', children, duration = 28 }) {
  const id = useRef(`ct-${Math.random().toString(36).slice(2)}`).current
  return (
    <div className={`circular ${className}`} style={{ width: size, height: size }}>
      <motion.svg viewBox="0 0 200 200" width={size} height={size}
        animate={{ rotate: 360 }} transition={{ duration, repeat: Infinity, ease: 'linear' }} aria-hidden="true">
        <defs><path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
        <text><textPath href={`#${id}`} startOffset="0">{text}</textPath></text>
      </motion.svg>
      <div className="circular-center">{children}</div>
    </div>
  )
}

/* React Bits-style blur text: words resolve out of a soft blur */
export function BlurText({ text, className = '', delay = 0, stagger = 0.08, as = 'span', start }) {
  const M = motion[as]
  const trigger = start === undefined ? { whileInView: 'show', viewport: { once: true } } : { animate: start ? 'show' : 'hide' }
  return (
    <M className={className} aria-label={text} initial="hide" {...trigger}>
      {text.split(' ').map((w, i) => (
        <motion.span key={i} className="blur-word" aria-hidden="true"
          variants={{
            hide: { opacity: 0, filter: 'blur(14px)', y: 24, rotateX: 50 },
            show: { opacity: 1, filter: 'blur(0px)', y: 0, rotateX: 0 },
          }}
          transition={{ duration: 1.4, delay: delay + i * stagger, ease }}>
          {w}{' '}
        </motion.span>
      ))}
    </M>
  )
}

/* Aceternity-style text generate: words fade in one by one */
export function TextGenerate({ text, className = '', delay = 0 }) {
  return (
    <motion.p className={className} initial="hide" whileInView="show" viewport={{ once: true, margin: '-10% 0px' }}>
      {text.split(' ').map((w, i) => (
        <motion.span key={i} variants={{ hide: { opacity: 0, filter: 'blur(6px)' }, show: { opacity: 1, filter: 'blur(0px)' } }}
          transition={{ duration: 0.8, delay: delay + i * 0.035 }}>
          {w}{' '}
        </motion.span>
      ))}
    </motion.p>
  )
}

/* Aceternity-style spotlight beam */
export function Spotlight({ className = '' }) {
  return (
    <svg className={`spotlight ${className}`} viewBox="0 0 3787 2842" fill="none" aria-hidden="true">
      <g filter="url(#sl-blur)">
        <ellipse cx="1924.71" cy="273.501" rx="1924.71" ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)" fill="#F7F6EE" fillOpacity="0.55" />
      </g>
      <defs>
        <filter id="sl-blur" x="0.86" y="0.84" width="3785.16" height="2840.26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="151" />
        </filter>
      </defs>
    </svg>
  )
}

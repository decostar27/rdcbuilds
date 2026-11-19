import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

/* Drifting aura blobs — the "breathing" colour field behind the whole site */
export function AuraField() {
  return (
    <div className="aura-field" aria-hidden="true">
      <span className="aura a1" />
      <span className="aura a2" />
      <span className="aura a3" />
      <span className="aura a4" />
      <div className="grain" />
    </div>
  )
}

/* Slow-rising motes of light, like incense smoke and dust in temple sunlight */
export function Motes({ count = 46 }) {
  const ref = useRef(null)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const c = ref.current
    const ctx = c.getContext('2d')
    let w, h, raf
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      w = c.width = window.innerWidth * dpr
      h = c.height = window.innerHeight * dpr
    }
    resize()
    window.addEventListener('resize', resize)
    const hues = ['214,178,111', '201,154,160', '142,167,166', '247,246,238', '106,76,107']
    const motes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: (Math.random() * 2.2 + 0.6) * dpr,
      s: (Math.random() * 0.25 + 0.08) * dpr,
      p: Math.random() * Math.PI * 2,
      c: hues[Math.floor(Math.random() * hues.length)],
    }))
    const tick = (t) => {
      ctx.clearRect(0, 0, w, h)
      for (const m of motes) {
        m.y -= m.s
        m.x += Math.sin(t / 2400 + m.p) * 0.25 * dpr
        if (m.y < -10) { m.y = h + 10; m.x = Math.random() * w }
        const a = 0.25 + 0.35 * Math.sin(t / 1600 + m.p) ** 2
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4)
        g.addColorStop(0, `rgba(${m.c},${a})`)
        g.addColorStop(1, `rgba(${m.c},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2); ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    if (reduce) tick(0); else raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [count])
  return <canvas ref={ref} className="motes" aria-hidden="true" />
}

/* A soft halo that follows the pointer */
export function CursorHalo() {
  const x = useMotionValue(-400), y = useMotionValue(-400)
  const sx = useSpring(x, { stiffness: 60, damping: 20 })
  const sy = useSpring(y, { stiffness: 60, damping: 20 })
  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])
  return <motion.div className="cursor-halo" style={{ x: sx, y: sy }} aria-hidden="true" />
}

/* Procedural mandala — rings of petals that draw themselves in */
export function Mandala({ size = 520, className = '', stroke = 'currentColor', draw = true }) {
  const rings = [
    { n: 8, r: 38, len: 34, w: 14 },
    { n: 12, r: 78, len: 40, w: 16 },
    { n: 16, r: 124, len: 46, w: 16 },
    { n: 24, r: 176, len: 44, w: 12 },
    { n: 36, r: 222, len: 26, w: 8 },
  ]
  const petal = (len, w) => `M0 0 C ${w} ${-len * 0.35}, ${w * 0.6} ${-len * 0.85}, 0 ${-len} C ${-w * 0.6} ${-len * 0.85}, ${-w} ${-len * 0.35}, 0 0 Z`
  return (
    <svg viewBox="-260 -260 520 520" width={size} height={size} className={className} fill="none" stroke={stroke} strokeWidth="0.8" aria-hidden="true">
      {[30, 70, 118, 168, 214, 248].map((r, i) => (
        <motion.circle key={r} r={r} strokeOpacity={0.45}
          initial={draw ? { pathLength: 0 } : false} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 2.4, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }} />
      ))}
      {rings.map((ring, ri) => (
        <g key={ri}>
          {Array.from({ length: ring.n }).map((_, i) => (
            <motion.path key={i} d={petal(ring.len, ring.w)}
              transform={`rotate(${(360 / ring.n) * i + (ri % 2 ? 180 / ring.n : 0)}) translate(0 ${-ring.r + ring.len})`}
              initial={draw ? { pathLength: 0, opacity: 0 } : false}
              whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.4 + ri * 0.25 + i * 0.015, ease: 'easeOut' }} />
          ))}
        </g>
      ))}
      <circle r="4" fill={stroke} />
    </svg>
  )
}

/* Lotus line-drawing */
export function Lotus({ size = 120, className = '', delay = 0 }) {
  const petals = [
    'M60 92 C 40 70, 44 40, 60 18 C 76 40, 80 70, 60 92 Z',
    'M60 92 C 30 84, 18 58, 22 34 C 44 44, 58 66, 60 92 Z',
    'M60 92 C 90 84, 102 58, 98 34 C 76 44, 62 66, 60 92 Z',
    'M60 92 C 26 96, 6 80, 2 62 C 26 60, 48 74, 60 92 Z',
    'M60 92 C 94 96, 114 80, 118 62 C 94 60, 72 74, 60 92 Z',
  ]
  return (
    <svg viewBox="0 0 120 104" width={size} height={size * 0.87} className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      {petals.map((d, i) => (
        <motion.path key={i} d={d}
          initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 2, delay: delay + i * 0.2, ease: 'easeInOut' }} />
      ))}
      <motion.path d="M20 100 Q 60 108 100 100" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.6, delay: delay + 1 }} />
    </svg>
  )
}

/* Opening ritual: a breathing lotus, then the veil lifts */
export function Intro({ done, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="intro" exit={{ opacity: 0, filter: 'blur(12px)' }} transition={{ duration: 1.2, ease: 'easeInOut' }}
          onClick={onDone}>
          <motion.div className="intro-breath" animate={{ scale: [0.85, 1.12, 0.95] }} transition={{ duration: 3, ease: 'easeInOut' }} />
          <div className="intro-gyro" aria-hidden="true">
            <span className="g1" /><span className="g2" /><span className="g3" />
          </div>
          <Lotus size={110} className="intro-lotus" />
          <motion.p initial={{ opacity: 0, letterSpacing: '0.2em' }} animate={{ opacity: [0, 1, 1, 0.6], letterSpacing: '0.6em' }}
            transition={{ duration: 3, ease: 'easeOut' }}>
            breathe in
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

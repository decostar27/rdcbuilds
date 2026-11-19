import { useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* Fine paper grain over the whole page — static, costs nothing after first paint */
export function Grain() {
  return <div className="grain" aria-hidden="true" />
}

/* Mandala line drawing. Built once as plain SVG paths (no per-petal animation),
   it fades in as a single layer and turns slowly via CSS on the GPU. */
export function Mandala({ size = 520, className = '', stroke = 'currentColor' }) {
  const d = useMemo(() => {
    const rings = [
      { n: 8, r: 38, len: 34, w: 14 },
      { n: 12, r: 78, len: 40, w: 16 },
      { n: 16, r: 124, len: 46, w: 16 },
      { n: 24, r: 176, len: 44, w: 12 },
      { n: 36, r: 222, len: 26, w: 8 },
    ]
    const out = []
    rings.forEach((ring, ri) => {
      for (let i = 0; i < ring.n; i++) {
        const a = ((360 / ring.n) * i + (ri % 2 ? 180 / ring.n : 0)) * Math.PI / 180
        const cos = Math.cos(a), sin = Math.sin(a)
        const base = -ring.r + ring.len
        // petal points in local space, rotated into place
        const P = (x, y) => { const yy = y + base; return `${(x * cos - yy * sin).toFixed(1)} ${(x * sin + yy * cos).toFixed(1)}` }
        const { len, w } = ring
        out.push(`M${P(0, 0)} C${P(w, -len * .35)} ${P(w * .6, -len * .85)} ${P(0, -len)} C${P(-w * .6, -len * .85)} ${P(-w, -len * .35)} ${P(0, 0)}Z`)
      }
    })
    return out.join('')
  }, [])
  return (
    <motion.svg viewBox="-260 -260 520 520" width={size} height={size} className={className} fill="none" stroke={stroke}
      strokeWidth="0.8" aria-hidden="true"
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.6 }}>
      {[30, 70, 118, 168, 214, 248].map((r) => <circle key={r} r={r} strokeOpacity={0.45} />)}
      <path d={d} />
      <circle r="4" fill={stroke} />
    </motion.svg>
  )
}

/* Lotus line-drawing */
export function Lotus({ size = 120, className = '' }) {
  const petals = [
    'M60 92 C 40 70, 44 40, 60 18 C 76 40, 80 70, 60 92 Z',
    'M60 92 C 30 84, 18 58, 22 34 C 44 44, 58 66, 60 92 Z',
    'M60 92 C 90 84, 102 58, 98 34 C 76 44, 62 66, 60 92 Z',
    'M60 92 C 26 96, 6 80, 2 62 C 26 60, 48 74, 60 92 Z',
    'M60 92 C 94 96, 114 80, 118 62 C 94 60, 72 74, 60 92 Z',
  ]
  return (
    <svg viewBox="0 0 120 104" width={size} height={size * 0.87} className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      {petals.map((p, i) => (
        <motion.path key={i} d={p}
          initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.1, delay: i * 0.08, ease: 'easeInOut' }} />
      ))}
    </svg>
  )
}

/* Short opening: a lotus draws in, then lifts away.
   Shown once per browser session, never blocks longer than ~1.4s, tap to skip. */
export const introSeen = () => { try { return sessionStorage.getItem('lm-intro') === '1' } catch { return false } }
export function Intro({ done, onDone }) {
  useEffect(() => {
    if (done) return
    try { sessionStorage.setItem('lm-intro', '1') } catch { /* private mode */ }
    const t = setTimeout(onDone, 1400)
    return () => clearTimeout(t)
  }, [done, onDone])
  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="intro" exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: 'easeInOut' }} onClick={onDone}>
          <Lotus size={96} className="intro-lotus" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

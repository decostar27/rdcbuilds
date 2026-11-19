import { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal, Words, Lightbox } from '../components/ui.jsx'
import { mamathwaya } from '../data.js'

const ease = [0.22, 1, 0.36, 1]

/* dye colours for each colourway — used for the ink-drop swatches and the dye bleed */
const dye = {
  Ocean: { a: '#4E8C8A', b: '#B5553F', label: 'Ocean & clay' },
  Saffron: { a: '#F0C94E', b: '#D9962E', label: 'Saffron' },
  Blush: { a: '#E7B7A8', b: '#9C7457', label: 'Blush & earth' },
}

const notes = {
  MW001: 'A layered, open wrap that falls in soft panels — wear it loose, or tie it close.',
  MW002: 'A free-flowing shift with ribbon ties down the sides to gather and shape it to you.',
  MW003: 'Relaxed shorts with tie-gathered hems — easy, breathable, made for warm days.',
  MW004: 'Wide trousers with drawstring-gathered legs that adjust to every body.',
  MW005: 'A long-sleeved blouse closed with a cascade of soft fabric bows.',
  MW006: 'A cropped open jacket with dramatic, angled sleeves that move as you do.',
}

/* point on the sagging line (quadratic curve) — x in %, y in px */
const H = 140
const sag = (t) => (1 - t) ** 2 * 18 + 2 * (1 - t) * t * 218 + t ** 2 * 18

export default function DyeLine() {
  const pieces = useMemo(() => {
    const map = new Map()
    mamathwaya.forEach((m) => {
      if (!map.has(m.code)) map.set(m.code, { code: m.code, name: m.name, ways: [] })
      map.get(m.code).ways.push({ tone: m.tone, src: m.src })
    })
    return [...map.values()]
  }, [])

  const [active, setActive] = useState(0)
  const [way, setWay] = useState(0)
  const [lb, setLb] = useState(null)
  const close = useCallback(() => setLb(null), [])
  const piece = pieces[active]
  const cur = piece.ways[way] || piece.ways[0]
  const pick = (i) => { setActive(i); setWay(0) }
  const lbItems = piece.ways.map((w) => ({ src: w.src, alt: `${piece.name} in ${w.tone}` }))

  return (
    <div className="dye">
      <div className="dye-head">
        <span className="fc-k">Collection 01 · Hand-dyed Shibori</span>
        <h3 className="h2"><Words text="Free size, free spirit" /></h3>
        <Reveal><p>Six free-size pieces, folded, bound and dyed by hand — left to dry in the sun. Choose one from the line.</p></Reveal>
      </div>

      {/* the drying line */}
      <div className="line-scroll" data-lenis-prevent-wheel>
        <div className="line-wrap">
          <svg className="line-string" viewBox={`0 0 1000 ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <motion.path d="M0 18 Q 500 218 1000 18" fill="none"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
              transition={{ duration: 2, ease: 'easeInOut' }} />
          </svg>
          {pieces.map((p, i) => {
            const t = (i + 0.5) / pieces.length
            const on = i === active
            return (
              <motion.div key={p.code} className="peg-slot" style={{ left: `${t * 100}%`, top: sag(t) }}
                initial={{ opacity: 0, y: -40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.6 + i * 0.12, ease }}>
                <motion.button className={`peg-card ${on ? 'on' : ''}`} onClick={() => pick(i)}
                  aria-pressed={on} aria-label={`${p.code} ${p.name}`}
                  animate={{ rotate: [-2.2 + i * 0.3, 2.4 - i * 0.2, -2.2 + i * 0.3] }}
                  transition={{ duration: 5.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ y: 8 }}>
                  <span className="peg" aria-hidden="true" />
                  <span className="peg-photo">
                    <img src={p.ways[0].src} alt="" loading="lazy" />
                  </span>
                  <span className="peg-tag">{p.code}</span>
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* the dye room */}
      <div className="dye-room">
        <div className="dye-stage">
          <motion.span className="dye-bleed" aria-hidden="true"
            animate={{ background: `radial-gradient(circle at 40% 40%, ${dye[cur.tone].a}, ${dye[cur.tone].b} 60%, transparent 75%)` }}
            transition={{ duration: 1.2 }} />
          <div className="dye-frame">
            <AnimatePresence initial={false}>
              <motion.button key={cur.src} className="dye-photo" onClick={() => setLb(way)}
                initial={{ clipPath: 'circle(0% at 82% 88%)' }} animate={{ clipPath: 'circle(150% at 82% 88%)' }}
                exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.5 } }}
                transition={{ duration: 1.3, ease }} aria-label="View full screen">
                <img src={cur.src} alt={`${piece.name} in ${cur.tone}`} />
              </motion.button>
            </AnimatePresence>
          </div>
        </div>

        <div className="dye-info">
          <AnimatePresence mode="wait">
            <motion.div key={piece.code} initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ duration: 0.7, ease }}>
              <span className="dye-code">{piece.code}</span>
              <h4 className="dye-name">{piece.name}</h4>
              <p>{notes[piece.code]}</p>
            </motion.div>
          </AnimatePresence>

          <div className="dye-ways">
            <span className="fc-k">Colourway · {String(way + 1).padStart(2, '0')} of {String(piece.ways.length).padStart(2, '0')}</span>
            <div className="drops" role="radiogroup" aria-label="Colourway">
              {piece.ways.map((w, i) => (
                <button key={w.tone} role="radio" aria-checked={i === way} className={`drop ${i === way ? 'on' : ''}`}
                  onClick={() => setWay(i)}>
                  <motion.span className="drop-ink" style={{ background: `radial-gradient(circle at 35% 30%, ${dye[w.tone].a}, ${dye[w.tone].b})` }}
                    whileHover={{ scale: 1.12, rotate: -8 }} whileTap={{ scale: 0.92 }} />
                  <span className="drop-label">{dye[w.tone].label}</span>
                </button>
              ))}
            </div>
          </div>

          <ul className="dye-facts">
            <li><span>Size</span>Free size</li>
            <li><span>Dyed</span>By hand, in small batches</li>
            <li><span>Technique</span>Shibori fold &amp; bind</li>
          </ul>
          <p className="dye-unique">✺ Every piece is folded and dyed by hand, so no two are ever exactly alike.</p>
        </div>
      </div>
      <Lightbox items={lbItems} index={lb} onClose={close} onIndex={setLb} />
    </div>
  )
}

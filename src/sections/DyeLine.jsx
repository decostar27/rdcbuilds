import { useEffect, useMemo, useState, useCallback } from 'react'
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
  MW001: 'A layered, open wrap that falls in soft panels. Wear it loose, or tie it close.',
  MW002: 'A free-flowing shift with ribbon ties down the sides to gather and shape it to you.',
  MW003: 'Relaxed shorts with tie-gathered hems. Easy and breathable, made for warm days.',
  MW004: 'Wide trousers with drawstring-gathered legs that adjust to every body.',
  MW005: 'A long-sleeved blouse closed with a cascade of soft fabric bows.',
  MW006: 'A cropped open jacket with dramatic, angled sleeves that move as you do.',
}

function useMedia(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches
  const [m, setM] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setM(mq.matches)
    on(); mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return m
}

/* One sagging string with its garments. Cards sit in a flex row, so everything scales
   with the screen; each card is pushed down to meet the curve at its centre point. */
function Line({ items, offset, active, onPick, depth }) {
  const top = 18
  const h = top + depth + 14
  const sag = (t) => top + depth * 4 * t * (1 - t)
  return (
    <div className="line-wrap" style={{ '--n': items.length }}>
      <motion.svg className="line-string" viewBox={`0 0 1000 ${h}`} preserveAspectRatio="none" style={{ height: h }} aria-hidden="true"
        initial={{ clipPath: 'inset(0 100% 0 0)' }} whileInView={{ clipPath: 'inset(0 0% 0 0)' }} viewport={{ once: true }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}>
        <path d={`M0 ${top} Q 500 ${top + 2 * depth} 1000 ${top}`} fill="none" />
      </motion.svg>
      <span className="line-knot l" aria-hidden="true" />
      <span className="line-knot r" aria-hidden="true" />
      {items.map((p, j) => {
        const i = offset + j
        const t = (j + 0.5) / items.length
        const on = i === active
        return (
          <motion.div key={p.code} className="peg-slot" style={{ paddingTop: sag(t) - 17 }}
            initial={{ opacity: 0, y: -40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5 + j * 0.12, ease }}>
            <motion.button className={`peg-card ${on ? 'on' : ''}`} onClick={() => onPick(i)}
              aria-pressed={on} aria-label={`${p.code} ${p.name}`}
              style={{ '--sway-d': `${5.5 + j * 0.7}s`, '--sway-a': `${2.2 - j * 0.2}deg` }}>
              <span className="peg" aria-hidden="true" />
              <span className="peg-photo">
                <img src={p.ways[0].thumb} alt="" loading="lazy" decoding="async" width="384" height="480" />
              </span>
              <span className="peg-tag">{p.code}</span>
            </motion.button>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function DyeLine() {
  const pieces = useMemo(() => {
    const map = new Map()
    mamathwaya.forEach((m) => {
      if (!map.has(m.code)) map.set(m.code, { code: m.code, name: m.name, ways: [] })
      map.get(m.code).ways.push({ tone: m.tone, src: m.src, thumb: m.thumb })
    })
    return [...map.values()]
  }, [])

  const phone = useMedia('(max-width: 700px)')
  const [active, setActive] = useState(0)
  const [way, setWay] = useState(0)
  const [dir, setDir] = useState(1)
  const [lb, setLb] = useState(null)
  const close = useCallback(() => setLb(null), [])
  const piece = pieces[active]
  const cur = piece.ways[way] || piece.ways[0]
  // decode every colourway of the chosen piece in advance so switching is instant
  useEffect(() => { piece.ways.forEach((w) => { const im = new Image(); im.src = w.src }) }, [piece])
  const lbItems = piece.ways.map((w) => ({ src: w.src, alt: `${piece.name} in ${w.tone}` }))

  const pick = (i) => {
    setActive(i); setWay(0)
    // on phones, bring the details into view after choosing from the line
    if (phone) setTimeout(() => document.getElementById('dye-room')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }
  const step = (d) => { setDir(d); setWay((w) => (w + d + piece.ways.length) % piece.ways.length) }

  const rows = phone ? [pieces.slice(0, 3), pieces.slice(3)] : [pieces]

  return (
    <div className="dye">
      <div className="dye-head">
        <span className="fc-k">Collection 01 · Hand-dyed Shibori</span>
        <h3 className="h2"><Words text="Free size, free spirit" /></h3>
        <Reveal><p>Six free-size pieces, folded, bound and dyed by hand, then left to dry in the sun. Pick one from the line.</p></Reveal>
      </div>

      <div className="line-area">
        {rows.map((r, k) => (
          <Line key={k} items={r} offset={k * 3} active={active} onPick={pick} depth={phone ? 46 : 96} />
        ))}
      </div>

      <div className="dye-room" id="dye-room">
        <div className="dye-stage">
          <motion.span className="dye-bleed" aria-hidden="true"
            animate={{ background: `radial-gradient(circle at 40% 40%, ${dye[cur.tone].a}, ${dye[cur.tone].b} 60%, transparent 75%)` }}
            transition={{ duration: 1.2 }} />
          <div className="dye-frame">
            <AnimatePresence initial={false}>
              <motion.button key={cur.src} className="dye-photo" onClick={() => setLb(way)}
                initial={{ clipPath: `circle(0% at ${dir > 0 ? 82 : 18}% 88%)` }}
                animate={{ clipPath: `circle(150% at ${dir > 0 ? 82 : 18}% 88%)` }}
                exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.5 } }}
                transition={{ duration: 1.3, ease }} aria-label="View full screen"
                drag={piece.ways.length > 1 ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25}
                onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 50) step(info.offset.x < 0 ? 1 : -1) }}>
                <img src={cur.src} alt={`${piece.name} in ${cur.tone}`} draggable="false" decoding="async" />
              </motion.button>
            </AnimatePresence>
            {piece.ways.length > 1 && <>
              <button className="dye-arrow prev" onClick={() => step(-1)} aria-label="Previous colourway">←</button>
              <button className="dye-arrow next" onClick={() => step(1)} aria-label="Next colourway">→</button>
            </>}
          </div>
          {piece.ways.length > 1 && <span className="dye-hint">Swipe or tap the arrows to change colourway</span>}
        </div>

        <div className="dye-info">
          <AnimatePresence mode="wait">
            <motion.div key={piece.code} initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
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
                  onClick={() => { setDir(i >= way ? 1 : -1); setWay(i) }}>
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
          <p className="dye-unique">Every piece is folded and dyed by hand, so no two are ever exactly alike.</p>

          {phone && (
            <div className="dye-pager">
              <button onClick={() => pick((active - 1 + pieces.length) % pieces.length)}>← {pieces[(active - 1 + pieces.length) % pieces.length].code}</button>
              <button onClick={() => pick((active + 1) % pieces.length)}>{pieces[(active + 1) % pieces.length].code} →</button>
            </div>
          )}
        </div>
      </div>
      <Lightbox items={lbItems} index={lb} onClose={close} onIndex={setLb} title={`${piece.code} · ${piece.name}`} />
    </div>
  )
}

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Reveal, Words, Label, Lightbox } from '../components/ui.jsx'
import { TiltedCard } from '../components/effects.jsx'
import { brand, mamathwaya, candles } from '../data.js'

const ease = [0.22, 1, 0.36, 1]
const tones = [
  { k: 'All', c: 'conic-gradient(#3f8f8b, #e6b84a, #d98ba0, #3f8f8b)' },
  { k: 'Ocean', c: 'linear-gradient(135deg,#3f8f8b,#b5553f)' },
  { k: 'Saffron', c: 'linear-gradient(135deg,#f0c94e,#e6a33c)' },
  { k: 'Blush', c: 'linear-gradient(135deg,#e7b7a8,#a87a5a)' },
]

export default function Mamathwaya() {
  const [tone, setTone] = useState('All')
  const [lb, setLb] = useState(null)
  const close = useCallback(() => setLb(null), [])
  const items = mamathwaya.filter((m) => tone === 'All' || m.tone === tone)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const coverY = useTransform(scrollYProgress, [0, 0.5], [80, 0])

  return (
    <section id="mamathwaya" className="section mamathwaya" ref={ref}>
      <Label num="03">The brand</Label>

      <div className="mw-hero">
        <motion.div className="mw-cover" style={{ y: coverY }}>
          <motion.img src={brand.cover} alt="Mamathwaya wordmark in Sinhala script"
            initial={{ opacity: 0, scale: 1.05 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.6, ease }} />
        </motion.div>
        <div className="mw-copy">
          <h2 className="display"><Words text="Mamathwaya" stagger={0.1} /></h2>
          <Reveal className="mw-sinhala">මමත්වය</Reveal>
          <Reveal delay={0.2}>
            <p className="lead">
              A small, slow label founded by Lakshi Milani in 2026. Free-size garments, each hand-dyed with Shibori
              folds so no two pieces ever carry the same pattern — and handcrafted scented candles, poured to
              bring that same stillness into the home.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p>
              Mamathwaya is stocked through a consignment partnership with <strong>Urban Island</strong>.
              Every step — design, dyeing, costing, branding and merchandising — happens by hand, in small batches.
            </p>
          </Reveal>
          <Reveal delay={0.4} className="mw-cards">
            <motion.img src={brand['card-front']} alt="Mamathwaya business card, front" whileHover={{ rotate: -3, y: -6 }} />
            <motion.img src={brand['card-back']} alt="Mamathwaya business card, back" whileHover={{ rotate: 3, y: -6 }} />
          </Reveal>
        </div>
      </div>

      <div className="mw-collection">
        <div className="mw-col-head">
          <div>
            <span className="fc-k">Collection 01 · Hand-dyed Shibori</span>
            <h3 className="h2"><Words text="Free size, free spirit" /></h3>
          </div>
          <div className="tone-filter" role="radiogroup" aria-label="Filter by colourway">
            {tones.map((t) => (
              <button key={t.k} role="radio" aria-checked={tone === t.k} className={tone === t.k ? 'on' : ''} onClick={() => setTone(t.k)}>
                <span className="swatch" style={{ background: t.c }} />
                {t.k}
                {tone === t.k && <motion.span layoutId="tone-ring" className="tone-ring" />}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mw-grid">
          <AnimatePresence mode="popLayout">
            {items.map((m, i) => (
              <motion.button layout key={m.src} className="mw-item"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }} transition={{ duration: 0.6, ease }}
                onClick={() => setLb(i)} whileHover="hover">
                <TiltedCard className="mw-tilt" max={14} scale={1.03}>
                  <div className="mw-img">
                    <motion.img src={m.src} alt={`${m.name} in ${m.tone}`} loading="lazy" variants={{ hover: { scale: 1.05 } }} transition={{ duration: 0.9, ease }} />
                  </div>
                </TiltedCard>
                <div className="mw-meta">
                  <span>{m.name}</span>
                  <span className="fc-k">{m.code} · {m.tone}</span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
        <Lightbox items={items} index={lb} onClose={close} onIndex={setLb} />
      </div>

      <div className="candles">
        <div className="candles-head">
          <span className="fc-k">Home ritual</span>
          <h3 className="h2"><Words text="Hand-poured light" /></h3>
          <Reveal><p>Flower-form scented candles wrapped in tulle and tied with jute — a small offering of calm.</p></Reveal>
        </div>
        <div className="candle-row">
          {candles.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.08} className="candle">
              <motion.div className="candle-img" style={{ '--hue': c.hue }} whileHover={{ y: -12 }} transition={{ type: 'spring', stiffness: 160, damping: 16 }}>
                <span className="candle-glow" />
                <img src={c.src} alt={`${c.name} flower candle`} loading="lazy" />
              </motion.div>
              <span>{c.name}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

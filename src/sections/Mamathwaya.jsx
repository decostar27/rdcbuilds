import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Reveal, Words, Label } from '../components/ui.jsx'
import DyeLine from './DyeLine.jsx'
import { brand, candles } from '../data.js'

const ease = [0.22, 1, 0.36, 1]

export default function Mamathwaya() {
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
              folds so no two pieces ever carry the same pattern. Alongside them, handcrafted scented candles, poured to
              bring that same stillness into the home.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p>
              Mamathwaya is stocked through a consignment partnership with <strong>Urban Island</strong>.
              Design, dyeing, costing, branding and merchandising all happen by hand, in small batches.
            </p>
          </Reveal>
          <Reveal delay={0.4} className="mw-cards">
            <motion.img src={brand['card-front']} alt="Mamathwaya business card, front" whileHover={{ rotate: -3, y: -6 }} />
            <motion.img src={brand['card-back']} alt="Mamathwaya business card, back" whileHover={{ rotate: 3, y: -6 }} />
          </Reveal>
        </div>
      </div>

      <div className="mw-collection">
        <DyeLine />
      </div>

      <div className="candles">
        <div className="candles-head">
          <span className="fc-k">Home ritual</span>
          <h3 className="h2"><Words text="Hand-poured light" /></h3>
          <Reveal><p>Flower-form scented candles wrapped in tulle and tied with jute.</p></Reveal>
        </div>
        <div className="candle-row">
          {candles.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.08} className="candle">
              <motion.div className="candle-img" style={{ '--hue': c.hue }} whileHover={{ y: -12 }} transition={{ type: 'spring', stiffness: 160, damping: 16 }}>
                <span className="candle-glow" />
                <img src={c.thumb} alt={`${c.name} flower candle`} loading="lazy" decoding="async" width="360" height="480" />
              </motion.div>
              <span>{c.name}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

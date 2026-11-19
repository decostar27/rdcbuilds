import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Card3D, Layer, CircularText, BlurText } from '../components/effects.jsx'
import { img, brand } from '../data.js'

const ease = [0.22, 1, 0.36, 1]

export default function Hero({ ready }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], [0, -70])
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const sink = useTransform(scrollYProgress, [0, 1], [0, 90])

  const show = ready ? 'show' : 'hide'
  const v = { hide: { opacity: 0, y: 18 }, show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: d, ease } }) }

  return (
    <section id="home" className="hero" ref={ref}>
      <motion.div className="hero-text" style={{ y: yText, opacity: fade }}>
        <motion.p className="eyebrow" variants={v} initial="hide" animate={show} custom={0.05}>
          Fashion &amp; Textile Designer · Sri Lanka
        </motion.p>
        <h1 className="hero-title">
          <BlurText text="Lakshi" className="t-line" delay={0.1} start={ready} />
          <BlurText text="Milani" className="t-line t-italic" delay={0.22} start={ready} />
        </h1>
        <motion.p className="hero-lede" variants={v} initial="hide" animate={show} custom={0.35}>
          Hand-dyed, slow-made clothing shaped by Shibori, batik and a daily practice of mindfulness.
        </motion.p>
        <motion.div className="hero-cta" variants={v} initial="hide" animate={show} custom={0.45}>
          <a href="#work" className="btn btn-solid">View the work</a>
          <a href="#mamathwaya" className="btn btn-ghost">Mamathwaya</a>
        </motion.div>
      </motion.div>

      <motion.div className="hero-visual" style={{ y: sink, opacity: fade }}>
        <Card3D className="hero-card" max={7}>
          <Layer z={0} className="hero-arch-wrap">
            <motion.div className="hero-arch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <motion.img src={img('looks/look5-12.webp')} width="933" height="1400" fetchpriority="high" decoding="async"
                alt="A model twirls in a hand-dyed saffron gown from the Thama Nibbana collection"
                initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease }} />
            </motion.div>
          </Layer>

          <Layer z={-60} className="arch-shadow" />

          <Layer z={70} className="pos-circ">
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={ready ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.5, ease }}>
              <CircularText text="LAKSHI MILANI · FASHION DESIGNER · SRI LANKA · " size={138}>
                <img src={brand.mark} alt="" width="62" height="62" />
              </CircularText>
            </motion.div>
          </Layer>

          <Layer z={110} className="pos-fc1">
            <motion.div className="glass float-card fc-1" initial={{ opacity: 0, x: 20 }} animate={ready ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.55, ease }}>
              <span className="fc-k">Selected · 2025</span>
              <strong>Mercedes-Benz Fashion Week</strong>
              <span>Talented Designer category</span>
            </motion.div>
          </Layer>

          <Layer z={150} className="pos-fc2">
            <motion.div className="glass float-card fc-2" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.65, ease }}>
              <img src={img('looks/look6-10.webp')} alt="" width="66" height="82" loading="lazy" />
              <div>
                <span className="fc-k">Final collection</span>
                <strong>Thama Nibbana</strong>
                <span>Six looks, BA (Hons) 2025</span>
              </div>
            </motion.div>
          </Layer>
        </Card3D>
      </motion.div>

      <motion.a href="#about" className="scroll-cue" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1 }}>
        <span>Scroll</span>
        <span className="cue-line" />
      </motion.a>
    </section>
  )
}

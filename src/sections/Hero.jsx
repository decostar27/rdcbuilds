import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Card3D, Layer, CircularText, BlurText, Spotlight } from '../components/effects.jsx'
import { img, brand } from '../data.js'

const ease = [0.22, 1, 0.36, 1]

export default function Hero({ ready }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], [0, -90])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  // as you scroll away the whole 3D stage tips back, like a page laid down to rest
  const tilt = useTransform(scrollYProgress, [0, 1], [0, 28])
  const sink = useTransform(scrollYProgress, [0, 1], [0, 120])
  const shrink = useTransform(scrollYProgress, [0, 1], [1, 0.86])

  const show = ready ? 'show' : 'hide'
  const v = { hide: { opacity: 0, y: 30, filter: 'blur(10px)' }, show: (d = 0) => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.5, delay: d, ease } }) }

  return (
    <section id="home" className="hero" ref={ref}>
      <Spotlight className="hero-spot" />

      <motion.div className="hero-text" style={{ y: yText, opacity: fade }}>
        <motion.p className="eyebrow" variants={v} initial="hide" animate={show} custom={0.1}>
          Fashion &amp; Textile Designer · Sri Lanka
        </motion.p>
        <h1 className="hero-title">
          <BlurText text="Lakshi" className="t-line" delay={0.25} start={ready} />
          <BlurText text="Milani" className="t-line t-italic" delay={0.55} start={ready} />
        </h1>
        <motion.div className="hero-sign" variants={v} initial="hide" animate={show} custom={0.85}>
          <span className="hs-name">Lakshi Gunasekara</span>
          <span className="hs-role">Founder &amp; Designer</span>
        </motion.div>
        <motion.p className="hero-lede" variants={v} initial="hide" animate={show} custom={1}>
          Clothing as a path to awareness — hand-dyed, slow-made garments that carry the calm of
          Shibori, batik and the quiet practice of mindfulness.
        </motion.p>
        <motion.div className="hero-cta" variants={v} initial="hide" animate={show} custom={1.2}>
          <a href="#work" className="btn btn-solid">Explore the portfolio</a>
          <a href="#mamathwaya" className="btn btn-ghost">Discover Mamathwaya</a>
        </motion.div>
      </motion.div>

      <motion.div className="hero-visual" style={{ rotateX: tilt, y: sink, scale: shrink, opacity: fade }}>
        <Card3D className="hero-card" max={9}>
          <Layer z={0} className="hero-arch-wrap">
            <motion.div className="hero-arch"
              initial={{ clipPath: 'inset(100% 0 0 0 round 300px 300px 28px 28px)' }}
              animate={ready ? { clipPath: 'inset(0% 0 0 0 round 300px 300px 28px 28px)' } : {}}
              transition={{ duration: 2.2, delay: 0.4, ease }}>
              <motion.img src={img('looks/look5-12.webp')} alt="A model twirls in a hand-dyed saffron gown from the Thama Nibbana collection"
                initial={{ scale: 1.3 }} animate={ready ? { scale: 1 } : {}} transition={{ duration: 3.2, delay: 0.4, ease }} />
              <span className="arch-sheen" />
            </motion.div>
          </Layer>

          <Layer z={-60} className="arch-shadow" />

          <Layer z={70} className="pos-circ">
            <motion.div initial={{ opacity: 0, scale: 0.6, rotate: -40 }} animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 1.8, delay: 1.4, ease }}>
              <CircularText text="LAKSHI MILANI ✺ FASHION DESIGNER ✺ SRI LANKA ✺ " size={138}>
                <img src={brand.mark} alt="" />
              </CircularText>
            </motion.div>
          </Layer>

          <Layer z={110} className="pos-fc1">
            <motion.div className="glass float-card fc-1 bob" initial={{ opacity: 0, x: 40 }} animate={ready ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.4, delay: 1.5, ease }}>
              <span className="fc-k">Selected · 2025</span>
              <strong>Mercedes-Benz Fashion Week</strong>
              <span>Talented Designer category</span>
            </motion.div>
          </Layer>

          <Layer z={150} className="pos-fc2">
            <motion.div className="glass float-card fc-2 bob bob-2" initial={{ opacity: 0, y: 40 }} animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.4, delay: 1.8, ease }}>
              <img src={img('looks/look6-10.webp')} alt="" />
              <div>
                <span className="fc-k">Final collection</span>
                <strong>Thama Nibbana</strong>
                <span>6 looks · mindfulness</span>
              </div>
            </motion.div>
          </Layer>
        </Card3D>
      </motion.div>

      <motion.a href="#about" className="scroll-cue" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 2.6 }}>
        <span>scroll gently</span>
        <span className="cue-line" />
      </motion.a>
    </section>
  )
}

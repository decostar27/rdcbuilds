import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Reveal, Words, Label } from '../components/ui.jsx'
import { Lotus } from '../components/Ambient.jsx'
import { TiltedCard, TextGenerate } from '../components/effects.jsx'
import { portrait, experience, education, skills } from '../data.js'

const words = ['Sila', 'Samadhi', 'Panna', 'Shibori', 'Batik', 'Tie-dye', 'Mindfulness', 'Slow craft', 'Hand-dyed calico']

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...words, ...words, ...words].map((w, i) => (
          <span key={i}>{w}<i>✺</i></span>
        ))}
      </div>
    </div>
  )
}

export default function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const rot = useTransform(scrollYProgress, [0, 1], [-8, 8])

  return (
    <section id="about" className="section about" ref={ref}>
      <Label num="01">About</Label>

      <div className="about-grid">
        <div className="about-portrait">
          <motion.div className="halo-ring" style={{ rotate: rot }} />
          <motion.div className="portrait-3d" style={{ y, rotateY: rot }}>
            <TiltedCard className="arch-tilt" max={10}>
              <motion.div className="arch arch-portrait"
                initial={{ clipPath: 'inset(0 0 100% 0 round 400px 400px 0 0)' }}
                whileInView={{ clipPath: 'inset(0 0 0% 0 round 400px 400px 0 0)' }}
                viewport={{ once: true }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}>
                <img src={portrait} alt="Portrait of Lakshi Milani" />
              </motion.div>
            </TiltedCard>
          </motion.div>
          <Reveal className="glass portrait-tag" delay={0.6}>
            <span className="fc-k">Instagram</span>
            <a href="https://instagram.com/lifelines.mila" target="_blank" rel="noreferrer">@lifelines.mila</a>
          </Reveal>
        </div>

        <div className="about-copy">
          <h2 className="h2"><Words text="A designer who dyes, draws and listens" /></h2>
          <TextGenerate className="lead" delay={0.2}
            text="I am a fashion design graduate with a strong foundation in fashion and textile design. My practice moves between design research, concept development, textile and print design, illustration and garment development." />
          <Reveal delay={0.3}>
            <p>
              Working inside the industry has deepened my understanding of product development,
              trend analysis, material exploration and collaborative design. My heart, though, lives in
              the dye bath — where calico drinks in colour, and each fold of Shibori becomes a small
              meditation. I am now looking to expand my practice through postgraduate study and to
              contribute to an evolving, more conscious global fashion industry.
            </p>
          </Reveal>

          <div className="stats">
            {[['BA (Hons)', 'Northumbria University'], ['MBFW', 'Talented Designer 2025'], ['1 yr+', 'Industry experience']].map(([a, b], i) => (
              <Reveal key={a} delay={0.2 + i * 0.12} className="stat glass">
                <strong>{a}</strong><span>{b}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="journey">
        <div className="journey-col">
          <Reveal as="h3" className="h3">Path of practice</Reveal>
          <ol className="timeline">
            {experience.map((e, i) => (
              <Reveal as="li" key={e.role} delay={i * 0.1}>
                <span className="tl-dot" />
                <span className="tl-when">{e.when}</span>
                <h4>{e.role}</h4>
                <span className="tl-org">{e.org}</span>
                <p>{e.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
        <div className="journey-col">
          <Reveal as="h3" className="h3">Learning</Reveal>
          <ol className="timeline">
            {education.map((e, i) => (
              <Reveal as="li" key={e.title} delay={i * 0.1}>
                <span className="tl-dot" />
                <span className="tl-when">{e.when}</span>
                <h4>{e.title}</h4>
                <span className="tl-org">{e.where}</span>
              </Reveal>
            ))}
          </ol>
          <Reveal as="h3" className="h3 mt">Craft &amp; tools</Reveal>
          <div className="chips">
            {skills.map((s, i) => (
              <motion.span key={s} className="chip"
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.6 }} whileHover={{ y: -3 }}>
                {s}
              </motion.span>
            ))}
          </div>
          <Lotus size={90} className="about-lotus" delay={0.4} />
        </div>
      </div>
    </section>
  )
}

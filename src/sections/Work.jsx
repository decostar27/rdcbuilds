import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { Reveal, Words, Label, Lightbox } from '../components/ui.jsx'
import { Mandala } from '../components/Ambient.jsx'
import { TiltedCard } from '../components/effects.jsx'
import { SilaIcon, SamadhiIcon, PannaIcon } from '../components/StageIcons.jsx'
import { looks, runway, projects } from '../data.js'

const ease = [0.22, 1, 0.36, 1]

const stages = [
  { k: 'Sila', t: 'Morality', d: 'Grounded tones and steady forms. The first discipline of a quiet mind.', c: 'radial-gradient(circle at 35% 30%, #B08A72, var(--earth-brown))', Icon: SilaIcon },
  { k: 'Samadhi', t: 'Concentration', d: 'Calm, balanced shades for Buddhi: clarity, focus and decision.', c: 'radial-gradient(circle at 35% 30%, var(--mist-teal), var(--cosmic-blue))', Icon: SamadhiIcon },
  { k: 'Panna', t: 'Wisdom', d: 'Colours blended and faded until the boundaries dissolve into light.', c: 'radial-gradient(circle at 35% 30%, #DDB4B9, #A8737C)', Icon: PannaIcon },
]

function LookExplorer() {
  const [active, setActive] = useState(0)
  const [shot, setShot] = useState(0)
  const [lb, setLb] = useState(null)
  const look = looks[active]
  const pick = (i) => { setActive(i); setShot(0) }
  const close = useCallback(() => setLb(null), [])

  return (
    <div className="explorer">
      <div className="explorer-tabs" role="tablist" aria-label="Looks">
        {looks.map((l, i) => (
          <button key={l.n} role="tab" aria-selected={i === active} className={i === active ? 'on' : ''} onClick={() => pick(i)}>
            {i === active && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 220, damping: 26 }} />}
            <span>Look {l.n}</span>
          </button>
        ))}
      </div>

      <div className="explorer-body">
        <TiltedCard className="stage-tilt" max={7} scale={1.02}>
        <div className="explorer-stage">
          <AnimatePresence mode="wait">
            <motion.button key={look.images[shot].src} className="explorer-main" onClick={() => setLb(shot)}
              initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.8, ease }}
              aria-label="Open image full screen">
              <img src={look.images[shot].src} alt={`Look ${look.n} — ${look.title}`} />
            </motion.button>
          </AnimatePresence>
        </div>
        </TiltedCard>

        <div className="explorer-info">
          <AnimatePresence mode="wait">
            <motion.div key={look.n} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease }}>
              <span className="look-num">{look.n}</span>
              <span className="fc-k">{look.stage}</span>
              <h3 className="h3">{look.title}</h3>
              <p>{look.text}</p>
            </motion.div>
          </AnimatePresence>
          <div className="thumbs">
            {look.images.map((im, i) => (
              <motion.button key={im.src} className={`thumb ${i === shot ? 'on' : ''}`} onClick={() => setShot(i)}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                aria-label={`Show image ${i + 1}`}>
                <img src={im.src} alt="" loading="lazy" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      <Lightbox items={look.images} index={lb} onClose={close} onIndex={setLb} title={`Thama Nibbana · Look ${look.n}, ${look.title}`} />
    </div>
  )
}

function Runway() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-80%'])
  const bgX = useTransform(scrollYProgress, [0, 1], ['10%', '-30%'])
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-8, -2, 6])
  const [lb, setLb] = useState(null)
  const [count, setCount] = useState(1)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setCount(Math.min(runway.length, Math.max(1, Math.round(v * (runway.length - 1)) + 1))))
  const close = useCallback(() => setLb(null), [])
  const pad = (n) => String(n).padStart(2, '0')
  return (
    <div className="runway" ref={ref}>
      <div className="runway-sticky">
        <div className="runway-stage">
          <motion.span className="runway-word" style={{ x: bgX }} aria-hidden="true">RUNWAY</motion.span>
          <span className="beam beam-1" aria-hidden="true" />
          <span className="beam beam-2" aria-hidden="true" />
          <span className="beam beam-3" aria-hidden="true" />
          <span className="runway-floor" aria-hidden="true" />

          <div className="runway-head">
            <div>
              <h3 className="h2"><Words text="On the runway" /></h3>
              <p>Shibori, tie-dye and traditional batik, shown in the Talented Designer showcase.</p>
            </div>
            <div className="runway-count" aria-live="polite">
              <AnimatePresence mode="popLayout">
                <motion.strong key={count} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }} transition={{ duration: 0.5, ease }}>{pad(count)}</motion.strong>
              </AnimatePresence>
              <span>/ {pad(runway.length)}</span>
            </div>
          </div>

          <div className="runway-viewport">
            <motion.div className="runway-track" style={{ x, rotateY }}>
              {runway.map((r, i) => (
                <motion.button key={r.src} className={`runway-card ${i + 1 === count ? 'is-active' : ''}`} onClick={() => setLb(i)}
                  whileHover={{ y: -14, scale: 1.03 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  aria-label={`Open runway photo ${i + 1}`}>
                  <span className="rc-frame">
                    <img src={r.src} alt={`MBFW 2025 runway look ${i + 1}`} loading="lazy" />
                    <span className="rc-glare" />
                  </span>
                  <span className="rc-tag"><em>{pad(i + 1)}</em> Look</span>
                </motion.button>
              ))}
            </motion.div>
          </div>

          <div className="runway-foot">
            <span className="fc-k">Scroll to walk the show</span>
            <div className="runway-progress"><motion.span style={{ scaleX: scrollYProgress }} /></div>
            <span className="fc-k">View full screen ↗</span>
          </div>
        </div>
      </div>
      <Lightbox items={runway} index={lb} onClose={close} onIndex={setLb} title="On the runway · MBFW 2025" />
    </div>
  )
}

function Projects() {
  const [open, setOpen] = useState(null)
  const [lb, setLb] = useState(null)
  const close = useCallback(() => setLb(null), [])
  const p = projects.find((x) => x.id === open)
  return (
    <div className="projects">
      <div className="projects-head">
        <h3 className="h2"><Words text="More from the studio" /></h3>
        <Reveal><p>Research, print development, illustration and line-ups from university projects.</p></Reveal>
      </div>
      <div className="project-grid">
        {projects.map((pr, i) => (
          <Reveal key={pr.id} delay={i * 0.1} className={`${pr.featured ? 'pc-featured' : ''} ${pr.flip ? 'pc-flip' : ''}`}>
            <TiltedCard className="project-tilt" max={6} scale={1.015}>
              <motion.button className="project-card" onClick={() => { setOpen(pr.id); setLb(0) }} whileHover="hover">
                <div className="pc-img">
                  <motion.img src={pr.pages[pr.cover].src} alt="" loading="lazy"
                    variants={{ hover: { scale: 1.05 } }} transition={{ duration: 1.2, ease }} />
                  <span className="pc-pages">{pr.pages.length} pages</span>
                </div>
                <div className="pc-body">
                  <span className="fc-k">{pr.kind}</span>
                  <h4>{pr.title}</h4>
                  <p>{pr.blurb}</p>
                  <motion.span className="pc-more" variants={{ hover: { x: 6 } }}>View all pages →</motion.span>
                </div>
              </motion.button>
            </TiltedCard>
          </Reveal>
        ))}
      </div>
      <Lightbox items={p ? p.pages : []} index={p ? lb : null} onClose={() => { close(); setOpen(null) }} onIndex={setLb} title={p ? p.title : ''} />
    </div>
  )
}

export default function Work() {
  return (
    <section id="work" className="section work">
      <Label num="02">Work</Label>

      <div className="nibbana-intro">
        <div className="ni-floor" aria-hidden="true"><div className="ni-plane"><div className="ni-mandala spin-rev"><Mandala size={560} /></div></div></div>
        <Reveal className="fc-k center">Final collection · BA (Hons)</Reveal>
        <h2 className="display center"><Words text="Thama Nibbana" stagger={0.12} /></h2>
        <Reveal delay={0.3}>
          <p className="lead center narrow">
            The modern world moves on autopilot. This collection imagines a way back: the inner workings of
            the mind during meditation, translated into hand-dyed calico, doodled prints and voluminous,
            breathing silhouettes. A journey from distraction to awareness, ego to consciousness,
            chaos to inner peace.
          </p>
        </Reveal>
        <div className="stages">
          {stages.map((s, i) => (
            <Reveal key={s.k} delay={0.15 * i} className="stage glass">
              <div className="stage-icon">
                <motion.span className="stage-halo" style={{ background: s.c }}
                  animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
                  transition={{ duration: 5, repeat: Infinity, delay: i * 1.2, ease: 'easeInOut' }} />
                <motion.span className="stage-orb" style={{ background: s.c }}
                  animate={{ y: [0, -4, 0] }} transition={{ duration: 6, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}>
                  <s.Icon />
                </motion.span>
              </div>
              <h4>{s.k}</h4>
              <span className="fc-k">{s.t}</span>
              <p>{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <LookExplorer />

      <Runway />
      <Projects />
    </section>
  )
}

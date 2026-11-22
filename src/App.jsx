import { useEffect, useState, useCallback } from 'react'
import { motion, MotionConfig, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'
import Lenis from 'lenis'
import { Grain, Intro, introSeen } from './components/Ambient.jsx'
import ShaderSky from './components/ShaderSky.jsx'
import Hero from './sections/Hero.jsx'
import About, { Marquee } from './sections/About.jsx'
import Work from './sections/Work.jsx'
import Mamathwaya from './sections/Mamathwaya.jsx'
import Contact from './sections/Contact.jsx'

const nav = [
  ['home', 'Home'], ['about', 'About'], ['work', 'Work'], ['mamathwaya', 'Mamathwaya'], ['contact', 'Contact'],
]

function Nav() {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
    }, { rootMargin: '-45% 0px -50% 0px' })
    nav.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [])

  return (
    <motion.header className="nav-wrap" initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.1 }}>
      <nav className="nav glass">
        <a href="#home" className="brand-mark">L<span>·</span>M</a>
        <ul className={open ? 'open' : ''}>
          {nav.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={() => setOpen(false)} className={active === id ? 'on' : ''}>
                {active === id && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 260, damping: 28 }} />}
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
        <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
        <motion.span className="nav-progress" style={{ scaleX: progress }} />
      </nav>
    </motion.header>
  )
}

/* Small round button that appears once you are past the header */
function ToTop() {
  const { scrollY } = useScroll()
  const [show, setShow] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setShow(v > window.innerHeight * 1.2))
  return (
    <AnimatePresence>
      {show && (
        <motion.a href="#home" className="to-top" aria-label="Back to top"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.25 }}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14l6-6 6 6" /></svg>
        </motion.a>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const [ready, setReady] = useState(introSeen)
  const done = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // light smoothing only — responsive, never "floaty"
    const lenis = new Lenis({ lerp: 0.14, smoothWheel: true, wheelMultiplier: 1 })
    let raf
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      e.preventDefault()
      lenis.scrollTo(a.getAttribute('href'), { offset: 0, duration: 1.1 })
    }
    document.addEventListener('click', onClick)
    return () => { cancelAnimationFrame(raf); lenis.destroy(); document.removeEventListener('click', onClick) }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <ShaderSky />
      <Grain />
      <Intro done={ready} onDone={done} />
      <Nav />
      <ToTop />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Work />
        <Mamathwaya />
        <Contact />
      </main>
    </MotionConfig>
  )
}

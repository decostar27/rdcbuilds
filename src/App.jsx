import { useEffect, useState, useCallback } from 'react'
import { motion, MotionConfig, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import { AuraField, Motes, CursorHalo, Intro } from './components/Ambient.jsx'
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
    <motion.header className="nav-wrap" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, delay: 0.4 }}>
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

export default function App() {
  const [ready, setReady] = useState(false)
  const done = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.4, smoothWheel: true })
    let raf
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      e.preventDefault()
      lenis.scrollTo(a.getAttribute('href'), { offset: 0, duration: 2 })
    }
    document.addEventListener('click', onClick)
    return () => { cancelAnimationFrame(raf); lenis.destroy(); document.removeEventListener('click', onClick) }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <ShaderSky />
      <AuraField />
      <Motes />
      <CursorHalo />
      <Intro done={ready} onDone={done} />
      <Nav />
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

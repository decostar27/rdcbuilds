import { motion } from 'framer-motion'
import { Reveal, Words, Label } from '../components/ui.jsx'
import { Mandala } from '../components/Ambient.jsx'
import { brand } from '../data.js'

export default function Contact() {
  const links = [
    { k: 'Email', v: 'lgunasekara528@gmail.com', href: 'mailto:lgunasekara528@gmail.com' },
    { k: 'Phone', v: '+94 71 9003 121', href: 'tel:+94719003121' },
    { k: 'Instagram', v: '@lifelines.mila', href: 'https://instagram.com/lifelines.mila' },
  ]
  return (
    <section id="contact" className="section contact">
      <Label num="04">Contact</Label>
      <div className="contact-inner">
        <div className="contact-mandala"><div className="spin-slow"><Mandala size={720} /></div></div>
        <motion.div className="breath-orb" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <h2 className="display center"><Words text="Let's create something" /><br /><Words text="mindful." className="t-italic" delay={0.4} /></h2>
        <Reveal delay={0.3}>
          <p className="lead center narrow">
            Open to design roles, collaborations, commissions and Mamathwaya stockists.
          </p>
        </Reveal>
        <div className="contact-links">
          {links.map((l, i) => (
            <Reveal key={l.k} delay={0.2 + i * 0.1}>
              <motion.a className="glass contact-link" href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
                <span className="fc-k">{l.k}</span>
                <span>{l.v}</span>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
      <footer className="footer">
        <img src={brand.mark} alt="" />
        <span>© {new Date().getFullYear()} Lakshi Milani</span>
        <span className="fc-k">May all beings be well & happy</span>
      </footer>
    </section>
  )
}

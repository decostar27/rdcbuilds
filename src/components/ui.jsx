import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export function Reveal({ children, delay = 0, y = 40, className = '', as = 'div' }) {
  const M = motion[as]
  return (
    <M className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 1.2, delay, ease }}>
      {children}
    </M>
  )
}

/* Words float up one by one, like a slow exhale */
export function Words({ text, className = '', delay = 0, stagger = 0.06 }) {
  return (
    <motion.span className={className} aria-label={text} initial="hide" whileInView="show" viewport={{ once: true }}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="word-mask" aria-hidden="true" style={{ marginRight: '0.25em' }}>
          <motion.span className="word"
            variants={{
              hide: { y: '90%', opacity: 0, rotateX: 70, filter: 'blur(10px)' },
              show: { y: '0%', opacity: 1, rotateX: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration: 1.4, delay: delay + i * stagger, ease }}>
            {w}
          </motion.span>{' '}
        </span>
      ))}
    </motion.span>
  )
}

export function Label({ children, num }) {
  return (
    <Reveal className="label">
      {num && <span className="label-num">{num}</span>}
      <span className="label-line" />
      <span>{children}</span>
    </Reveal>
  )
}

export function Lightbox({ items, index, onClose, onIndex }) {
  useEffect(() => {
    if (index == null) return
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', key)
    document.documentElement.classList.add('locked')
    return () => { window.removeEventListener('keydown', key); document.documentElement.classList.remove('locked') }
  }, [index, items.length, onClose, onIndex])

  return (
    <AnimatePresence>
      {index != null && (
        <motion.div className="lightbox" role="dialog" aria-modal="true" data-lenis-prevent
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <AnimatePresence mode="wait">
            <motion.img key={items[index].src} src={items[index].src} alt={items[index].alt || ''}
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.6, ease }}
              onClick={(e) => e.stopPropagation()} />
          </AnimatePresence>
          {items.length > 1 && <>
            <button className="lb-btn lb-prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + items.length) % items.length) }}>←</button>
            <button className="lb-btn lb-next" aria-label="Next" onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % items.length) }}>→</button>
          </>}
          <button className="lb-close" aria-label="Close" onClick={onClose}>close ✕</button>
          <span className="lb-count">{index + 1} / {items.length}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

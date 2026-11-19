import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
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

/*
  Full-screen viewer.
  - Rendered in a portal on <body>, so it always sits above the navigation bar.
  - Close: ✕ button, Esc, or clicking the dark backdrop. Focus moves to ✕ on open and returns afterwards.
  - Navigate: arrow buttons, ← → keys, swipe on touch, or the thumbnail strip.
  - Zoom: the + button, Z key, or double-click; zoomed images scroll/pan inside the viewer.
*/
export function Lightbox({ items, index, onClose, onIndex, title = '' }) {
  const open = index != null && items.length > 0
  const [zoom, setZoom] = useState(false)
  const closeRef = useRef(null)
  const dialogRef = useRef(null)
  const thumbsRef = useRef(null)
  const lastFocus = useRef(null)
  const n = items.length
  const go = useCallback((d) => onIndex((index + d + n) % n), [index, n, onIndex])

  useEffect(() => { setZoom(false) }, [index])

  // open/close side effects: lock page scroll, manage focus
  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement
    document.documentElement.classList.add('locked')
    const t = setTimeout(() => closeRef.current?.focus(), 50)
    return () => {
      clearTimeout(t)
      document.documentElement.classList.remove('locked')
      lastFocus.current?.focus?.()
    }
  }, [open])

  // keyboard
  useEffect(() => {
    if (!open) return
    const key = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      else if (e.key === 'ArrowRight' && n > 1) go(1)
      else if (e.key === 'ArrowLeft' && n > 1) go(-1)
      else if (e.key === 'z' || e.key === 'Z') setZoom((z) => !z)
      else if (e.key === 'Tab') {
        // keep focus inside the viewer
        const f = dialogRef.current?.querySelectorAll('button')
        if (!f?.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [open, n, go, onClose])

  // keep the active thumbnail visible, preload neighbours
  useEffect(() => {
    if (!open) return
    thumbsRef.current?.querySelector('.on')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    ;[1, -1].forEach((d) => { const im = new Image(); im.src = items[(index + d + n) % n].src })
  }, [open, index, n, items])

  if (typeof document === 'undefined') return null
  const item = open ? items[index] : null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label={title || 'Image viewer'} data-lenis-prevent
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          <div className="lb-backdrop" onClick={onClose} />

          <header className="lb-bar">
            <div className="lb-title">
              {title && <strong>{title}</strong>}
              {n > 1 && <span className="lb-count">{String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>}
            </div>
            <div className="lb-tools">
              <button className={`lb-icon ${zoom ? 'on' : ''}`} onClick={() => setZoom((z) => !z)} aria-pressed={zoom}
                aria-label={zoom ? 'Zoom out' : 'Zoom in'} title={zoom ? 'Zoom out (Z)' : 'Zoom in (Z)'}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5M8.5 11h5" />{!zoom && <path d="M11 8.5v5" />}</svg>
              </button>
              <button ref={closeRef} className="lb-icon lb-close" onClick={onClose} aria-label="Close viewer" title="Close (Esc)">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
          </header>

          <div className={`lb-stage ${zoom ? 'zoomed' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.img key={item.src} src={item.src} alt={item.alt || title}
                initial={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: 0.45, ease }}
                drag={!zoom && n > 1 ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.35}
                onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 60) go(info.offset.x < 0 ? 1 : -1) }}
                onDoubleClick={() => setZoom((z) => !z)} draggable="false" />
            </AnimatePresence>
          </div>

          {n > 1 && <>
            <button className="lb-nav lb-prev" onClick={() => go(-1)} aria-label="Previous image">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button className="lb-nav lb-next" onClick={() => go(1)} aria-label="Next image">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </>}

          <footer className="lb-foot">
            {n > 1 && (
              <div className="lb-thumbs" ref={thumbsRef}>
                {items.map((it, i) => (
                  <button key={it.src} className={i === index ? 'on' : ''} onClick={() => onIndex(i)}
                    aria-label={`Show image ${i + 1}`} aria-current={i === index}>
                    <img src={it.src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
            <span className="lb-hint">
              <span className="hint-desk">← → to browse · Z or double-click to zoom · Esc to close</span>
              <span className="hint-touch">Swipe to browse · double-tap to zoom</span>
            </span>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

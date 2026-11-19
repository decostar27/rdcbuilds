import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

/* Content eases up into place — opacity + transform only, so it stays on the GPU */
export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const M = motion[as]
  return (
    <M className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.8, delay: Math.min(delay, 0.4), ease }}>
      {children}
    </M>
  )
}

/* Headings rise word by word from behind a mask (editorial style) */
export function Words({ text, className = '', delay = 0, stagger = 0.05 }) {
  return (
    <motion.span className={className} aria-label={text} initial="hide" whileInView="show" viewport={{ once: true }}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="word-mask" aria-hidden="true">
          <motion.span className="word"
            variants={{ hide: { y: '105%' }, show: { y: '0%' } }}
            transition={{ duration: 0.85, delay: delay + i * stagger, ease }}>
            {w}
          </motion.span>
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
  - Dual view (book prop): two pages side by side like an open book — page 1 alone as the cover,
    then 2–3, 4–5 … Toggle with the book button or D. Only offered on screens 700px and wider.
*/
const wideQuery = '(min-width: 700px)'
export function Lightbox({ items, index, onClose, onIndex, title = '', book = false }) {
  const open = index != null && items.length > 0
  const n = items.length
  const [zoom, setZoom] = useState(false)
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(wideQuery).matches)
  const [dualPref, setDualPref] = useState(book)
  const closeRef = useRef(null)
  const dialogRef = useRef(null)
  const thumbsRef = useRef(null)
  const lastFocus = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia(wideQuery)
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  useEffect(() => { setDualPref(book) }, [book])

  const dual = dualPref && wide && n > 2
  // pages shown right now
  const start = !dual || index == null ? index : index === 0 ? 0 : index % 2 === 1 ? index : index - 1
  const shown = !open ? [] : dual && start > 0 && start + 1 < n ? [start, start + 1] : [start]
  const lastStart = n - 1 === 0 ? 0 : (n - 1) % 2 === 1 ? n - 1 : n - 2

  const go = useCallback((d) => {
    if (!dual) return onIndex((index + d + n) % n)
    if (d > 0) { const nx = start === 0 ? 1 : start + 2; onIndex(nx >= n ? 0 : nx) }
    else { const pv = start <= 1 ? (start === 0 ? lastStart : 0) : start - 2; onIndex(pv) }
  }, [dual, index, n, onIndex, start, lastStart])

  useEffect(() => { setZoom(false) }, [index, dual])

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
      else if ((e.key === 'd' || e.key === 'D') && wide && n > 2) setDualPref((v) => !v)
      else if (e.key === 'Home') onIndex(0)
      else if (e.key === 'End') onIndex(n - 1)
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
  }, [open, n, go, onClose, onIndex, wide])

  // keep the active thumbnail visible, preload neighbours
  useEffect(() => {
    if (!open) return
    thumbsRef.current?.querySelector('.on')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    ;[-1, 1, 2, 3].forEach((d) => { const im = new Image(); im.src = items[(index + d + n) % n].src })
  }, [open, index, n, items])

  if (typeof document === 'undefined') return null
  const pad = (v) => String(v + 1).padStart(2, '0')
  const countText = shown.length === 2 ? `${pad(shown[0])}–${pad(shown[1])}` : pad(shown[0] ?? 0)

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label={title || 'Image viewer'} data-lenis-prevent
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          <div className="lb-backdrop" onClick={onClose} />

          <header className="lb-bar">
            <div className="lb-title">
              {title && <strong>{title}</strong>}
              {n > 1 && <span className="lb-count">{countText} / {String(n).padStart(2, '0')}</span>}
            </div>
            <div className="lb-tools">
              {wide && n > 2 && (
                <div className="lb-mode" role="group" aria-label="Page layout">
                  <button className={!dual ? 'on' : ''} onClick={() => setDualPref(false)} aria-pressed={!dual} title="Single page (D)">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="4" width="10" height="16" rx="1.5" /></svg>
                    <span>Single</span>
                  </button>
                  <button className={dual ? 'on' : ''} onClick={() => setDualPref(true)} aria-pressed={dual} title="Dual pages (D)">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="8.5" height="14" rx="1.2" /><rect x="12.5" y="5" width="8.5" height="14" rx="1.2" /></svg>
                    <span>Dual</span>
                  </button>
                </div>
              )}
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
              <motion.div key={shown.join('-') + (dual ? 'd' : 's')} className={`lb-spread ${shown.length === 2 ? 'two' : ''}`}
                onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: 0.45, ease }}
                drag={!zoom && n > 1 ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.35}
                onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 60) go(info.offset.x < 0 ? 1 : -1) }}
                onDoubleClick={() => setZoom((z) => !z)}>
                {shown.map((i) => (
                  <img key={items[i].src} src={items[i].src} alt={items[i].alt || title} draggable="false"
                    width={items[i].w} height={items[i].h} />
                ))}
              </motion.div>
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
                  <button key={it.src} className={shown.includes(i) ? 'on' : ''} onClick={() => onIndex(i)}
                    aria-label={`Show page ${i + 1}`} aria-current={shown.includes(i)}>
                    <img src={it.thumb || it.src} alt="" loading="lazy" />
                    <span>{i + 1}</span>
                  </button>
                ))}
              </div>
            )}
            <span className="lb-hint">
              <span className="hint-desk">← → to browse · {wide && n > 2 ? 'D for dual pages · ' : ''}Z or double-click to zoom · Esc to close</span>
              <span className="hint-touch">Swipe to browse · double-tap to zoom</span>
            </span>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

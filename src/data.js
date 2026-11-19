import manifest from './manifest.json'

export const img = (p) => `/images/${p}`

export const looks = [
  {
    n: 'I', key: '1', title: 'The Restless Mind', stage: 'Manas',
    text: 'A hooded cape draped over one shoulder, a wide-leg pant with circular tie-up panels, and a tunic of curved, petal-like panels — the curious, wandering mind at the start of practice.',
  },
  {
    n: 'II', key: '2', title: 'Threads of Attention', stage: 'Sila',
    text: 'A loose V-neck tunic gathered by side ties threaded through channels, over a floor-length dress with full, gathered sleeves and a tie-up back.',
  },
  {
    n: 'III', key: '3', title: 'Open Breath', stage: 'Samadhi',
    text: 'An open-front jacket with short, wide sleeves joined by piped cut-outs, a pleated-hem A-line tunic, and a low-hip three-quarter pant gathered with ties.',
  },
  {
    n: 'IV', key: '4', title: 'The Inward Hood', stage: 'Buddhi',
    text: 'A sleeveless hooded tunic with a flared A-line silhouette and centre drawstring, layered over a technical wide-leg trouser with asymmetric panel pockets.',
  },
  {
    n: 'V', key: '5', title: 'Golden Stillness', stage: 'Panna',
    text: 'A high-waisted A-line maxi skirt with clean cut-outs, under a long-sleeve gown whose front opens into a jacket and ties closed with strips.',
  },
  {
    n: 'VI', key: '6', title: 'Release', stage: 'Nibbana',
    text: 'Box-pleated wide-leg pants gathered at the side, an asymmetric layered tunic, and a one-sided cape tied around the neck — fluid, unbound, at peace.',
  },
].map((l) => ({ ...l, images: manifest.looks[l.key].map((i) => ({ ...i, src: img(i.src) })) }))

export const runway = manifest.runway.map((i) => ({ ...i, src: img(i.src) }))
export const portrait = img(manifest.portrait)
export const brand = Object.fromEntries(Object.entries(manifest.brand).map(([k, v]) => [k, img(v)]))
/* Full documents — every page of each PDF, with a small thumbnail per page */
const doc = (k, title, from = 0, to) =>
  manifest.docs[k].slice(from, to).map((p, i) => ({
    src: img(p.src), thumb: img(p.thumb), w: p.w, h: p.h,
    alt: `${title} — page ${from + i + 1}`,
  }))

export const projects = [
  {
    id: 'lookbook', title: 'Thama Nibbana — Look Book', kind: 'Final collection · Look book', featured: true,
    blurb: 'The graduate collection photographed — six looks of hand-dyed calico, from the restless mind to release, across a 36-page look book.',
    pages: doc('lookbook', 'Thama Nibbana Look Book'), cover: 35,
  },
  {
    id: 'samsara', title: 'Samsara', kind: 'Follow-on project · Menswear',
    blurb: 'The journey from birth to Nirvana — biomorphic prints, chakra colour and layered gauze over DTF, told through menswear silhouettes.',
    pages: doc('portfolio', 'Samsara', 25, 37), cover: 10,
  },
  {
    id: 'versace', title: 'Aura × Versace', kind: 'Collaboration project',
    blurb: 'Inspired by aura photography — the human energy field as colour — with sculptural headwraps drawn from African, Tibetan and Celtic traditions.',
    pages: doc('portfolio', 'Aura × Versace', 37, 49), cover: 10,
  },
  {
    id: 'heritage', title: 'Heritage', kind: 'Print & embroidery study',
    blurb: 'Buddhist heritage and Sri Lankan craft — Beeralu lace, Lakshā and embroidery motifs reimagined as contemporary prints in a Delpozo-inspired range.',
    pages: doc('heritage', 'Heritage project'), cover: 23,
  },
  {
    id: 'choice', title: 'The Power of Choice', kind: 'Second-year final project',
    blurb: 'Armour, structure and softness — a tailored womenswear range exploring strength, freedom and the quiet confidence of choosing for oneself.',
    pages: doc('choice', 'The Power of Choice'), cover: 17,
  },
]


const C = brand
export const mamathwaya = [
  { code: 'MW001', name: 'Wrap Jacket', tone: 'Ocean', src: C.mw001c1 },
  { code: 'MW001', name: 'Wrap Jacket', tone: 'Blush', src: C.mw001c2 },
  { code: 'MW002', name: 'Tie Dress', tone: 'Saffron', src: C.mw002c1 },
  { code: 'MW002', name: 'Tie Dress', tone: 'Blush', src: C.mw002c2 },
  { code: 'MW003', name: 'Free Shorts', tone: 'Ocean', src: C.mw003c1 },
  { code: 'MW003', name: 'Free Shorts', tone: 'Saffron', src: C.mw003c2 },
  { code: 'MW003', name: 'Free Shorts', tone: 'Blush', src: C.mw003c3 },
  { code: 'MW004', name: 'Tie Trousers', tone: 'Ocean', src: C.mw004c1 },
  { code: 'MW004', name: 'Tie Trousers', tone: 'Saffron', src: C.mw004c2 },
  { code: 'MW004', name: 'Tie Trousers', tone: 'Blush', src: C.mw004c3 },
  { code: 'MW005', name: 'Bow Blouse', tone: 'Ocean', src: C.mw005c1 },
  { code: 'MW005', name: 'Bow Blouse', tone: 'Saffron', src: C.mw005c2 },
  { code: 'MW005', name: 'Bow Blouse', tone: 'Blush', src: C.mw005c3 },
  { code: 'MW006', name: 'Open Jacket', tone: 'Ocean', src: C.mw006c1 },
  { code: 'MW006', name: 'Open Jacket', tone: 'Saffron', src: C.mw006c2 },
  { code: 'MW006', name: 'Open Jacket', tone: 'Blush', src: C.mw006c3 },
]

export const candles = [
  { name: 'Lotus Blue', src: C.blue, hue: '#8fb1d9' },
  { name: 'Morning Mist', src: C['light-blue'], hue: '#9fd6d3' },
  { name: 'Marigold', src: C.yellow, hue: '#e9c45b' },
  { name: 'Temple Saffron', src: C.orange, hue: '#ec9a6e' },
  { name: 'Hibiscus', src: C.red, hue: '#e0647a' },
  { name: 'Lavender Dusk', src: C.purple, hue: '#b79ad6' },
]

export const experience = [
  {
    when: '2026 — Present', role: 'Founder & Consignment Partner', org: 'Mamathwaya · Self-employed',
    text: 'Hand-dyed Shibori free-size garments and handcrafted scented candles, supplied through a consignment partnership with Urban Island. Leading design, costing, branding, production and retail merchandising.',
  },
  {
    when: 'Industry', role: 'Textile Designer & Junior Fashion Designer', org: 'Kelly Felder',
    text: 'Textile and print development, garment design, trend research and concept development — original textile artworks and illustrations taken through the full collection process.',
  },
  {
    when: '2025', role: 'Talented Designer — Fashion Showcase', org: 'Mercedes-Benz Fashion Week',
    text: 'Selected to present a collection exploring South Asian craftsmanship through Shibori, tie-dye and traditional batik.',
  },
  {
    when: 'Internship', role: 'Fashion Design Intern', org: 'Matterhorn Revolution (Pvt) Ltd',
    text: 'Trend forecasting, concept and sample development, technical drawings, print design and documentation alongside merchandising, sourcing and production.',
  },
]

export const education = [
  { when: '2025', title: 'BA (Hons) Fashion Design & Textile', where: 'Northumbria University (AOD) — Second Upper Honours' },
  { when: '2021 — 2022', title: 'Diploma of Communication & Creative Industries', where: 'Edith Cowan University' },
  { when: 'School', title: 'G.C.E. Ordinary Level', where: 'Kegalle Balika Vidyalaya' },
]

export const skills = ['Textile & print design', 'Shibori · Tie-dye · Batik', 'Fashion illustration', 'Technical drawing', 'Concept & trend research', 'Garment development', 'Adobe Illustrator', 'Procreate']

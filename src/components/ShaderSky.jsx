import { useEffect, useRef } from 'react'

/*
  Full-screen WebGL shader: slow, domain-warped clouds of dusk blue and soft pink
  drifting over the warm ivory base — like the sky in a temple painting.
  Rendered at reduced resolution (it is very soft anyway) to stay light.
*/
const vert = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`

const frag = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;

// Earthen Aura base + blue & pink accents
const vec3 IVORY  = vec3(0.953, 0.918, 0.867); // #F3EADD warm cream (board background)
const vec3 SAND   = vec3(0.910, 0.882, 0.831); // #E8E1D4 sand beige
const vec3 SAGE   = vec3(0.420, 0.498, 0.478); // #6B7F7A sage green
const vec3 TAUPE  = vec3(0.486, 0.431, 0.329); // #7C6E54 olive taupe
const vec3 BLUE   = vec3(0.557, 0.655, 0.651); // #8EA7A6 mist teal
const vec3 NAVY   = vec3(0.180, 0.290, 0.353); // #2E4A5A cosmic blue
const vec3 PINK   = vec3(0.788, 0.604, 0.627); // #C99AA0 rose dust
const vec3 BLUSH  = vec3(0.839, 0.698, 0.435); // #D6B26F starlight gold

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  float t = uTime * 0.035;

  // domain warping for silky, flowing clouds
  vec2 q = vec2(fbm(p * 1.3 + t), fbm(p * 1.3 - t + 4.0));
  vec2 r = vec2(fbm(p * 1.1 + 2.0 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p * 1.1 + 2.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.2 + 2.2 * r + uScroll * 0.6);

  vec3 col = IVORY;
  // blue drifts mostly through the upper-left & lower areas, pink through the right
  float blueMask = smoothstep(0.34, 0.78, f) * (0.6 + 0.4 * (1.0 - uv.x));
  float pinkMask = smoothstep(0.32, 0.74, r.x) * (0.5 + 0.5 * uv.x);
  col = mix(col, SAND, smoothstep(0.25, 0.85, q.y) * 0.5);
  col = mix(col, BLUSH, smoothstep(0.5, 0.9, q.x) * 0.22);
  col = mix(col, BLUE, blueMask * 0.45);
  col = mix(col, SAGE, smoothstep(0.6, 0.95, q.y) * blueMask * 0.18);
  col = mix(col, NAVY, smoothstep(0.72, 0.97, f) * 0.16);
  col = mix(col, PINK, pinkMask * 0.3);
  col = mix(col, TAUPE, smoothstep(0.7, 1.0, r.y) * 0.08);

  // soft glow following the pointer
  float d = length(uv - uMouse);
  col += vec3(0.06, 0.05, 0.06) * smoothstep(0.35, 0.0, d);

  // gentle vignette keeps the page calm
  col *= 1.0 - 0.10 * length(uv - 0.5);
  gl_FragColor = vec4(col, 1.0);
}
`

export default function ShaderSky() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) { canvas.classList.add('no-gl'); return }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vert))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.classList.add('no-gl'); return }
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')
    const uScroll = gl.getUniformLocation(prog, 'uScroll')

    const scale = 0.45
    const resize = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth * scale))
      canvas.height = Math.max(1, Math.floor(window.innerHeight * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const m = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
    const move = (e) => { m.tx = e.clientX / window.innerWidth; m.ty = 1 - e.clientY / window.innerHeight }
    window.addEventListener('pointermove', move)

    let raf, start = performance.now()
    const draw = (now) => {
      m.x += (m.tx - m.x) * 0.04; m.y += (m.ty - m.y) * 0.04
      gl.uniform1f(uTime, (now - start) / 1000 + 20)
      gl.uniform2f(uMouse, m.x, m.y)
      gl.uniform1f(uScroll, window.scrollY / Math.max(1, document.body.scrollHeight))
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    const vis = () => { cancelAnimationFrame(raf); if (!document.hidden && !reduce) raf = requestAnimationFrame(draw) }
    document.addEventListener('visibilitychange', vis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [])
  return <canvas ref={ref} className="shader-sky" aria-hidden="true" />
}

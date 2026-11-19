import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const P = {
  ivory: '#F1E8D7', sand: '#DDCCBB', blush: '#D9C1AC', taupe: '#B3AA9E',
  sage: '#ADB2A0', ochre: '#B18D66', terracotta: '#A06D50', cocoa: '#453227',
  blue: '#8DA7BE', slate: '#516981', pink: '#E1B0B7', rose: '#C9959D',
}

/* Breathing aura orb — expands and softens like a slow inhale/exhale */
function AuraOrb() {
  const ref = useRef()
  const mat = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const breath = 1 + Math.sin(t * 0.55) * 0.06
    ref.current.scale.setScalar(breath)
    mat.current.distort = 0.32 + Math.sin(t * 0.55) * 0.08
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.35, 64]} />
      <MeshDistortMaterial ref={mat} color={P.blush} emissive={P.rose} emissiveIntensity={0.14}
        roughness={0.35} metalness={0.15} speed={1.1} distort={0.32} transparent opacity={0.92} />
    </mesh>
  )
}

/* Inner glow halo (a sprite-like gradient disc always facing the camera) */
function Halo() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 256
    const g = c.getContext('2d')
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128)
    grd.addColorStop(0, 'rgba(247,240,227,0.9)')
    grd.addColorStop(0.3, 'rgba(225,176,183,0.45)')
    grd.addColorStop(0.65, 'rgba(141,167,190,0.25)')
    grd.addColorStop(1, 'rgba(141,167,190,0)')
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(c)
  }, [])
  return (
    <sprite scale={[6.5, 6.5, 1]} position={[0, 0, -1.2]}>
      <spriteMaterial map={tex} transparent depthWrite={false} />
    </sprite>
  )
}

/* Gyroscope of thin golden rings — a mandala in three dimensions */
function Rings() {
  const g = useRef()
  const rings = [
    { r: 2.05, tilt: [Math.PI / 2.2, 0, 0], speed: 0.12, c: P.ochre },
    { r: 2.35, tilt: [Math.PI / 3, Math.PI / 5, 0], speed: -0.08, c: P.slate },
    { r: 2.7, tilt: [Math.PI / 1.7, -Math.PI / 6, 0.3], speed: 0.06, c: P.rose },
  ]
  const refs = useRef([])
  useFrame((_, d) => {
    refs.current.forEach((m, i) => { if (m) m.rotation.z += rings[i].speed * d })
  })
  return (
    <group ref={g}>
      {rings.map((r, i) => (
        <group key={i} rotation={r.tilt}>
          <mesh ref={(el) => (refs.current[i] = el)}>
            <torusGeometry args={[r.r, 0.006, 12, 240]} />
            <meshBasicMaterial color={r.c} transparent opacity={0.75} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* 108 mala beads orbiting slowly */
function Mala() {
  const ref = useRef()
  const count = 108
  const dummy = useMemo(() => new THREE.Object3D(), [])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + t * 0.05
      const big = i % 27 === 0
      dummy.position.set(Math.cos(a) * 3.05, Math.sin(a * 3 + t * 0.3) * 0.06, Math.sin(a) * 3.05)
      dummy.scale.setScalar(big ? 1.9 : 1 + Math.sin(t * 1.2 + i * 0.4) * 0.12)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <group rotation={[0.42, 0, -0.18]}>
      <instancedMesh ref={ref} args={[null, null, count]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={P.terracotta} roughness={0.4} metalness={0.3} />
      </instancedMesh>
    </group>
  )
}

/* Floating lotus petals made from curved planes */
function Petals() {
  const petals = useMemo(() => Array.from({ length: 9 }, (_, i) => ({
    pos: [(Math.random() - 0.5) * 7, (Math.random() - 0.5) * 4.5, (Math.random() - 0.5) * 2 - 0.5],
    rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
    s: 0.12 + Math.random() * 0.14,
    c: [P.pink, P.blue, P.blush, P.ochre][i % 4],
  })), [])
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.bezierCurveTo(0.6, 0.4, 0.45, 1.3, 0, 1.8)
    s.bezierCurveTo(-0.45, 1.3, -0.6, 0.4, 0, 0)
    return s
  }, [])
  return petals.map((p, i) => (
    <Float key={i} speed={0.8 + i * 0.1} rotationIntensity={1.2} floatIntensity={1.4}>
      <mesh position={p.pos} rotation={p.rot} scale={p.s}>
        <shapeGeometry args={[shape, 24]} />
        <meshStandardMaterial color={p.c} side={THREE.DoubleSide} roughness={0.6} transparent opacity={0.85} />
      </mesh>
    </Float>
  ))
}

/* Whole scene leans toward the pointer, like turning to listen */
function Rig({ children }) {
  const g = useRef()
  useFrame(({ pointer, clock }) => {
    const t = clock.getElapsedTime()
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, pointer.x * 0.35 + Math.sin(t * 0.1) * 0.15, 0.03)
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -pointer.y * 0.2, 0.03)
  })
  return <group position={[0, 0.45, 0]}><group ref={g}>{children}</group></group>
}

export default function HeroScene() {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <Canvas className="hero-canvas" dpr={[1, 1.75]} camera={{ position: [0, 0, 7.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }} frameloop={reduce ? 'demand' : 'always'}
      eventSource={typeof document !== 'undefined' ? document.getElementById('root') : undefined} eventPrefix="client">
      <ambientLight intensity={0.9} color={P.ivory} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#fff3e2" />
      <pointLight position={[-4, -2, 2]} intensity={14} color={P.pink} />
      <pointLight position={[3.5, -2.5, 1]} intensity={16} color={P.blue} />
      <pointLight position={[0, 4, -2]} intensity={6} color={P.terracotta} />
      <Rig>
        <Halo />
        <Float speed={1} rotationIntensity={0.3} floatIntensity={0.6}>
          <AuraOrb />
        </Float>
        <Rings />
        <Mala />
        <Petals />
        <Sparkles count={70} scale={[8, 5, 3]} size={2.4} speed={0.25} opacity={0.7} color={P.ochre} />
        <Sparkles count={40} scale={[6, 4, 2]} size={1.6} speed={0.18} opacity={0.8} color={P.ivory} />
        <Sparkles count={35} scale={[7, 5, 3]} size={2} speed={0.22} opacity={0.75} color={P.pink} />
        <Sparkles count={35} scale={[7, 5, 3]} size={2} speed={0.2} opacity={0.75} color={P.blue} />
      </Rig>
    </Canvas>
  )
}

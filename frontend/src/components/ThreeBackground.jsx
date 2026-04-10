import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

// Global mouse tracker for parallax, bypassing any z-index/canvas pointer event blocks
const mouse = { x: 0, y: 0 }
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  })
}

function Stars(props) {
  const ref = useRef()
  
  const [sphere] = useMemo(() => [
    random.inSphere(new Float32Array(3000), { radius: 1.5 })
  ], [])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15
    
    // Interactive mouse follow (parallax)
    ref.current.position.x += (mouse.x * 0.5 - ref.current.position.x) * delta * 2
    ref.current.position.y += (mouse.y * 0.5 - ref.current.position.y) * delta * 2
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#5b9bff"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  )
}

function Particles() {
  const count = 500
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])

  const ref = useRef()

  useFrame((state, delta) => {
    if (!ref.current) return
    const time = state.clock.getElapsedTime()
    ref.current.rotation.x = time * 0.1
    ref.current.rotation.y = time * 0.05
    
    // Interactive mouse follow with slightly different depth/speed than stars
    ref.current.position.x += (mouse.x * 1.5 - ref.current.position.x) * delta * 1.5
    ref.current.position.y += (mouse.y * 1.5 - ref.current.position.y) * delta * 1.5

    // Animate individual particles
    const positions = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.001
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#3b82f6"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.3}
        alphaTest={0.001}
        depthWrite={false}
      />
    </points>
  )
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        style={{ background: 'transparent' }}
      >
        <fog attach="fog" args={['#0d1117', 5, 20]} />
        <Stars />
        <Particles />
      </Canvas>
    </div>
  )
}

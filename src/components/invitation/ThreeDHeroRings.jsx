import { useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function WeddingRings() {
  const ring1 = useRef()
  const ring2 = useRef()
  const { mouse } = useThree()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Gentle auto-rotation
    ring1.current.rotation.x = mouse.y * 0.4 + Math.sin(t * 0.4) * 0.1
    ring1.current.rotation.y = mouse.x * 0.4 + t * 0.3
    ring2.current.rotation.x = mouse.y * 0.35 + Math.cos(t * 0.4) * 0.1
    ring2.current.rotation.y = -mouse.x * 0.35 + t * 0.25 + 0.8
  })

  return (
    <group>
      <mesh ref={ring1} position={[-0.38, 0.05, 0]}>
        <torusGeometry args={[0.62, 0.07, 24, 120]} />
        <meshStandardMaterial
          color="#C5A059"
          metalness={0.95}
          roughness={0.08}
        />
      </mesh>
      <mesh ref={ring2} position={[0.38, -0.08, 0.18]}>
        <torusGeometry args={[0.58, 0.07, 24, 120]} />
        <meshStandardMaterial
          color="#E8D5A3"
          metalness={0.92}
          roughness={0.12}
        />
      </mesh>
    </group>
  )
}

export default function ThreeDHeroRings() {
  return (
    <div className="w-full h-[220px] pointer-events-auto" style={{ cursor: 'grab' }}>
      <Canvas camera={{ position: [0, 0, 3.2], fov: 42 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[4, 4, 4]} intensity={2.5} color="#fff8e7" />
        <pointLight position={[-3, -2, 2]} intensity={0.8} color="#f0e4c0" />
        <Suspense fallback={null}>
          <WeddingRings />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}

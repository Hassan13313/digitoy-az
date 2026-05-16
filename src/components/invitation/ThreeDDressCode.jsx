import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function WavingFabric({ color }) {
  const meshRef = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.z = Math.sin(t * 1.6) * 0.04
    meshRef.current.rotation.y = Math.cos(t * 1.2) * 0.08
    meshRef.current.rotation.x = Math.sin(t * 0.9) * 0.03
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2.4, 2.4, 24, 24]} />
      <meshStandardMaterial
        color={color}
        roughness={0.35}
        metalness={0.15}
        side={2}
      />
    </mesh>
  )
}

export default function ThreeDDressCode({ color = '#C9A88A' }) {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        height: '180px',
        background: '#FDFBF7',
        border: '1px solid rgba(221,213,200,0.5)',
      }}
    >
      <Canvas camera={{ position: [0, 0, 3.2], fov: 48 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <spotLight position={[5, 8, 6]} angle={0.4} intensity={2.5} />
        <pointLight position={[-4, -3, 3]} intensity={0.5} color="#f0e4c0" />
        <Suspense fallback={null}>
          <WavingFabric color={color} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}

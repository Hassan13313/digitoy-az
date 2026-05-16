import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import t from '../../data/translations'

function TableMesh({ position, tableNum, isSelected, onClick }) {
  const meshRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (isSelected) {
      meshRef.current.position.y = Math.sin(t * 4) * 0.06 + 0.25
      glowRef.current.material.opacity = 0.18 + Math.sin(t * 3) * 0.06
    } else {
      meshRef.current.position.y = 0.15
      glowRef.current.material.opacity = 0
    }
  })

  return (
    <group position={position} onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* Glow ring */}
      <mesh ref={glowRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 1.15, 32]} />
        <meshStandardMaterial
          color="#C5A059"
          transparent
          opacity={0}
        />
      </mesh>
      {/* Table top */}
      <mesh ref={meshRef} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.08, 48]} />
        <meshStandardMaterial
          color={isSelected ? '#C5A059' : '#F4F1EA'}
          roughness={0.25}
          metalness={isSelected ? 0.3 : 0.05}
        />
      </mesh>
      {/* Table leg */}
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.55, 12]} />
        <meshStandardMaterial color="#DDD5C8" roughness={0.5} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.44, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.04, 24]} />
        <meshStandardMaterial color="#DDD5C8" roughness={0.5} />
      </mesh>
      {/* Table number label */}
      <Text
        position={[0, 0.25, 0]}
        fontSize={0.22}
        color={isSelected ? '#FDFBF7' : '#8C7B6B'}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {tableNum}
      </Text>
    </group>
  )
}

function parseSeatingToTables(seatingPlan) {
  if (!seatingPlan) return []
  return seatingPlan
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const colonIdx = entry.indexOf(':')
      if (colonIdx === -1) return null
      const label = entry.slice(0, colonIdx).trim()
      const guests = entry.slice(colonIdx + 1).trim().split(',').map(g => g.trim()).filter(Boolean)
      const num = label.replace(/[^0-9]/g, '') || label
      return { num, label, guests }
    })
    .filter(Boolean)
}

// Arrange tables in a circle or grid
function getTablePositions(count) {
  if (count === 0) return []
  if (count <= 4) {
    const positions = [[-2.2, 0, -1.5], [2.2, 0, -1.5], [-2.2, 0, 1.5], [2.2, 0, 1.5]]
    return positions.slice(0, count)
  }
  // Circle layout
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    const r = Math.min(3, 1.5 + count * 0.25)
    return [Math.cos(angle) * r, 0, Math.sin(angle) * r]
  })
}

export default function ThreeDSeatingChart({ seatingPlan, lang }) {
  const tables = parseSeatingToTables(seatingPlan)
  const [selectedTable, setSelectedTable] = useState(null)
  const [ref, visible] = useScrollReveal()
  const tr = t[lang]

  const positions = getTablePositions(tables.length)
  const selected = tables.find((t) => t.num === selectedTable)

  const LABELS = {
    az: { title: '3D Oturma Planı', hint: 'Zalı fırladın · Masaya toxunun', guests: 'Qonaqlar' },
    en: { title: '3D Seating Plan', hint: 'Rotate the hall · Click a table', guests: 'Guests' },
    ru: { title: '3D План рассадки', hint: 'Вращайте зал · Нажмите на стол', guests: 'Гости' },
  }
  const L = LABELS[lang] || LABELS.az

  return (
    <section className="py-28 px-6 bg-beige">
      <div
        ref={ref}
        className={`max-w-2xl mx-auto reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        <div className="text-center mb-12">
          <p className="text-[9px] tracking-[0.38em] uppercase text-gold mb-5 font-medium font-sans">Seating · 3D</p>
          <h2 className="font-serif text-3xl text-ink font-light tracking-tight">{L.title}</h2>
          <div className="gold-divider mt-8 max-w-[100px] mx-auto" />
        </div>

        {/* 3D Canvas */}
        <div
          className="relative rounded-none overflow-hidden mb-6"
          style={{
            height: '340px',
            background: 'linear-gradient(160deg, #2C2523 0%, #1A1A1A 100%)',
            border: '1px solid rgba(197,160,89,0.18)',
          }}
        >
          {/* Hint overlay */}
          <div
            className="absolute top-4 left-4 z-10 text-[10px] tracking-[0.18em] uppercase font-sans font-medium"
            style={{
              color: 'rgba(253,251,247,0.45)',
              backdropFilter: 'blur(8px)',
              background: 'rgba(0,0,0,0.25)',
              padding: '8px 14px',
              border: '1px solid rgba(197,160,89,0.12)',
            }}
          >
            {selected
              ? `${selected.label} · ${selected.guests.join(', ')}`
              : L.hint}
          </div>

          <Canvas dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 5.5, 6.5]} fov={45} />
            <ambientLight intensity={0.6} />
            <pointLight position={[0, 8, 0]} intensity={1.8} color="#fff8e7" />
            <pointLight position={[-5, 4, 5]} intensity={0.6} color="#f0e4c0" />
            <Suspense fallback={null}>
              {tables.map((table, i) => (
                <TableMesh
                  key={table.num}
                  position={positions[i] || [0, 0, 0]}
                  tableNum={table.num}
                  isSelected={selectedTable === table.num}
                  onClick={() => setSelectedTable(prev => prev === table.num ? null : table.num)}
                />
              ))}
              {/* Floor */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.47, 0]}>
                <planeGeometry args={[14, 14]} />
                <meshStandardMaterial color="#1c1917" roughness={0.85} />
              </mesh>
              {/* Floor grid lines */}
              <gridHelper args={[12, 12, 'rgba(197,160,89,0.08)', 'rgba(197,160,89,0.05)']} position={[0, -0.46, 0]} />
            </Suspense>
            <OrbitControls
              enableZoom
              enablePan={false}
              maxPolarAngle={Math.PI / 2.1}
              minPolarAngle={0.3}
              minDistance={4}
              maxDistance={12}
            />
          </Canvas>
        </div>

        {/* Selected table info */}
        {selected && (
          <div
            className="border border-gold/30 bg-cream px-8 py-6 flex flex-wrap gap-2 items-start"
            style={{ borderLeft: '2px solid #C5A059' }}
          >
            <div className="flex-1">
              <p className="text-[9px] tracking-[0.28em] uppercase text-gold font-medium font-sans mb-2">
                {selected.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {selected.guests.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1.5 text-[11px] font-light font-sans border border-beige-dark/60 bg-beige text-ink"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tables.length === 0 && (
          <p className="text-center text-brown-muted text-sm font-light">—</p>
        )}
      </div>
    </section>
  )
}

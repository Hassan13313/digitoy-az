import { useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

/* ══════════════════════════════════════════════════
   TOY / NİŞAN — Premium Qızılı Üzüklər (Three.js)
   Kişi: qalın, klassik band | Qadın: incə + brilyant
══════════════════════════════════════════════════ */
function PremiumRings() {
  const groupRef = useRef()
  const ring1    = useRef() // male — qalın
  const ring2    = useRef() // female — incə
  const diamond  = useRef()
  const sparkles = useRef([])
  const { mouse } = useThree()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Gentle group sway
    groupRef.current.rotation.y = mouse.x * 0.22 + Math.sin(t * 0.18) * 0.08
    groupRef.current.rotation.x = mouse.y * 0.18 + Math.cos(t * 0.22) * 0.05
    // Individual ring spins
    ring1.current.rotation.y = t * 0.26 + 0.3
    ring1.current.rotation.x = Math.sin(t * 0.34) * 0.18
    ring2.current.rotation.y = -t * 0.22 + 1.2
    ring2.current.rotation.x = Math.cos(t * 0.28) * 0.14
    // Diamond shimmer
    if (diamond.current) {
      diamond.current.rotation.y = t * 1.8
      diamond.current.rotation.z = t * 0.9
    }
    // Sparkle orbit
    sparkles.current.forEach((sp, i) => {
      if (!sp) return
      const angle = t * 0.9 + (i * Math.PI * 2) / sparkles.current.length
      sp.position.x = Math.cos(angle) * 0.72
      sp.position.z = Math.sin(angle) * 0.72
      sp.position.y = Math.sin(t * 1.2 + i * 1.1) * 0.18
      sp.material.opacity = 0.55 + Math.sin(t * 2.2 + i) * 0.35
    })
  })

  const goldMat   = { color: '#C8900A', metalness: 0.98, roughness: 0.04, emissive: '#7A4808', emissiveIntensity: 0.25 }
  const champMat  = { color: '#E8CC6A', metalness: 0.96, roughness: 0.06, emissive: '#9A6818', emissiveIntensity: 0.18 }
  const diamMat   = { color: '#E8F6FF', metalness: 0.05, roughness: 0,    emissive: '#B8E4FF', emissiveIntensity: 0.6  }
  const spkMat    = { color: '#FFE57A', metalness: 0.9,  roughness: 0.1,  emissive: '#FFD030', emissiveIntensity: 0.7, transparent: true }

  return (
    <group ref={groupRef}>
      {/* Male ring — qalın band */}
      <mesh ref={ring1} position={[-0.44, 0.05, 0]}>
        <torusGeometry args={[0.65, 0.095, 48, 160]} />
        <meshStandardMaterial {...goldMat} />
      </mesh>

      {/* Female ring — incə band */}
      <mesh ref={ring2} position={[0.44, -0.05, 0.22]}>
        <torusGeometry args={[0.58, 0.06, 48, 160]} />
        <meshStandardMaterial {...champMat} />
      </mesh>

      {/* Diamond on female ring */}
      <group position={[0.44, 0.53, 0.22]}>
        <mesh ref={diamond}>
          <octahedronGeometry args={[0.11, 0]} />
          <meshStandardMaterial {...diamMat} />
        </mesh>
        {/* Diamond setting prongs */}
        {[0, 90, 180, 270].map((deg, i) => {
          const rad = deg * Math.PI / 180
          return (
            <mesh key={i} position={[Math.cos(rad)*0.09, -0.04, Math.sin(rad)*0.09]} rotation={[Math.PI/2,0,rad]}>
              <cylinderGeometry args={[0.012, 0.008, 0.1, 8]} />
              <meshStandardMaterial {...champMat} />
            </mesh>
          )
        })}
      </group>

      {/* Orbiting sparkle gems */}
      {[0,1,2,3,4].map((i) => (
        <mesh
          key={i}
          ref={(el) => { sparkles.current[i] = el }}
          position={[0, 0, 0]}
        >
          <octahedronGeometry args={[0.038, 0]} />
          <meshStandardMaterial {...spkMat} />
        </mesh>
      ))}
    </group>
  )
}

function GoldenRingsCanvas() {
  return (
    <div className="w-full pointer-events-auto" style={{ height: 230, cursor: 'grab' }}>
      <Canvas camera={{ position: [0, 0.1, 3.5], fov: 38 }} dpr={[1, 2]} shadows>
        {/* Environment — HDR-like, metal colors show realistically */}
        <Environment preset="sunset" />
        <ambientLight intensity={0.6} color="#FFF8E8" />
        <pointLight position={[4, 5, 4]}   intensity={3.5} color="#FFEEA0" castShadow />
        <pointLight position={[-3, 2, 3]}  intensity={2.0} color="#FFF0CC" />
        <pointLight position={[0, -3, 2]}  intensity={1.2} color="#FFE080" />
        <spotLight  position={[2, 6, 2]}   intensity={3}   color="#FFD060" angle={0.5} penumbra={0.6} />
        <Suspense fallback={null}>
          <PremiumRings />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   AD GÜNÜ — Premium 3 Mərtəbəli Tort (CSS)
   Krem + Şokolad + Qızılı. Tam simmetrik, minimalist
══════════════════════════════════════════════════ */
function LuxuryBirthdayCake() {
  /* 4 şam — müxtəlif rəng + müstəqil alov animasiyaları */
  const candles = [
    { left: '22%', color: '#F8C8D4', delay: 0    },
    { left: '38%', color: '#C8E6F8', delay: 0.3  },
    { left: '54%', color: '#F8E6C8', delay: 0.6  },
    { left: '70%', color: '#D4F8C8', delay: 0.9  },
  ]
  const flameDur = 1.3

  return (
    <div className="flex justify-center items-end select-none" style={{ paddingTop: 36, paddingBottom: 24, position: 'relative' }}>
      <div style={{ position: 'relative', width: 176 }}>

        {/* ── CANDLES ── */}
        {candles.map((c, i) => (
          <div key={i} style={{ position: 'absolute', left: c.left, bottom: 134, zIndex: 10 }}>
            {/* Candle body */}
            <div style={{
              width: 9, height: 30,
              background: `linear-gradient(180deg, ${c.color} 0%, ${c.color}CC 100%)`,
              borderRadius: '3px 3px 1px 1px',
              margin: '0 auto',
              boxShadow: '0 2px 6px rgba(0,0,0,0.14)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Candle horizontal stripe */}
              <div style={{
                position: 'absolute', inset: '0 0 0 0',
                background: 'repeating-linear-gradient(transparent, transparent 6px, rgba(255,255,255,0.22) 6px, rgba(255,255,255,0.22) 7px)',
              }} />
            </div>
            {/* Wick */}
            <div style={{
              width: 1.5, height: 6,
              background: '#4A3020',
              margin: '-1px auto 0',
            }} />
            {/* FLAME — 3 katmanlı, CSS animasiyalı */}
            <div style={{
              position: 'absolute', left: '50%',
              transform: 'translateX(-50%)',
              bottom: 30 + 6,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              animation: `candle-flame ${flameDur}s ${c.delay}s ease-in-out infinite`,
            }}>
              {/* Outer glow halo */}
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,200,50,0.35) 0%, transparent 70%)',
                position: 'absolute', top: -3, left: '50%',
                transform: 'translateX(-50%)',
                animation: `candle-halo ${flameDur * 0.8}s ${c.delay}s ease-in-out infinite`,
              }} />
              {/* Outer flame */}
              <div style={{
                width: 11, height: 20,
                background: 'radial-gradient(ellipse at 50% 85%, #FFF176 0%, #FFB300 45%, #FF6D00 80%, #BF360C 100%)',
                borderRadius: '50% 50% 35% 35% / 55% 55% 40% 40%',
                filter: 'blur(0.4px)',
              }} />
              {/* Inner bright core */}
              <div style={{
                position: 'absolute', bottom: 3, left: '50%',
                transform: 'translateX(-50%)',
                width: 5, height: 11,
                background: 'radial-gradient(ellipse, #FFFFFF 0%, #FFF9C4 55%, transparent 100%)',
                borderRadius: '50% 50% 35% 35%',
              }} />
            </div>
          </div>
        ))}

        {/* ── TIER 1 — Top (smallest, krem) ── */}
        <div style={{
          margin: '0 auto',
          width: 88, height: 38,
          background: 'linear-gradient(180deg, #FDFBF0 0%, #F8F0D8 50%, #F0E4BC 100%)',
          borderRadius: '4px 4px 2px 2px',
          position: 'relative',
          boxShadow: '0 -3px 12px rgba(197,160,89,0.18), 0 2px 6px rgba(0,0,0,0.08)',
          border: '1px solid rgba(197,160,89,0.25)',
        }}>
          {/* Frosting drips */}
          {[8, 20, 34, 50, 64, 76].map((l, i) => (
            <div key={i} style={{
              position: 'absolute', top: 0, left: l,
              width: 7 + (i % 3) * 2, height: 9 + (i % 2) * 4,
              background: 'rgba(255,255,255,0.88)',
              borderRadius: '0 0 50% 50%',
            }} />
          ))}
          {/* Gold trim top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.7), transparent)',
          }} />
          {/* Gold trim bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 1.5,
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55), transparent)',
          }} />
          {/* Sprinkles */}
          {[12, 28, 44, 60, 74].map((l, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: l, top: 13 + (i % 2) * 8,
              width: 7, height: 3,
              background: ['#E91E63','#00BCD4','#C5A059','#8BC34A','#FF7043'][i],
              borderRadius: 2,
              transform: `rotate(${[-30,45,-15,55,-40][i]}deg)`,
              opacity: 0.8,
            }} />
          ))}
        </div>

        {/* ── TIER 2 — Middle (şokolad ganache) ── */}
        <div style={{
          margin: '0 auto',
          width: 132, height: 44,
          background: 'linear-gradient(180deg, #8B5E3C 0%, #6B3E20 55%, #5A3018 100%)',
          position: 'relative',
          boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
          border: '1px solid rgba(120,70,30,0.4)',
        }}>
          {/* Ganache drip effect */}
          {[10, 26, 44, 62, 82, 100, 118].map((l, i) => (
            <div key={i} style={{
              position: 'absolute', top: 0, left: l,
              width: 8 + (i % 3), height: 10 + (i % 3) * 3,
              background: 'rgba(60,30,10,0.65)',
              borderRadius: '0 0 50% 50%',
            }} />
          ))}
          {/* Gold piping line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.8), transparent)',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.65), transparent)',
          }} />
          {/* Pearl dots */}
          {[14, 34, 54, 74, 94, 114].map((l, i) => (
            <div key={i} style={{
              position: 'absolute', left: l,
              top: '50%', transform: 'translateY(-50%)',
              width: 6, height: 6, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(220,200,160,0.7))',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          ))}
        </div>

        {/* ── TIER 3 — Bottom (krem + qızılı bəzək) ── */}
        <div style={{
          width: 176, height: 52,
          background: 'linear-gradient(180deg, #FDF8EE 0%, #F4EBD0 55%, #EAD8B0 100%)',
          borderRadius: '0 0 3px 3px',
          position: 'relative',
          boxShadow: '0 6px 20px rgba(0,0,0,0.12), 0 2px 8px rgba(197,160,89,0.15)',
          border: '1px solid rgba(197,160,89,0.28)',
        }}>
          {/* Gold piping top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2.5,
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.85), transparent)',
          }} />
          {/* Scallop piping decoration */}
          <svg style={{ position: 'absolute', top: 3, left: 0, right: 0, width: '100%' }} height="10" viewBox="0 0 176 10" preserveAspectRatio="none">
            <path
              d={Array.from({ length: 11 }, (_, i) => `${i === 0 ? 'M' : 'Q'}${i * 16},0 ${i * 16 + 8},7 ${(i + 1) * 16},0`).join(' ')}
              fill="none" stroke="rgba(197,160,89,0.5)" strokeWidth="1"
            />
          </svg>
          {/* Gold trim bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.6), transparent)',
          }} />
          {/* Center gold monogram circle */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 28, height: 28, borderRadius: '50%',
            border: '1px solid rgba(197,160,89,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(197,160,89,0.25), transparent)',
              border: '1px solid rgba(197,160,89,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 9, color: 'rgba(197,160,89,0.8)' }}>✦</span>
            </div>
          </div>
        </div>

        {/* ── PLATE ── */}
        <div style={{
          width: 196, height: 10, marginLeft: -10,
          background: 'linear-gradient(180deg, #E8E0D0 0%, #C8C0B0 100%)',
          borderRadius: '0 0 50% 50%',
          boxShadow: '0 3px 10px rgba(0,0,0,0.14)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes candle-flame {
          0%,100% { transform:translateX(-50%) rotate(-3deg) scaleY(1);    }
          50%     { transform:translateX(-50%) rotate(3deg)  scaleY(1.12); }
        }
        @keyframes candle-halo {
          0%,100% { opacity:0.3; transform:translateX(-50%) scale(1);    }
          50%     { opacity:0.7; transform:translateX(-50%) scale(1.32); }
        }
      `}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   KORPORATİV / DİGƏR — Lüks Bokeh + Qızılı Konfeti
   Çöp adam yoxdur — saf işıq, parıltı, atmosfer
══════════════════════════════════════════════════ */
function LuxuryCorporateAmbience() {
  /* Bokeh blobs */
  const bokeh = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    cx: 5  + (i * 43 % 90),
    cy: 5  + (i * 37 % 90),
    r:  18 + (i * 17 % 42),
    c:  ['rgba(197,160,89,', 'rgba(230,200,120,', 'rgba(255,220,100,', 'rgba(180,140,60,'][i % 4],
    op: 0.08 + (i % 5) * 0.04,
    dur: 3.5 + (i % 4) * 1.2,
    del: i * 0.35,
  }))

  /* Confetti pieces */
  const confetti = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    left:   3  + (i * 29 % 94),
    delay:  (i * 0.21) % 3.2,
    dur:    2.4 + (i * 0.11) % 1.8,
    color:  [
      '#C5A059','#E8C86A','#D4A84B','#F0DC9A', // gold family
      '#B8A090','#D8C8B8','#F8F0E0',            // neutral pearl
      '#C8D8C0','#D0C8E8',                       // soft pastels
    ][i % 9],
    rot:    (i * 61) % 360,
    size:   4 + (i % 5) * 1.6,
    shape:  i % 4, // 0=rect, 1=circle, 2=diamond, 3=long-rect
    shimmer: i % 3 === 0,
  }))

  /* Sparkle stars */
  const stars = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: 8 + (i * 19 % 84),
    top:  10 + (i * 23 % 75),
    size: 3 + (i % 3) * 2,
    dur:  1.0 + (i * 0.18) % 1.4,
    del:  i * 0.22,
  }))

  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none',
    }}>
      {/* ── Bokeh glow layers ── */}
      {bokeh.map(b => (
        <div key={b.id} style={{
          position: 'absolute',
          left: `${b.cx}%`, top: `${b.cy}%`,
          width: `${b.r * 2}px`, height: `${b.r * 2}px`,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${b.c}${b.op + 0.12}) 0%, ${b.c}0.0) 65%)`,
          filter: 'blur(12px)',
          animation: `bokeh-float-${b.id % 4} ${b.dur}s ${b.del}s ease-in-out infinite`,
        }} />
      ))}

      {/* ── Confetti rain ── */}
      {confetti.map(p => {
        const isLong    = p.shape === 3
        const isCircle  = p.shape === 1
        const isDiamond = p.shape === 2
        return (
          <div key={p.id} style={{
            position: 'absolute',
            left:   `${p.left}%`, top: '-8px',
            width:  isLong ? `${p.size * 0.4}px` : `${p.size}px`,
            height: isLong ? `${p.size * 2.8}px` : `${p.size}px`,
            background: p.shimmer
              ? `linear-gradient(135deg, ${p.color}, rgba(255,255,220,0.9), ${p.color})`
              : p.color,
            borderRadius: isCircle ? '50%' : isDiamond ? '2px' : '1px',
            transform: isDiamond ? `rotate(45deg)` : `rotate(${p.rot}deg)`,
            animation: `confetti-drop ${p.dur}s ${p.delay}s ease-in infinite`,
            opacity: 0,
            boxShadow: p.shimmer ? `0 0 4px 1px rgba(255,230,120,0.4)` : 'none',
          }} />
        )
      })}

      {/* ── Sparkle stars ── */}
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.left}%`, top: `${s.top}%`,
          animation: `star-twinkle ${s.dur}s ${s.del}s ease-in-out infinite`,
        }}>
          <svg width={s.size * 3} height={s.size * 3} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2 L13.2 10 L21 12 L13.2 14 L12 22 L10.8 14 L3 12 L10.8 10 Z"
              fill={`rgba(197,160,89,0.8)`}
            />
          </svg>
        </div>
      ))}

      {/* ── Center luxury monogram crest ── */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -54%)',
        animation: 'crest-float 4s ease-in-out infinite',
      }}>
        {/* Outer ring */}
        <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
          <circle cx="55" cy="55" r="46"
            stroke="url(#goldRingGrad)" strokeWidth="1"
            strokeDasharray="4 3" opacity="0.55"
          />
          <circle cx="55" cy="55" r="38"
            stroke="url(#goldRingGrad)" strokeWidth="0.75" opacity="0.4"
          />
          {/* 8 diamond markers on outer ring */}
          {[0,45,90,135,180,225,270,315].map((deg, i) => {
            const rad = deg * Math.PI / 180
            const x = 55 + 46 * Math.cos(rad), y = 55 + 46 * Math.sin(rad)
            return (
              <rect key={i}
                x={x - 2.5} y={y - 2.5} width={5} height={5}
                fill="rgba(197,160,89,0.65)"
                transform={`rotate(45 ${x} ${y})`}
              />
            )
          })}
          {/* Inner decorative arcs */}
          {[0,60,120,180,240,300].map((deg, i) => {
            const rad = deg * Math.PI / 180, r = 28
            const x1 = 55 + r * Math.cos(rad - 0.4), y1 = 55 + r * Math.sin(rad - 0.4)
            const x2 = 55 + r * Math.cos(rad + 0.4), y2 = 55 + r * Math.sin(rad + 0.4)
            return (
              <path key={i}
                d={`M${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2}`}
                stroke="rgba(197,160,89,0.35)" strokeWidth="1" fill="none"
              />
            )
          })}
          {/* Center star */}
          <path
            d="M55 40 L57.8 50.5 L68 50.5 L59.6 56.8 L62.4 67.3 L55 61 L47.6 67.3 L50.4 56.8 L42 50.5 L52.2 50.5 Z"
            fill="url(#goldStarGrad)" opacity="0.85"
          />
          <defs>
            <linearGradient id="goldRingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#F0DC9A" />
              <stop offset="50%"  stopColor="#C5A059" />
              <stop offset="100%" stopColor="#E8C86A" />
            </linearGradient>
            <radialGradient id="goldStarGrad" cx="40%" cy="35%">
              <stop offset="0%"   stopColor="#FFF0A0" />
              <stop offset="60%"  stopColor="#C5A059" />
              <stop offset="100%" stopColor="#8A6020" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <style>{`
        @keyframes bokeh-float-0 { 0%,100%{transform:translate(-50%,-50%) scale(1);}    50%{transform:translate(-50%,-55%) scale(1.12);} }
        @keyframes bokeh-float-1 { 0%,100%{transform:translate(-50%,-50%) scale(1.05);} 50%{transform:translate(-48%,-52%) scale(0.92);} }
        @keyframes bokeh-float-2 { 0%,100%{transform:translate(-50%,-50%) scale(1);}    50%{transform:translate(-52%,-48%) scale(1.08);} }
        @keyframes bokeh-float-3 { 0%,100%{transform:translate(-50%,-50%) scale(1.08);} 50%{transform:translate(-50%,-53%) scale(0.95);} }
        @keyframes confetti-drop {
          0%   { transform:translateY(0)    rotate(0deg);   opacity:0.95; }
          15%  { opacity:1; }
          85%  { opacity:0.7; }
          100% { transform:translateY(100vh) rotate(600deg); opacity:0; }
        }
        @keyframes star-twinkle {
          0%,100% { opacity:0.15; transform:scale(0.6) rotate(0deg);   }
          50%     { opacity:0.9;  transform:scale(1.2) rotate(18deg);  }
        }
        @keyframes crest-float {
          0%,100% { transform:translate(-50%,-54%) scale(1);    filter:drop-shadow(0 0 8px rgba(197,160,89,0.25)); }
          50%     { transform:translate(-50%,-58%) scale(1.03); filter:drop-shadow(0 0 16px rgba(197,160,89,0.45)); }
        }
      `}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   Export — event tipinə görə doğru komponent
══════════════════════════════════════════════════ */
export default function DynamicHeroAnimation({ eventType = 'toy' }) {
  if (eventType === 'birthday')
    return <LuxuryBirthdayCake />
  if (eventType === 'corporate' || eventType === 'other')
    return <LuxuryCorporateAmbience />
  return <GoldenRingsCanvas />
}

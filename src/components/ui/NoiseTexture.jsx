/* Noise Texture — ağ/açıq bölmələr üzərindəki grain overlay (A2)
   SVG feTurbulence ilə CSS-only grain — canvas yoxdur */
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

export default function NoiseTexture({ opacity = 0.035, style = {} }) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute', inset: 0,
        backgroundImage: NOISE_SVG,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    />
  )
}

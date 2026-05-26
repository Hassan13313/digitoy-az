/* Animated Shiny Text — işıq dəsti mətnin üzərindən keçir */
export default function AnimatedShinyText({ children, className = '', style = {}, shimmerWidth = '60%' }) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        position: 'relative',
        color: 'inherit',
        ...style,
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.65) 50%, transparent 70%)`,
          backgroundSize: `${shimmerWidth} 100%`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '-100% 0',
          animation: 'shiny-sweep 2.8s ease-in-out infinite',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>

      <style>{`
        @keyframes shiny-sweep {
          0%   { background-position: -100% 0; }
          50%  { background-position: 250% 0;  }
          100% { background-position: 250% 0;  }
        }
      `}</style>
    </span>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   Status ekranı — tapılmadı / deaktiv (Phase 47).
   Əvvəl App.jsx-də iki dəfə təkrarlanırdı (invite-disabled, invite-not-found);
   indi ümumi 404 də eyni görünüşü işlədir. `code` verilsə böyük rəqəm çıxır.
   ══════════════════════════════════════════════════════════════════════ */

const line = (alpha) => ({
  width: 48, height: 1,
  background: `linear-gradient(to right, transparent, rgba(197,160,89,${alpha}), transparent)`,
})

export default function StatusPage({ code, title, text, homeLabel, onHome }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Ambient gold glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 35% at 50% 38%, rgba(197,160,89,0.08) 0%, transparent 65%)',
      }} />
      <div className="relative" style={{ maxWidth: 420 }}>
        <div style={{ ...line(0.6), margin: '0 auto 28px' }} />
        <p className="font-mono text-[10px] tracking-[0.38em] uppercase text-gold mb-6">Digitoy.az</p>
        {code && (
          <p className="font-serif text-gold/35 font-light leading-none mb-4" style={{ fontSize: 'clamp(56px, 16vw, 96px)' }}>{code}</p>
        )}
        <h1 className="font-serif text-2xl sm:text-3xl text-ink font-light tracking-tight mb-4 leading-snug">{title}</h1>
        <p className="text-brown-muted text-sm font-light leading-relaxed max-w-xs mx-auto mb-10">{text}</p>
        <button onClick={onHome} className="inline-flex items-center gap-2.5 btn-gold" style={{ textDecoration: 'none' }}>
          {homeLabel}
          <span style={{ fontSize: 14 }}>→</span>
        </button>
        <div style={{ ...line(0.4), margin: '40px auto 0' }} />
      </div>
    </div>
  )
}

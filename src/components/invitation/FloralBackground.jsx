import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

/* ─────────────────────────────────────────────────────────
   FloralBackground — Phase 25.4.2 Premium Ambient Polish
   Same two-layer system as 25.4.1, refined to feel natural, never cyclic:

   • BEHIND (z-0)  — hero depth. Glow field lives inside a "glow-follow"
     wrapper that eases a few px with scroll (card stays "in the light"),
     plus a 1–2% ambient halo behind the card. Light sweep is now smart:
     paused while scrolling, fires once ~4–5s after scroll settles, then
     drifts back on a random 24–36s cadence.

   • FRONT VEIL (z-30) — page-wide continuity: fine paper texture, adaptive
     gold dust, soft bloom, whisper vignette. pointer-events-none, below
     every control (music z-55).

   Colours come from --ambient-* tokens (index.css). All motion is
   transform / opacity / filter only (GPU, no reflow). Fully inert under
   prefers-reduced-motion. No backdrop-filter; fixed layers sit outside any
   transformed ancestor — Safari-safe.
───────────────────────────────────────────────────────── */

const rand = (a, b) => a + Math.random() * (b - a)

/* Deterministic hash PRNG (0..1) — same field every render, zero layout shift. */
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }

const DUST_MOTIONS = ['a', 'b', 'c', 'd']

/* Build an evenly-spread dust field for a given count. A jittered grid gives
   full-screen premium coverage (no clumps, no bare corners); every mote gets a
   deterministic size / opacity / duration / phase / motion so nothing is
   synchronised. Gold-forward palette: ~55% gold, ~35% champagne (light gold),
   ~10% ivory; ~12% carry a brighter accent glow. */
function buildDustPool(n) {
  const cols = Math.max(1, Math.round(Math.sqrt(n * 1.7)))
  const rows = Math.ceil(n / cols)
  const pool = []
  for (let i = 0; i < n; i++) {
    const cx = i % cols, cy = Math.floor(i / cols)
    const left = ((cx + 0.12 + hash(i * 2.1) * 0.76) / cols) * 100
    const top  = ((cy + 0.12 + hash(i * 3.7) * 0.76) / rows) * 100
    const tr = hash(i * 19.9)
    const tone = tr < 0.55 ? 'gold' : tr < 0.90 ? 'champagne' : 'ivory'
    pool.push({
      left: `${left.toFixed(1)}%`,
      top: `${top.toFixed(1)}%`,
      size: +(3 + hash(i * 7.1) * 4).toFixed(1),           // 3–7px
      o: +(0.16 + hash(i * 9.9) * 0.14).toFixed(2),        // 0.16–0.30 (subtle)
      dur: Math.round(28 + hash(i * 11.3) * 27),           // 28–55s
      delay: -Math.round(hash(i * 13.7) * 46),             // 0 … -46s
      k: DUST_MOTIONS[Math.floor(hash(i * 17.1) * 4)],
      tone,
      bright: hash(i * 23.3) < 0.12,
    })
  }
  return pool
}

/* The dust layer now spans the full (scrolling) page, so the count scales with
   page height to keep a consistent, subtle per-screen density on any invitation
   length. `d` = target motes per screen (kept low → calm, not distracting);
   floor/cap bound it for short pages and for performance. */
function dustDensity(w) {
  if (w < 640) return { d: 4, floor: 14, cap: 38 }   // mobile
  if (w < 1024) return { d: 5, floor: 18, cap: 52 }  // tablet
  return { d: 6, floor: 24, cap: 72 }                // desktop
}

export default function FloralBackground() {
  const [count, setCount] = useState(30)
  const [sweep, setSweep] = useState(false)

  const glowFollowRef = useRef(null)
  const dustLayerRef  = useRef(null)  // full-page dust layer (measured for density)
  const sweepTimerRef = useRef(0)     // arms the next sweep pass
  const idleTimerRef  = useRef(0)     // detects "scroll settled"
  const rafRef        = useRef(0)

  /* Opening bloom — one gentle "breath" of the existing glow field the first
     time the invitation appears. FloralBackground mounts exactly once at the
     Opening→Invitation transition and never remounts on scroll / music / RSVP /
     gallery, so this plays only once. The class is added POST-mount (a class
     present from the very first render does not reliably start the animation in
     Chromium; a post-mount toggle does). classList.add is idempotent, so React
     StrictMode's dev double-invoke can't double-play or drop it. Self-clears on
     animationend → zero residue. Skipped entirely under reduced motion. */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = glowFollowRef.current
    if (!el) return
    el.classList.add('is-bloom')
    const onEnd = (e) => { if (e.animationName === 'floral-bloom') el.classList.remove('is-bloom') }
    el.addEventListener('animationend', onEnd)
    return () => el.removeEventListener('animationend', onEnd)
  }, [])

  /* Adaptive dust count — scales with the full page height so per-screen density
     stays constant on any invitation length. Recomputed (rAF-coalesced) on
     resize and whenever the page height changes (images / sections loading). */
  useEffect(() => {
    let raf = 0
    const compute = () => {
      const vh = window.innerHeight || 1
      const layerH = dustLayerRef.current?.offsetHeight || vh
      const ratio = Math.max(1, layerH / vh)
      const { d, floor, cap } = dustDensity(window.innerWidth)
      setCount(Math.min(cap, Math.max(floor, Math.round(d * ratio))))
    }
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(compute) }
    schedule()
    window.addEventListener('resize', schedule, { passive: true })
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null
    if (ro && dustLayerRef.current) ro.observe(dustLayerRef.current)
    return () => {
      window.removeEventListener('resize', schedule)
      ro?.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  /* Smart light sweep + glow-follow. Both are opt-out under reduced motion. */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const armSweep = (delay) => {
      clearTimeout(sweepTimerRef.current)
      sweepTimerRef.current = setTimeout(() => setSweep(true), delay)
    }

    // First pass after an unpredictable warm-up, never immediate.
    armSweep(rand(8000, 14000))

    const onScroll = () => {
      // Never let a pass start mid-scroll: cancel anything pending…
      clearTimeout(sweepTimerRef.current)
      // …and the glow field drifts against the scroll (parallax, compositor only).
      // The page moves up, the glow lags behind by up to 40px, so the light
      // reads as a layer sitting further back than the invitation card.
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = 0
          const shift = Math.max(-40, Math.min(40, (window.scrollY || 0) * 0.05))
          glowFollowRef.current?.style.setProperty('--glow-shift-y', shift.toFixed(2) + 'px')
        })
      }
      // 4–5s after scroll settles, allow exactly one pass.
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => armSweep(rand(4000, 5000)), 140)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(sweepTimerRef.current)
      clearTimeout(idleTimerRef.current)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  /* One pass finished → drift back on a random 24–36s ambient cadence. */
  const onSweepEnd = useCallback(() => {
    setSweep(false)
    clearTimeout(sweepTimerRef.current)
    sweepTimerRef.current = setTimeout(() => setSweep(true), rand(24000, 36000))
  }, [])

  const dust = useMemo(() => buildDustPool(count), [count])

  return (
    <>
      {/* ══════════════ BEHIND LAYER (z-0) — hero depth ══════════════ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">

        {/* Background depth — centre a touch lighter, edges ~3% darker */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 96% 80% at 50% 40%, rgba(var(--ambient-bloom),0.6) 0%, rgba(var(--ambient-bloom),0) 48%, rgba(var(--ambient-vignette),0.045) 100%)',
          }}
        />

        {/* Glow-follow field — eases a few px with scroll; also holds the halo.
            The one-shot opening bloom toggles .is-bloom post-mount (see effect). */}
        <div ref={glowFollowRef} className="floral-glow-follow absolute inset-0">
          <div
            className="floral-glow floral-glow--a"
            style={{
              background:
                'radial-gradient(circle at center, rgba(var(--ambient-ivory),0.62) 0%, rgba(var(--ambient-champagne),0.24) 40%, transparent 72%)',
            }}
          />
          <div
            className="floral-glow floral-glow--b"
            style={{
              background:
                'radial-gradient(circle at center, rgba(var(--ambient-bloom),0.5) 0%, rgba(var(--ambient-champagne),0.14) 44%, transparent 74%)',
            }}
          />
          {/* Ambient halo — 1–2% bloom behind the card so it reads as lit, not stuck-on */}
          <div
            className="floral-halo"
            style={{
              background:
                'radial-gradient(ellipse 60% 42% at 50% 42%, rgba(var(--ambient-bloom),0.02) 0%, rgba(var(--ambient-bloom),0) 70%)',
            }}
          />
        </div>

        {/* Botanical corners (brand ornaments — unchanged) */}
        <svg className="absolute -top-2 -left-2 w-56 h-56 opacity-[0.13]" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 200 C40 150 80 100 110 60 C135 28 165 8 200 5" stroke="#C9A84C" fill="none" strokeWidth="1.5" />
          <path d="M50 175 C65 148 92 128 108 105" stroke="#C9A84C" fill="none" strokeWidth="1" />
          <path d="M90 130 C102 108 124 92 140 72" stroke="#C9A84C" fill="none" strokeWidth="0.8" />
          <ellipse cx="35" cy="185" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-48 35 185)" />
          <ellipse cx="62" cy="155" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-38 62 155)" />
          <ellipse cx="92" cy="118" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-28 92 118)" />
          <ellipse cx="122" cy="80" rx="13" ry="5" fill="#C9A84C" transform="rotate(-20 122 80)" />
          <ellipse cx="155" cy="45" rx="12" ry="4.5" fill="#C9A84C" transform="rotate(-12 155 45)" />
          <ellipse cx="55" cy="168" rx="10" ry="3.5" fill="#C9A84C" transform="rotate(32 55 168)" opacity="0.7" />
          <ellipse cx="90" cy="140" rx="10" ry="3.5" fill="#C9A84C" transform="rotate(38 90 140)" opacity="0.7" />
          <circle cx="202" cy="5" r="5" fill="#D4A88A" opacity="0.6" />
          <circle cx="194" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
          <circle cx="202" cy="-3" r="3.5" fill="#D4A88A" opacity="0.5" />
          <circle cx="210" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
          <circle cx="202" cy="13" r="3.5" fill="#D4A88A" opacity="0.5" />
          <circle cx="108" cy="105" r="3.5" fill="#D4A88A" opacity="0.5" />
          <circle cx="101" cy="100" r="2.5" fill="#D4A88A" opacity="0.4" />
          <circle cx="115" cy="100" r="2.5" fill="#D4A88A" opacity="0.4" />
          <circle cx="108" cy="112" r="2.5" fill="#D4A88A" opacity="0.4" />
          <circle cx="130" cy="150" r="2" fill="#C9A84C" opacity="0.3" />
          <circle cx="160" cy="110" r="1.5" fill="#C9A84C" opacity="0.25" />
          <circle cx="70" cy="185" r="1.5" fill="#C9A84C" opacity="0.25" />
        </svg>

        <svg className="absolute -top-2 -right-2 w-56 h-56 opacity-[0.13]" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
          <path d="M15 200 C40 150 80 100 110 60 C135 28 165 8 200 5" stroke="#C9A84C" fill="none" strokeWidth="1.5" />
          <path d="M50 175 C65 148 92 128 108 105" stroke="#C9A84C" fill="none" strokeWidth="1" />
          <path d="M90 130 C102 108 124 92 140 72" stroke="#C9A84C" fill="none" strokeWidth="0.8" />
          <ellipse cx="35" cy="185" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-48 35 185)" />
          <ellipse cx="62" cy="155" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-38 62 155)" />
          <ellipse cx="92" cy="118" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-28 92 118)" />
          <ellipse cx="122" cy="80" rx="13" ry="5" fill="#C9A84C" transform="rotate(-20 122 80)" />
          <ellipse cx="155" cy="45" rx="12" ry="4.5" fill="#C9A84C" transform="rotate(-12 155 45)" />
          <ellipse cx="55" cy="168" rx="10" ry="3.5" fill="#C9A84C" transform="rotate(32 55 168)" opacity="0.7" />
          <ellipse cx="90" cy="140" rx="10" ry="3.5" fill="#C9A84C" transform="rotate(38 90 140)" opacity="0.7" />
          <circle cx="202" cy="5" r="5" fill="#D4A88A" opacity="0.6" />
          <circle cx="194" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
          <circle cx="202" cy="-3" r="3.5" fill="#D4A88A" opacity="0.5" />
          <circle cx="210" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
          <circle cx="202" cy="13" r="3.5" fill="#D4A88A" opacity="0.5" />
          <circle cx="108" cy="105" r="3.5" fill="#D4A88A" opacity="0.5" />
          <circle cx="101" cy="100" r="2.5" fill="#D4A88A" opacity="0.4" />
          <circle cx="115" cy="100" r="2.5" fill="#D4A88A" opacity="0.4" />
          <circle cx="108" cy="112" r="2.5" fill="#D4A88A" opacity="0.4" />
        </svg>

        <svg className="absolute -bottom-2 -left-2 w-48 h-48 opacity-[0.10]" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg) scaleX(-1)' }}>
          <path d="M15 200 C40 150 80 100 110 60 C135 28 165 8 200 5" stroke="#C9A84C" fill="none" strokeWidth="1.5" />
          <ellipse cx="35" cy="185" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-48 35 185)" />
          <ellipse cx="62" cy="155" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-38 62 155)" />
          <ellipse cx="92" cy="118" rx="13" ry="5" fill="#C9A84C" transform="rotate(-28 92 118)" />
          <circle cx="202" cy="5" r="5" fill="#D4A88A" opacity="0.6" />
          <circle cx="194" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
          <circle cx="210" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
        </svg>

        <svg className="absolute -bottom-2 -right-2 w-48 h-48 opacity-[0.10]" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
          <path d="M15 200 C40 150 80 100 110 60 C135 28 165 8 200 5" stroke="#C9A84C" fill="none" strokeWidth="1.5" />
          <ellipse cx="35" cy="185" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-48 35 185)" />
          <ellipse cx="62" cy="155" rx="15" ry="5.5" fill="#C9A84C" transform="rotate(-38 62 155)" />
          <ellipse cx="92" cy="118" rx="13" ry="5" fill="#C9A84C" transform="rotate(-28 92 118)" />
          <circle cx="202" cy="5" r="5" fill="#D4A88A" opacity="0.6" />
          <circle cx="194" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
          <circle cx="210" cy="1" r="3.5" fill="#D4A88A" opacity="0.5" />
        </svg>

        {/* Light sweep — smart, one-shot; scheduled from JS, never a fixed loop */}
        <div
          className={`floral-sweep absolute inset-0${sweep ? ' is-active' : ''}`}
          onAnimationEnd={onSweepEnd}
        />
      </div>

      {/* ═════════════ FRONT VEIL (z-30) — page-wide continuity ═════════════ */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none" aria-hidden="true">

        {/* Page-wide premium paper texture — fine cotton grain, barely there */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.02,
            mixBlendMode: 'multiply',
            backgroundImage:
              `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Soft page-wide warm bloom — keeps warmth over opaque sections */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 92% 62% at 50% 32%, rgba(var(--ambient-bloom),0.06) 0%, rgba(var(--ambient-bloom),0) 58%)',
          }}
        />

        {/* Premium vignette — a whisper darker at the edges, draws the eye in */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 100% 100% at 50% 46%, rgba(var(--ambient-vignette),0) 56%, rgba(var(--ambient-vignette),0.05) 100%)',
          }}
        />
      </div>

      {/* ═══════ GOLD DUST (z-30) — ABSOLUTE, spans the full page ═══════
          Not fixed: the field scrolls with the invitation instead of staying
          pinned to the glass. `absolute inset-0` inside the outer relative
          container stretches to the whole document height, so motes spread down
          the entire page and drift past as the guest scrolls. */}
      <div
        ref={dustLayerRef}
        className="floral-dust-layer absolute inset-0 pointer-events-none z-30 overflow-hidden select-none"
        aria-hidden="true"
      >
        {dust.map((d, i) => (
          <span
            key={i}
            className={`floral-dust__p floral-dust__p--${d.k} floral-dust__p--${d.tone}${d.bright ? ' floral-dust__p--bright' : ''}`}
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              opacity: d.o,
              animationDuration: `${d.dur}s`,
              animationDelay: `${d.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        .floral-glow-follow {
          transform: translate3d(0, var(--glow-shift-y, 0px), 0);
          will-change: transform;
        }
        /* Opening bloom — the glow field settles from a 1.5% "breath" to rest,
           once, as the card comes alive. Transform-only → additive-neutral, so
           the resting ambient is byte-for-byte unchanged afterward. */
        .floral-glow-follow.is-bloom {
          animation: floral-bloom 550ms cubic-bezier(0.22, 1, 0.36, 1) 1;
        }
        @keyframes floral-bloom {
          from { transform: translate3d(0, var(--glow-shift-y, 0px), 0) scale(1.015); }
          to   { transform: translate3d(0, var(--glow-shift-y, 0px), 0) scale(1); }
        }

        .floral-glow {
          position: absolute;
          width: 80vmax;
          height: 80vmax;
          border-radius: 50%;
          filter: blur(90px);
          will-change: transform;
          pointer-events: none;
        }
        .floral-glow--a {
          top: -24vmax; left: -14vmax;
          animation: floral-glow-a 54s ease-in-out -7s infinite;
        }
        .floral-glow--b {
          bottom: -28vmax; right: -18vmax;
          animation: floral-glow-b 67s ease-in-out -31s infinite;
        }
        @keyframes floral-glow-a {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50%     { transform: translate3d(4vmax,3vmax,0) scale(1.08); }
        }
        @keyframes floral-glow-b {
          0%,100% { transform: translate3d(0,0,0) scale(1.04); }
          50%     { transform: translate3d(-3.5vmax,-2.5vmax,0) scale(1); }
        }

        /* Halo doubles as "glow C": a 61s barely-there breathe, out of phase */
        .floral-halo {
          position: absolute;
          inset: 0;
          will-change: transform, opacity;
          animation: floral-halo 61s ease-in-out -19s infinite;
        }
        @keyframes floral-halo {
          0%,100% { transform: scale(1);    opacity: 0.9; }
          50%     { transform: scale(1.05); opacity: 1;   }
        }

        /* Floating luxury dust — a bright warm core over a soft-GOLD body with a
           gold glow halo. The gold is what makes each mote read against the warm
           cream background (pure champagne/ivory would blend in and vanish); the
           bright core keeps it feeling like light dust, not a dark speck. No hard
           edge, never snow / sparkle / star / glitter / fireflies. Filter texture
           is cached and the mote only translates → cheap. */
        /* Glow is baked into the gradient's soft falloff (core → gold → faint
           gold → transparent) so there is NO per-particle filter/drop-shadow —
           38 filter layers tanked FPS; a plain gradient div that only translates
           is a cheap compositor move. Gold-forward palette, soft edge, never
           snow / sparkle / star / glitter / fireflies. */
        .floral-dust__p {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle,
            rgba(242,224,172,0.95) 0%,
            rgba(206,168,92,0.85) 30%,
            rgba(200,162,86,0.34) 62%,
            rgba(200,162,86,0) 100%);
          will-change: transform, opacity;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        /* Ivory — lighter warm core, still gold-edged so it stays golden */
        .floral-dust__p--ivory {
          background: radial-gradient(circle,
            rgba(255,248,228,0.96) 0%,
            rgba(212,176,104,0.72) 34%,
            rgba(206,168,92,0.3) 64%,
            rgba(206,168,92,0) 100%);
        }
        /* Rich gold — the deepest, most golden body */
        .floral-dust__p--gold {
          background: radial-gradient(circle,
            rgba(236,216,166,0.96) 0%,
            rgba(197,160,89,0.92) 32%,
            rgba(184,144,58,0.4) 64%,
            rgba(184,144,58,0) 100%);
        }
        /* ~12% brighter accent — a stronger, more saturated gold core */
        .floral-dust__p--bright {
          background: radial-gradient(circle,
            rgba(248,232,186,0.98) 0%,
            rgba(205,166,86,0.98) 34%,
            rgba(190,150,64,0.45) 66%,
            rgba(190,150,64,0) 100%);
        }
        .floral-dust__p--a { animation-name: floral-dust-a; }
        .floral-dust__p--b { animation-name: floral-dust-b; }
        .floral-dust__p--c { animation-name: floral-dust-c; }
        .floral-dust__p--d { animation-name: floral-dust-d; }
        /* Freer float — larger travel, and no longer all drifting up: motes
           glide up, down, left and right so the field feels alive. Different
           durations + negative delays keep every mote out of phase. */
        @keyframes floral-dust-a {   /* rise + gentle sway */
          0%,100% { transform: translate3d(0,0,0); }
          50%     { transform: translate3d(10px,-34px,0); }
        }
        @keyframes floral-dust-b {   /* sink down-right */
          0%,100% { transform: translate3d(0,0,0); }
          50%     { transform: translate3d(26px,22px,0); }
        }
        @keyframes floral-dust-c {   /* wide left↔right sway, slight rise */
          0%,100% { transform: translate3d(0,0,0); }
          25%     { transform: translate3d(30px,-10px,0); }
          50%     { transform: translate3d(6px,-24px,0); }
          75%     { transform: translate3d(-28px,-8px,0); }
        }
        @keyframes floral-dust-d {   /* slow wander, drifting down-left */
          0%,100% { transform: translate3d(0,0,0); }
          33%     { transform: translate3d(-22px,14px,0); }
          66%     { transform: translate3d(16px,32px,0); }
        }

        .floral-sweep {
          background: linear-gradient(105deg, transparent 43%, rgba(var(--ambient-bloom),0.08) 50%, transparent 57%);
          transform: translateX(-120%);
          pointer-events: none;
        }
        .floral-sweep.is-active {
          will-change: transform;
          animation: floral-sweep 2.4s ease-in-out 1;
        }
        @keyframes floral-sweep {
          from { transform: translateX(-120%); }
          to   { transform: translateX(120%);  }
        }

        @media (prefers-reduced-motion: reduce) {
          .floral-glow--a, .floral-glow--b, .floral-halo,
          .floral-dust__p, .floral-sweep, .floral-sweep.is-active,
          .floral-glow-follow.is-bloom {
            animation: none !important;
          }
          .floral-glow-follow { transform: none !important; }
          .floral-sweep { display: none !important; }
        }
      `}</style>
    </>
  )
}

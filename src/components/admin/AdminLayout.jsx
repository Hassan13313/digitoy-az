import { useState } from 'react'
import { ShoppingBag, FileText, Image, LayoutDashboard, MessageSquare, ShieldCheck, LogOut, QrCode, MoreHorizontal, X } from 'lucide-react'
import { useIsNarrow } from '../../hooks/useIsNarrow'

const NAV = [
  { key: 'dashboard',   label: 'Dashboard',     icon: LayoutDashboard },
  { key: 'orders',      label: 'Sifarişlər',    icon: ShoppingBag },
  { key: 'invitations', label: 'Dəvətnamələr',  icon: FileText },
  { key: 'photos',      label: 'Fotolar',       icon: Image },
  /* Phase 43 — masaüstü çap stendi (A5 PDF) */
  { key: 'qrstand',     label: 'QR Stend',      icon: QrCode },
  /* Phase 36 — qonaqların təbrik mesajlarının moderasiyası */
  { key: 'guestbook',   label: 'Təbrik Məktubları', icon: MessageSquare },
  /* Phase 37/39 — backup vəziyyəti, draft təmizləmə, media indeksi, audit */
  { key: 'maintenance', label: 'Baxım',         icon: ShieldCheck },
]

/* ── Telefon (Phase 45) ─────────────────────────────────────────────────────
   Alt paneldə ən çox işlənən 4 bölmə + «Daha çox». Qısa adlar — 384px-də
   (S24 Ultra) beş düymə bir sətrə sığmalıdır. */
const PRIMARY = ['dashboard', 'orders', 'invitations', 'photos']
const SHORT = { dashboard: 'Panel', orders: 'Sifarişlər', invitations: 'Dəvətnamə', photos: 'Fotolar' }

const INK = 'oklch(14% 0.02 60)'
const GOLD = 'oklch(72% 0.12 80)'

export default function AdminLayout({ children, section, onNavigate }) {
  /* ── Telefon rejimi ───────────────────────────────────────────────────────
     Phase 42.1-də yan menyu yuxarıda üfüqi sürüşən lentə çevrilmişdi, amma
     telefonda üç problem qalmışdı: lent + logo + «Sayta qayıt» ekranın
     ~160px-ni yeyirdi, lentin yarısı ekrandan kənarda idi (görünmürdü) və
     menyu baş barmaqdan uzaqda — ekranın yuxarısında idi.
     Phase 45: yığcam başlıq (48px) + ALT naviqasiya paneli — böyük telefonda
     (S24 Ultra, 6.8″) bir əllə istifadə üçün. Az işlənən bölmələr «Daha
     çox» vərəqindədir. Masaüstü görünüşü DƏYİŞMƏYİB. */
  const narrow = useIsNarrow()
  const [moreOpen, setMoreOpen] = useState(false)

  if (narrow) {
    const current = NAV.find((n) => n.key === section)
    const inMore = !PRIMARY.includes(section)
    const go = (key) => { setMoreOpen(false); onNavigate(key) }

    return (
      <div style={{ minHeight: '100vh', fontFamily: '"Inter",system-ui,sans-serif', background: 'oklch(97% 0.008 80)' }}>
        {/* Yığcam başlıq */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40, height: 48, padding: '0 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          background: INK, borderBottom: '1px solid oklch(22% 0.02 60)',
        }}>
          <span style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",serif', fontSize: 18, fontWeight: 300,
            letterSpacing: '0.1em', color: 'oklch(82% 0.09 80)', whiteSpace: 'nowrap',
          }}>
            Digitoy <span style={{ fontFamily: '"Inter",system-ui,sans-serif', fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'oklch(55% 0.03 60)' }}>admin</span>
          </span>
          <span style={{ fontSize: 12.5, color: 'oklch(80% 0.02 60)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {current?.label || ''}
          </span>
        </header>

        {/* Məzmun — alt panelin altında qalmasın deyə aşağı boşluq */}
        <main style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))', minWidth: 0 }}>
          {children}
        </main>

        {/* «Daha çox» vərəqi */}
        {moreOpen && (
          <div
            role="dialog" aria-modal="true" aria-label="Bütün bölmələr"
            onClick={(e) => { if (e.target === e.currentTarget) setMoreOpen(false) }}
            style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(20,16,12,.45)', display: 'flex', alignItems: 'flex-end' }}
          >
            <div style={{
              width: '100%', background: 'white', borderRadius: '16px 16px 0 0',
              padding: '10px 10px calc(84px + env(safe-area-inset-bottom, 0px))',
              boxShadow: '0 -12px 40px rgba(0,0,0,.18)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px 10px' }}>
                <span style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'oklch(55% 0.03 60)' }}>Bölmələr</span>
                <button type="button" onClick={() => setMoreOpen(false)} aria-label="Bağla"
                  style={{ width: 40, height: 40, border: 'none', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'oklch(45% 0.03 60)', cursor: 'pointer' }}>
                  <X size={18} strokeWidth={1.8} />
                </button>
              </div>
              {NAV.map(({ key, label, icon: Icon }) => {
                const active = section === key
                return (
                  <button
                    key={key} type="button" onClick={() => go(key)} aria-current={active ? 'page' : undefined}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12, minHeight: 50, padding: '0 12px',
                      border: 'none', borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      background: active ? 'oklch(96% 0.03 85)' : 'transparent',
                      color: active ? 'oklch(30% 0.05 75)' : 'oklch(30% 0.02 60)', fontSize: 15, fontWeight: active ? 600 : 400,
                    }}
                  >
                    <Icon size={18} strokeWidth={1.6} style={{ color: active ? 'oklch(55% 0.1 80)' : 'oklch(55% 0.03 60)' }} />
                    {label}
                  </button>
                )
              })}
              <div style={{ height: 1, background: 'oklch(92% 0.01 75)', margin: '8px 6px' }} />
              <button
                type="button" onClick={() => { window.location.href = '/' }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12, minHeight: 48, padding: '0 12px',
                  border: 'none', borderRadius: 10, background: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  color: 'oklch(45% 0.03 60)', fontSize: 14,
                }}
              >
                <LogOut size={17} strokeWidth={1.6} /> Sayta qayıt
              </button>
            </div>
          </div>
        )}

        {/* Alt naviqasiya */}
        <nav aria-label="Admin bölmələri" style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 70,
          display: 'flex', background: INK, borderTop: '1px solid oklch(24% 0.02 60)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}>
          {PRIMARY.map((key) => {
            const { icon: Icon } = NAV.find((n) => n.key === key)
            const active = section === key && !moreOpen
            return (
              <button
                key={key} type="button" onClick={() => go(key)} aria-current={active ? 'page' : undefined}
                style={{
                  flex: 1, minWidth: 0, height: 60, border: 'none', background: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                  color: active ? GOLD : 'oklch(60% 0.03 60)', fontFamily: 'inherit',
                  borderTop: `2px solid ${active ? GOLD : 'transparent'}`,
                }}
              >
                <Icon size={20} strokeWidth={1.6} />
                <span style={{ fontSize: 10.5, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{SHORT[key]}</span>
              </button>
            )
          })}
          <button
            type="button" onClick={() => setMoreOpen((v) => !v)} aria-expanded={moreOpen}
            style={{
              flex: 1, minWidth: 0, height: 60, border: 'none', background: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
              color: moreOpen || inMore ? GOLD : 'oklch(60% 0.03 60)', fontFamily: 'inherit',
              borderTop: `2px solid ${moreOpen || inMore ? GOLD : 'transparent'}`,
            }}
          >
            <MoreHorizontal size={20} strokeWidth={1.6} />
            <span style={{ fontSize: 10.5 }}>Daha çox</span>
          </button>
        </nav>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      minHeight: '100vh', fontFamily: '"Inter",system-ui,sans-serif',
    }}>

      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: 'oklch(14% 0.02 60)',
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid oklch(22% 0.02 60)',
        position: 'static',
      }}>
        {/* Logo */}
        <div style={{
          padding: '28px 24px 24px',
          borderBottom: '1px solid oklch(22% 0.02 60)',
        }}>
          <p style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",serif',
            fontSize: 18, fontWeight: 300, letterSpacing: '0.12em',
            color: 'oklch(82% 0.09 80)', margin: 0,
          }}>
            Digitoy
          </p>
          <p style={{
            fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'oklch(50% 0.03 60)', marginTop: 2,
          }}>
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0', display: 'block' }}>
          {NAV.map(({ key, label, icon: Icon }) => {
            const active = section === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => onNavigate(key)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 24px',
                  whiteSpace: 'nowrap',
                  borderRadius: 0,
                  background: active ? 'oklch(22% 0.03 60)' : 'none',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderLeft: active ? '2px solid oklch(72% 0.12 80)' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={14} strokeWidth={1.5} style={{ color: active ? 'oklch(72% 0.12 80)' : 'oklch(50% 0.03 60)', flexShrink: 0 }} />
                <span style={{
                  fontSize: 12, fontWeight: active ? 500 : 400,
                  color: active ? 'oklch(88% 0.02 60)' : 'oklch(55% 0.03 60)',
                  letterSpacing: '0.04em',
                }}>
                  {label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid oklch(22% 0.02 60)',
        }}>
          <button
            type="button"
            onClick={() => { window.location.href = '/' }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, color: 'oklch(40% 0.02 60)',
              letterSpacing: '0.04em',
            }}
          >
            <LogOut size={12} strokeWidth={1.5} />
            Sayta qayıt
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{
        flex: 1, background: 'oklch(97% 0.008 80)',
        overflow: 'auto',
      }}>
        {children}
      </main>
    </div>
  )
}

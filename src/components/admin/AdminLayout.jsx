import { ShoppingBag, FileText, Image, LayoutDashboard, MessageSquare, ShieldCheck, LogOut } from 'lucide-react'
import { useIsNarrow } from '../../hooks/useIsNarrow'

const NAV = [
  { key: 'dashboard',   label: 'Dashboard',     icon: LayoutDashboard },
  { key: 'orders',      label: 'Sifarişlər',    icon: ShoppingBag },
  { key: 'invitations', label: 'Dəvətnamələr',  icon: FileText },
  { key: 'photos',      label: 'Fotolar',       icon: Image },
  /* Phase 36 — qonaqların təbrik mesajlarının moderasiyası */
  { key: 'guestbook',   label: 'Təbrik Məktubları', icon: MessageSquare },
  /* Phase 37/39 — backup vəziyyəti, draft təmizləmə, media indeksi, audit */
  { key: 'maintenance', label: 'Baxım',         icon: ShieldCheck },
]

export default function AdminLayout({ children, section, onNavigate }) {
  /* ── Telefon rejimi (Phase 42.1) ───────────────────────────────────────
     220px-lik yan menyu 412px-lik ekranın YARISINI yeyir. Dar ekranda menyu
     yuxarıya, üfüqi sürüşən lentə çevrilir: bütün bölmələr əlçatan qalır,
     məzmuna isə tam en düşür. */
  const narrow = useIsNarrow()

  return (
    <div style={{
      display: 'flex',
      flexDirection: narrow ? 'column' : 'row',
      minHeight: '100vh', fontFamily: '"Inter",system-ui,sans-serif',
    }}>

      {/* Sidebar */}
      <aside style={{
        width: narrow ? '100%' : 220, flexShrink: 0,
        background: 'oklch(14% 0.02 60)',
        display: 'flex', flexDirection: 'column',
        borderRight: narrow ? 'none' : '1px solid oklch(22% 0.02 60)',
        borderBottom: narrow ? '1px solid oklch(22% 0.02 60)' : 'none',
        /* Telefonda menyu yapışqan qalsın — uzun siyahıda naviqasiya itməsin */
        position: narrow ? 'sticky' : 'static', top: 0, zIndex: 40,
      }}>
        {/* Logo */}
        <div style={{
          padding: narrow ? '10px 14px 8px' : '28px 24px 24px',
          borderBottom: narrow ? 'none' : '1px solid oklch(22% 0.02 60)',
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
        <nav style={{
          flex: 1,
          padding: narrow ? '0 6px 8px' : '12px 0',
          /* ⚠ Üfüqi lent: 6 bölmə 412px-ə sığmır, ona görə sürüşür.
             `WebkitOverflowScrolling` iOS-da inertial scroll verir. */
          display: narrow ? 'flex' : 'block',
          gap: narrow ? 4 : 0,
          overflowX: narrow ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch',
        }}>
          {NAV.map(({ key, label, icon: Icon }) => {
            const active = section === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => onNavigate(key)}
                style={{
                  width: narrow ? 'auto' : '100%',
                  display: 'flex', alignItems: 'center', gap: narrow ? 6 : 10,
                  padding: narrow ? '9px 12px' : '10px 24px',
                  /* ⚠ Toxunma hədəfi ≥ 40px (barmaq üçün) */
                  minHeight: narrow ? 40 : undefined,
                  whiteSpace: 'nowrap', flex: narrow ? '0 0 auto' : undefined,
                  borderRadius: narrow ? 6 : 0,
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
          padding: narrow ? '10px 14px' : '16px 24px',
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

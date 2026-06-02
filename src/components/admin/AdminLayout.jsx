import { ShoppingBag, FileText, Image, LayoutDashboard, LogOut } from 'lucide-react'

const NAV = [
  { key: 'orders',      label: 'Sifarişlər',    icon: ShoppingBag },
  { key: 'invitations', label: 'Dəvətnamələr',  icon: FileText },
  { key: 'photos',      label: 'Fotolar',       icon: Image },
]

export default function AdminLayout({ children, section, onNavigate }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '"Inter",system-ui,sans-serif' }}>

      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: 'oklch(14% 0.02 60)',
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid oklch(22% 0.02 60)',
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
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {NAV.map(({ key, label, icon: Icon }) => {
            const active = section === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => onNavigate(key)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 24px',
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

import { AdminShell, ADMIN_SECTIONS } from './v2/adminUi'

/* ─────────────────────────────────────────────────────────────────────────────
   Admin qabığı — UI redesign 2026-10 (v2/adminUi › AdminShell).

   Desktop (≥1024px): sol yan panel. Telefon: yığcam yuxarı panel + ALT
   naviqasiya (4 əsas bölmə + «Daha çox» vərəqi) — Phase 45-dəki bir əllə
   istifadə qaydası qorunur.

   ⚠ Bölmə id-ləri URL-lərdir (/admin/invitations, /admin/qrstand …) — onlar
   dəyişmir; dizayn dəstindəki qısa id-lər burada xəritələnir.
   ⚠ `dt-page`: body/#root `overflow-x: clip` alır ki, yan panel və mobil
   başlıq `sticky` işləsin (index.css).
   ───────────────────────────────────────────────────────────────────────── */

const ID_MAP = { invites: 'invitations', qr: 'qrstand', letters: 'guestbook' }
const SECTIONS = ADMIN_SECTIONS.map((s) => ({ ...s, id: ID_MAP[s.id] || s.id }))
const MOBILE_TABS = ['dashboard', 'orders', 'invitations', 'photos']

export default function AdminLayout({ children, section, onNavigate }) {
  const current = SECTIONS.find((s) => s.id === section)
  return (
    <div className="dt-page">
      <AdminShell
        active={section}
        sections={SECTIONS}
        mobileTabs={MOBILE_TABS}
        pageTitle={current?.label}
        getHref={(id) => `/admin/${id}`}
        onNavigate={(id, e) => {
          /* Ctrl/⌘ + klik — yeni tabda açılsın (adi link davranışı) */
          if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return
          e?.preventDefault?.()
          onNavigate(id)
        }}
        onBackToSite={() => { window.location.href = '/' }}
      >
        {children}
      </AdminShell>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   QALEREYA ANALİTİKASI — paylaşılan qrafik elementləri (Phase 43)

   Həm cütlüyün statistika paneli, həm admin dashboard widget-i bunları
   işlədir. Yeni kitabxana YOXDUR: hər şey CSS `flex` + `height` ilə çizilir,
   yəni bundle-a ~1 KB əlavə olunur (chart kitabxanası 50–150 KB olardı).

   ⚠ ƏLÇATANLIQ: hər çubuq `title` ilə dəqiq rəqəmi verir və `role="img"`
   + `aria-label` ilə ümumi məna ekran oxuyucusuna çatır — rəqəmlər yalnız
   vizual formada qalmır.
   ───────────────────────────────────────────────────────────────────────── */

const GOLD = 'oklch(68% 0.1 80)'

export function StatTile({ icon: Icon, label, value, sub, tone = GOLD, compact = false }) {
  return (
    <div style={{
      background: 'white', border: '1px solid oklch(88% 0.02 60)', borderRadius: 6,
      padding: compact ? '13px 14px' : '18px 20px',
      display: 'flex', alignItems: 'flex-start', gap: compact ? 10 : 13,
      minWidth: 0,
    }}>
      {Icon && (
        <div style={{
          width: compact ? 28 : 34, height: compact ? 28 : 34, borderRadius: 6,
          background: 'oklch(96% 0.02 80)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={compact ? 13 : 15} strokeWidth={1.5} style={{ color: tone }} />
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: compact ? 18 : 23, fontWeight: 300, lineHeight: 1.1,
          color: 'oklch(18% 0.02 60)', fontVariantNumeric: 'tabular-nums',
        }}>
          {value ?? '—'}
        </div>
        <div style={{
          fontSize: compact ? 10 : 11, color: 'oklch(50% 0.03 60)',
          letterSpacing: '0.04em', marginTop: 3, overflowWrap: 'anywhere',
        }}>
          {label}
        </div>
        {sub != null && sub !== '' && (
          <div style={{ fontSize: 9.5, color: 'oklch(58% 0.04 145)', marginTop: 3 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Şaquli çubuq qrafiki.
 * @param {Array<{label: string, value: number, title?: string}>} data
 */
export function BarChart({ data, height = 78, tone = GOLD, emptyText = 'Məlumat yoxdur', ariaLabel }) {
  const rows = Array.isArray(data) ? data : []
  const total = rows.reduce((s, r) => s + (r.value || 0), 0)

  if (!rows.length || total === 0) {
    return (
      <div style={{
        height, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 11, color: 'oklch(65% 0.03 60)' }}>{emptyText}</span>
      </div>
    )
  }

  const max = Math.max(...rows.map(r => r.value || 0), 1)

  return (
    <div
      role="img"
      aria-label={ariaLabel || `Qrafik, cəmi ${total}`}
      style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height, paddingTop: 6 }}
    >
      {rows.map((r, i) => {
        const h = r.value > 0 ? Math.max(Math.round((r.value / max) * (height - 22)), 3) : 2
        return (
          <div key={i} style={{
            flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3,
          }}>
            <div
              title={r.title || `${r.label}: ${r.value}`}
              style={{
                width: '100%', height: h,
                background: r.value > 0 ? tone : 'oklch(90% 0.01 80)',
                borderRadius: '2px 2px 0 0',
                transition: 'height 0.4s ease',
              }}
            />
            <span style={{
              fontSize: 8, color: 'oklch(60% 0.03 60)', letterSpacing: '0.01em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip',
            }}>
              {r.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** Üfüqi zolaq — reaksiya bölgüsü kimi az sayda sətir üçün */
export function BarRow({ label, value, max, tone = GOLD, emoji }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
        <span style={{
          fontSize: 11, color: 'oklch(40% 0.03 60)', letterSpacing: '0.03em',
          display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0,
        }}>
          {emoji && (
            <span aria-hidden="true" style={{
              fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
              fontSize: 13,
            }}>{emoji}</span>
          )}
          <span style={{ overflowWrap: 'anywhere' }}>{label}</span>
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600, color: 'oklch(30% 0.03 60)',
          fontVariantNumeric: 'tabular-nums', flexShrink: 0,
        }}>
          {value}
        </span>
      </div>
      <div style={{ height: 5, background: 'oklch(92% 0.01 80)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: tone,
          borderRadius: 3, transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}

/** `2026-09-25` → `25.09` (qrafik altındaki qısa etiket) */
export function shortDay(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''))
  return m ? `${m[3]}.${m[2]}` : String(iso || '')
}

/** Saat etiketi — yalnız hər 3-cü saat yazılır ki, 24 xana sıxılmasın */
export function hourLabel(h) {
  return h % 3 === 0 ? String(h).padStart(2, '0') : ''
}

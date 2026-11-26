import { useEffect, useState } from 'react'
import { getInvitation } from '../../utils/api'
import { useSeating, getInviteSlug } from '../../hooks/useSeating'

/* ─────────────────────────────────────────────────────────────────────────────
   «Masanızı tapın» — girişdəki QR stendinin açdığı sadə səhifə (2026-11-26)
   /invite/<slug>/masa: açılış animasiyası, geri sayım və s. yoxdur — qonaq
   adını yazır, masa nömrəsini və (müştəri istəyibsə) zal planını görür.
   Hansı şablon olursa olsun eyni işləyir. Qaydalar useSeating-dədir
   (masasızlar axtarışda çıxmır, masa yoldaşları / xəritə müştərinin seçimi).
   ───────────────────────────────────────────────────────────────────────── */

const C = { bg: '#FDFBF7', ink: '#2C2523', mut: '#6B5E54', gold: '#84652A', ring: '#E5DED2', mist: '#F3EAD3' }
const serif = '"Cormorant Garamond","Playfair Display",Georgia,serif'

function namesOf(d) {
  if (!d) return ''
  if (['toy', 'nishan'].includes(d.eventType)) return [d.groomName, d.brideName].filter(Boolean).join(' & ')
  if (['corporate', 'other'].includes(d.eventType)) return d.eventName || ''
  return d.brideName || ''
}

export default function SeatFinderPage() {
  const slug = getInviteSlug()
  const [inv, setInv] = useState(slug ? undefined : null)   /* undefined = yüklənir, null = tapılmadı */
  useEffect(() => {
    if (slug) getInvitation(slug).then((r) => setInv(r?.data ? r : null)).catch(() => setInv(null))
  }, [slug])
  const lang = ['az', 'en', 'ru'].includes(inv?.data?.lang) ? inv.data.lang : 'az'
  const {
    labels: L, loading, isEmpty, inputRef, query, setQuery, setSelected, onKeyDown,
    suggestions, activeIdx, pick, showNotFound, selected, tablemates, mapEl, reset,
  } = useSeating({ seatingPlan: inv?.data?.seatingPlan || '', lang })

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.ink, padding: '40px 18px 60px', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <div style={{ maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>
        {inv?.data && <p style={{ margin: 0, color: C.gold, fontSize: 15 }}>{namesOf(inv.data)}</p>}
        <h1 style={{ font: `600 38px/1.1 ${serif}`, margin: '6px 0 6px' }}>{lang === 'en' ? 'Find your table' : lang === 'ru' ? 'Найдите свой стол' : 'Masanızı tapın'}</h1>
        <p style={{ margin: '0 0 22px', color: C.mut, fontSize: 15 }}>{L.sub}</p>

        {inv === null && <p role="alert" style={{ color: '#9A3B2E' }}>Dəvətnamə tapılmadı.</p>}
        {inv && (loading ? <p style={{ color: C.mut }}>Yüklənir…</p>
          : isEmpty ? (
            <p style={{ padding: 16, borderRadius: 14, background: C.mist, color: '#4E3E18', lineHeight: 1.5 }}>
              Masa planı hələ hazır deyil. Zəhmət olmasa toy sahibinə və ya girişdəki əməkdaşa yaxınlaşın.
            </p>
          ) : (
            <>
              <input ref={inputRef} type="search" value={query} autoFocus autoComplete="off" aria-label={L.hint}
                placeholder={L.hint} onKeyDown={onKeyDown}
                onChange={(e) => { setQuery(e.target.value); setSelected(null) }}
                style={{ width: '100%', height: 54, borderRadius: 14, border: 0, padding: '0 16px', fontSize: 17, background: '#fff', boxShadow: `inset 0 0 0 1.5px ${C.ring}`, color: C.ink }} />
              {suggestions.length > 0 && (
                <ul role="listbox" style={{ listStyle: 'none', margin: '8px 0 0', padding: 6, borderRadius: 14, background: '#fff', boxShadow: `inset 0 0 0 1px ${C.ring}`, textAlign: 'left' }}>
                  {suggestions.map((g, i) => (
                    <li key={g.id ?? `${g.full_name}-${i}`}>
                      <button type="button" role="option" aria-selected={i === activeIdx} onClick={() => pick(g)}
                        style={{ width: '100%', minHeight: 48, border: 0, borderRadius: 10, background: i === activeIdx ? C.mist : 'transparent', textAlign: 'left', padding: '0 12px', fontSize: 16, color: C.ink, cursor: 'pointer' }}>
                        {g.full_name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {showNotFound && <p style={{ marginTop: 14, color: C.mut }}>Bu adla qonaq tapılmadı. Adınızı dəvətnamədəki kimi tam yazın.</p>}
              {selected && (
                <div style={{ marginTop: 22, padding: '22px 16px', borderRadius: 18, background: '#fff', boxShadow: `inset 0 0 0 1px ${C.ring}` }}>
                  <p style={{ margin: 0, color: C.mut, fontSize: 14 }}>{selected.full_name}, sizin masanız</p>
                  <strong style={{ display: 'block', font: `700 44px/1.1 ${serif}`, margin: '4px 0 8px' }}>{selected.table_id}</strong>
                  {tablemates.length > 1 && <p style={{ margin: '0 0 6px', color: C.mut, fontSize: 14.5, lineHeight: 1.6 }}>{tablemates.map((g) => g.full_name).join(', ')}</p>}
                  {mapEl}
                  <button type="button" onClick={reset} style={{ marginTop: 10, minHeight: 44, border: 0, background: 'none', color: C.gold, fontSize: 15.5, textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer' }}>{L.again}</button>
                </div>
              )}
            </>
          ))}
        {slug && <p style={{ marginTop: 30 }}><a href={`/invite/${encodeURIComponent(slug)}`} style={{ color: C.mut, fontSize: 14 }}>Dəvətnaməyə keç</a></p>}
      </div>
    </main>
  )
}

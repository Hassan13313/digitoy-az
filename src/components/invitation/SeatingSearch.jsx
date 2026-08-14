import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSeating } from '../../hooks/useSeating'
import t from '../../data/translations'

/* Axtarış/normalizasiya/masa yoldaşı məntiqi artıq `hooks/useSeating.js`-dədir —
   bu fayl yalnız simple-luxury UI qatıdır. */

export default function SeatingSearch({ seatingPlan, lang }) {
  const tr = t[lang] || t.az
  const {
    suggestions, selected, tablemates,
    query, setQuery, activeIdx, setActiveIdx, setSelected,
    isEmpty, showNotFound, pick, reset, onKeyDown, inputRef,
    labels: L, statusMap: STATUS_DOT,
  } = useSeating({ seatingPlan, lang })
  const [ref, visible] = useScrollReveal()

  if (isEmpty) return null

  return (
    <section className="py-28 px-6 bg-beige">
      <div ref={ref} className={`max-w-lg mx-auto reveal-hidden ${visible ? 'reveal-visible' : ''}`}>

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[9px] tracking-[0.38em] uppercase text-gold mb-5 font-medium font-sans">Seating</p>
          <h2 className="font-serif text-3xl text-ink font-light tracking-tight">{L.title}</h2>
          <p className="text-brown-muted text-xs mt-3 tracking-wide font-light font-sans">{L.sub}</p>
          <div className="gold-divider mt-8 max-w-[100px] mx-auto" />
        </div>

        {/* Search input */}
        <div className="relative mb-3">
          <div style={{ position: 'absolute', left: 16, top: 27, transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <Search size={15} strokeWidth={1.5} style={{ color: 'rgba(197,160,89,0.7)' }} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(-1); if (selected) setSelected(null) }}
            onKeyDown={onKeyDown}
            placeholder={L.hint}
            role="combobox"
            aria-expanded={suggestions.length > 0}
            aria-controls="seating-suggestions"
            aria-autocomplete="list"
            aria-activedescendant={activeIdx >= 0 ? `seating-opt-${activeIdx}` : undefined}
            autoComplete="off"
            style={{
              width: '100%',
              background: 'rgba(253,250,244,0.85)',
              border: `1px solid ${query.length > 1 ? 'rgba(197,160,89,0.5)' : 'rgba(221,213,200,0.6)'}`,
              outline: 'none',
              padding: '18px 44px 18px 48px',
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontSize: 17, fontWeight: 300, color: '#1C1610', letterSpacing: '0.03em',
              transition: 'border-color 0.25s, box-shadow 0.25s',
              boxShadow: query.length > 1
                ? '0 0 0 3px rgba(197,160,89,0.08), 0 4px 16px rgba(0,0,0,0.06)'
                : '0 2px 8px rgba(0,0,0,0.04)',
            }}
          />
          {query && (
            <button onClick={reset} aria-label={tr.btn_back || 'Təmizlə'}
              style={{ position: 'absolute', right: 14, top: 27, transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={13} strokeWidth={1.5} style={{ color: 'rgba(140,123,107,0.5)' }} />
            </button>
          )}

          {/* Autocomplete dropdown */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.ul
                id="seating-suggestions" role="listbox"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                style={{
                  listStyle: 'none', margin: '6px 0 0', padding: 4,
                  position: 'absolute', left: 0, right: 0, top: '100%', zIndex: 30,
                  background: 'rgba(253,250,244,0.98)', border: '1px solid rgba(197,160,89,0.28)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.12)', maxHeight: 320, overflowY: 'auto',
                }}
              >
                {suggestions.map((g, i) => {
                  const sm = STATUS_DOT[g.status] || STATUS_DOT.NO_RESPONSE
                  return (
                    <li
                      key={g.id ? g.id : `${g.full_name}-${g.table_id}-${i}`}
                      id={`seating-opt-${i}`}
                      role="option"
                      aria-selected={i === activeIdx}
                      onMouseEnter={() => setActiveIdx(i)}
                      onMouseDown={e => { e.preventDefault(); pick(g) }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                        padding: '13px 14px', cursor: 'pointer',
                        background: i === activeIdx ? 'rgba(197,160,89,0.10)' : 'transparent',
                        transition: 'background 0.12s',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12 }}>{sm.dot}</span>
                        <span style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 16, fontWeight: 300, color: '#1C1610' }}>
                          {g.full_name}
                        </span>
                      </span>
                      <span style={{
                        flexShrink: 0, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
                        color: 'rgba(140,100,30,0.9)', padding: '4px 10px',
                        border: '1px solid rgba(197,160,89,0.35)', background: 'rgba(197,160,89,0.07)', whiteSpace: 'nowrap',
                      }}>
                        {g.table_id}
                      </span>
                    </li>
                  )
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Helper */}
        {!selected && (
          <p className="text-center text-[11px] text-brown-muted/70 font-light tracking-wide mb-8 font-sans">
            {query.trim().length >= 2 && suggestions.length > 0 ? tr.inv_seat_select : tr.inv_seat_helper}
          </p>
        )}

        <AnimatePresence mode="wait">
          {showNotFound && (
            <motion.div key="notfound" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              style={{ border: '1px solid rgba(221,213,200,0.5)', background: 'rgba(253,250,244,0.7)', padding: '28px 24px', textAlign: 'center' }}
            >
              <div style={{ width: 40, height: 40, margin: '0 auto 14px', border: '1px solid rgba(221,213,200,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={16} strokeWidth={1} style={{ color: 'rgba(140,123,107,0.45)' }} />
              </div>
              <p style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 16, fontWeight: 300, color: 'rgba(80,68,58,0.8)' }}>
                {tr.inv_seat_fullname}
              </p>
            </motion.div>
          )}

          {selected && (
            <motion.div key="found" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            >
              <div style={{
                background: 'linear-gradient(150deg, #FDFAF4 0%, #F8F3E8 100%)',
                border: '1px solid rgba(197,160,89,0.28)', borderLeft: '2.5px solid rgba(197,160,89,0.8)',
                padding: '28px 28px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.07), 0 2px 8px rgba(197,160,89,0.08)',
              }}>
                {/* Table badge + seçilmiş qonaq */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 52, height: 52, flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(197,160,89,0.15), rgba(197,160,89,0.05))',
                    border: '1px solid rgba(197,160,89,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%', boxShadow: '0 2px 12px rgba(197,160,89,0.15)',
                  }}>
                    <span style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 18, fontWeight: 400, color: 'rgba(197,160,89,0.95)', lineHeight: 1 }}>
                      {selected.table_id.replace(/[^0-9]/g, '') || selected.table_id.slice(0, 2)}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(140,123,107,0.7)', marginBottom: 4, fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 500 }}>
                      {tr.inv_table_found}
                    </p>
                    <p style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 20, fontWeight: 300, color: '#1C1610', lineHeight: 1.1 }}>
                      {selected.table_id}
                    </p>
                  </div>
                  <button onClick={reset} aria-label="Yenidən axtar"
                    style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
                    <X size={15} strokeWidth={1.5} style={{ color: 'rgba(140,123,107,0.55)' }} />
                  </button>
                </div>

                <div style={{ height: 1, marginBottom: 18, background: 'linear-gradient(to right, rgba(197,160,89,0.4), rgba(197,160,89,0.12))' }} />

                <p style={{ fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(140,123,107,0.65)', marginBottom: 12, fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 500 }}>
                  {tr.inv_tablemates}
                </p>

                {/* Masa yoldaşları — RSVP status göstəricisi ilə */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {tablemates.map(g => {
                    const isMatch = g.id === selected.id || g.full_name === selected.full_name
                    const sm = STATUS_DOT[g.status] || STATUS_DOT.NO_RESPONSE
                    return (
                      <span
                        key={g.id ?? g.full_name}
                        style={{
                          padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: 6,
                          border: `1px solid ${isMatch ? 'rgba(197,160,89,0.7)' : 'rgba(221,213,200,0.6)'}`,
                          background: isMatch
                            ? 'linear-gradient(135deg, rgba(197,160,89,0.15), rgba(197,160,89,0.06))'
                            : 'rgba(253,250,244,0.6)',
                          fontFamily: '"Cormorant Garamond",Georgia,serif',
                          fontSize: 14, fontWeight: isMatch ? 400 : 300,
                          color: isMatch ? 'rgba(140,100,30,0.95)' : 'rgba(80,68,58,0.75)',
                          boxShadow: isMatch ? '0 2px 8px rgba(197,160,89,0.12)' : 'none',
                        }}
                        title={sm.label[lang] || sm.label.az}
                      >
                        <span style={{ fontSize: 11 }}>{sm.dot}</span>
                        {g.full_name}
                      </span>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

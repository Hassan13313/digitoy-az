import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Minus, Plus, Send, Search, AlertCircle } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useRsvp } from '../../hooks/useRsvp'
import t from '../../data/translations'

/* Qonaq siyahısı, autocomplete və göndərmə məntiqi artıq
   `hooks/useRsvp.js`-dədir — bu fayl yalnız simple-luxury UI qatıdır. */

export default function RSVPSection({ lang, weddingData }) {
  const {
    suggestions, selected, useGuestMode,
    query, setQuery, setActiveIdx, activeIdx, setSelected,
    status, plusOne, submitted, alreadyDone, sending,
    rsvpClosed, showNotFound, canSubmit, thanksMsg,
    chooseStatus, incPlusOne, decPlusOne,
    pick, resetGuest, onKeyDown, handleSubmit, inputRef,
    labels: L, maxExtraGuests,
  } = useRsvp({ lang, weddingData })

  const tr = t[lang] || t.az
  const [ref, visible] = useScrollReveal()

  return (
    <section className="py-28 px-6 bg-cream">
      <div
        ref={ref}
        className={`max-w-[540px] mx-auto px-6 text-center reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.42em] text-gold-dark uppercase">
            <span className="w-[22px] h-px bg-gold opacity-60" />
            İştirak Təsdiqi
            <span className="w-[22px] h-px bg-gold opacity-60" />
          </div>
          <h2 className="font-serif font-normal text-espresso mt-3 mb-2.5" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>{L.title}</h2>
          {L.subtitle && (
            <p className="text-brown-dark text-[15px] leading-[1.6] mb-7">{L.subtitle}</p>
          )}
          <div className="gold-divider mt-8 max-w-[100px] mx-auto" />
        </div>

        <AnimatePresence mode="wait">
          {rsvpClosed && !submitted ? (
            <motion.div key="closed" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 border border-beige-dark/50 bg-beige/40"
            >
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border" style={{ borderColor: '#DDD5C8' }}>
                <X size={20} className="text-brown-muted" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-ink font-light mb-2">{tr.rsvp_closed_title}</h3>
              <p className="text-[11px] tracking-[0.18em] uppercase text-brown-muted font-sans font-medium">{tr.rsvp_closed_desc}</p>
            </motion.div>
          ) : alreadyDone ? (
            <motion.div key="already" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 border border-beige-dark/50 bg-beige/40"
            >
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border" style={{ borderColor: '#C5A059' }}>
                <AlertCircle size={20} style={{ color: '#C5A059' }} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-ink font-light mb-2">{L.already_done}</h3>
              <p className="text-[11px] tracking-[0.18em] uppercase text-brown-muted font-sans font-medium">{selected?.full_name}</p>
            </motion.div>
          ) : submitted ? (
            <motion.div key="thanks" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 border border-beige-dark/50 bg-beige/40"
            >
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border"
                style={{ borderColor: status === 'no' ? '#DDD5C8' : '#C5A059' }}
              >
                {status === 'yes'   && <Check size={20} className="text-gold" strokeWidth={1.5} />}
                {status === 'maybe' && <Minus size={20} style={{ color: '#C5A059' }} strokeWidth={1.5} />}
                {status === 'no'    && <X size={20} className="text-brown-muted" strokeWidth={1.5} />}
              </div>
              <h3 className="font-serif text-xl text-ink font-light mb-2">{thanksMsg}</h3>
              <p className="text-[11px] tracking-[0.18em] uppercase text-brown-muted font-sans font-medium">{L.thanks_sub}</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* ── Qonaq axtarışı (autocomplete) ── */}
              {useGuestMode ? (
                <div className="relative text-left">
                  <div style={{ position: 'absolute', left: 14, top: 18, pointerEvents: 'none' }}>
                    <Search size={14} strokeWidth={1.5} style={{ color: 'rgba(197,160,89,0.7)' }} />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setActiveIdx(-1); if (selected) setSelected(null) }}
                    onKeyDown={onKeyDown}
                    placeholder={L.namePh}
                    autoComplete="off"
                    className="luxury-input w-full text-left"
                    style={{ paddingLeft: 38, paddingRight: 38 }}
                  />
                  {query && (
                    <button type="button" onClick={resetGuest} style={{ position: 'absolute', right: 12, top: 18, background: 'none', border: 'none', cursor: 'pointer' }}>
                      <X size={13} strokeWidth={1.5} style={{ color: 'rgba(140,123,107,0.5)' }} />
                    </button>
                  )}

                  {/* Autocomplete dropdown */}
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.ul
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }}
                        style={{
                          listStyle: 'none', margin: '4px 0 0', padding: 4,
                          position: 'absolute', left: 0, right: 0, top: '100%', zIndex: 30,
                          background: 'rgba(253,250,244,0.98)', border: '1px solid rgba(197,160,89,0.28)',
                          boxShadow: '0 12px 36px rgba(0,0,0,0.12)', maxHeight: 260, overflowY: 'auto',
                        }}
                      >
                        {suggestions.map((g, i) => (
                          <li
                            key={g.id}
                            onMouseEnter={() => setActiveIdx(i)}
                            onMouseDown={e => { e.preventDefault(); pick(g) }}
                            style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              gap: 12, padding: '12px 14px', cursor: 'pointer',
                              background: i === activeIdx ? 'rgba(197,160,89,0.10)' : 'transparent',
                            }}
                          >
                            <span style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 16, fontWeight: 300, color: '#1C1610' }}>
                              {g.full_name}
                            </span>
                            <span style={{
                              fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                              color: 'rgba(140,100,30,0.9)', padding: '3px 9px',
                              border: '1px solid rgba(197,160,89,0.3)', background: 'rgba(197,160,89,0.07)',
                              whiteSpace: 'nowrap', flexShrink: 0,
                            }}>
                              {g.table_id}
                            </span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>

                  {/* Seçilmiş qonaq konfirmasiyası */}
                  {selected && (
                    <p style={{ fontSize: 10, color: 'rgba(100,140,80,0.9)', marginTop: 6, letterSpacing: '0.06em' }}>
                      ✓ {selected.table_id} · {selected.full_name}
                    </p>
                  )}
                  {showNotFound && (
                    <p style={{ fontSize: 10, color: 'rgba(180,100,60,0.85)', marginTop: 6, letterSpacing: '0.04em' }}>
                      {L.not_in_list}
                    </p>
                  )}
                </div>
              ) : (
                /* Fallback: qonaq siyahısı yoxdursa sərbəst mətn */
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={L.namePh}
                  required
                  className="luxury-input border-b w-full text-center"
                />
              )}

              {/* ── 3 status düyməsi ── */}
              <div className="flex flex-col gap-2.5">
                {[
                  { val: 'yes',   label: L.yes,   activeClass: 'bg-gradient-to-br from-gold to-gold-dark text-white border-transparent', inactiveClass: 'bg-gold/[0.12] border-gold/50 text-gold-dark' },
                  { val: 'maybe', label: L.maybe, activeClass: 'bg-[#C5A059]/30 border-[#C5A059] text-[#8A6A20]',                        inactiveClass: 'bg-white/40 border-gold/25 text-espresso/70' },
                  { val: 'no',    label: L.no,    activeClass: 'bg-espresso/85 text-white border-transparent',                            inactiveClass: 'bg-white/40 border-gold/25 text-espresso' },
                ].map(({ val, label, activeClass, inactiveClass }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => chooseStatus(val)}
                    className={`min-h-[52px] px-7 font-semibold text-[13px] tracking-[0.18em] uppercase transition-all duration-200 border ${status === val ? activeClass : inactiveClass}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Əlavə qonaq ── */}
              <AnimatePresence>
                {status === 'yes' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="border border-beige-dark/50 bg-beige/40 p-7">
                      <p className="text-[10px] tracking-[0.22em] uppercase text-brown-muted mb-6 font-sans font-medium text-center">{L.plusq}</p>
                      <div className="flex items-center justify-center gap-8">
                        <button type="button" disabled={plusOne === 0} onClick={decPlusOne}
                          className="w-10 h-10 border border-beige-dark flex items-center justify-center text-brown-muted hover:border-gold hover:text-gold transition-all disabled:opacity-25">
                          <Minus size={13} strokeWidth={1.5} />
                        </button>
                        <span className="font-serif text-4xl text-ink font-light w-12 text-center tabular-nums">{plusOne}</span>
                        <button type="button" disabled={plusOne === maxExtraGuests} onClick={incPlusOne}
                          className="w-10 h-10 border border-beige-dark flex items-center justify-center text-brown-muted hover:border-gold hover:text-gold transition-all disabled:opacity-25">
                          <Plus size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={!canSubmit}
                className="btn-gold w-full min-h-[52px] flex items-center justify-center gap-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={12} strokeWidth={1.5} />
                {sending ? '...' : L.send}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

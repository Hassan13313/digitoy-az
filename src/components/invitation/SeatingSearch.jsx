import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, X } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import t from '../../data/translations'

function parseSeating(text) {
  if (!text) return []
  return text.split(';').map(e => e.trim()).filter(Boolean).map(entry => {
    const ci = entry.indexOf(':')
    if (ci === -1) return null
    const tablePart = entry.slice(0, ci).trim()
    const guests    = entry.slice(ci + 1).split(',').map(g => g.trim()).filter(Boolean)
    return { table: tablePart.replace(/[^0-9]/g, '') || tablePart, label: tablePart, guests }
  }).filter(Boolean)
}

function findGuest(tables, query) {
  if (!query.trim()) return null
  const q = query.toLowerCase().trim()
  for (const t of tables) {
    const match = t.guests.find(g => g.toLowerCase().includes(q))
    if (match) return { ...t, matched: match }
  }
  return undefined
}

export default function SeatingSearch({ seatingPlan, lang }) {
  const tr = t[lang]
  const [query,  setQuery]  = useState('')
  const [ref, visible] = useScrollReveal()
  const tables = parseSeating(seatingPlan)
  const result = query.length > 1 ? findGuest(tables, query) : null

  const LABELS = {
    az: { title: 'Masa Axtarışı', sub: 'Adınızı yazın, masanızı tapın', hint: 'Ad daxil edin…' },
    en: { title: 'Find Your Seat', sub: 'Type your name to find your table', hint: 'Enter your name…' },
    ru: { title: 'Поиск столика', sub: 'Введите имя, чтобы найти стол', hint: 'Введите имя…' },
  }
  const L = LABELS[lang] || LABELS.az

  if (!tables.length) return null

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
        <div className="relative mb-8">
          {/* Left icon */}
          <div style={{
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}>
            <Search size={15} strokeWidth={1.5} style={{ color: 'rgba(197,160,89,0.7)' }} />
          </div>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={L.hint}
            style={{
              width: '100%',
              background: 'rgba(253,250,244,0.85)',
              border: `1px solid ${query.length > 1 ? 'rgba(197,160,89,0.5)' : 'rgba(221,213,200,0.6)'}`,
              outline: 'none',
              padding: '18px 44px 18px 48px',
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontSize: 17,
              fontWeight: 300,
              color: '#1C1610',
              letterSpacing: '0.03em',
              transition: 'border-color 0.25s, box-shadow 0.25s',
              boxShadow: query.length > 1
                ? '0 0 0 3px rgba(197,160,89,0.08), 0 4px 16px rgba(0,0,0,0.06)'
                : '0 2px 8px rgba(0,0,0,0.04)',
            }}
          />
          {/* Clear button */}
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              }}
            >
              <X size={13} strokeWidth={1.5} style={{ color: 'rgba(140,123,107,0.5)' }} />
            </button>
          )}
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result === undefined && query.length > 1 && (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              style={{
                border: '1px solid rgba(221,213,200,0.5)',
                background: 'rgba(253,250,244,0.7)',
                padding: '28px 24px',
                textAlign: 'center',
              }}
            >
              <div style={{
                width: 40, height: 40, margin: '0 auto 14px',
                border: '1px solid rgba(221,213,200,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Search size={16} strokeWidth={1} style={{ color: 'rgba(140,123,107,0.45)' }} />
              </div>
              <p style={{
                fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
                fontSize: 16, fontWeight: 300, color: 'rgba(80,68,58,0.7)',
              }}>
                {tr.inv_notfound}
              </p>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            >
              {/* Result card */}
              <div style={{
                background: 'linear-gradient(150deg, #FDFAF4 0%, #F8F3E8 100%)',
                border: '1px solid rgba(197,160,89,0.28)',
                borderLeft: '2.5px solid rgba(197,160,89,0.8)',
                padding: '28px 28px 24px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.07), 0 2px 8px rgba(197,160,89,0.08)',
              }}>
                {/* Table number badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 52, height: 52, flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(197,160,89,0.15), rgba(197,160,89,0.05))',
                    border: '1px solid rgba(197,160,89,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%',
                    boxShadow: '0 2px 12px rgba(197,160,89,0.15)',
                  }}>
                    <span style={{
                      fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
                      fontSize: 22, fontWeight: 400, color: 'rgba(197,160,89,0.95)',
                      lineHeight: 1,
                    }}>
                      {result.table}
                    </span>
                  </div>
                  <div>
                    <p style={{
                      fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase',
                      color: 'rgba(140,123,107,0.7)', marginBottom: 4,
                      fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 500,
                    }}>
                      {tr.inv_table_found}
                    </p>
                    <p style={{
                      fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
                      fontSize: 20, fontWeight: 300, color: '#1C1610', lineHeight: 1.1,
                    }}>
                      {result.label}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div style={{
                  height: 1, marginBottom: 18,
                  background: 'linear-gradient(to right, rgba(197,160,89,0.4), rgba(197,160,89,0.12))',
                }} />

                {/* Tablemates label */}
                <p style={{
                  fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase',
                  color: 'rgba(140,123,107,0.65)', marginBottom: 12,
                  fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 500,
                }}>
                  {tr.inv_tablemates}
                </p>

                {/* Guest chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.guests.map(g => {
                    const isMatch = g.toLowerCase().includes(query.toLowerCase())
                    return (
                      <motion.span
                        key={g}
                        initial={isMatch ? { scale: 0.85 } : {}}
                        animate={isMatch ? { scale: 1 } : {}}
                        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                        style={{
                          padding: '7px 14px',
                          border: `1px solid ${isMatch ? 'rgba(197,160,89,0.7)' : 'rgba(221,213,200,0.6)'}`,
                          background: isMatch
                            ? 'linear-gradient(135deg, rgba(197,160,89,0.15), rgba(197,160,89,0.06))'
                            : 'rgba(253,250,244,0.6)',
                          fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
                          fontSize: 14, fontWeight: isMatch ? 400 : 300,
                          color: isMatch ? 'rgba(140,100,30,0.95)' : 'rgba(80,68,58,0.75)',
                          letterSpacing: '0.02em',
                          boxShadow: isMatch ? '0 2px 8px rgba(197,160,89,0.12)' : 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        {g}
                      </motion.span>
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

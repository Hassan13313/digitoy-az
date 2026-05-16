import { useState } from 'react'
import { Search, Users } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import t from '../../data/translations'

function parseSeating(text) {
  if (!text) return []
  return text
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const colonIdx = entry.indexOf(':')
      if (colonIdx === -1) return null
      const tablePart = entry.slice(0, colonIdx).trim()
      const guestsPart = entry.slice(colonIdx + 1).trim()
      const tableNum = tablePart.replace(/[^0-9]/g, '') || tablePart
      const guests = guestsPart.split(',').map((g) => g.trim()).filter(Boolean)
      return { table: tableNum || tablePart, label: tablePart, guests }
    })
    .filter(Boolean)
}

function findGuest(tables, query) {
  if (!query.trim()) return null
  const q = query.toLowerCase().trim()
  for (const t of tables) {
    const match = t.guests.find((g) => g.toLowerCase().includes(q))
    if (match) return { ...t, matched: match }
  }
  return undefined
}

export default function SeatingSearch({ seatingPlan, lang }) {
  const tr = t[lang]
  const [query, setQuery] = useState('')
  const [ref, visible] = useScrollReveal()
  const tables = parseSeating(seatingPlan)
  const result = query.length > 1 ? findGuest(tables, query) : null

  return (
    <section className="py-20 px-6 bg-beige">
      <div
        ref={ref}
        className={`max-w-lg mx-auto reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.25em] uppercase text-gold mb-2">Seating</p>
          <h2 className="font-serif text-2xl text-ink font-light">{tr.inv_seating}</h2>
          <div className="gold-divider mt-4 max-w-xs mx-auto" />
        </div>

        {tables.length === 0 ? (
          <p className="text-center text-brown-muted text-sm">—</p>
        ) : (
          <>
            {/* Search input */}
            <div className="relative mb-6">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-muted/60" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tr.inv_search_placeholder}
                className="w-full border border-beige-dark bg-cream text-ink text-sm pl-11 pr-4 py-4 focus:outline-none focus:border-gold transition-colors duration-200 placeholder:text-brown-muted/50"
              />
            </div>

            {/* Result */}
            {result === undefined && query.length > 1 && (
              <div className="border border-red-100 bg-red-50 p-5 text-center">
                <p className="text-sm text-red-400">{tr.inv_notfound}</p>
              </div>
            )}

            {result && (
              <div className="border border-gold/40 bg-cream p-6 animate-fade-up">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gold flex items-center justify-center">
                    <Users size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-brown-muted">{tr.inv_table_found}</p>
                    <p className="font-serif text-lg text-gold">
                      {tr.inv_table} {result.table}
                    </p>
                  </div>
                </div>
                <div className="gold-divider mb-4" />
                <p className="text-[10px] tracking-[0.15em] uppercase text-brown-muted mb-3">{tr.inv_tablemates}</p>
                <div className="flex flex-wrap gap-2">
                  {result.guests.map((g) => (
                    <span
                      key={g}
                      className={`px-3 py-1.5 text-xs border ${
                        g.toLowerCase().includes(query.toLowerCase())
                          ? 'bg-gold text-white border-gold'
                          : 'bg-beige border-beige-dark text-ink'
                      }`}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

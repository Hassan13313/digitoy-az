import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Heart, Diamond, Cake, Briefcase, Sparkles,
  ChevronRight, ChevronLeft, Check, Crown, Shirt, Calendar, User, MapPin, Search,
  Download, QrCode, Archive, Minus, Plus, X,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { DRESS_CODE_PALETTES, EVENT_TYPES, WHATSAPP_NUMBER } from '../../data/constants'
import { PACKAGE_DEFS, getLockedSteps } from '../../data/packages'
import { buildWhatsAppUrl } from '../../utils/whatsappOrder'
import { formatFullDateByLang } from '../../utils/dateFormat'
import t from '../../data/translations'

const EVENT_ICONS = { toy: Heart, nishan: Diamond, birthday: Cake, corporate: Briefcase, other: Sparkles }
const COUPLE_TYPES = ['toy', 'nishan']
const CORP_TYPES   = ['corporate', 'other']

/* ── Çoxdilli təqvim massivləri ── */
const calendarTranslations = {
  az: {
    weekDays: ['B.', 'B.E.', 'Ç.A.', 'Ç.', 'C.A.', 'C.', 'Ş.'],
    months: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktabr', 'Noyabr', 'Dekabr'],
  },
  ru: {
    weekDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  },
  en: {
    weekDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  },
}

/* ── Məkan axtarışı (Google Maps + Nominatim fallback) ── */
const VENUE_HINTS = {
  az: '*Məkan adlarını Azərbaycan hərfləri ilə və ya Google-da axtardığınız rəsmi şəkildə yazmağınız tövsiyə olunur.',
  en: '*It is recommended to type venue names with Azerbaijani characters or exactly as they appear on Google Search.',
  ru: '*Рекомендуется вводить названия мест на азербайджанской латинице или так, как они указаны в поиске Google.',
}

/* AZ hərflərini latına çevirir — hər iki variantla axtarış üçün */
function latinize(s) {
  const M = { ə:'e',Ə:'E',ş:'s',Ş:'S',ç:'c',Ç:'C',ğ:'g',Ğ:'G',ö:'o',Ö:'O',ü:'u',Ü:'U',ı:'i',İ:'I' }
  return s.split('').map(c => M[c] ?? c).join('')
}

/* ── Google Maps sabitləri ── */
const MAPS_KEY    = import.meta.env.VITE_GOOGLE_MAPS_KEY || ''
const BAKU_CENTER = { lat: 40.4093, lng: 49.8671 }
const MAP_STYLES  = [
  { elementType: 'geometry',                                         stylers: [{ color: '#f5edd8' }] },
  { elementType: 'labels.text.fill',                                 stylers: [{ color: '#8c7b6b' }] },
  { elementType: 'labels.text.stroke',                               stylers: [{ color: '#fdfaf4' }] },
  { featureType: 'water',          elementType: 'geometry',          stylers: [{ color: '#c8d5d5' }] },
  { featureType: 'water',          elementType: 'labels.text.fill',  stylers: [{ color: '#7a9a9a' }] },
  { featureType: 'road',           elementType: 'geometry',          stylers: [{ color: '#ede3cc' }] },
  { featureType: 'road',           elementType: 'geometry.stroke',   stylers: [{ color: '#d4b896' }] },
  { featureType: 'road.highway',   elementType: 'geometry',          stylers: [{ color: '#c8b07a' }] },
  { featureType: 'poi',            elementType: 'geometry',          stylers: [{ color: '#e8dcc8' }] },
  { featureType: 'poi.park',       elementType: 'geometry',          stylers: [{ color: '#d4e0c8' }] },
  { featureType: 'transit',        elementType: 'geometry',          stylers: [{ color: '#ddd5c4' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke',   stylers: [{ color: '#c5a059' }] },
]

/* Singleton loader — bir dəfə yüklənir */
let _mapsP = null
const getMaps = () => {
  if (_mapsP) return _mapsP
  if (window.google?.maps?.places) return (_mapsP = Promise.resolve())
  if (!MAPS_KEY) return Promise.reject(new Error('no-key'))
  _mapsP = import('@googlemaps/js-api-loader')
    .then(({ Loader }) => new Loader({ apiKey: MAPS_KEY, version: 'weekly', libraries: ['places'], authReferrerPolicy: 'origin' }).load())
  return _mapsP
}

function VenueSearchInput({ value, onSelect, lang, tr }) {
  const [query,     setQuery]     = useState(value || '')
  const [preds,     setPreds]     = useState([])
  const [loading,   setLoading]   = useState(false)
  const [open,      setOpen]      = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [mapsReady, setMapsReady] = useState(false)
  const [mapsError, setMapsError] = useState(null)

  const wrapRef      = useRef(null)
  const mapDivRef    = useRef(null)
  const mapRef       = useRef(null)
  const markerRef    = useRef(null)
  const svcRef       = useRef(null)   /* AutocompleteService */
  const geocRef      = useRef(null)   /* Geocoder */
  const debRef       = useRef(null)
  const onSelectRef  = useRef(onSelect)
  useEffect(() => { onSelectRef.current = onSelect }, [onSelect])

  /* ── Google Maps yüklə ── */
  useEffect(() => {
    getMaps()
      .then(() => {
        svcRef.current  = new window.google.maps.places.AutocompleteService()
        geocRef.current = new window.google.maps.Geocoder()
        setMapsReady(true)
        setMapsError(null)
      })
      .catch((err) => {
        const msg = err?.message || String(err)
        console.error('[Digitoy Maps yükləmə xətası]', msg)
        setMapsError(msg)
      })
  }, [])

  /* ── Xəritəni mount et ── */
  const placeMarker = useCallback(({ lat, lng }) => {
    if (!mapRef.current) return
    markerRef.current?.setMap(null)
    markerRef.current = new window.google.maps.Marker({
      position: { lat, lng }, map: mapRef.current,
      icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 9, fillColor: '#C5A059', fillOpacity: 1, strokeColor: '#fdfaf4', strokeWeight: 2.5 },
    })
    mapRef.current.panTo({ lat, lng }); mapRef.current.setZoom(15)
  }, [])

  useEffect(() => {
    if (!mapsReady || !mapDivRef.current || mapRef.current) return
    const map = new window.google.maps.Map(mapDivRef.current, {
      center: BAKU_CENTER, zoom: 11, styles: MAP_STYLES,
      zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: false,
    })
    mapRef.current = map
    map.addListener('click', ({ latLng }) => {
      const lat = latLng.lat(), lng = latLng.lng()
      placeMarker({ lat, lng })
      geocRef.current?.geocode({ location: { lat, lng } }, (res, st) => {
        if (st !== 'OK' || !res[0]) return
        const name = res[0].address_components?.[0]?.long_name || res[0].formatted_address.split(',')[0]
        setQuery(name)
        onSelectRef.current({ venueName: name, googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, wazeUrl: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes` })
        setSuccess(true); setTimeout(() => setSuccess(false), 4000)
      })
    })
  }, [mapsReady, placeMarker])

  useEffect(() => { setQuery(value || '') }, [value])
  useEffect(() => {
    const fn = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn); return () => document.removeEventListener('mousedown', fn)
  }, [])

  /* ── Google Places axtarışı (AZ-first + fallback) ── */
  const searchGoogle = useCallback((q) => {
    const svc    = svcRef.current
    const latinQ = latinize(q)
    const terms  = q === latinQ ? [q] : [q, latinQ]
    const ask    = (t, opts) => new Promise(res => svc.getPlacePredictions({ input: t, ...opts }, p => res(p || [])))
    setLoading(true)
    ;(async () => {
      try {
        for (const t of terms) {
          const p = await ask(t, { componentRestrictions: { country: 'az' } })
          if (p.length) { setPreds(p.slice(0, 6)); setOpen(true); return }
        }
        const p = await ask(terms[0], {})
        setPreds(p.slice(0, 6)); setOpen(p.length > 0)
      } finally { setLoading(false) }
    })()
  }, [])

  /* ── Nominatim fallback (açar yoxdursa) ── */
  const searchNominatim = useCallback((q) => {
    const latinQ = latinize(q)
    const terms  = q === latinQ ? [q] : [q, latinQ]
    const hdrs   = { 'Accept-Language': lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'az,en' }
    const BASE   = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6'
    const fetch_ = extra => Promise.all(
      terms.map(t => fetch(`${BASE}${extra}&q=${encodeURIComponent(t)}`, { headers: hdrs }).then(r => r.json()))
    ).then(arrs => { const s = new Set(); return arrs.flat().filter(r => { if (s.has(r.place_id)) return false; s.add(r.place_id); return true }) })
    const toPred = n => ({ place_id: n.place_id, description: n.display_name, structured_formatting: { main_text: n.display_name.split(',')[0] }, _nom: n })
    setLoading(true)
    ;(async () => {
      try {
        const az = await fetch_('&countrycodes=az')
        if (az.length) { setPreds(az.slice(0, 6).map(toPred)); setOpen(true); return }
        const gl = await fetch_('')
        setPreds(gl.slice(0, 6).map(toPred)); setOpen(gl.length > 0)
      } catch { setPreds([]) } finally { setLoading(false) }
    })()
  }, [lang])

  /* ── Prediction seçimi ── */
  const handleSelectPred = useCallback((pred) => {
    setOpen(false)
    if (pred._nom) {
      const { lat, lon, display_name } = pred._nom
      const name = display_name.split(',')[0].trim()
      setQuery(name); setPreds([])
      onSelectRef.current({ venueName: name, googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, wazeUrl: `https://waze.com/ul?ll=${lat},${lon}&navigate=yes` })
      setSuccess(true); setTimeout(() => setSuccess(false), 4000)
      return
    }
    geocRef.current?.geocode({ placeId: pred.place_id }, (res, st) => {
      if (st !== 'OK' || !res[0]) return
      const lat  = res[0].geometry.location.lat()
      const lng  = res[0].geometry.location.lng()
      const name = pred.structured_formatting?.main_text || pred.description.split(',')[0]
      setQuery(name); placeMarker({ lat, lng })
      onSelectRef.current({ venueName: name, googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${pred.place_id}`, wazeUrl: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes` })
      setSuccess(true); setTimeout(() => setSuccess(false), 4000)
    })
  }, [placeMarker])

  const handleChange = (e) => {
    const q = e.target.value
    setQuery(q); setSuccess(false)
    clearTimeout(debRef.current)
    if (q.trim().length < 3) { setPreds([]); setOpen(false); return }
    debRef.current = setTimeout(() => mapsReady ? searchGoogle(q) : searchNominatim(q), 300)
  }

  return (
    <div ref={wrapRef} className="relative">
      {/* ── Input (mövcud premium dizayn qorunur) ── */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/50 pointer-events-none" />
        {loading && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border border-gold/40 border-t-gold/80 rounded-full animate-spin" />}
        <input
          type="text" value={query} onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), mapsReady ? searchGoogle(query) : searchNominatim(query))}
          placeholder={tr.venue_search_placeholder}
          className="w-full pl-9 pr-10 py-3 bg-[#1a1a1a]/60 border border-gold/20 text-white/90 text-sm placeholder-white/25 rounded-none focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <p className="text-xs text-amber-500/70 mt-1 block font-sans">{VENUE_HINTS[lang] || VENUE_HINTS.az}</p>

      {/* ── Predictions dropdown ── */}
      {open && preds.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-[110] backdrop-blur-md bg-[#1a1a1a]/90 border border-gold/20 shadow-2xl max-h-64 overflow-y-auto">
          {preds.map(pred => (
            <button key={pred.place_id} type="button" onClick={() => handleSelectPred(pred)}
              className="w-full text-left px-4 py-3 hover:bg-gold/10 border-b border-white/5 last:border-0 transition-colors">
              <p className="text-white/90 text-sm leading-snug">{pred.structured_formatting?.main_text || pred.description.split(',')[0]}</p>
              <p className="text-white/35 text-[10px] mt-0.5 truncate">{pred.description}</p>
            </button>
          ))}
        </div>
      )}
      {open && preds.length === 0 && !loading && query.trim().length >= 3 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-[110] backdrop-blur-md bg-[#1a1a1a]/90 border border-gold/20 px-4 py-3">
          <p className="text-white/40 text-sm">{tr.venue_search_no_results}</p>
        </div>
      )}
      {success && (
        <p className="mt-2 text-[11px] tracking-[0.12em] text-gold font-medium flex items-center gap-1.5">
          <MapPin size={11} /> {tr.venue_search_success}
        </p>
      )}

      {/* ── Google Map (yalnız VITE_GOOGLE_MAPS_KEY mövcuddursa) ── */}
      {MAPS_KEY && (
        <div style={{ marginTop: 16, border: '1px solid rgba(197,160,89,0.22)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 2, background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5) 40%, rgba(197,160,89,0.7) 50%, rgba(197,160,89,0.5) 60%, transparent)' }} />

          {/* Xəta vəziyyəti */}
          {mapsError && (
            <div style={{ height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(26,17,5,0.55)', padding: '0 16px', textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: 'rgba(197,160,89,0.85)', fontFamily: '"Inter",system-ui,sans-serif', letterSpacing: '0.04em' }}>
                Google Maps açıla bilmir — API açarı məhdudlaşdırılıb.
              </p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: '"Inter",system-ui,sans-serif' }}>
                Google Cloud Console → Credentials → HTTP referrers → localhost:5173/* əlavə edin
              </p>
              <p style={{ fontSize: 10, color: 'rgba(197,160,89,0.6)', fontFamily: '"Inter",system-ui,sans-serif' }}>
                Axtarış hələ işləyir (OpenStreetMap vasitəsilə)
              </p>
            </div>
          )}

          {/* Yüklənir */}
          {!mapsReady && !mapsError && (
            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,237,216,0.4)' }}>
              <div className="w-5 h-5 border border-gold/30 border-t-gold/80 rounded-full animate-spin" />
            </div>
          )}

          <div ref={mapDivRef} style={{ height: mapsReady ? 240 : 0, width: '100%' }} />
          {mapsReady && (
            <p style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(197,160,89,0.75)', fontFamily: '"Inter",system-ui,sans-serif', background: 'rgba(253,250,244,0.82)', backdropFilter: 'blur(4px)', padding: '2px 10px', pointerEvents: 'none', zIndex: 1, whiteSpace: 'nowrap' }}>
              Xəritədə nöqtəyə vurun — ünvan avtomatik yazılacaq
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Proqram Addımı Redaktoru ── */
const PROGRAM_ICONS = ['🥂','💍','🎵','💃','🎂','🎤','❤️','🤵','🎆','☕']

function TimeInput({ value, onChange, onComplete, placeholder, className }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    let display = raw
    if (raw.length >= 3) display = raw.slice(0, 2) + ':' + raw.slice(2)
    onChange(display)
    if (raw.length === 4) onComplete?.()
  }
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      maxLength={5}
    />
  )
}

function IconPickerBtn({ value, onSelect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-10 h-10 flex items-center justify-center border border-amber-600/30 bg-white hover:bg-neutral-50 text-xl rounded transition-all"
        title="İkon seç"
      >
        {value || '✨'}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-[120] bg-white border border-neutral-200 rounded-lg shadow-xl w-48 p-2 grid grid-cols-4 gap-2">
          {PROGRAM_ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => { onSelect(ic); setOpen(false) }}
              className={`flex items-center justify-center text-2xl rounded p-1 hover:bg-neutral-100 transition-colors ${value === ic ? 'bg-amber-100' : ''}`}
            >
              {ic}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ProgramStepEditor({ rows, onChange, tr }) {
  const activityRefs = useRef([])

  const update = (i, field, val) => {
    const updated = [...rows]
    updated[i] = { ...updated[i], [field]: val }
    onChange(updated)
  }

  const addRow = () => onChange([...rows, { time: '', icon: '', activity: '' }])

  const removeRow = (i) => onChange(rows.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-neutral-50 border border-neutral-100 rounded-lg p-3 sm:p-2.5">
            {/* Mobil: saat + (sağda) ikon+sil düymələri */}
            <div className="flex items-center gap-2">
              <TimeInput
                value={row.time}
                onChange={(v) => update(i, 'time', v)}
                onComplete={() => activityRefs.current[i]?.focus()}
                placeholder="19:00"
                className="w-[84px] sm:w-[90px] flex-shrink-0 text-center p-2.5 border border-neutral-300 rounded bg-white font-mono text-sm focus:outline-none focus:border-gold/60 transition-colors"
              />
              {/* Mobil-da sağa keç */}
              <div className="flex items-center gap-1 ml-auto sm:hidden">
                <IconPickerBtn value={row.icon} onSelect={(ic) => update(i, 'icon', ic)} />
                <button type="button" onClick={() => removeRow(i)} className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors rounded touch-manipulation" aria-label="Sil">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </div>
            {/* Fəaliyyət input — mobil-da tam en */}
            <input
              ref={(el) => (activityRefs.current[i] = el)}
              type="text"
              value={row.activity}
              onChange={(e) => update(i, 'activity', e.target.value)}
              placeholder={tr.program_step_activity_placeholder}
              className="w-full sm:flex-1 sm:min-w-0 p-2.5 border border-neutral-300 rounded bg-white text-sm focus:outline-none focus:border-gold/60 transition-colors"
            />
            {/* Desktop-da ikon+sil */}
            <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
              <IconPickerBtn value={row.icon} onSelect={(ic) => update(i, 'icon', ic)} />
              <button type="button" onClick={() => removeRow(i)} className="flex-shrink-0 p-2 text-neutral-400 hover:text-red-500 transition-colors rounded" aria-label="Sil">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="text-[11px] tracking-[0.16em] uppercase text-gold/80 hover:text-gold border border-gold/25 hover:border-gold/50 px-4 py-2.5 transition-all duration-200 flex items-center gap-2"
      >
        {tr.program_add_row}
      </button>
      <p className="text-[11px] text-brown-muted/60 font-light tracking-wide">{tr.program_hint}</p>
    </div>
  )
}

/* ── Köməkçi: YYYY-MM-DD → { year, month(0-based), day } ── */
function parseIso(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  return { year: y, month: m - 1, day: d }
}

/* ── Köməkçi: { year, month, day } → YYYY-MM-DD ── */
function toIso(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/* ══════════════════════════════════════════════════
   Özəl Azərbaycan Təqvim Komponenti
══════════════════════════════════════════════════ */
function AzCalendar({ value, onChange, hasError, lang = 'az' }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const today    = new Date()
  const selected = parseIso(value)
  const calLang  = calendarTranslations[lang] || calendarTranslations.az

  /* displayDate: GG.AA.YYYY — həm başlanğıc dəyər, həm sinxron */
  const isoToDisplay = (iso) => {
    const p = parseIso(iso)
    if (!p) return ''
    return `${String(p.day).padStart(2, '0')}.${String(p.month + 1).padStart(2, '0')}.${p.year}`
  }

  const [inputValue, setInputValue] = useState(isoToDisplay(value))
  const [viewYear,   setViewYear]   = useState(selected?.year  ?? today.getFullYear())
  const [viewMonth,  setViewMonth]  = useState(selected?.month ?? today.getMonth())

  /* xarici value dəyişəndə inputValue-nu sinxronla (məs: ay seçimindən) */
  useEffect(() => {
    setInputValue(isoToDisplay(value))
  }, [value])

  /* kənar klik ilə bağla */
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  /* əl ilə yazma — avtomatik nöqtə maskası */
  const handleInputChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '')
    let masked = raw
    if (raw.length > 2 && raw.length <= 4) {
      masked = `${raw.slice(0, 2)}.${raw.slice(2)}`
    } else if (raw.length > 4) {
      masked = `${raw.slice(0, 2)}.${raw.slice(2, 4)}.${raw.slice(4, 8)}`
    }
    masked = masked.slice(0, 10)
    setInputValue(masked)

    if (masked.length === 10) {
      const [dd, mm, yyyy] = masked.split('.')
      const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
      if (!isNaN(parsed.getTime())) {
        const iso = toIso(Number(yyyy), Number(mm) - 1, Number(dd))
        onChange(iso)
        setViewYear(Number(yyyy))
        setViewMonth(Number(mm) - 1)
      }
    }
  }

  const handleDay = (e, day) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(toIso(viewYear, viewMonth, day))
    setOpen(false)
  }

  const isSelected = (day) =>
    selected && selected.year === viewYear && selected.month === viewMonth && selected.day === day

  const isToday = (day) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day

  return (
    <div ref={wrapRef} className="relative">
      {/* yazıla bilən + ikonlu trigger */}
      <div className={`flex items-center border-0 border-b ${hasError ? 'border-b-red-300' : 'border-beige-dark'} focus-within:border-gold transition-colors duration-300`}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="GG.AA.YYYY"
          maxLength={10}
          className="flex-1 bg-transparent text-ink text-sm py-3 focus:outline-none placeholder:text-brown-muted/40"
        />
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="pl-2 py-3 text-brown-muted/50 hover:text-gold transition-colors duration-200"
        >
          <Calendar size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* canlı tarix mətni */}
      {value && (
        <p className="mt-2 text-[10px] tracking-[0.14em] text-gold/80 font-light">
          {formatFullDateByLang(value, lang)}
        </p>
      )}

      {/* təqvim paneli — absolute, z-[9999] */}
      {open && (
        <div
          className="absolute left-0 top-full mt-1 w-full max-w-[340px] bg-[#1a1a1a]/95 backdrop-blur-md border border-amber-500/20 rounded-xl p-4 shadow-2xl"
          style={{ zIndex: 9999 }}
        >
          {/* başlıq */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center text-amber-400/70 hover:text-amber-400 transition-colors rounded-full hover:bg-white/5">
              <ChevronLeft size={14} strokeWidth={1.5} />
            </button>
            <span className="text-[11px] tracking-[0.22em] uppercase text-amber-200/80 font-medium">
              {calLang.months[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center text-amber-400/70 hover:text-amber-400 transition-colors rounded-full hover:bg-white/5">
              <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* həftə günləri */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {calLang.weekDays.map((d) => (
              <div key={d} className="text-center text-[9px] text-amber-500/50 font-medium tracking-wide py-1">{d}</div>
            ))}
          </div>

          {/* günlər */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                type="button"
                onClick={(e) => handleDay(e, day)}
                className={`h-8 w-full flex items-center justify-center text-[11px] rounded-md transition-all duration-150 font-light ${
                  isSelected(day)
                    ? 'bg-amber-500 text-white font-medium'
                    : isToday(day)
                    ? 'border border-amber-500/40 text-amber-400'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <p className="mt-3 text-center text-[9px] text-amber-500/30 tracking-widest uppercase">
            {calLang.months[viewMonth]} {viewYear}
          </p>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════
   24 Saatlıq Saat — yazıla bilən mətn maskası
══════════════════════════════════════════════════ */
function TimeInputAz({ value, onChange }) {
  const [timeInputValue, setTimeInputValue] = useState(value || '')

  useEffect(() => {
    setTimeInputValue(value || '')
  }, [value])

  const handleTimeInputChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '')

    let masked = raw
    if (raw.length > 2) {
      let hours   = raw.slice(0, 2)
      let minutes = raw.slice(2, 4)
      if (parseInt(hours,   10) > 23) hours   = '23'
      if (parseInt(minutes, 10) > 59) minutes = '59'
      masked = `${hours}:${minutes}`
    }

    const final = masked.slice(0, 5)
    setTimeInputValue(final)

    if (final.length === 5) onChange(final)
  }

  return (
    <div className={`flex items-center border-0 border-b border-beige-dark focus-within:border-gold transition-colors duration-300`}>
      <input
        type="text"
        value={timeInputValue}
        onChange={handleTimeInputChange}
        placeholder="19:00"
        maxLength={5}
        className="flex-1 bg-transparent text-ink text-sm py-3 focus:outline-none placeholder:text-brown-muted/40"
      />
    </div>
  )
}

/* ══════════════════════════════════════════════════
   Sadə köməkçi komponentlər
══════════════════════════════════════════════════ */
function Label({ children, required }) {
  return (
    <label className="block text-[10px] tracking-[0.22em] uppercase text-brown-muted mb-3 font-medium">
      {children} {required && <span className="text-gold">*</span>}
    </label>
  )
}

function Input({ className = '', ...props }) {
  return <input {...props} className={`luxury-input ${className}`} />
}

function Textarea({ ...props }) {
  return (
    <textarea
      {...props}
      rows={5}
      className="w-full border-0 border-b border-beige-dark bg-transparent text-ink text-sm px-0 py-3 focus:outline-none focus:border-gold transition-colors duration-300 placeholder:text-brown-muted/40 resize-none rounded-none"
    />
  )
}

/* ══════════════════════════════════════════════════
   Foto Paylaşım Addımı (Step 6) — Builder
   Müştəriyə: QR önizlənməsi + link
   Admin: + Masa Kartını HD SVG Endir düyməsi
══════════════════════════════════════════════════ */
function GalleryAdminStep({ data, isCouple, isCorp, isAdmin = false }) {
  const qrExportRef = useRef()
  const [copied, setCopied] = useState(false)

  let slug = ''
  if (isCouple) slug = `${toSlug(data.brideName || '')}-ve-${toSlug(data.groomName || '')}`
  else if (isCorp) slug = toSlug(data.eventName || 'tedbir')
  else slug = toSlug(data.brideName || 'davetname')

  const photoShareUrl = slug
    ? `${window.location.origin}/invite/${slug}/foto`
    : `${window.location.origin}/invite/davetname/foto`

  const galeryaIdareUrl = slug
    ? `${window.location.origin}/invite/${slug}/qalereya-idare`
    : `${window.location.origin}/invite/davetname/qalereya-idare`

  const copyGaleryaLink = useCallback(() => {
    navigator.clipboard.writeText(galeryaIdareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }).catch(() => {
      /* fallback */
      const el = document.createElement('textarea')
      el.value = galeryaIdareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }, [galeryaIdareUrl])

  const downloadQR = useCallback(() => {
    /* XML-unsafe simvolları escape et — & < > " ' */
    const xmlEsc = (s) => String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')

    const names = isCouple
      ? xmlEsc(`${data.brideName || ''} & ${data.groomName || ''}`)
      : xmlEsc(data.brideName || data.eventName || 'Digitoy')

    const safeDate = xmlEsc(data.date || '')
    const safeUrl  = xmlEsc(photoShareUrl)

    /* Gizli QR SVG-dən həm innerHTML, həm də orijinal viewBox-u oxu */
    const qrSvgEl   = qrExportRef.current?.querySelector('svg')
    const qrInner   = qrSvgEl ? qrSvgEl.innerHTML : ''
    const qrViewBox = qrSvgEl?.getAttribute('viewBox') || '0 0 150 150'

    /*
      A5 portrait: 420×595 px (72 dpi canvas — full-bleed, mətbəə üçün kənar boşluq yoxdur)
      QR: hidden element 150×150 → scale(1.8) = 270×270, x=75 y=162
    */
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg"
  width="420" height="595"
  viewBox="0 0 420 595"
  style="display:block;margin:0;padding:0;">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FDFAF4"/>
      <stop offset="100%" stop-color="#EDE3CC"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="30%" stop-color="#C5A059"/>
      <stop offset="70%" stop-color="#C5A059"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
  </defs>

  <!-- Arxa fon -->
  <rect width="420" height="595" fill="url(#bg)"/>

  <!-- Xarici çərçivə -->
  <rect x="1" y="1" width="418" height="593" fill="none" stroke="rgba(197,160,89,0.5)" stroke-width="1.2"/>
  <!-- İçəri çərçivə -->
  <rect x="12" y="12" width="396" height="571" fill="none" stroke="rgba(197,160,89,0.18)" stroke-width="0.6"/>

  <!-- Künc ornamentləri -->
  <path d="M24,24 L50,24 M24,24 L24,50"   stroke="rgba(197,160,89,0.72)" stroke-width="1.8" fill="none"/>
  <path d="M396,24 L370,24 M396,24 L396,50" stroke="rgba(197,160,89,0.72)" stroke-width="1.8" fill="none"/>
  <path d="M24,571 L50,571 M24,571 L24,545" stroke="rgba(197,160,89,0.72)" stroke-width="1.8" fill="none"/>
  <path d="M396,571 L370,571 M396,571 L396,545" stroke="rgba(197,160,89,0.72)" stroke-width="1.8" fill="none"/>

  <!-- ─── BAŞLIQ BÖLMƏSİ (y 36–158) ─── -->
  <text x="210" y="56"  text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="rgba(197,160,89,0.9)" letter-spacing="5">FOTO · PAYLAŞIM</text>
  <rect x="105" y="65" width="210" height="0.8" fill="url(#gold)"/>

  <text x="210" y="106" text-anchor="middle" font-family="Georgia,serif" font-size="26" font-weight="300" fill="#1A140C">${names}</text>
  <text x="210" y="130" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="rgba(140,123,107,0.7)" letter-spacing="2">${safeDate}</text>

  <rect x="155" y="145" width="110" height="0.6" fill="url(#gold)"/>

  <!-- ─── QR BÖLMƏ (y 162–432, ağ kvadrat 270×270) ─── -->
  <!-- QR ağ fon -->
  <rect x="75" y="162" width="270" height="270" fill="white" stroke="rgba(197,160,89,0.28)" stroke-width="1"/>
  <!-- QR künc ornamentləri -->
  <path d="M79,166 L93,166 M79,166 L79,180" stroke="rgba(197,160,89,0.55)" stroke-width="1.2" fill="none"/>
  <path d="M341,166 L327,166 M341,166 L341,180" stroke="rgba(197,160,89,0.55)" stroke-width="1.2" fill="none"/>
  <path d="M79,428 L93,428 M79,428 L79,414" stroke="rgba(197,160,89,0.55)" stroke-width="1.2" fill="none"/>
  <path d="M341,428 L327,428 M341,428 L341,414" stroke="rgba(197,160,89,0.55)" stroke-width="1.2" fill="none"/>
  <!-- Nested SVG: qrViewBox → 270×270 px, brauzer koordinatları özü miqyaslandırır -->
  <svg x="75" y="162" width="270" height="270" viewBox="${qrViewBox}">
    ${qrInner}
  </svg>

  <!-- ─── FOOTER BÖLMƏSİ (y 445–580) ─── -->
  <rect x="100" y="448" width="220" height="0.6" fill="url(#gold)"/>

  <text x="210" y="472" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="rgba(140,123,107,0.72)" letter-spacing="3">TOY ŞƏKİLLƏRİNİZİ PAYLAŞIN</text>
  <text x="210" y="496" text-anchor="middle" font-family="Georgia,serif" font-size="8"  fill="rgba(140,123,107,0.42)" letter-spacing="0.5">${safeUrl}</text>

  <rect x="100" y="510" width="220" height="0.6" fill="url(#gold)"/>

  <text x="210" y="556" text-anchor="middle" font-family="Georgia,serif" font-size="9"  fill="rgba(197,160,89,0.7)" letter-spacing="2">digitoy.az</text>
</svg>`

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `masa-qr-${slug || 'digitoy'}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }, [data, slug, photoShareUrl, isCouple, isCorp])

  const BLOCK_STYLE = {
    border: '1px solid rgba(197,160,89,0.2)',
    background: 'linear-gradient(150deg, #FDFAF4 0%, #F8F3E8 100%)',
    padding: '28px',
    position: 'relative',
  }

  return (
    <div className="space-y-0">
      {/* Gizli export QR — 150×150, tam vector, DOM-da mövcuddur */}
      <div ref={qrExportRef} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: -9999, left: -9999 }}>
        <QRCodeSVG value={photoShareUrl} size={150} bgColor="white" fgColor="#1A140C" level="M" />
      </div>

      <div style={BLOCK_STYLE}>
        {/* Üst qızıl xətt ornament */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.7) 40%, rgba(197,160,89,0.9) 50%, rgba(197,160,89,0.7) 60%, transparent)',
        }} />

        {/* Başlıq */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 38, height: 38, flexShrink: 0,
            border: '1px solid rgba(197,160,89,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(197,160,89,0.05)',
          }}>
            <QrCode size={18} strokeWidth={1.5} style={{ color: 'rgba(197,160,89,0.8)' }} />
          </div>
          <div>
            <p style={{ fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(197,160,89,0.85)', fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 600, marginBottom: 4 }}>
              Foto Paylaşım Sistemi
            </p>
            <p style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontSize: 17, fontWeight: 300, color: '#1C1610', lineHeight: 1.2 }}>
              Qonaqlar bu QR vasitəsilə şəkil göndərəcək
            </p>
          </div>
        </div>

        {/* QR + izah */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* QR preview */}
          <div style={{
            padding: 12,
            border: '1px solid rgba(197,160,89,0.22)',
            background: 'white',
            flexShrink: 0,
            position: 'relative',
          }}>
            {/* Künc ornamentləri */}
            {[['top:4px','left:4px','borderLeft','borderTop'],['top:4px','right:4px','borderRight','borderTop'],
              ['bottom:4px','left:4px','borderLeft','borderBottom'],['bottom:4px','right:4px','borderRight','borderBottom']
            ].map(([t, lr, b1, b2], i) => (
              <div key={i} style={{
                position: 'absolute',
                [t.split(':')[0]]: t.split(':')[1],
                [lr.split(':')[0]]: lr.split(':')[1],
                width: 10, height: 10,
                [b1]: '1px solid rgba(197,160,89,0.55)',
                [b2]: '1px solid rgba(197,160,89,0.55)',
              }} />
            ))}
            <QRCodeSVG value={photoShareUrl} size={100} bgColor="transparent" fgColor="rgba(26,20,12,0.88)" level="M" />
          </div>

          {/* Mətn */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: 'rgba(60,50,40,0.75)', fontFamily: '"Inter",system-ui,sans-serif', lineHeight: 1.7, marginBottom: 10 }}>
              Masa kartlarına bu QR kodu yapışdırın. Qonaqlar skan edərək toy şəkillərini birbaşa sistemə yükləyəcəklər.
            </p>
            <p style={{
              fontSize: 9, letterSpacing: '0.04em', color: 'rgba(197,160,89,0.8)',
              fontFamily: '"Inter",system-ui,sans-serif', wordBreak: 'break-all',
              padding: '6px 10px', background: 'rgba(197,160,89,0.07)',
              border: '1px solid rgba(197,160,89,0.18)',
            }}>
              {photoShareUrl}
            </p>
          </div>
        </div>

        {/* Admin: SVG masa kartı endirme düyməsi */}
        {isAdmin && (
          <>
            <button
              type="button"
              onClick={downloadQR}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginTop: 20, width: '100%', padding: '13px 18px',
                border: '1px solid rgba(197,160,89,0.4)',
                background: 'rgba(197,160,89,0.07)',
                cursor: 'pointer',
                fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
                color: 'rgba(197,160,89,0.95)', fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 600,
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.14)'; e.currentTarget.style.borderColor = 'rgba(197,160,89,0.65)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.07)'; e.currentTarget.style.borderColor = 'rgba(197,160,89,0.4)' }}
            >
              <Download size={13} strokeWidth={1.5} />
              Masa Kartını HD (SVG) Endir — Mətbəə Keyfiyyəti
            </button>

            {/* Müştəri üçün qalereya idarəetmə linki */}
            <div style={{
              marginTop: 16,
              padding: '18px 18px 16px',
              border: '1px solid rgba(197,160,89,0.22)',
              background: 'rgba(197,160,89,0.04)',
              position: 'relative',
            }}>
              {/* Üst ornament xətti */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.45) 40%, rgba(197,160,89,0.6) 50%, rgba(197,160,89,0.45) 60%, transparent)',
              }} />
              <p style={{
                fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase',
                color: 'rgba(197,160,89,0.8)', fontFamily: '"Inter",system-ui,sans-serif',
                fontWeight: 600, marginBottom: 6,
              }}>
                Müştərinin Şəxsi Qalereya İdarəetmə Linki
              </p>
              <p style={{
                fontSize: 10, color: 'rgba(80,68,58,0.65)', fontFamily: '"Inter",system-ui,sans-serif',
                lineHeight: 1.6, marginBottom: 12,
              }}>
                Aşağıdakı linki müştəriyə göndər — buradan qonaqların yüklədiyи şəkilləri görə, seçə və .zip endirə biləcək:
              </p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  readOnly
                  value={galeryaIdareUrl}
                  onClick={e => e.target.select()}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    fontSize: 9, letterSpacing: '0.04em',
                    fontFamily: '"Inter",system-ui,sans-serif',
                    color: 'rgba(197,160,89,0.85)',
                    background: 'rgba(197,160,89,0.06)',
                    border: '1px solid rgba(197,160,89,0.22)',
                    outline: 'none',
                    wordBreak: 'break-all',
                    cursor: 'text',
                  }}
                />
                <button
                  type="button"
                  onClick={copyGaleryaLink}
                  style={{
                    flexShrink: 0,
                    padding: '9px 14px',
                    border: `1px solid ${copied ? 'rgba(197,160,89,0.7)' : 'rgba(197,160,89,0.4)'}`,
                    background: copied ? 'rgba(197,160,89,0.18)' : 'rgba(197,160,89,0.09)',
                    cursor: 'pointer',
                    fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: copied ? 'rgba(197,160,89,1)' : 'rgba(197,160,89,0.85)',
                    fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all 0.18s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copied
                    ? <><Check size={12} strokeWidth={2} /> Kopyalandı</>
                    : <><Archive size={11} strokeWidth={1.5} /> Linki Kopyala</>
                  }
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   Əsas Builder Formu
══════════════════════════════════════════════════ */
/* ── Ad → URL slug çevricisi ── */
function toSlug(str = '') {
  const MAP = {
    ə:'e',ə:'e',Ə:'e',ğ:'g',Ğ:'g',ı:'i',İ:'i',ö:'o',Ö:'o',ü:'u',Ü:'u',ş:'s',Ş:'s',ç:'c',Ç:'c',
    á:'a',é:'e',í:'i',ó:'o',ú:'u',ñ:'n',ä:'a',ü:'u',ö:'o',
  }
  return str
    .split('').map(c => MAP[c] || c).join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* ── URL-safe Base64 encode (+ → -, / → _, = silinir) ── */
function encodeDataLocal(data) {
  try {
    const utf8Bytes = new TextEncoder().encode(JSON.stringify(data))
    return btoa(String.fromCharCode(...utf8Bytes))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  } catch { return '' }
}

/* ── URL-safe Base64 decode ── */
function decodeDataLocal(token) {
  try {
    const base64 = token.replace(/-/g, '+').replace(/_/g, '/') +
      '=='.slice(0, (4 - (token.length % 4)) % 4)
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i)
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch { return null }
}

/* ── Oturma Planı Editor ── */
const SEATING_UI = {
  az: { addTable: 'Masa əlavə et', addGuest: '+ Qonaq', tableName: 'Masa adı', guestName: 'Qonaq adı', noTables: 'Masa əlavə etmək üçün düyməyə basın' },
  en: { addTable: 'Add Table', addGuest: '+ Guest', tableName: 'Table name', guestName: 'Guest name', noTables: 'Press the button to add a table' },
  ru: { addTable: 'Добавить стол', addGuest: '+ Гость', tableName: 'Название стола', guestName: 'Имя гостя', noTables: 'Нажмите кнопку чтобы добавить стол' },
}

function parseTables(str) {
  if (!str?.trim()) return []
  return str.split(';').map((chunk, i) => {
    const colonIdx = chunk.indexOf(':')
    const name = colonIdx >= 0 ? chunk.slice(0, colonIdx).trim() : chunk.trim()
    const guests = colonIdx >= 0
      ? chunk.slice(colonIdx + 1).split(',').map(g => g.trim()).filter(Boolean)
      : []
    return { id: `t${i}_${Date.now()}`, name: name || `Masa ${i + 1}`, guests }
  }).filter(t => t.name)
}

function serializeTables(tables) {
  return tables.map(t => {
    const validGuests = t.guests.filter(Boolean)
    return validGuests.length ? `${t.name}: ${validGuests.join(', ')}` : t.name
  }).join('; ')
}

function SeatingPlanEditor({ value, onChange, lang }) {
  const L = SEATING_UI[lang] || SEATING_UI.az
  const [tables, setTables] = useState(() => parseTables(value))

  const commit = (next) => { setTables(next); onChange(serializeTables(next)) }

  const addTable = () => commit([...tables, { id: `t${Date.now()}`, name: `Masa ${tables.length + 1}`, guests: [] }])
  const removeTable = (id) => commit(tables.filter(t => t.id !== id))
  const renameTable = (id, name) => commit(tables.map(t => t.id === id ? { ...t, name } : t))
  const addGuest = (id) => commit(tables.map(t => t.id === id ? { ...t, guests: [...t.guests, ''] } : t))
  const removeGuest = (id, gi) => commit(tables.map(t => t.id === id ? { ...t, guests: t.guests.filter((_, i) => i !== gi) } : t))
  const editGuest = (id, gi, val) => commit(tables.map(t => t.id === id ? { ...t, guests: t.guests.map((g, i) => i === gi ? val : g) } : t))

  const cardStyle = {
    border: '1px solid rgba(197,160,89,0.28)',
    background: 'rgba(253,250,244,0.9)',
    padding: '16px 16px 12px',
    marginBottom: 0,
  }
  const inputBase = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(197,160,89,0.35)',
    outline: 'none',
    fontFamily: 'inherit',
    color: '#1a1a1a',
    width: '100%',
    padding: '6px 0',
  }
  const iconBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid rgba(197,160,89,0.25)', background: 'transparent',
    color: 'rgba(140,123,107,0.65)', cursor: 'pointer', flexShrink: 0,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {tables.length === 0 && (
        <p style={{ color: 'rgba(140,123,107,0.45)', fontSize: 12, fontFamily: 'serif', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
          {L.noTables}
        </p>
      )}

      {tables.map((table) => (
        <div key={table.id} style={cardStyle}>
          {/* Masa başlığı */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <input
              type="text"
              value={table.name}
              onChange={(e) => renameTable(table.id, e.target.value)}
              placeholder={L.tableName}
              style={{ ...inputBase, minHeight: 44, fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', flex: 1 }}
            />
            <button type="button" onClick={() => removeTable(table.id)}
              style={{ ...iconBtn, minWidth: 36, minHeight: 36 }}>
              <X size={13} strokeWidth={1.5} />
            </button>
          </div>

          {/* Qonaqlar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {table.guests.map((guest, gi) => (
              <div key={gi} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="text"
                  value={guest}
                  onChange={(e) => editGuest(table.id, gi, e.target.value)}
                  placeholder={L.guestName}
                  style={{ ...inputBase, minHeight: 40, fontSize: 12, fontWeight: 300, flex: 1 }}
                />
                <button type="button" onClick={() => removeGuest(table.id, gi)}
                  style={{ ...iconBtn, border: 'none', minWidth: 28, minHeight: 28 }}>
                  <Minus size={11} strokeWidth={1.5} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addGuest(table.id)}
              style={{
                alignSelf: 'flex-start', marginTop: 6, minHeight: 36, padding: '0 10px',
                border: '1px solid rgba(197,160,89,0.3)', background: 'transparent',
                color: 'rgba(197,160,89,0.85)', fontSize: 10, letterSpacing: '0.14em',
                fontFamily: 'inherit', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
              <Plus size={10} strokeWidth={1.5} />
              {L.addGuest}
            </button>
          </div>
        </div>
      ))}

      {/* Masa əlavə et */}
      <button type="button" onClick={addTable}
        style={{
          minHeight: 44,
          border: '1px dashed rgba(197,160,89,0.4)',
          background: 'transparent',
          color: 'rgba(197,160,89,0.85)',
          fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          fontFamily: 'inherit', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
        <Plus size={11} strokeWidth={1.5} />
        {L.addTable}
      </button>
    </div>
  )
}

export default function BuilderForm({ lang, initialData, initialStep = null, onSubmit, isAdmin = false }) {
  const tr = t[lang]

  /* ── Paket kilidləmə ── */
  const pkgId = localStorage.getItem('selected_package') || 'PREMIUM'
  const lockedSteps = getLockedSteps(pkgId)
  const visibleSteps = [1, 2, 3, 4, 5, 6].filter(n => !lockedSteps.includes(n))
  const VISIBLE_TOTAL = visibleSteps.length

  /* initialStep-i görünən addımlara uyğunlaşdır */
  const safeInitialStep = (() => {
    if (!initialStep) return 1
    const idx = visibleSteps.indexOf(initialStep)
    return idx >= 0 ? idx + 1 : visibleSteps.length
  })()

  const [step, setStep] = useState(safeInitialStep)
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [generatedLiveLink, setGeneratedLiveLink] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  const [adminMode,   setAdminMode]   = useState(isAdmin)
  const [isHydrated,  setIsHydrated]  = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  /* ── URL-dən data hydration (admin idarəetmə linki) ── */
  useEffect(() => {
    const urlParams   = new URLSearchParams(window.location.search)
    const adminToken  = urlParams.get('admin')
    const encodedData = urlParams.get('data')

    if (adminToken === 'digitoyadmin2026') {
      setAdminMode(true)
      localStorage.setItem('isAdmin', 'true')
    }

    if (encodedData) {
      try {
        const parsedData = decodeDataLocal(encodedData)
        if (!parsedData) throw new Error('null result')
        console.log('Deşifrə olunan data:', parsedData)
        setData(prev => ({ ...prev, ...parsedData }))
        window.history.replaceState({}, '', window.location.pathname)
      } catch (err) {
        console.error('Datanı deşifrə edərkən xəta baş verdi. Format düzgün deyil:', err)
      }
    }

    /* Hydration tamamlandı — digər effektlər artıq işə düşə bilər */
    setIsHydrated(true)
  }, [])

  const set = (key, val) => {
    setData((d) => ({ ...d, [key]: val }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const isCouple = COUPLE_TYPES.includes(data.eventType)
  const isCorp   = CORP_TYPES.includes(data.eventType)

  const steps = [
    tr.step1_title, tr.step2_title, tr.step3_title,
    tr.step4_title, tr.step5_title, tr.step6_title,
  ]

  /* Görünən addımlar içərisindəki mövqedən həqiqi addım nömrəsi */
  const actualStep = visibleSteps[step - 1] ?? 1

  const validate = () => {
    const e = {}
    if (actualStep === 1) {
      if (isCorp && !data.eventName?.trim()) e.eventName = true
      if (!isCorp && !data.brideName.trim()) e.brideName = true
      if (isCouple && !data.groomName.trim()) e.groomName = true
      if (!data.date) e.date = true
      if (!data.time) e.time = true
    }
    if (actualStep === 2) {
      if (!data.venueName.trim()) e.venueName = true
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const scrollToTop = () => {
    setTimeout(() => {
      const section = document.getElementById('builder-section')
      const el = document.getElementById('builder-top')
      ;(section || el)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  const next = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    if (validate()) {
      setStep((s) => Math.min(s + 1, VISIBLE_TOTAL))
      scrollToTop()
    }
  }
  const prev = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    setStep((s) => Math.max(s - 1, 1))
    scrollToTop()
  }
  const handleSubmit = async (e) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    if (submitLoading) return
    if (!validate()) return
    setSubmitLoading(true)
    try {
      await onSubmit(data)
    } catch {
      /* üst komponent xətaları idarə edir */
    } finally {
      setSubmitLoading(false)
    }
  }

  /* ── WhatsApp sifariş — mərkəzi funksiya ilə ── */
  const handleWhatsAppOrder = () => {
    /* Məlumatları əvvəlcə localStorage-a yaz */
    const isC = COUPLE_TYPES.includes(data.eventType)
    const isP = CORP_TYPES.includes(data.eventType)
    let slug = ''
    if (isC)      slug = `${toSlug(data.brideName)}-ve-${toSlug(data.groomName)}`
    else if (isP) slug = toSlug(data.eventName || 'tedbir')
    else          slug = toSlug(data.brideName || 'davetname')
    localStorage.setItem(`wedding_${slug}`, JSON.stringify(data))

    window.open(buildWhatsAppUrl(data, lang, WHATSAPP_NUMBER), '_blank')
  }

  const handleApproveAndGenerateLink = () => {
    const isCouple = COUPLE_TYPES.includes(data.eventType)
    const isCorp   = CORP_TYPES.includes(data.eventType)
    let slug = ''
    if (isCouple) {
      slug = `${toSlug(data.brideName)}-ve-${toSlug(data.groomName)}`
    } else if (isCorp) {
      slug = toSlug(data.eventName || 'tedbir')
    } else {
      slug = toSlug(data.brideName || 'davetname')
    }
    /* Datanı qalıcı yaddaşa yaz — link açılanda oradan oxunacaq */
    localStorage.setItem(`wedding_${slug}`, JSON.stringify(data))
    const token = encodeDataLocal(data)
    const link  = `${window.location.origin}/invite/${slug}?data=${token}`
    setGeneratedLiveLink(link)
    setLinkCopied(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLiveLink).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    })
  }

  return (
    <div id="builder-top" className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center mb-8 sm:mb-14">
        {visibleSteps.map((actualN, i) => {
          const n = i + 1
          const done = n < step
          const active = n === step
          const title = steps[actualN - 1]
          return (
            <div key={actualN} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-7 h-7 flex items-center justify-center text-[10px] font-medium transition-all duration-300 ${
                    done
                      ? 'bg-gold text-white'
                      : active
                      ? 'border border-gold text-gold bg-transparent'
                      : 'border border-beige-dark text-brown-muted/40 bg-transparent'
                  }`}
                >
                  {done ? <Check size={11} strokeWidth={2} /> : n}
                </div>
                <span className={`hidden sm:block text-[9px] tracking-[0.12em] uppercase text-center max-w-[56px] leading-tight ${active ? 'text-gold' : 'text-brown-muted/50'}`}>
                  {title}
                </span>
              </div>
              {i < visibleSteps.length - 1 && (
                <div className={`flex-1 h-px mx-1 sm:mx-2 transition-all duration-500 ${done ? 'step-line-active' : 'bg-beige-dark/60'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="bg-cream border border-beige-dark/60 px-4 sm:px-10 py-8 sm:py-12 overflow-visible min-h-[420px] sm:min-h-[520px]">
        <h3 className="font-serif text-xl text-ink mb-10 font-light tracking-tight">{steps[actualStep - 1]}</h3>

        {/* STEP 1 */}
        {actualStep === 1 && (
          <div className="space-y-8 pb-10 sm:pb-64">
            {/* Tədbir növü */}
            <div>
              <Label>{tr.event_type || 'Tədbir növü'}</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-1">
                {EVENT_TYPES.map(({ id }) => {
                  const Icon = EVENT_ICONS[id]
                  const label = tr[`event_${id}`]
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set('eventType', id)}
                      className={`flex flex-col items-center gap-2.5 py-5 border transition-all duration-200 ${
                        data.eventType === id
                          ? 'border-gold bg-gold/[0.04] text-gold'
                          : 'border-beige-dark/70 text-brown-muted/70 hover:border-gold/40 hover:text-brown-muted'
                      }`}
                    >
                      <Icon size={16} strokeWidth={1.5} />
                      <span className="text-[10px] tracking-[0.12em] uppercase">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Korporativ / Digər — Tədbirin Adı + Təşkilatçı */}
            {isCorp ? (
              <>
                <div>
                  <Label required>{tr.event_name_label}</Label>
                  <Input
                    value={data.eventName || ''}
                    onChange={(e) => set('eventName', e.target.value)}
                    placeholder={tr.event_name_label}
                    className={errors.eventName ? 'border-b-red-300' : ''}
                  />
                </div>
                <div>
                  <Label>{tr.organizer_label}</Label>
                  <Input
                    value={data.organizer || ''}
                    onChange={(e) => set('organizer', e.target.value)}
                    placeholder={tr.organizer_placeholder}
                  />
                </div>
              </>
            ) : isCouple ? (
              /* Toy / Nişan — cütlük adları */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <Label required>{tr.bride_label}</Label>
                  <Input
                    value={data.brideName}
                    onChange={(e) => set('brideName', e.target.value)}
                    placeholder="Məs: Leyla"
                    className={errors.brideName ? 'border-b-red-300' : ''}
                  />
                </div>
                <div>
                  <Label required>{tr.groom_label}</Label>
                  <Input
                    value={data.groomName}
                    onChange={(e) => set('groomName', e.target.value)}
                    placeholder="Məs: Murad"
                    className={errors.groomName ? 'border-b-red-300' : ''}
                  />
                </div>
              </div>
            ) : (
              /* Ad günü — tək ad */
              <div>
                <Label required>{tr.person_name_label}</Label>
                <Input
                  value={data.brideName}
                  onChange={(e) => set('brideName', e.target.value)}
                  placeholder={tr.person_name_label}
                  className={errors.brideName ? 'border-b-red-300' : ''}
                />
              </div>
            )}

            {/* Tarix & Vaxt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <Label required>{tr.date_label}</Label>
                <AzCalendar
                  value={data.date}
                  onChange={(iso) => set('date', iso)}
                  hasError={!!errors.date}
                  lang={lang}
                />
              </div>
              <div>
                <Label required>{tr.time_label}</Label>
                <TimeInputAz
                  value={data.time}
                  onChange={(val) => set('time', val)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {actualStep === 2 && (
          <div className="space-y-8">
            <div>
              <Label required>{tr.venue_search_label}</Label>
              <VenueSearchInput
                value={data.venueName}
                onChange={(val) => set('venueName', val)}
                onSelect={({ venueName, googleMapsUrl, wazeUrl }) => {
                  setData(d => ({ ...d, venueName, googleMapsUrl, wazeUrl }))
                  setErrors(e => ({ ...e, venueName: undefined }))
                }}
                lang={lang}
                tr={tr}
              />
              {errors.venueName && (
                <p className="mt-1 text-[10px] text-red-400/80">{errors.venueName}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 3 — Tədbir Proqramı */}
        {actualStep === 3 && (
          <ProgramStepEditor
            rows={data.programSteps || []}
            onChange={(rows) => set('programSteps', rows)}
            tr={tr}
          />
        )}

        {/* STEP 4 — Dress Code */}
        {actualStep === 4 && (
          <div className="space-y-8">
            <div>
              <Label>{tr.dresscode_type_label}</Label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                {[
                  { id: 'blacktie',    label: 'Black Tie',    subKey: 'dresscode_blacktie_sub',    colors: ['#1A1A1A', '#F5F5F5', '#C9A84C'] },
                  { id: 'cocktail',    label: 'Cocktail',     subKey: 'dresscode_cocktail_sub',    colors: ['#C4956A', '#E8D5C4', '#8B6347'] },
                  { id: 'smartcasual', label: 'Smart Casual', subKey: 'dresscode_smartcasual_sub', colors: ['#6B8CAE', '#D4E4F0', '#4A6B8A'] },
                  { id: 'creative',    label: 'Creative',     subKey: 'dresscode_creative_sub',    colors: ['#9B6B9B', '#F0C4D4', '#6B9B6B'] },
                ].map(({ id, label, subKey, colors }) => {
                  const sub = tr[subKey] || subKey
                  const isActive = data.dressCodePalette === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set('dressCodePalette', id)}
                      className={`text-left p-5 border transition-all duration-200 ${
                        isActive
                          ? 'border-gold bg-gold/[0.04]'
                          : 'border-beige-dark/60 hover:border-gold/35'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="flex items-center gap-1">
                          {colors.map((c) => (
                            <span
                              key={c}
                              className="w-3 h-3 rounded-full border border-black/10 inline-block flex-shrink-0"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium tracking-wide ${isActive ? 'text-gold' : 'text-ink'}`}>{label}</p>
                      </div>
                      <p className="text-[10px] text-brown-muted/70 font-light mb-4">{sub}</p>
                      {isActive && (
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center gap-1.5">
                            <User size={18} className="text-amber-700/80" strokeWidth={1.4} />
                            <span className="text-[9px] text-brown-muted">{tr.dresscode_groom_icon}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1.5">
                            <Sparkles size={18} className="text-amber-700/80" strokeWidth={1.4} />
                            <span className="text-[9px] text-brown-muted">{tr.dresscode_bride_icon}</span>
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <Label>{tr.dresscode_desc_label}</Label>
              <Textarea
                value={data.dressCodeDescription}
                onChange={(e) => set('dressCodeDescription', e.target.value)}
                placeholder={tr.dresscode_placeholder}
              />
            </div>
          </div>
        )}

        {/* STEP 5 — Oturma Planı */}
        {actualStep === 5 && (
          <div className="space-y-6">
            <div>
              <Label>{tr.seating_label}</Label>
              <SeatingPlanEditor
                value={data.seatingPlan}
                onChange={(val) => set('seatingPlan', val)}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* STEP 6 — Foto Qalereya & QR İdarəetmə */}
        {actualStep === 6 && (
          <GalleryAdminStep data={data} isCouple={isCouple} isCorp={isCorp} isAdmin={isAdmin || adminMode} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6 sm:mt-8">
        <button
          type="button"
          onClick={prev}
          disabled={step === 1}
          className="flex items-center gap-2 px-4 sm:px-7 py-3 sm:py-3.5 min-h-[44px] border border-beige-dark/70 text-brown-muted text-[10px] tracking-[0.22em] uppercase hover:border-gold/50 hover:text-gold transition-all duration-200 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed touch-manipulation"
        >
          <ChevronLeft size={13} strokeWidth={1.5} />
          {tr.btn_prev}
        </button>

        {step < VISIBLE_TOTAL ? (
          <button type="button" onClick={next} className="flex items-center gap-2 btn-gold min-h-[44px] touch-manipulation">
            {tr.btn_next}
            <ChevronRight size={13} strokeWidth={1.5} />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={submitLoading} className="btn-gold min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed">
            {submitLoading ? '…' : tr.btn_create}
          </button>
        )}
      </div>

      {/* ── WhatsApp Sifariş Düyməsi (son addımda) ── */}
      {step === VISIBLE_TOTAL && (
        <div style={{
          marginTop: 16,
          padding: '28px 24px',
          border: '1px solid rgba(197,160,89,0.28)',
          background: 'linear-gradient(150deg, #FDFAF4 0%, #F5EDD8 100%)',
          textAlign: 'center',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.8) 40%, rgba(197,160,89,1) 50%, rgba(197,160,89,0.8) 60%, transparent)',
          }} />
          <p style={{
            fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'rgba(197,160,89,0.85)', fontFamily: '"Inter",system-ui,sans-serif',
            fontWeight: 600, marginBottom: 8,
          }}>Dəvətnaməniz Hazırdır</p>
          <p style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
            fontSize: 15, fontWeight: 300, color: 'rgba(28,22,16,0.75)',
            marginBottom: 20, lineHeight: 1.55,
          }}>
            Dizaynı tamamladınız. İndi tək bir toxunuşla sifariş verin.
          </p>
          <button
            type="button"
            onClick={handleWhatsAppOrder}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              border: 'none', cursor: 'pointer',
              fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'white', fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 700,
              boxShadow: '0 8px 32px rgba(37,211,102,0.35)',
              transition: 'transform 0.18s, box-shadow 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,211,102,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,211,102,0.35)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Dəvətnaməni Sifariş Ver
          </button>
        </div>
      )}

      {/* ── Admin İdarəetmə Paneli ── */}
      {(isAdmin || adminMode) && (
        <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm text-center">
          <h3 className="text-base font-semibold text-emerald-800 mb-1 flex items-center justify-center gap-2">
            ⚡ Rəqəmsal Admin Paneli
          </h3>
          <p className="text-sm text-emerald-600 mb-5 font-light leading-relaxed">
            Yuxarıda müştərinin məlumatlarını redaktə edə bilərsiniz. Hər şey hazırdırsa, canlı linki generasiya edin.
          </p>

          <button
            type="button"
            onClick={handleApproveAndGenerateLink}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-md transition-colors w-full sm:w-auto"
          >
            Sifarişi Təsdiqlə və Canlı Linki Yarat
          </button>

          {generatedLiveLink && (
            <div className="mt-4 p-3 bg-white border border-emerald-300 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="font-mono text-xs text-emerald-700 break-all text-left select-all leading-relaxed">
                {generatedLiveLink}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-shrink-0 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded transition-colors whitespace-nowrap"
              >
                {linkCopied ? '✓ Kopyalandı' : 'Linki Kopyala'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

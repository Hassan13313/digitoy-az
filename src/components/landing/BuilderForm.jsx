import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Heart, Diamond, Cake, Briefcase, Sparkles,
  ChevronRight, ChevronLeft, Check, Crown, Shirt, Calendar, User, MapPin, Search,
  Download, QrCode, Archive, Minus, Plus, X,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
/* Google Maps JS API — singleton promise, script injected once */
let _mapsPromise = null
function loadGoogleMaps(apiKey) {
  if (_mapsPromise) return _mapsPromise
  if (window.google?.maps?.places) return Promise.resolve()
  _mapsPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=az`
    s.async = true
    s.defer = true
    s.onload  = () => resolve()
    s.onerror = (e) => { _mapsPromise = null; reject(e) }
    document.head.appendChild(s)
  })
  return _mapsPromise
}
import { DRESS_CODE_PALETTES, EVENT_TYPES } from '../../data/constants'
import { PACKAGE_DEFS, getLockedSteps } from '../../data/packages'
import { defaultWedding } from '../../data/defaultWedding'
import { buildShortLiveLink } from '../../utils/whatsappOrder'
import { formatFullDateByLang } from '../../utils/dateFormat'
import { saveDraft, getDraft, submitDraft, saveInvitation, approveDraft } from '../../utils/api'
import t from '../../data/translations'
import { trackEvent } from '../../utils/analytics'

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

const GMAPS_KEY   = import.meta.env.VITE_GOOGLE_MAPS_KEY
const BAKU_CENTER = { lat: 40.4093, lng: 49.8671 }

const DARK_MAP_STYLES = [
  { elementType: 'geometry',            stylers: [{ color: '#1c1c1c' }] },
  { elementType: 'labels.text.stroke',  stylers: [{ color: '#1c1c1c' }] },
  { elementType: 'labels.text.fill',    stylers: [{ color: '#9a9a9a' }] },
  { featureType: 'road',    elementType: 'geometry',         stylers: [{ color: '#2e2e2e' }] },
  { featureType: 'road',    elementType: 'labels.text.fill', stylers: [{ color: '#7a7a7a' }] },
  { featureType: 'water',   elementType: 'geometry',         stylers: [{ color: '#0d0d0d' }] },
  { featureType: 'poi',     stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#C5A059' }] },
]

function toNavUrls(lat, lng) {
  return {
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    wazeUrl: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
  }
}

function VenueSearchInput({ value, onSelect, lang, tr }) {
  const inputRef    = useRef(null)
  const mapDivRef   = useRef(null)
  const mapRef      = useRef(null)
  const onSelectRef = useRef(onSelect)
  useEffect(() => { onSelectRef.current = onSelect }, [onSelect])

  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let marker = null

    const flash = () => { setSuccess(true); setTimeout(() => setSuccess(false), 4000) }

    const placeMarker = (latLng) => {
      if (!mapRef.current) return
      if (marker) {
        marker.setPosition(latLng)
      } else {
        marker = new window.google.maps.Marker({
          position: latLng,
          map: mapRef.current,
          draggable: true,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#C5A059',
            fillOpacity: 1,
            strokeColor: '#fdfaf4',
            strokeWeight: 2.5,
          },
          animation: window.google.maps.Animation.DROP,
        })
        marker.addListener('dragend', () => {
          const pos = marker.getPosition()
          new window.google.maps.Geocoder().geocode({ location: pos }, (results, status) => {
            const name = status === 'OK' && results[0]
              ? (results[0].name || results[0].formatted_address.split(',')[0])
              : ''
            if (inputRef.current) inputRef.current.value = name
            onSelectRef.current({ venueName: name, ...toNavUrls(pos.lat(), pos.lng()) })
            flash()
          })
        })
      }
      mapRef.current.panTo(latLng)
      mapRef.current.setZoom(16)
    }

    const geocodeAndEmit = (latLng) => {
      new window.google.maps.Geocoder().geocode({ location: latLng }, (results, status) => {
        const name = status === 'OK' && results[0]
          ? (results[0].name || results[0].formatted_address.split(',')[0])
          : ''
        if (inputRef.current) inputRef.current.value = name
        onSelectRef.current({ venueName: name, ...toNavUrls(latLng.lat(), latLng.lng()) })
        flash()
      })
    }

    loadGoogleMaps(GMAPS_KEY).then(() => {
      if (!mapDivRef.current || mapRef.current) return

      const map = new window.google.maps.Map(mapDivRef.current, {
        center: BAKU_CENTER,
        zoom: 11,
        disableDefaultUI: true,
        zoomControl: true,
        styles: DARK_MAP_STYLES,
      })
      mapRef.current = map

      map.addListener('click', (e) => {
        placeMarker(e.latLng)
        geocodeAndEmit(e.latLng)
      })

      if (!inputRef.current) return

      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'az' },
        fields: ['geometry', 'name', 'formatted_address'],
      })

      ac.addListener('place_changed', () => {
        const place = ac.getPlace()
        if (!place.geometry?.location) return
        const lat  = place.geometry.location.lat()
        const lng  = place.geometry.location.lng()
        const name = place.name || (place.formatted_address || '').split(',')[0]
        placeMarker(place.geometry.location)
        onSelectRef.current({ venueName: name, ...toNavUrls(lat, lng) })
        flash()
      })
    }).catch(() => {})

    return () => { mapRef.current = null; marker = null }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/50 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          defaultValue={value || ''}
          placeholder={tr.venue_search_placeholder}
          className="w-full pl-9 pr-4 py-3 bg-[#1a1a1a]/60 border border-gold/20 text-white/90 text-sm placeholder-white/25 rounded-full focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>
      {success && (
        <p className="mt-2 text-[11px] tracking-[0.12em] text-gold font-medium flex items-center gap-1.5">
          <MapPin size={11} /> {tr.venue_search_success}
        </p>
      )}
      <div style={{ marginTop: 16, border: '1px solid rgba(197,160,89,0.22)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 2, background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5) 40%, rgba(197,160,89,0.7) 50%, rgba(197,160,89,0.5) 60%, transparent)' }} />
        <div ref={mapDivRef} style={{ height: 240, width: '100%', zIndex: 1 }} />
        <p style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(197,160,89,0.8)', fontFamily: '"Inter",system-ui,sans-serif', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(4px)', padding: '2px 10px', pointerEvents: 'none', zIndex: 10, whiteSpace: 'nowrap' }}>
          Məkanı axtarın və ya xəritəyə vurun
        </p>
      </div>
    </div>
  )
}

/* ── Proqram Addımı Redaktoru ── */
const PROGRAM_ICONS = [
  '🥂','💍','🎵','💃','🎂','🎤','❤️','🤵','🎆','☕',
  '💐','🎀','💌','🍾','🕊️',
  '🎁','🎉','🎈','🎊','🎙️',
  '📸','🍸','🕰️','🎗️','👑',
]

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
        className="w-10 h-10 flex items-center justify-center border border-gold/25 bg-cream hover:border-gold/50 hover:bg-gold/5 transition-colors rounded-lg text-xl"
        title="İkon seç"
      >
        {value || '✨'}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-[120] bg-cream border border-beige-dark/60 shadow-xl rounded-lg w-52 p-2.5 grid grid-cols-5 gap-1.5">
          {PROGRAM_ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => { onSelect(ic); setOpen(false) }}
              className={`w-9 h-9 flex items-center justify-center text-xl rounded-lg transition-colors ${value === ic ? 'bg-gold/10 border border-gold/40' : 'hover:bg-beige border border-transparent'}`}
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
          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-beige/50 border border-beige-dark/50 rounded-lg p-3 sm:p-2.5">
            {/* Mobil: saat + (sağda) ikon+sil düymələri */}
            <div className="flex items-center gap-2">
              <TimeInput
                value={row.time}
                onChange={(v) => update(i, 'time', v)}
                onComplete={() => activityRefs.current[i]?.focus()}
                placeholder="19:00"
                className="w-[84px] sm:w-[90px] flex-shrink-0 text-center p-2.5 border border-beige-dark/60 rounded bg-cream font-mono text-sm focus:outline-none focus:border-gold/60 transition-colors"
              />
              {/* Mobil-da sağa keç */}
              <div className="flex items-center gap-1 ml-auto sm:hidden">
                <IconPickerBtn value={row.icon} onSelect={(ic) => update(i, 'icon', ic)} />
                <button type="button" onClick={() => removeRow(i)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-brown-muted/40 hover:text-red-400 transition-colors rounded touch-manipulation" aria-label="Sil">
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
              className="w-full sm:flex-1 sm:min-w-0 p-2.5 border border-beige-dark/50 rounded bg-cream text-sm focus:outline-none focus:border-gold/60 transition-colors"
            />
            {/* Desktop-da ikon+sil */}
            <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
              <IconPickerBtn value={row.icon} onSelect={(ic) => update(i, 'icon', ic)} />
              <button type="button" onClick={() => removeRow(i)} className="flex-shrink-0 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-brown-muted/40 hover:text-red-400 transition-colors rounded" aria-label="Sil">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="text-[11px] tracking-[0.16em] uppercase text-gold/80 hover:text-gold border border-gold/25 hover:border-gold/50 px-4 py-3 min-h-[44px] transition-all duration-200 flex items-center gap-2 touch-manipulation"
      >
        {tr.program_add_row}
      </button>
      <p className="text-[11px] text-brown-muted/60 font-light tracking-wide">{tr.program_hint}</p>
    </div>
  )
}

/* ── Proqram şablonları ── */
const TPL_UI = {
  az: { title: 'Hazır şablon seçin', sub: 'Şablonu seçin — sonra istədiyiniz kimi dəyişə bilərsiniz', own: 'Özüm yazacam', change: 'Şablonu dəyiş',
        labels: { toy:'Toy', nishan:'Nişan', nikah:'Nikah', xinayaxdi:'Xınayaxdı', birthday:'Ad günü', other:'Digər' } },
  en: { title: 'Choose a template', sub: 'Select a template — you can edit it anytime', own: 'Write my own', change: 'Change template',
        labels: { toy:'Wedding', nishan:'Engagement', nikah:'Ceremony', xinayaxdi:'Henna Night', birthday:'Birthday', other:'Other' } },
  ru: { title: 'Выберите шаблон', sub: 'Выберите шаблон — вы сможете его изменить позже', own: 'Напишу сам', change: 'Изменить шаблон',
        labels: { toy:'Свадьба', nishan:'Помолвка', nikah:'Никях', xinayaxdi:'Вечер хны', birthday:'День рождения', other:'Другое' } },
}
const TPL_ICONS = { toy:'💒', nishan:'💍', nikah:'🤲', xinayaxdi:'🌿', birthday:'🎂', other:'✨' }
const TPL_KEYS  = ['toy','nishan','nikah','xinayaxdi','birthday','other']

const PROGRAM_TEMPLATES = {
  toy: {
    az: [{ time:'17:30',icon:'🥂',activity:'Qonaqların qarşılanması' },{ time:'18:00',icon:'💒',activity:'Bəy və gəlinin gəlişi' },{ time:'18:30',icon:'📸',activity:'Ailə fotoşəkilləri' },{ time:'19:00',icon:'🎤',activity:'Açılış sözü' },{ time:'19:30',icon:'🍽️',activity:'Ziyafət' },{ time:'20:30',icon:'💃',activity:'İlk rəqs' },{ time:'21:00',icon:'🎉',activity:'Əyləncə proqramı' },{ time:'22:00',icon:'🎂',activity:'Tort kəsimi' },{ time:'23:00',icon:'🌙',activity:'Gecənin sonu' }],
    en: [{ time:'17:30',icon:'🥂',activity:'Guest Welcome' },{ time:'18:00',icon:'💒',activity:"Bride & Groom's Entrance" },{ time:'18:30',icon:'📸',activity:'Family Photos' },{ time:'19:00',icon:'🎤',activity:'Opening Speech' },{ time:'19:30',icon:'🍽️',activity:'Dinner' },{ time:'20:30',icon:'💃',activity:'First Dance' },{ time:'21:00',icon:'🎉',activity:'Entertainment' },{ time:'22:00',icon:'🎂',activity:'Cake Cutting' },{ time:'23:00',icon:'🌙',activity:"Evening's End" }],
    ru: [{ time:'17:30',icon:'🥂',activity:'Встреча гостей' },{ time:'18:00',icon:'💒',activity:'Выход жениха и невесты' },{ time:'18:30',icon:'📸',activity:'Семейные фото' },{ time:'19:00',icon:'🎤',activity:'Вступительное слово' },{ time:'19:30',icon:'🍽️',activity:'Ужин' },{ time:'20:30',icon:'💃',activity:'Первый танец' },{ time:'21:00',icon:'🎉',activity:'Развлекательная программа' },{ time:'22:00',icon:'🎂',activity:'Разрезание торта' },{ time:'23:00',icon:'🌙',activity:'Завершение вечера' }],
  },
  nishan: {
    az: [{ time:'18:00',icon:'🥂',activity:'Qonaqların qarşılanması' },{ time:'18:30',icon:'🌸',activity:'Ailə sözü' },{ time:'19:00',icon:'💍',activity:'Nişan mərasimi' },{ time:'19:30',icon:'📸',activity:'Fotoşəkil' },{ time:'20:00',icon:'🍽️',activity:'Şam yeməyi' },{ time:'21:00',icon:'💃',activity:'Rəqs və əyləncə' },{ time:'22:00',icon:'🎂',activity:'Tort kəsimi' },{ time:'22:30',icon:'🌙',activity:'Gecənin sonu' }],
    en: [{ time:'18:00',icon:'🥂',activity:'Guest Welcome' },{ time:'18:30',icon:'🌸',activity:'Family Speech' },{ time:'19:00',icon:'💍',activity:'Engagement Ceremony' },{ time:'19:30',icon:'📸',activity:'Photos' },{ time:'20:00',icon:'🍽️',activity:'Dinner' },{ time:'21:00',icon:'💃',activity:'Dancing & Entertainment' },{ time:'22:00',icon:'🎂',activity:'Cake Cutting' },{ time:'22:30',icon:'🌙',activity:"Evening's End" }],
    ru: [{ time:'18:00',icon:'🥂',activity:'Встреча гостей' },{ time:'18:30',icon:'🌸',activity:'Слово родителей' },{ time:'19:00',icon:'💍',activity:'Церемония помолвки' },{ time:'19:30',icon:'📸',activity:'Фотосъёмка' },{ time:'20:00',icon:'🍽️',activity:'Ужин' },{ time:'21:00',icon:'💃',activity:'Танцы и развлечения' },{ time:'22:00',icon:'🎂',activity:'Торт' },{ time:'22:30',icon:'🌙',activity:'Завершение вечера' }],
  },
  nikah: {
    az: [{ time:'11:00',icon:'✨',activity:'Hazırlıq' },{ time:'12:00',icon:'💒',activity:'Nikah mərasimi' },{ time:'12:30',icon:'🥂',activity:'Təbrik və fotoşəkillər' },{ time:'13:00',icon:'🤲',activity:'Dua' },{ time:'13:30',icon:'🍽️',activity:'Nahar' },{ time:'14:30',icon:'🌙',activity:'Tədbirin sonu' }],
    en: [{ time:'11:00',icon:'✨',activity:'Preparation' },{ time:'12:00',icon:'💒',activity:'Nikah Ceremony' },{ time:'12:30',icon:'🥂',activity:'Congratulations & Photos' },{ time:'13:00',icon:'🤲',activity:'Prayer' },{ time:'13:30',icon:'🍽️',activity:'Lunch' },{ time:'14:30',icon:'🌙',activity:'End of Event' }],
    ru: [{ time:'11:00',icon:'✨',activity:'Подготовка' },{ time:'12:00',icon:'💒',activity:'Никях' },{ time:'12:30',icon:'🥂',activity:'Поздравления и фото' },{ time:'13:00',icon:'🤲',activity:'Молитва' },{ time:'13:30',icon:'🍽️',activity:'Обед' },{ time:'14:30',icon:'🌙',activity:'Завершение' }],
  },
  xinayaxdi: {
    az: [{ time:'17:00',icon:'🥂',activity:'Qonaqların qarşılanması' },{ time:'17:30',icon:'🎵',activity:'Musiqi proqramı' },{ time:'18:00',icon:'🌿',activity:'Xına mərasimi' },{ time:'19:00',icon:'📸',activity:'Fotoşəkillər' },{ time:'20:00',icon:'🍽️',activity:'Şam yeməyi' },{ time:'21:00',icon:'💃',activity:'Rəqs və əyləncə' },{ time:'22:00',icon:'🌙',activity:'Gecənin sonu' }],
    en: [{ time:'17:00',icon:'🥂',activity:'Guest Welcome' },{ time:'17:30',icon:'🎵',activity:'Music Program' },{ time:'18:00',icon:'🌿',activity:'Henna Ceremony' },{ time:'19:00',icon:'📸',activity:'Photos' },{ time:'20:00',icon:'🍽️',activity:'Dinner' },{ time:'21:00',icon:'💃',activity:'Dancing & Entertainment' },{ time:'22:00',icon:'🌙',activity:"Evening's End" }],
    ru: [{ time:'17:00',icon:'🥂',activity:'Встреча гостей' },{ time:'17:30',icon:'🎵',activity:'Музыкальная программа' },{ time:'18:00',icon:'🌿',activity:'Церемония хны' },{ time:'19:00',icon:'📸',activity:'Фотосъёмка' },{ time:'20:00',icon:'🍽️',activity:'Ужин' },{ time:'21:00',icon:'💃',activity:'Танцы и развлечения' },{ time:'22:00',icon:'🌙',activity:'Завершение вечера' }],
  },
  birthday: {
    az: [{ time:'18:00',icon:'🥂',activity:'Qonaqların qarşılanması' },{ time:'18:30',icon:'🎤',activity:'Açılış sözü' },{ time:'19:00',icon:'🎁',activity:'Hədiyyə mərasimi' },{ time:'19:30',icon:'🍽️',activity:'Şam yeməyi' },{ time:'20:30',icon:'🎂',activity:'Tort kəsimi' },{ time:'21:00',icon:'🎉',activity:'Əyləncə' },{ time:'22:30',icon:'🌙',activity:'Tədbirin sonu' }],
    en: [{ time:'18:00',icon:'🥂',activity:'Guest Welcome' },{ time:'18:30',icon:'🎤',activity:'Opening Speech' },{ time:'19:00',icon:'🎁',activity:'Gift Ceremony' },{ time:'19:30',icon:'🍽️',activity:'Dinner' },{ time:'20:30',icon:'🎂',activity:'Cake Cutting' },{ time:'21:00',icon:'🎉',activity:'Entertainment' },{ time:'22:30',icon:'🌙',activity:'End of Event' }],
    ru: [{ time:'18:00',icon:'🥂',activity:'Встреча гостей' },{ time:'18:30',icon:'🎤',activity:'Вступительное слово' },{ time:'19:00',icon:'🎁',activity:'Вручение подарков' },{ time:'19:30',icon:'🍽️',activity:'Ужин' },{ time:'20:30',icon:'🎂',activity:'Торт' },{ time:'21:00',icon:'🎉',activity:'Развлечения' },{ time:'22:30',icon:'🌙',activity:'Завершение' }],
  },
  other: {
    az: [{ time:'18:00',icon:'🥂',activity:'Qonaqların qarşılanması' },{ time:'18:30',icon:'✨',activity:'Açılış' },{ time:'19:00',icon:'🎤',activity:'Əsas mərasim' },{ time:'20:00',icon:'🍽️',activity:'Yemək' },{ time:'21:00',icon:'🎉',activity:'Əyləncə' },{ time:'22:00',icon:'🌙',activity:'Tədbirin sonu' }],
    en: [{ time:'18:00',icon:'🥂',activity:'Guest Welcome' },{ time:'18:30',icon:'✨',activity:'Opening' },{ time:'19:00',icon:'🎤',activity:'Main Ceremony' },{ time:'20:00',icon:'🍽️',activity:'Dinner' },{ time:'21:00',icon:'🎉',activity:'Entertainment' },{ time:'22:00',icon:'🌙',activity:'End of Event' }],
    ru: [{ time:'18:00',icon:'🥂',activity:'Встреча гостей' },{ time:'18:30',icon:'✨',activity:'Открытие' },{ time:'19:00',icon:'🎤',activity:'Основная церемония' },{ time:'20:00',icon:'🍽️',activity:'Ужин' },{ time:'21:00',icon:'🎉',activity:'Развлечения' },{ time:'22:00',icon:'🌙',activity:'Завершение' }],
  },
}

function ProgramStepWithTemplates({ rows, onChange, tr, lang }) {
  const [showSelector, setShowSelector] = useState(rows.length === 0)
  const ui = TPL_UI[lang] || TPL_UI.az

  const applyTemplate = (key) => {
    const tpl = PROGRAM_TEMPLATES[key]
    const items = tpl[lang] || tpl.az
    onChange(items.map(r => ({ ...r })))
    setShowSelector(false)
  }

  if (showSelector) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-2">
          <p className="text-[10px] tracking-[0.28em] uppercase text-gold font-medium mb-1">{ui.title}</p>
          <p className="text-xs text-brown-muted/70 font-light">{ui.sub}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TPL_KEYS.map(key => (
            <button
              key={key}
              type="button"
              onClick={() => applyTemplate(key)}
              className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl border border-gold/20 bg-cream hover:border-gold/50 hover:bg-gold/5 transition-all duration-200 touch-manipulation"
            >
              <span className="text-2xl leading-none">{TPL_ICONS[key]}</span>
              <span className="text-[11px] font-medium text-ink tracking-wide">{ui.labels[key]}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => { onChange([{ time:'', icon:'', activity:'' }]); setShowSelector(false) }}
          className="w-full py-3 text-[11px] tracking-[0.18em] uppercase text-brown-muted/55 hover:text-gold border border-dashed border-beige-dark/50 hover:border-gold/30 rounded-lg transition-all duration-200"
        >
          ✏️ {ui.own}
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setShowSelector(true)}
          className="text-[10px] tracking-[0.16em] uppercase text-gold/60 hover:text-gold border border-gold/20 hover:border-gold/40 px-4 py-2.5 min-h-[44px] rounded transition-all duration-200 touch-manipulation flex items-center gap-1.5"
        >
          ↺ {ui.change}
        </button>
      </div>
      <ProgramStepEditor rows={rows} onChange={onChange} tr={tr} />
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
            <p style={{ fontSize: 11, color: 'rgba(60,50,40,0.75)', fontFamily: '"Inter",system-ui,sans-serif', lineHeight: 1.7, marginBottom: 12 }}>
              Masa kartlarına bu QR kodu yapışdırın. Qonaqlar skan edərək toy şəkillərini birbaşa sistemə yükləyəcəklər.
            </p>
            {/* Benefits grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px', marginBottom: 12 }}>
              {['QR paylaşım', 'Şəxsi qalereya', 'HD yükləmə', 'ZIP export'].map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check size={10} strokeWidth={2.5} style={{ color: 'rgba(197,160,89,0.85)', flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: 'rgba(60,50,40,0.7)', fontFamily: '"Inter",system-ui,sans-serif', letterSpacing: '0.03em' }}>{b}</span>
                </div>
              ))}
            </div>
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

/* ══════════════════════════════════════════════════
   Oturma Planı — Phase 8.1 (SeatingMethodSelector)
   ══════════════════════════════════════════════════ */
function parseTableTexts(str) {
  if (!str?.trim()) return []
  return str.split(';').map((chunk, i) => {
    const colonIdx = chunk.indexOf(':')
    const name = colonIdx >= 0 ? chunk.slice(0, colonIdx).trim() : chunk.trim()
    const guests = colonIdx >= 0
      ? chunk.slice(colonIdx + 1).split(',').map(g => g.trim()).filter(Boolean)
      : []
    return { id: `t${i}_${Date.now()}`, name: name || `Masa ${i + 1}`, text: guests.join('\n') }
  }).filter(t => t.name)
}

function serializeTableTexts(tables) {
  return tables.map(t => {
    const guests = t.text.split('\n').map(g => g.trim()).filter(Boolean)
    return guests.length ? `${t.name}: ${guests.join(', ')}` : t.name
  }).join('; ')
}

const DIGITORY_FORMATS = ['Excel', 'PDF', 'Word', 'Screenshot', 'Şəkil']

function SeatingMethodSelector({ seatingPlan, seatingMethod, onPlanChange, onMethodChange }) {
  const [tables, setTables] = useState(() => parseTableTexts(seatingPlan))
  const [tableCount, setTableCount] = useState('')

  const commit = (next) => { setTables(next); onPlanChange(serializeTableTexts(next)) }

  const generateTables = () => {
    const n = Math.min(parseInt(tableCount, 10) || 0, 200)
    if (n < 1) return
    const cur = tables.length
    if (n <= cur) { commit(tables.slice(0, n)); return }
    const extra = Array.from({ length: n - cur }, (_, i) => ({
      id: `t${cur + i}_${Date.now()}`, name: `Masa ${cur + i + 1}`, text: '',
    }))
    commit([...tables, ...extra])
  }

  const s = {
    changeBtn: {
      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
      fontSize: 10, color: 'rgba(197,160,89,0.85)', letterSpacing: '0.1em',
      textDecoration: 'underline', textUnderlineOffset: 3, flexShrink: 0,
    },
    addBtn: {
      minHeight: 44, border: '1px dashed rgba(197,160,89,0.4)', background: 'transparent',
      color: 'rgba(197,160,89,0.85)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
      fontFamily: 'inherit', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    },
  }

  /* ── Method not chosen ── */
  if (!seatingMethod) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button type="button" onClick={() => onMethodChange('self')}
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', textAlign: 'left', border: '1px solid rgba(197,160,89,0.35)', background: 'rgba(253,250,244,0.85)', cursor: 'pointer', transition: 'border-color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(197,160,89,0.7)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(197,160,89,0.35)'}
        >
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(197,160,89,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={15} strokeWidth={1.5} style={{ color: 'rgba(197,160,89,0.85)' }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 3 }}>Özüm dolduracağam</div>
            <div style={{ fontSize: 11, color: 'rgba(140,123,107,0.7)', lineHeight: 1.5 }}>Masa sayını bildirin, qonaqları özünüz daxil edin</div>
          </div>
        </button>

        <button type="button" onClick={() => onMethodChange('digitory')}
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', textAlign: 'left', border: '1.5px solid rgba(197,160,89,0.65)', background: 'linear-gradient(135deg, rgba(253,250,244,0.95) 0%, rgba(250,243,220,0.95) 100%)', cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(197,160,89,1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(197,160,89,0.15)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(197,160,89,0.65)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(197,160,89,0.15)', border: '1px solid rgba(197,160,89,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={15} strokeWidth={1.5} style={{ color: 'rgba(197,160,89,1)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>DigiToy doldursun</span>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', background: 'rgba(197,160,89,0.18)', border: '1px solid rgba(197,160,89,0.55)', color: 'rgba(160,118,30,1)', padding: '2px 7px' }}>+15 AZN</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(140,123,107,0.7)', lineHeight: 1.5 }}>Qonaq siyahısını göndərin, biz sisteme yerləşdirərik</div>
          </div>
        </button>
      </div>
    )
  }

  /* ── DigiToy service card ── */
  if (seatingMethod === 'digitory') {
    return (
      <div style={{ border: '1.5px solid rgba(197,160,89,0.65)', background: 'linear-gradient(135deg, rgba(253,250,244,0.95) 0%, rgba(250,243,220,0.95) 100%)', padding: '22px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
              <Sparkles size={14} strokeWidth={1.5} style={{ color: 'rgba(197,160,89,1)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(197,160,89,1)' }}>DigiToy Xidməti</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', background: 'rgba(197,160,89,0.18)', border: '1px solid rgba(197,160,89,0.55)', color: 'rgba(160,118,30,1)', padding: '2px 9px' }}>+15 AZN</span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(60,50,40,0.8)', lineHeight: 1.7, margin: 0, maxWidth: 380 }}>
              Qonaq siyahısını Excel, PDF, Word, screenshot və ya şəkil kimi göndərin. Oturma planını sizin üçün sistemə yerləşdirəcəyik.
            </p>
          </div>
          <button type="button" onClick={() => onMethodChange(null)} style={s.changeBtn}>Dəyiş</button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16 }}>
          {DIGITORY_FORMATS.map(fmt => (
            <span key={fmt} style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', border: '1px solid rgba(197,160,89,0.4)', color: 'rgba(140,100,30,0.9)', padding: '5px 12px', background: 'rgba(253,250,244,0.9)' }}>
              {fmt}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 10, color: 'rgba(140,123,107,0.65)', lineHeight: 1.6, margin: '14px 0 0' }}>
          Sifariş tamamlandıqdan sonra qonaq siyahınızı WhatsApp vasitəsilə bizə göndərin.
        </p>
      </div>
    )
  }

  /* ── Self mode ── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(253,250,244,0.7)', border: '1px solid rgba(197,160,89,0.22)' }}>
        <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(140,123,107,0.65)' }}>Özüm dolduracağam</span>
        <button type="button" onClick={() => onMethodChange(null)} style={s.changeBtn}>Dəyiş</button>
      </div>

      {/* Table count generator */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="number" min="1" max="200"
          value={tableCount}
          onChange={e => setTableCount(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generateTables()}
          placeholder="Masa sayı (məs: 15)"
          style={{ flex: 1, minHeight: 44, padding: '0 14px', border: '1px solid rgba(197,160,89,0.35)', background: 'rgba(253,250,244,0.85)', outline: 'none', fontFamily: 'inherit', fontSize: 13, color: '#1a1a1a' }}
        />
        <button type="button" onClick={generateTables}
          style={{ minHeight: 44, padding: '0 18px', border: '1px solid rgba(197,160,89,0.55)', background: 'rgba(197,160,89,0.08)', color: 'rgba(160,118,30,1)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(197,160,89,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(197,160,89,0.08)'}
        >
          Yarat
        </button>
      </div>

      {/* Table cards */}
      {tables.map((table) => (
        <div key={table.id} style={{ border: '1px solid rgba(197,160,89,0.25)', background: 'rgba(253,250,244,0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid rgba(197,160,89,0.18)' }}>
            <input
              type="text" value={table.name}
              onChange={e => commit(tables.map(t => t.id === table.id ? { ...t, name: e.target.value } : t))}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: '#1a1a1a', minHeight: 36 }}
            />
            <button type="button" onClick={() => commit(tables.filter(t => t.id !== table.id))}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 28, minHeight: 28, border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(140,123,107,0.5)' }}>
              <X size={13} strokeWidth={1.5} />
            </button>
          </div>
          <textarea
            value={table.text}
            onChange={e => commit(tables.map(t => t.id === table.id ? { ...t, text: e.target.value } : t))}
            placeholder={'Murad Əliyev\nLeyla Məmmədova\nNicat Həsənov'}
            rows={4}
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', background: 'transparent', border: 'none', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: 12, fontWeight: 300, color: '#1a1a1a', lineHeight: 1.7 }}
          />
          <div style={{ padding: '4px 14px 8px', fontSize: 9, color: 'rgba(140,123,107,0.45)', letterSpacing: '0.06em' }}>
            {table.text.split('\n').filter(g => g.trim()).length} qonaq
          </div>
        </div>
      ))}

      <button type="button" onClick={() => commit([...tables, { id: `t${Date.now()}`, name: `Masa ${tables.length + 1}`, text: '' }])} style={s.addBtn}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(197,160,89,0.7)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(197,160,89,0.4)'}
      >
        <Plus size={11} strokeWidth={1.5} />
        Masa əlavə et
      </button>
    </div>
  )
}

const STEP_DESCRIPTIONS = {
  az: [
    'Toyunuz haqqında əsas məlumatları daxil edin.',
    'Tədbirinizin keçiriləcəyi məkanı xəritədə tapın.',
    'Günün əsas anları üçün proqram cədvəli yaradın.',
    'Qonaqlar üçün geyim tərzi seçin.',
    'Qonaqların öz masalarını asanlıqla tapması üçün.',
    'QR kod vasitəsilə xatirə şəkillərini toplayın.',
  ],
  en: [
    'Enter the key details about your event.',
    'Find and pin your event venue on the map.',
    'Create a schedule for the key moments of the day.',
    'Choose a dress code recommendation for your guests.',
    'Help guests find their table quickly and easily.',
    'Collect memories via QR photo sharing.',
  ],
  ru: [
    'Введите основную информацию о мероприятии.',
    'Найдите и отметьте место проведения на карте.',
    'Создайте программу на весь день.',
    'Выберите дресс-код для ваших гостей.',
    'Помогите гостям быстро найти свой стол.',
    'Собирайте воспоминания через QR-фотообмен.',
  ],
}

export default function BuilderForm({ lang, initialData, initialStep = null, onSubmit, isAdmin = false }) {
  const tr = t[lang]

  /* ── Paket kilidləmə — həmişə initialData.package oxunur, rol fərqi yoxdur ── */
  const pkgId = initialData?.package || localStorage.getItem('selected_package') || 'SADE'
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
  const [linkCopied,        setLinkCopied]        = useState(false)
  const [showApproveModal,  setShowApproveModal]  = useState(false)
  const [adminMode,         setAdminMode]         = useState(isAdmin)
  const [isHydrated,    setIsHydrated]    = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [approving,       setApproving]       = useState(false)
  const [approveError,    setApproveError]    = useState('')
  const [draftRestored,   setDraftRestored]   = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const sessionIdRef   = useRef(null)
  const autosaveTimer  = useRef(null)

  /* ── URL-dən data hydration (admin idarəetmə linki) ── */
  useEffect(() => {
    const urlParams   = new URLSearchParams(window.location.search)
    const adminToken  = urlParams.get('admin')
    const encodedData = urlParams.get('data')

    /* Admin statusu App.jsx tərəfindən isAdmin prop ilə ötürülür.
       sessionStorage tokeni varsa əlavə təsdiq kimi qəbul et. */
    if (adminToken) {
      const storedToken = sessionStorage.getItem('adminToken')
      const storedExp   = parseInt(sessionStorage.getItem('adminTokenExp') || '0', 10)
      if (storedToken && storedExp && Date.now() < storedExp * 1000) {
        setAdminMode(true)
      }
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

  /* ── Draft init: session_id yarat/oxu, admin modda keç ── */
  useEffect(() => {
    if (isAdmin) return
    let sid = localStorage.getItem('digitoy_session_id')
    if (!sid) {
      sid = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36)
      localStorage.setItem('digitoy_session_id', sid)
    }
    sessionIdRef.current = sid

    /* Admin URL-dən gəlmirsə draft-ı restore et */
    const hasUrlData = new URLSearchParams(window.location.search).get('data')
    if (!hasUrlData) {
      getDraft(sid)
        .then(function(draft) {
          if (!draft?.found || !draft.form_data) return
          setData(function(prev) { return { ...prev, ...draft.form_data } })
          if (draft.current_step > 1) setStep(draft.current_step)
          setDraftRestored(true) /* banner göstər */
        })
        .catch(function() {}) /* draft restore non-critical */
    }
  }, [isAdmin])

  /* ── Autosave: data/step dəyişəndə 800ms debounce ilə saxla ── */
  useEffect(() => {
    if (!isHydrated || !sessionIdRef.current || isAdmin) return
    clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(function() {
      const pkg = data.package || data.selectedPackage || pkgId || 'SADE'
      saveDraft(sessionIdRef.current, data, pkg, step).catch(function() {})
    }, 800)
    return function() { clearTimeout(autosaveTimer.current) }
  }, [data, step, isHydrated, isAdmin])

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
      const el = document.getElementById('builder-content') || document.getElementById('builder-section')
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' })
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
      trackEvent('builder_completed', { lang, package: pkgId, step: VISIBLE_TOTAL })
    } catch {
      /* üst komponent xətaları idarə edir */
    } finally {
      setSubmitLoading(false)
    }
  }

  /* ── Slug hesablama ── */
  const computeSlug = () => {
    const isC = COUPLE_TYPES.includes(data.eventType)
    const isP = CORP_TYPES.includes(data.eventType)
    if (isC) return `${toSlug(data.brideName)}-ve-${toSlug(data.groomName)}`
    if (isP) return toSlug(data.eventName || 'tedbir')
    return toSlug(data.brideName || 'davetname')
  }

  /* ── Draft sıfırlama: yeni session_id + boş form ── */
  const handleNewDraft = function() {
    const newSid = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('digitoy_session_id', newSid)
    sessionIdRef.current = newSid
    setData({ ...defaultWedding, package: pkgId })
    setStep(1)
    setErrors({})
    setDraftRestored(false)
    setShowResetConfirm(false)
  }

  /* ── Admin Təsdiqi: DB-yə yaz, draft approve et, sonra modal aç ── */
  const handleApproveAndGenerateLink = async () => {
    if (approving) return
    const slug = computeSlug()
    setApproving(true)
    setApproveError('')
    try {
      await saveInvitation(slug, data)

      /* draft_code URL-dən oxu, varsa approve et (slug ötür ki, admin paneldə link görsənsin) */
      const draftCode = new URLSearchParams(window.location.search).get('draft')
      if (draftCode) {
        try {
          await approveDraft(draftCode, slug)
        } catch (approveErr) {
          console.error('approve_draft uğursuz:', approveErr)
          /* saveInvitation rollback edilmir — dəvətnamə saxlanıldı */
        }
      }

      const link = buildShortLiveLink(slug)
      setGeneratedLiveLink(link)
      setLinkCopied(false)
      setShowApproveModal(true)
    } catch (err) {
      const status = err?.message?.match(/\d+/)?.[0] || ''
      setApproveError(status === '401'
        ? 'Sessiya bitib. Səhifəni yeniləyib yenidən giriş edin.'
        : 'Saxlama uğursuz oldu. Yenidən cəhd edin.'
      )
    } finally {
      setApproving(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLiveLink).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    })
  }

  return (
    <div id="builder-top" className="max-w-2xl mx-auto">

      {/* ── Draft Restore Banner ── */}
      {draftRestored && !isAdmin && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', marginBottom: 16,
          background: 'linear-gradient(135deg, oklch(97% 0.02 85) 0%, oklch(95% 0.035 80) 100%)',
          border: '1px solid oklch(82% 0.07 80)',
          borderRadius: 4,
          gap: 12,
        }}>
          <span style={{
            fontSize: 11, letterSpacing: '0.04em',
            color: 'oklch(35% 0.04 60)', fontFamily: '"Inter",system-ui,sans-serif',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 13 }}>↩</span>
            Əvvəlki dəvətnaməniz yükləndi
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              style={{
                fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'oklch(55% 0.09 60)', fontFamily: '"Inter",system-ui,sans-serif',
                fontWeight: 600, background: 'none', border: 'none',
                cursor: 'pointer', padding: '2px 6px',
                borderBottom: '1px solid oklch(72% 0.07 80)',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'oklch(35% 0.08 60)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'oklch(55% 0.09 60)' }}
            >
              Yeni Başlat
            </button>
            <button
              type="button"
              onClick={() => setDraftRestored(false)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'oklch(65% 0.04 60)', lineHeight: 1, padding: '2px 4px',
                fontSize: 14, display: 'flex', alignItems: 'center',
              }}
              aria-label="Bağla"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ── Sıfırlama Təsdiq Modalı ── */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[200] px-4"
          style={{ background: 'rgba(15,10,5,0.6)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowResetConfirm(false) }}
        >
          <div
            className="bg-cream shadow-2xl max-w-sm w-full"
            style={{
              border: '1px solid rgba(197,160,89,0.35)',
              position: 'relative',
            }}
          >
            <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.9) 30%,rgba(197,160,89,1) 50%,rgba(197,160,89,0.9) 70%,transparent)' }} />
            <div className="px-8 py-8 text-center">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="absolute top-4 right-4 text-brown-muted/40 hover:text-gold transition-colors"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
              <p className="font-mono text-[9px] tracking-[0.32em] uppercase text-gold mb-4">
                Yeni Dəvətnamə
              </p>
              <p className="font-serif text-lg text-ink font-light tracking-tight mb-2">
                Əminsiniz?
              </p>
              <p className="text-brown-muted text-sm font-light leading-relaxed mb-7 max-w-xs mx-auto">
                Cari qaralama silinəcək. Yeni dəvətnaməyə başlamaq istəyirsiniz?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleNewDraft}
                  className="flex-1 btn-gold text-xs py-3"
                >
                  Bəli, başla
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 btn-outline-gold text-xs py-3"
                >
                  Ləğv et
                </button>
              </div>
            </div>
            <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.6) 40%,rgba(197,160,89,0.8) 50%,rgba(197,160,89,0.6) 60%,transparent)' }} />
          </div>
        </div>
      )}

      {/* ── Təsdiq Modalı ── */}
      {showApproveModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[200] px-4"
          style={{ background: 'rgba(15,10,5,0.65)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowApproveModal(false) }}
        >
          <div className="bg-cream border border-beige-dark/60 shadow-2xl max-w-lg w-full animate-fade-up" style={{ position: 'relative' }}>
            {/* Üst qızıl xətt */}
            <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.9) 30%,rgba(197,160,89,1) 50%,rgba(197,160,89,0.9) 70%,transparent)' }} />

            <div className="px-10 py-10">
              {/* Bağla düyməsi */}
              <button
                onClick={() => setShowApproveModal(false)}
                className="absolute top-5 right-5 text-brown-muted/40 hover:text-gold transition-colors"
                style={{ lineHeight: 1 }}
              >
                <X size={16} strokeWidth={1.5} />
              </button>

              <div className="text-center mb-8">
                <div className="gold-divider mb-6 max-w-[60px] mx-auto" />
                <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-3 font-medium">Uğurlu Təsdiq</p>
                <h3 className="font-serif text-2xl text-ink font-light tracking-tight mb-3">
                  Sifariş Təsdiqləndi!
                </h3>
                <p className="text-brown-muted text-sm font-light leading-relaxed max-w-sm mx-auto">
                  Müştəriyə göndəriləcək yekun dəvətnamə linki hazırdır. Kopyalayıb WhatsApp vasitəsilə müştəriyə göndərin.
                </p>
              </div>

              {/* Link qutusu */}
              <div className="bg-beige border border-beige-dark/60 px-5 py-4 mb-6">
                <p className="text-[9px] tracking-[0.22em] uppercase text-brown-muted/60 mb-2 font-medium">
                  🔗 Müştəri Dəvətnamə Linki
                </p>
                <p className="font-mono text-xs text-ink break-all leading-relaxed select-all">
                  {generatedLiveLink}
                </p>
              </div>

              {/* Düymələr */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 btn-gold text-xs"
                >
                  {linkCopied ? '✓ Kopyalandı!' : 'Linki Kopyala'}
                </button>
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 btn-outline-gold text-xs"
                >
                  Bağla
                </button>
              </div>

              <div className="gold-divider mt-8 max-w-[60px] mx-auto" />
            </div>

            {/* Alt qızıl xətt */}
            <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.9) 30%,rgba(197,160,89,1) 50%,rgba(197,160,89,0.9) 70%,transparent)' }} />
          </div>
        </div>
      )}

      {/* Mobile step label — compact "Addım X / Y · Title" */}
      <div className="sm:hidden flex items-center justify-between mb-4">
        <span className="text-[9px] tracking-[0.28em] uppercase text-gold font-medium font-sans">
          {step} / {VISIBLE_TOTAL}
        </span>
        <span className="text-[9px] tracking-[0.14em] uppercase text-brown-muted/60 font-sans truncate ml-3 max-w-[55%] text-right">
          {steps[actualStep - 1]}
        </span>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8 sm:mb-12">
        {visibleSteps.map((actualN, i) => {
          const n = i + 1
          const done = n < step
          const active = n === step
          const title = steps[actualN - 1]
          return (
            <div key={actualN} className="flex items-center flex-1 last:flex-none last:flex-initial">
              <button
                type="button"
                onClick={() => setStep(n)}
                className="flex flex-col items-center gap-2.5 focus:outline-none group min-w-[48px] min-h-[48px] justify-center touch-manipulation"
              >
                <div className={`w-8 h-8 flex items-center justify-center transition-all duration-250 ${
                  done
                    ? 'bg-gold shadow-[0_2px_10px_rgba(197,160,89,0.35)] group-hover:opacity-80'
                    : active
                    ? 'border-2 border-gold bg-cream shadow-[0_0_0_4px_rgba(197,160,89,0.08)]'
                    : 'border border-beige-dark/50 bg-transparent group-hover:border-gold/40'
                }`}>
                  {done
                    ? <Check size={12} strokeWidth={2.5} className="text-white" />
                    : <span className={`text-[11px] font-medium font-sans ${active ? 'text-gold' : 'text-brown-muted/38 group-hover:text-brown-muted/60'}`}>{n}</span>
                  }
                </div>
                <span className={`hidden sm:block text-[8.5px] tracking-[0.14em] uppercase text-center max-w-[60px] leading-tight font-sans font-medium transition-colors duration-200 ${
                  done ? 'text-brown-muted/45' : active ? 'text-gold' : 'text-brown-muted/28 group-hover:text-brown-muted/45'
                }`}>
                  {title}
                </span>
              </button>
              {i < visibleSteps.length - 1 && (
                <div className={`flex-1 h-px mx-2 sm:mx-3 transition-colors duration-500 ${done ? 'step-line-active' : 'bg-beige-dark/35'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="bg-cream border border-beige-dark/40 shadow-[0_1px_4px_rgba(0,0,0,0.04),0_8px_32px_rgba(197,160,89,0.04)] px-6 sm:px-12 py-10 sm:py-14 overflow-visible">
        <div className="mb-8 pb-6 border-b border-beige-dark/25">
          <h3 className="font-serif text-2xl text-ink font-light tracking-tight mb-2">{steps[actualStep - 1]}</h3>
          <p className="text-[11.5px] text-brown-muted/60 font-sans font-light leading-relaxed">{(STEP_DESCRIPTIONS[lang] || STEP_DESCRIPTIONS.az)[actualStep - 1]}</p>
        </div>

        {/* STEP 1 */}
        {actualStep === 1 && (
          <div className="space-y-8 pb-10">
            {/* Tədbir növü */}
            <div>
              <Label>{tr.event_type || 'Tədbir növü'}</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                {EVENT_TYPES.map(({ id }) => {
                  const Icon = EVENT_ICONS[id]
                  const label = tr[`event_${id}`]
                  const selected = data.eventType === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set('eventType', id)}
                      className={`flex flex-col items-center gap-3 py-7 border transition-all duration-200 group touch-manipulation ${
                        selected
                          ? 'border-gold bg-gold/[0.05] text-gold shadow-[0_4px_20px_rgba(197,160,89,0.12)]'
                          : 'border-beige-dark/55 text-brown-muted/55 hover:border-gold/45 hover:text-gold/80 hover:bg-gold/[0.02] hover:shadow-[0_2px_12px_rgba(197,160,89,0.07)]'
                      }`}
                    >
                      <div className={`transition-transform duration-200 ${selected ? '' : 'group-hover:scale-110'}`}>
                        <Icon size={22} strokeWidth={1.4} />
                      </div>
                      <span className="text-[9.5px] tracking-[0.16em] uppercase font-sans font-medium">{label}</span>
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
          <ProgramStepWithTemplates
            rows={data.programSteps || []}
            onChange={(rows) => set('programSteps', rows)}
            tr={tr}
            lang={lang}
          />
        )}

        {/* STEP 4 — Dress Code */}
        {actualStep === 4 && (
          <div className="space-y-8">
            <div>
              <Label>{tr.dresscode_type_label}</Label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                {[
                  { id: 'blacktie',    label: tr.dresscode_blacktie_label    || 'Black Tie',    subKey: 'dresscode_blacktie_sub',    colors: ['#1A1A1A', '#F5F5F5', '#C9A84C'] },
                  { id: 'cocktail',    label: tr.dresscode_cocktail_label    || 'Cocktail',     subKey: 'dresscode_cocktail_sub',    colors: ['#C4956A', '#E8D5C4', '#8B6347'] },
                  { id: 'smartcasual', label: tr.dresscode_smartcasual_label || 'Smart Casual', subKey: 'dresscode_smartcasual_sub', colors: ['#6B8CAE', '#D4E4F0', '#4A6B8A'] },
                  { id: 'creative',    label: tr.dresscode_creative_label    || 'Creative',     subKey: 'dresscode_creative_sub',    colors: ['#9B6B9B', '#F0C4D4', '#6B9B6B'] },
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
              <SeatingMethodSelector
                seatingPlan={data.seatingPlan}
                seatingMethod={data.seatingMethod}
                onPlanChange={(val) => set('seatingPlan', val)}
                onMethodChange={(val) => set('seatingMethod', val)}
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
      <div className="flex justify-between mt-8 sm:mt-10">
        <button
          type="button"
          onClick={prev}
          disabled={step === 1}
          className="flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-3.5 min-h-[46px] border border-beige-dark/55 text-brown-muted/70 text-[10px] tracking-[0.22em] uppercase font-sans font-medium hover:border-gold/55 hover:text-gold hover:bg-gold/[0.02] transition-all duration-200 active:scale-[0.97] disabled:opacity-20 disabled:cursor-not-allowed touch-manipulation"
        >
          <ChevronLeft size={12} strokeWidth={2} />
          {tr.btn_prev}
        </button>

        {step < VISIBLE_TOTAL ? (
          <button type="button" onClick={next} className="flex items-center gap-2.5 btn-gold min-h-[46px] shadow-[0_4px_18px_rgba(197,160,89,0.2)] touch-manipulation">
            {tr.btn_next}
            <ChevronRight size={12} strokeWidth={2} />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={submitLoading} className="btn-gold min-h-[46px] shadow-[0_4px_18px_rgba(197,160,89,0.2)] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed">
            {submitLoading ? '…' : tr.btn_create}
          </button>
        )}
      </div>

      {/* ── Admin İdarəetmə Paneli ── */}
      {(isAdmin || adminMode) && (
        <div
          className="mt-8 border border-emerald-600/25"
          style={{ background: 'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)' }}
        >
          <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(16,185,129,0.6) 40%,rgba(16,185,129,0.8) 50%,rgba(16,185,129,0.6) 60%,transparent)' }} />
          <div className="px-8 py-7 text-center">
            <p className="text-[10px] tracking-[0.28em] uppercase text-emerald-700 font-semibold mb-2">
              ⚡ Admin Paneli
            </p>
            <p className="text-sm text-emerald-800/70 font-light leading-relaxed mb-6 max-w-sm mx-auto">
              Müştərinin məlumatlarını yuxarıda redaktə edin. Hər şey hazır olduqda müştəriyə göndəriləcək yekun linki yaradın.
            </p>
            <button
              type="button"
              onClick={handleApproveAndGenerateLink}
              disabled={approving}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[11px] tracking-[0.2em] uppercase font-semibold transition-colors duration-200 shadow-md"
            >
              <Check size={13} strokeWidth={2.5} />
              {approving ? 'Saxlanılır...' : 'Sifarişi Təsdiqlə'}
            </button>
            {approveError && (
              <p className="text-[11px] text-red-500 font-medium mt-3">
                {approveError}
              </p>
            )}
          </div>
          <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(16,185,129,0.6) 40%,rgba(16,185,129,0.8) 50%,rgba(16,185,129,0.6) 60%,transparent)' }} />
        </div>
      )}
    </div>
  )
}

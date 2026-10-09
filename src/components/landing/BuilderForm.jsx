import { useState, useEffect, useRef, useCallback } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import {
  Heart, Diamond, Cake, Briefcase, Sparkles,
  ChevronRight, ChevronLeft, Check, Crown, Shirt, Calendar, User, MapPin, Search,
  Download, Archive, Minus, X, GripVertical, MessageCircle,
  Martini, Palette,
  /* Phase 35 — bölmələr addımı + şablon addımı ikonları */
  Clock, ListOrdered, Users, Image as ImageIcon, UserCheck, Music,
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
import { resolveDressGenders } from '../../data/dressCode'
import { PACKAGE_DEFS, getLockedSteps } from '../../data/packages'
import { listBuilderSections, isSectionOn } from '../../data/sections'
import LoveStoryStep from './LoveStoryStep'
import { ACTIVE_PARTNERS } from '../../data/partners'
import MusicStep from './MusicStep'
import TemplateSelect from './TemplateSelect'
import { resolveBuilderTemplateId } from '../../templates/templateConfig'
import { computeInviteSlug } from '../../utils/inviteSlug'
import { defaultWedding } from '../../data/defaultWedding'
import { buildShortLiveLink } from '../../utils/whatsappOrder'
import { formatFullDateByLang } from '../../utils/dateFormat'
import { pushView, patchState, currentUrl } from '../../utils/navHistory'
import { saveDraft, getDraft, submitDraft, saveInvitation, approveDraft } from '../../utils/api'
import { saveBuilderSnapshot, readBuilderSnapshot } from '../../utils/builderSession'
import t from '../../data/translations'
import BuilderShell, { StepCard, GhostButton } from '../builder/BuilderShell'
import { ChoiceGroup, SelectCard, AddButton } from '../builder/fields'
import { SectionToggleRow, ToggleList, OptionCard, PaletteCard, PartnerCard as PartnerOfferCard, QrShareCard } from '../builder/choices'
import { Notice, NoticeButton, ConfirmDialog } from '../builder/feedback'
import { inputBase, ringState, labelClass, hintClass } from '../builder/styles'
import { trackEvent } from '../../utils/analytics'

const EVENT_ICONS = { toy: Heart, nishan: Diamond, birthday: Cake, corporate: Briefcase, other: Sparkles }
const COUPLE_TYPES = ['toy', 'nishan']
const CORP_TYPES   = ['corporate', 'other']

/* Phase 25.3 — Dress Code premium kartları: ikon + başlıq + açıqlama.
   Mətnlər translations.js-dəki dresscode_*_label / _sub açarlarından gəlir. */
const DRESS_CODE_OPTIONS = [
  { id: 'blacktie',    icon: Crown,   colors: ['#1A1A1A', '#F5F5F5', '#C9A84C'] },
  { id: 'cocktail',    icon: Martini, colors: ['#C4956A', '#E8D5C4', '#8B6347'] },
  { id: 'smartcasual', icon: Shirt,   colors: ['#6B8CAE', '#D4E4F0', '#4A6B8A'] },
  { id: 'creative',    icon: Palette, colors: ['#9B6B9B', '#F0C4D4', '#6B9B6B'] },
]

/* ── Çoxdilli təqvim massivləri ── */
const calendarTranslations = {
  az: {
    weekDays: ['B.', 'B.E.', 'Ç.A.', 'Ç.', 'C.A.', 'C.', 'Ş.'],
    months: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'],
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
        <Search size={18} strokeWidth={1.6} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep" />
        <input
          ref={inputRef}
          type="text"
          defaultValue={value || ''}
          placeholder={tr.venue_search_placeholder}
          className={`${inputBase} ${ringState(false)} h-12 pl-11 pr-4 sm:h-14`}
        />
      </div>
      {success && (
        <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-olive">
          <MapPin size={13} /> {tr.venue_search_success}
        </p>
      )}
      <div className="relative mt-4 overflow-hidden rounded-2xl ring-1 ring-gold/25">
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
        className="grid h-11 w-11 place-items-center rounded-[12px] bg-gold-mist/60 text-xl ring-1 ring-inset ring-gold/30 transition-colors hover:bg-gold-mist"
        title="İkon seç"
        aria-label="İkon seç"
      >
        {value || '✨'}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-[120] mt-1.5 grid w-56 grid-cols-5 gap-1.5 rounded-2xl bg-white p-2.5 shadow-luxe ring-1 ring-gold/25">
          {PROGRAM_ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => { onSelect(ic); setOpen(false) }}
              className={`grid h-9 w-9 place-items-center rounded-[10px] text-xl transition-colors ${value === ic ? 'bg-gold-mist ring-1 ring-inset ring-gold' : 'hover:bg-cream'}`}
            >
              {ic}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* Stabil id generatoru — şablon və əl ilə yaradılan addımlar eyni davranış üçün */
let _programRowSeq = 0
const genProgramRowId = () => `p_${Date.now().toString(36)}_${(_programRowSeq++).toString(36)}`

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
)

function DragHandle({ controls }) {
  return (
    <button
      type="button"
      aria-label="Sıralamaq üçün sürüklə"
      onPointerDown={(e) => controls.start(e)}
      className="grid h-11 w-11 flex-shrink-0 cursor-grab place-items-center rounded-full text-brown-muted transition-colors hover:bg-gold-mist/60 hover:text-gold-deep active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      <GripVertical size={16} strokeWidth={1.5} />
    </button>
  )
}

/* Tək program sətri — sağda sürükləmə tutacağı ilə yenidən sıralana bilir */
function ProgramRow({ row, update, removeRow, activityRefs, tr }) {
  const controls = useDragControls()
  return (
    <Reorder.Item
      value={row}
      dragListener={false}
      dragControls={controls}
      as="div"
      className="flex flex-col gap-2 rounded-2xl bg-white p-3 ring-1 ring-inset ring-beige-dark sm:flex-row sm:items-center sm:gap-3 sm:p-2.5"
      style={{ position: 'relative' }}
      whileDrag={{ scale: 1.015, boxShadow: '0 10px 28px rgba(0,0,0,0.14)', zIndex: 5 }}
    >
      {/* Mobil: saat + (sağda) ikon+sil+tutacaq */}
      <div className="flex items-center gap-2">
        <TimeInput
          value={row.time}
          onChange={(v) => update(row.id, 'time', v)}
          onComplete={() => activityRefs.current[row.id]?.focus()}
          placeholder="19:00"
          className="h-12 w-[88px] flex-shrink-0 rounded-[12px] bg-cream text-center text-[16px] font-medium tabular-nums text-ink ring-1 ring-inset ring-beige-dark focus:outline-none focus:ring-2 focus:ring-gold-deep sm:w-[92px]"
        />
        <div className="flex items-center gap-1 ml-auto sm:hidden">
          <IconPickerBtn value={row.icon} onSelect={(ic) => update(row.id, 'icon', ic)} />
          <button type="button" onClick={() => removeRow(row.id)} className="grid h-11 w-11 place-items-center rounded-full text-brown-muted transition-colors hover:bg-rust-mist hover:text-rust touch-manipulation" aria-label="Sil">
            <DeleteIcon />
          </button>
          <DragHandle controls={controls} />
        </div>
      </div>
      {/* Fəaliyyət input — mobil-da tam en */}
      <input
        ref={(el) => { activityRefs.current[row.id] = el }}
        type="text"
        value={row.activity}
        onChange={(e) => update(row.id, 'activity', e.target.value)}
        placeholder={tr.program_step_activity_placeholder}
        className="h-12 w-full rounded-[12px] bg-cream px-3.5 text-[16px] text-ink ring-1 ring-inset ring-beige-dark placeholder:text-brown-muted/80 focus:outline-none focus:ring-2 focus:ring-gold-deep sm:min-w-0 sm:flex-1"
      />
      {/* Desktop-da ikon+sil+tutacaq */}
      <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
        <IconPickerBtn value={row.icon} onSelect={(ic) => update(row.id, 'icon', ic)} />
        <button type="button" onClick={() => removeRow(row.id)} className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full text-brown-muted transition-colors hover:bg-rust-mist hover:text-rust" aria-label="Sil">
          <DeleteIcon />
        </button>
        <DragHandle controls={controls} />
      </div>
    </Reorder.Item>
  )
}

function ProgramStepEditor({ rows, onChange, tr }) {
  const activityRefs = useRef({})

  /* Hər sətrə stabil id təmin et — şablon və əl ilə yaradılanlar eyni davranır */
  useEffect(() => {
    if (rows.some(r => !r.id)) {
      onChange(rows.map(r => r.id ? r : { ...r, id: genProgramRowId() }))
    }
  }, [rows, onChange])

  const update = (id, field, val) =>
    onChange(rows.map(r => r.id === id ? { ...r, [field]: val } : r))

  const addRow = () => onChange([...rows, { id: genProgramRowId(), time: '', icon: '', activity: '' }])

  const removeRow = (id) => onChange(rows.filter(r => r.id !== id))

  return (
    <div className="space-y-4">
      <Reorder.Group axis="y" values={rows} onReorder={onChange} as="div" className="space-y-3">
        {rows.map((row) => (
          <ProgramRow
            key={row.id || row.activity + row.time}
            row={row}
            update={update}
            removeRow={removeRow}
            activityRefs={activityRefs}
            tr={tr}
          />
        ))}
      </Reorder.Group>
      <AddButton onClick={addRow}>{String(tr.program_add_row || '').replace(/^\+\s*/, '')}</AddButton>
      <p className={hintClass}>{tr.program_hint}</p>
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
    en: [{ time:'17:30',icon:'🥂',activity:'Guest Welcome' },{ time:'18:00',icon:'💒',activity:"Groom & Bride's Entrance" },{ time:'18:30',icon:'📸',activity:'Family Photos' },{ time:'19:00',icon:'🎤',activity:'Opening Speech' },{ time:'19:30',icon:'🍽️',activity:'Dinner' },{ time:'20:30',icon:'💃',activity:'First Dance' },{ time:'21:00',icon:'🎉',activity:'Entertainment' },{ time:'22:00',icon:'🎂',activity:'Cake Cutting' },{ time:'23:00',icon:'🌙',activity:"Evening's End" }],
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
          <p className="text-[11px] font-semibold uppercase tracking-label text-gold-deep">{ui.title}</p>
          <p className="mt-1 text-[14px] text-brown-dark/85">{ui.sub}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TPL_KEYS.map(key => (
            <button
              key={key}
              type="button"
              onClick={() => applyTemplate(key)}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white px-3 py-5 ring-1 ring-inset ring-beige-dark transition-[transform,box-shadow] duration-300 ease-luxe hover:-translate-y-0.5 hover:shadow-soft hover:ring-gold/60 touch-manipulation"
            >
              <span className="text-2xl leading-none">{TPL_ICONS[key]}</span>
              <span className="text-[13px] font-semibold text-ink">{ui.labels[key]}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => { onChange([{ time:'', icon:'', activity:'' }]); setShowSelector(false) }}
          className="min-h-[48px] w-full rounded-2xl border border-dashed border-gold/50 text-[12px] font-semibold uppercase tracking-label text-gold-deep transition-colors hover:bg-gold-mist/40"
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
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-white px-4 text-[11.5px] font-semibold uppercase tracking-label text-gold-deep ring-1 ring-inset ring-gold/40 transition-colors hover:bg-gold-mist/60 touch-manipulation"
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

/* Builder blokunun başına hamar sürüşdür (addım dəyişəndə) */
function scrollBuilderToTop() {
  setTimeout(() => {
    const el = document.getElementById('builder-content') || document.getElementById('builder-section')
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' })
  }, 60)
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
  const panelRef = useRef(null)

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

  /* açılanda panel tam görünsün — mobil alt naviqasiya da onu örtməsin */
  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => panelRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))
    return () => cancelAnimationFrame(id)
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
      <div className={`flex h-12 items-center rounded-2xl bg-white pl-4 pr-1.5 sm:h-14 ring-1 ring-inset transition-shadow duration-300 focus-within:ring-2 ${hasError ? 'ring-rust/70 focus-within:ring-rust' : 'ring-beige-dark hover:ring-gold/60 focus-within:ring-gold-deep'}`}>
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="GG.AA.YYYY"
          maxLength={10}
          aria-invalid={hasError || undefined}
          className="min-w-0 flex-1 bg-transparent text-[16px] tabular-nums text-ink placeholder:text-brown-muted/80 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-label="Təqvimi aç"
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-full text-gold-deep transition-colors hover:bg-gold-mist/70"
        >
          <Calendar size={18} strokeWidth={1.6} />
        </button>
      </div>

      {/* canlı tarix mətni */}
      {value && (
        <p className="mt-2 font-serif text-[16px] italic text-gold-deep">
          {formatFullDateByLang(value, lang)}
        </p>
      )}

      {/* təqvim paneli — axında (inline): kartın overflow-hidden-i onu kəsmir,
          sticky alt naviqasiya üçün scroll-margin saxlanılır */}
      {open && (
        <div
          ref={panelRef}
          className="mt-3 w-full max-w-[340px] scroll-mb-28 scroll-mt-24 animate-fade-in rounded-2xl bg-white p-4 shadow-luxe ring-1 ring-gold/25 [animation-duration:250ms]"
        >
          {/* başlıq */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth} aria-label="Əvvəlki ay"
              className="grid h-10 w-10 place-items-center rounded-full text-gold-deep transition-colors hover:bg-gold-mist/70">
              <ChevronLeft size={14} strokeWidth={1.5} />
            </button>
            <span className="text-[12px] font-semibold uppercase tracking-label text-ink">
              {calLang.months[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} aria-label="Növbəti ay"
              className="grid h-10 w-10 place-items-center rounded-full text-gold-deep transition-colors hover:bg-gold-mist/70">
              <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* həftə günləri */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {calLang.weekDays.map((d) => (
              <div key={d} className="py-1 text-center text-[10.5px] font-semibold text-brown-muted">{d}</div>
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
                className={`grid h-9 w-full place-items-center rounded-full text-[13px] tabular-nums transition-colors duration-150 ${
                  isSelected(day)
                    ? 'bg-espresso font-semibold text-gold-light'
                    : isToday(day)
                    ? 'text-gold-deep ring-1 ring-inset ring-gold'
                    : 'text-ink hover:bg-gold-mist/70'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

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
    <div className="flex h-12 items-center rounded-2xl bg-white px-4 sm:h-14 ring-1 ring-inset ring-beige-dark transition-shadow duration-300 hover:ring-gold/60 focus-within:ring-2 focus-within:ring-gold-deep">
      <Clock size={18} strokeWidth={1.6} className="mr-3 shrink-0 text-gold-deep" aria-hidden="true" />
      <input
        type="text"
        inputMode="numeric"
        value={timeInputValue}
        onChange={handleTimeInputChange}
        placeholder="19:00"
        maxLength={5}
        className="min-w-0 flex-1 bg-transparent text-[16px] tabular-nums text-ink placeholder:text-brown-muted/80 focus:outline-none"
      />
    </div>
  )
}

/* ══════════════════════════════════════════════════
   Sadə köməkçi komponentlər
══════════════════════════════════════════════════ */
/* UI redesign (2026-10): görünüş builder/styles.js-dən — yeni komponentlərlə eyni */
function Label({ children, required }) {
  return (
    <label className={labelClass}>
      {children}
      {required && <span className="ml-1 text-gold-deep" aria-hidden="true">*</span>}
    </label>
  )
}

function Input({ className = '', invalid = false, ...props }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={`${inputBase} ${ringState(invalid)} h-12 px-4 sm:h-14 ${className}`}
    />
  )
}

function Textarea({ ...props }) {
  return (
    <textarea
      {...props}
      rows={5}
      className={`${inputBase} ${ringState(false)} min-h-[140px] resize-y px-4 py-3.5 leading-relaxed`}
    />
  )
}

/* ══════════════════════════════════════════════════
   Foto Paylaşım Addımı (Step 6) — Builder
   Müştəriyə: QR önizlənməsi + link
   Admin: + Masa Kartını HD SVG Endir düyməsi
══════════════════════════════════════════════════ */
function GalleryAdminStep({ data, isCouple, isCorp, isAdmin = false, canonicalSlug = '' }) {
  const qrExportRef = useRef()
  const [copied, setCopied] = useState(false)

  /* KANONİK slug prioritetlidir. Adlardan hesablanan slug yalnız
     dəvətnamə hələ saxlanılmayıbkı önizləmə üçündür — QR kodu ondan
     çap etmək iki eyni adlı toyu eyni `uploads/<slug>/` qovluğuna
     yönəldərdi (bir toyun qonaqları digərinin qalereyasına yükləyər). */
  const slug = canonicalSlug || computeInviteSlug(data)

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
      ? xmlEsc(`${data.groomName || ''} & ${data.brideName || ''}`)
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

  return (
    <div className="space-y-4">
      {/* Gizli export QR — 150×150, tam vector, DOM-da mövcuddur */}
      <div ref={qrExportRef} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: -9999, left: -9999 }}>
        <QRCodeSVG value={photoShareUrl} size={150} bgColor="white" fgColor="#1A140C" level="M" />
      </div>

      <QrShareCard
        qr={<QRCodeSVG value={photoShareUrl} size={140} bgColor="transparent" fgColor="rgba(26,20,12,0.88)" level="M" />}
        url={photoShareUrl}
        features={['QR paylaşım', 'Şəxsi qalereya', 'HD yükləmə', 'ZIP export']}
        title="Qonaqlar bu QR vasitəsilə şəkil göndərəcək"
        text={canonicalSlug
          ? 'Masa kartlarına bu QR kodu yapışdırın. Qonaqlar skan edərək toy şəkillərini birbaşa sistemə yükləyəcəklər.'
          /* Təsdiqdən əvvəl slug-ın sifariş suffiksi hələ yoxdur — bu QR işləməyən
             (və ya başqasının) ünvanına apara bilər, çap edilməməlidir */
          : 'Bu QR nümunədir: əsl QR kod dəvətnamə təsdiqləndikdən sonra hazırlanır və sizə göndərilir. Qonaqlar onu skan edərək toy şəkillərini birbaşa sistemə yükləyəcəklər.'}
      />

      {/* Admin: SVG masa kartı + müştərinin qalereya idarəetmə linki */}
      {isAdmin && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={downloadQR}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-center text-[11.5px] font-semibold uppercase tracking-label text-gold-deep ring-1 ring-inset ring-gold/45 transition-colors hover:bg-gold-mist/50"
          >
            <Download size={15} strokeWidth={1.6} />
            Masa Kartını HD (SVG) Endir — Mətbəə Keyfiyyəti
          </button>

          <div className="rounded-2xl bg-gold-mist/40 p-4 ring-1 ring-inset ring-gold/25 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-label text-gold-deep">
              Müştərinin Şəxsi Qalereya İdarəetmə Linki
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-brown-dark">
              Aşağıdakı linki müştəriyə göndər — buradan qonaqların yüklədiyi şəkilləri görə, seçə və .zip endirə biləcək:
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white p-1.5 pl-4 ring-1 ring-inset ring-beige-dark">
              <input
                readOnly
                value={galeryaIdareUrl}
                onClick={e => e.target.select()}
                aria-label="Qalereya idarəetmə linki"
                className="min-w-0 flex-1 truncate bg-transparent font-mono text-[12px] text-brown-dark focus:outline-none"
              />
              <button
                type="button"
                onClick={copyGaleryaLink}
                className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[12px] px-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                  copied ? 'bg-olive text-white' : 'bg-espresso text-cream hover:bg-espresso-soft'
                }`}
              >
                {copied
                  ? <><Check size={13} strokeWidth={2} /> Kopyalandı</>
                  : <><Archive size={13} strokeWidth={1.6} /> Linki Kopyala</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════
   Əsas Builder Formu
══════════════════════════════════════════════════ */

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

/* Phase 45 — bu addım EN/RU builder-də də Azərbaycanca qalırdı (`lang` gəlirdi,
   amma işlədilmirdi). AZ mətnlər əvvəlki ilə eynidir (yalnız «sisteme» → «sistemə»). */
const SEATING_UI = {
  az: {
    selfTitle: 'Özüm dolduracağam', selfDesc: 'Masa sayını bildirin, qonaqları özünüz daxil edin',
    svcTitle: 'DigiToy doldursun', svcDesc: 'Qonaq siyahısını göndərin, biz sistemə yerləşdirərik',
    svcName: 'DigiToy Xidməti',
    svcLong: 'Qonaq siyahısını Excel, PDF, Word, screenshot və ya şəkil kimi göndərin. Oturma planını sizin üçün sistemə yerləşdirəcəyik.',
    svcNote: 'Sifariş tamamlandıqdan sonra qonaq siyahınızı WhatsApp vasitəsilə bizə göndərin.',
    change: 'Dəyiş', countPh: 'Masa sayı (məs: 15)', create: 'Yarat', guests: 'qonaq',
    addTable: 'Masa əlavə et', table: 'Masa', photo: 'Şəkil',
  },
  en: {
    selfTitle: 'I will fill it in myself', selfDesc: 'Set the number of tables and add your guests yourself',
    svcTitle: 'Let DigiToy fill it in', svcDesc: 'Send us your guest list and we will add it to the system',
    svcName: 'DigiToy service',
    svcLong: 'Send your guest list as Excel, PDF, Word, a screenshot or a photo. We will set up the seating plan for you.',
    svcNote: 'Once your order is complete, send us your guest list via WhatsApp.',
    change: 'Change', countPh: 'Number of tables (e.g. 15)', create: 'Create', guests: 'guests',
    addTable: 'Add table', table: 'Table', photo: 'Photo',
  },
  ru: {
    selfTitle: 'Заполню сам(а)', selfDesc: 'Укажите число столов и добавьте гостей самостоятельно',
    svcTitle: 'Пусть заполнит DigiToy', svcDesc: 'Пришлите список гостей — мы внесём его в систему',
    svcName: 'Услуга DigiToy',
    svcLong: 'Отправьте список гостей в Excel, PDF, Word, скриншотом или фото. Мы сами внесём план рассадки.',
    svcNote: 'После оформления заказа отправьте нам список гостей через WhatsApp.',
    change: 'Изменить', countPh: 'Число столов (напр. 15)', create: 'Создать', guests: 'гостей',
    addTable: 'Добавить стол', table: 'Стол', photo: 'Фото',
  },
}

function SeatingMethodSelector({ seatingPlan, seatingMethod, onPlanChange, onMethodChange, lang = 'az' }) {
  const ui = SEATING_UI[lang] || SEATING_UI.az
  const DIGITORY_FORMATS = ['Excel', 'PDF', 'Word', 'Screenshot', ui.photo]
  const [tables, setTables] = useState(() => parseTableTexts(seatingPlan))
  const [tableCount, setTableCount] = useState('')

  const commit = (next) => { setTables(next); onPlanChange(serializeTableTexts(next)) }

  const generateTables = () => {
    const n = Math.min(parseInt(tableCount, 10) || 0, 200)
    if (n < 1) return
    const cur = tables.length
    if (n <= cur) { commit(tables.slice(0, n)); return }
    const extra = Array.from({ length: n - cur }, (_, i) => ({
      id: `t${cur + i}_${Date.now()}`, name: `${ui.table} ${cur + i + 1}`, text: '',
    }))
    commit([...tables, ...extra])
  }

  /* UI redesign: iki seçim kartı — seçilən kartın içində öz məzmunu açılır.
     Üsulu dəyişmək = digər karta toxunmaq (köhnə «Dəyiş» düyməsinin işi). */
  const fieldCls = `${inputBase} ${ringState(false)} h-12 px-4`
  const guestCount = (text) => text.split('\n').filter(g => g.trim()).length

  return (
    <div className="space-y-3">
      <OptionCard
        name="seating-method"
        value="self"
        selected={seatingMethod === 'self'}
        onSelect={() => onMethodChange('self')}
        icon={User}
        title={ui.selfTitle}
        description={ui.selfDesc}
        lang={lang}
      >
        <div className="space-y-3">
          {/* Masa sayı generatoru */}
          <div className="flex gap-2">
            <input
              type="number" min="1" max="200"
              value={tableCount}
              onChange={e => setTableCount(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateTables()}
              placeholder={ui.countPh}
              aria-label={ui.countPh}
              className={`${fieldCls} min-w-0 flex-1`}
            />
            <button
              type="button"
              onClick={generateTables}
              className="inline-flex h-12 shrink-0 items-center rounded-full bg-espresso px-5 text-[11.5px] font-semibold uppercase tracking-label text-cream transition-colors hover:bg-espresso-soft"
            >
              {ui.create}
            </button>
          </div>

          {/* Masa kartları */}
          {tables.map((table) => (
            <div key={table.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-beige-dark">
              <div className="flex items-center gap-2 border-b border-gold/15 py-1.5 pl-4 pr-1.5">
                <input
                  type="text" value={table.name}
                  onChange={e => commit(tables.map(t => t.id === table.id ? { ...t, name: e.target.value } : t))}
                  aria-label={ui.table}
                  className="min-h-[40px] min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-ink focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => commit(tables.filter(t => t.id !== table.id))}
                  aria-label={`${table.name} — sil`}
                  className="grid h-10 w-10 place-items-center rounded-full text-brown-muted transition-colors hover:bg-rust-mist hover:text-rust"
                >
                  <X size={15} strokeWidth={1.6} />
                </button>
              </div>
              <textarea
                value={table.text}
                onChange={e => commit(tables.map(t => t.id === table.id ? { ...t, text: e.target.value } : t))}
                placeholder={'Murad Əliyev\nLeyla Məmmədova\nNicat Həsənov'}
                rows={4}
                className="block w-full resize-y bg-transparent px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-brown-muted/70 focus:outline-none"
              />
              <div className="px-4 pb-2.5 text-[12px] tabular-nums text-brown-dark/75">
                {guestCount(table.text)} {ui.guests}
              </div>
            </div>
          ))}

          <AddButton block onClick={() => commit([...tables, { id: `t${Date.now()}`, name: `${ui.table} ${tables.length + 1}`, text: '' }])}>
            {ui.addTable}
          </AddButton>
        </div>
      </OptionCard>

      <OptionCard
        name="seating-method"
        value="digitory"
        selected={seatingMethod === 'digitory'}
        onSelect={() => onMethodChange('digitory')}
        icon={Sparkles}
        title={ui.svcTitle}
        description={ui.svcDesc}
        badge="+15 AZN"
        lang={lang}
      >
        <p className="text-[14px] leading-relaxed text-brown-dark">{ui.svcLong}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {DIGITORY_FORMATS.map(fmt => (
            <span key={fmt} className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-gold-deep ring-1 ring-inset ring-gold/35">
              {fmt}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-brown-dark/80">{ui.svcNote}</p>
      </OptionCard>
    </div>
  )
}

/* ── Phase 35 — Builder addımlarının SIRASI ────────────────────────────────
   Addım NÖMRƏLƏRİ (id) sabitdir və DƏYİŞMİR: `packages.lockedSteps` (6, 7),
   `LandingPage.returnToStep` və serverdəki `draft.current_step` hamısı bu
   id-lərə istinad edir. Dəyişən yalnız GÖSTƏRİLMƏ sırasıdır.

   Phase 35-də iki yeni id əlavə olundu — mövcud 1–8 toxunulmaz qaldı:
     0 — Dizayn seçimi (əvvəl 1-ci addımın içində idi, indi BİRİNCİ addım)
     9 — Dəvətnamə bölmələri (göstər/gizlət)                                */
/* Phase 43-də bir yeni id əlavə olundu — mövcud 0–9 TOXUNULMAZ qaldı:
     10 — Bizim Hekayəmiz (zaman xətti üzrə hekayə blokları) */
const BUILDER_STEP_ORDER = [0, 1, 9, 10, 2, 3, 4, 5, 6, 7, 8]

/* Bölmə → onu dolduran builder addımı. Bölmə söndürüləndə addım da gizlənir
   (müştəri istifadə etməyəcəyi formanı doldurmağa məcbur qalmasın).
   Siyahıda olmayan bölmələrin (geri sayım, RSVP, qonaq dəftəri) ayrıca addımı
   yoxdur — onlar mövcud məlumatdan avtomatik qurulur. */
const SECTION_STEP_ID = {
  lovestory: 10,
  venue:     2,
  program:   3,
  dresscode: 4,
  music:     5,
  seating:   6,
  gallery:   7,
}

/* Addım id → başlıq. `tr` və partnyor UI-dan gələnlər komponentin içindədir. */
const STEP_EXTRA_TITLES = {
  az: { 0: 'Dizayn Seçimi', 9: 'Dəvətnamə Bölmələri', 10: 'Bizim Hekayəmiz' },
  en: { 0: 'Choose Design', 9: 'Invitation Sections', 10: 'Our Story' },
  ru: { 0: 'Выбор дизайна', 9: 'Разделы приглашения', 10: 'Наша история' },
}

/* Addım id → təsvir (əvvəl massiv idi; artıq id ilə açılır ki, sıra
   dəyişəndə mətnlər sürüşməsin). */
const STEP_DESCRIPTIONS = {
  az: {
    0: 'Əvvəlcə dəvətnamənizin dizaynını seçin — qalan addımlar bu görünüşə tətbiq olunacaq.',
    1: 'Tədbiriniz haqqında əsas məlumatları daxil edin.',
    2: 'Tədbirinizin keçiriləcəyi məkanı xəritədə tapın.',
    3: 'Günün əsas anları üçün proqram cədvəli yaradın.',
    4: 'Qonaqlar üçün geyim tərzi seçin.',
    5: 'Dəvətnamənizin fon musiqisini şəxsi zövqünüzə uyğun seçin.',
    6: 'Qonaqların öz masalarını asanlıqla tapması üçün.',
    7: 'QR kod vasitəsilə xatirə şəkillərini toplayın.',
    8: 'Digitoy tərəfdaşları vasitəsilə xüsusi endirim və üstünlüklərdən yararlana bilərsiniz.',
    9: 'Dəvətnamədə hansı blokların görünəcəyini seçin. Söndürdüyünüz bölmə qonağa göstərilmir.',
    10: 'Tanışlığınızdan bu günə qədər olan anları zaman xətti kimi yazın. Hər bloka şəkil əlavə edə bilərsiniz — boş bloklar dəvətnamədə görünmür.',
  },
  en: {
    0: 'Start by choosing the look of your invitation — every later step is applied to this design.',
    1: 'Enter the key details about your event.',
    2: 'Find and pin your event venue on the map.',
    3: 'Create a schedule for the key moments of the day.',
    4: 'Choose a dress code recommendation for your guests.',
    5: 'Choose the background music of your invitation to match your taste.',
    6: 'Help guests find their table quickly and easily.',
    7: 'Collect memories via QR photo sharing.',
    8: 'Through Digitoy partners you can enjoy special discounts and benefits.',
    9: 'Choose which blocks appear in your invitation. A section you switch off is never shown to guests.',
    10: 'Write the moments from your first meeting until today as a timeline. Each block can carry a photo — empty blocks are never shown.',
  },
  ru: {
    0: 'Сначала выберите оформление приглашения — все следующие шаги применяются к нему.',
    1: 'Введите основную информацию о мероприятии.',
    2: 'Найдите и отметьте место проведения на карте.',
    3: 'Создайте программу на весь день.',
    4: 'Выберите дресс-код для ваших гостей.',
    5: 'Выберите фоновую музыку приглашения по своему вкусу.',
    6: 'Помогите гостям быстро найти свой стол.',
    7: 'Собирайте воспоминания через QR-фотообмен.',
    8: 'Через партнёров Digitoy вы можете получить специальные скидки и преимущества.',
    9: 'Выберите, какие блоки появятся в приглашении. Выключенный раздел гостям не показывается.',
    10: 'Опишите моменты от знакомства до сегодняшнего дня в виде хронологии. К каждому блоку можно добавить фото — пустые блоки не показываются.',
  },
}

/* ── Phase 35 — «Dəvətnamə Bölmələri» addımı ───────────────────────────────
   Hər bölmə üçün bir açar/bağla açarı. Dəyər `data.sections[id]`-dədir və
   forma datasının bir hissəsi olduğu üçün autosave → draft → invitations
   zəncirindən öz-özünə keçir (yeni API və ya DB sütunu YOXDUR).

   ⚠ Paketdə bağlı olan bölmə (SADE-də RSVP və s.) burada `locked` gəlir:
   göstərilir, amma dəyişdirilə bilmir — istifadəçi nəyin niyə yoxa çıxdığını
   görsün deyə gizlətmirik. ── */
const SECTIONS_UI = {
  az: {
    locked: 'Paketdə yoxdur', allOn: 'Hamısını aç',
    note: 'Bütün bölmələr standart olaraq açıqdır. Bağladığınız bölmə dəvətnamədə görünmür və builder-də sizdən soruşulmur — yenidən açsanız, yazdıqlarınız olduğu kimi qayıdır.',
    skips: 'Bu addım builder-dən çıxarıldı',
  },
  en: {
    locked: 'Not in your package', allOn: 'Turn all on',
    note: 'Every section is on by default. A section you switch off is not shown to guests and is not asked for in the builder — turn it back on and everything you typed is still there.',
    skips: 'Its builder step is hidden',
  },
  ru: {
    locked: 'Нет в пакете', allOn: 'Включить все',
    note: 'Все разделы включены по умолчанию. Выключенный раздел не показывается гостям и не запрашивается в конструкторе — включите обратно, и введённые данные останутся на месте.',
    skips: 'Шаг убран из конструктора',
  },
}

const SECTION_ICONS = {
  countdown: Clock,
  venue:     MapPin,
  program:   ListOrdered,
  dresscode: Shirt,
  seating:   Users,
  gallery:   ImageIcon,
  rsvp:      UserCheck,
  guestbook: MessageCircle,
  music:     Music,
}

function SectionsStep({ lang, pkgId, sections, onToggle, onAllOn }) {
  const ui   = SECTIONS_UI[lang] || SECTIONS_UI.az
  const list = listBuilderSections(pkgId)
  /* DEFAULT BAĞLI bölmələr `=== false` yoxlamasına düşmür, ona görə
     burada da `isSectionOn` işlədilir (bax data/sections.js). */
  const anyOff = list.some((s) => !s.locked && !isSectionOn({ sections }, s.id))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="min-w-[200px] flex-1 text-[14px] leading-relaxed text-brown-dark/90">{ui.note}</p>
        {anyOff && <GhostButton onClick={onAllOn}>{ui.allOn}</GhostButton>}
      </div>

      <ToggleList>
        {list.map((s) => {
          const Icon  = SECTION_ICONS[s.id] || Sparkles
          const label = s.labels[lang] || s.labels.az
          const hint  = s.hints[lang]  || s.hints.az
          /* ⚠ `sections?.[id] !== false` YAZMAQ OLMAZ: Phase 43-dən sonra
             bəzi bölmələr DEFAULT BAĞLIDIR. `isSectionOn` hər iki qaydanın tək mənbəyidir. */
          const checked = !s.locked && isSectionOn({ sections }, s.id)
          return (
            <SectionToggleRow
              key={s.id}
              icon={Icon}
              title={label}
              description={hint}
              checked={checked}
              onChange={() => onToggle(s.id)}
              locked={s.locked}
              /* Bu bölmənin builder-də öz addımı var → bağlananda addım da çıxır */
              note={!s.locked && !checked && SECTION_STEP_ID[s.id] != null ? ui.skips : undefined}
              lang={lang}
            />
          )
        })}
      </ToggleList>
    </div>
  )
}

/* ── Phase 25.3 — Partnyorlar: Builder-in ayrıca SON addımı (bütün paketlərdə).
   Sırf informativ — dəvətnamə datasına, draft-a və sifariş axınına toxunmur.
   Partnyorlar src/data/partners.js-dən gəlir — yeni partnyor = massivə yeni obyekt. ── */
const PARTNER_UI = {
  az: {
    stepLabel: 'Partnyorlar',
    title: '🤝 Partnyor Endirimləri',
    sub: 'Digitoy tərəfdaşları vasitəsilə xüsusi endirim və üstünlüklərdən yararlana bilərsiniz.',
    badgeLabel: 'Sizin paketiniz:',
    badgeValue: (pct) => `${pct}-dək`,
    claim: 'Digitoy müştərisi olduğunuzu bildirərək paketinizə uyğun xüsusi endirimdən yararlana bilərsiniz.',
    cta: '📌 Əlaqə saxlayarkən "Digitoy müştərisiyəm" deməyiniz kifayətdir. Paketinizə uyğun endirim avtomatik tətbiq olunacaq.',
    footNote: (name) => `Bu endirim yalnız ${name} tərəfindən təqdim olunur və Digitoy tərəfdaş üstünlüyüdür.`,
  },
  en: {
    stepLabel: 'Partners',
    title: '🤝 Partner Discounts',
    sub: 'Through Digitoy partners you can enjoy special discounts and benefits.',
    badgeLabel: 'Your package:',
    badgeValue: (pct) => `up to ${pct}`,
    claim: 'Simply mention that you are a Digitoy customer to enjoy the special discount for your package.',
    cta: '📌 When getting in touch, simply say "I am a Digitoy customer" — the discount for your package will be applied automatically.',
    footNote: (name) => `This discount is provided solely by ${name} and is a Digitoy partner benefit.`,
  },
  ru: {
    stepLabel: 'Партнёры',
    title: '🤝 Партнёрские скидки',
    sub: 'Через партнёров Digitoy вы можете получить специальные скидки и преимущества.',
    badgeLabel: 'Ваш пакет:',
    badgeValue: (pct) => `до ${pct}`,
    claim: 'Сообщите, что вы клиент Digitoy, чтобы воспользоваться специальной скидкой по вашему пакету.',
    cta: '📌 При обращении достаточно сказать «Я клиент Digitoy» — скидка по вашему пакету будет применена автоматически.',
    footNote: (name) => `Эта скидка предоставляется только ${name} и является партнёрским преимуществом Digitoy.`,
  },
}

/* Partnyorlar addımının məzmunu — bütün aktiv partnyorları dinamik render edir */
function PartnersStep({ lang, pkgId }) {
  const ui = PARTNER_UI[lang] || PARTNER_UI.az
  if (ACTIVE_PARTNERS.length === 0) return null
  return (
    <div className="space-y-4">
      {ACTIVE_PARTNERS.map((p) => {
        const pct = p.discounts[pkgId] || p.discounts.SADE
        return (
          <PartnerOfferCard
            key={p.id}
            lang={lang}
            name={p.name}
            logo={p.logo ? <img src={p.logo} alt="" className="h-full w-full object-cover" /> : undefined}
            description={p.description[lang] || p.description.az}
            discount={ui.badgeValue(pct)}
            packageLabel={ui.badgeLabel.replace(/:\s*$/, '')}
            howTo={`${ui.claim} ${ui.cta.replace(/^📌\s*/, '')}`}
            instagramUrl={p.instagram}
            whatsappUrl={p.whatsapp}
            disclaimer={ui.footNote(p.name)}
          />
        )
      })}
    </div>
  )
}

export default function BuilderForm({ lang, initialData, initialStep = null, onSubmit, isAdmin = false }) {
  const tr = t[lang]

  /* ── Paket kilidləmə — həmişə initialData.package oxunur, rol fərqi yoxdur ── */
  const pkgId = initialData?.package || localStorage.getItem('selected_package') || 'SADE'
  const lockedSteps = getLockedSteps(pkgId)

  /* ⚠ Önbaxışdan qayıdış: builder vəziyyəti sessionStorage-dan SİNXRON bərpa
     olunur (bax utils/builderSession.js). Bu, ilk render-də tətbiq olunur —
     boş forma "flash"-ı olmur və server draft-ını gözləmək lazım gəlmir.
     Admin rejimində snapshot oxunmur: admin URL-dən gələn data prioritetlidir. */
  const [snapshot] = useState(() => (isAdmin ? null : readBuilderSnapshot()))

  /* ⚠ `data` addım siyahısından ƏVVƏL elan olunur: söndürülmüş bölmələr
     builder addımlarını da gizlədir (aşağıya bax), yəni siyahı datadan asılıdır. */
  const [data, setData] = useState(() => (
    snapshot?.data ? { ...initialData, ...snapshot.data } : initialData
  ))

  /* Phase 35 axını: 0 Dizayn · 1 Tədbir · 9 Bölmələr · 2 Məkan · 3 Proqram
     · 4 Geyim · 5 Musiqi · 6 Oturma · 7 Qalereya · 8 Partnyorlar (həmişə SON).
     Sıra BUILDER_STEP_ORDER-dədir; id-lər Phase 25.3-dəki kimi qalır.

     ⚠ İki filtr var:
       1. paket kilidi   — SADE/VIP-də bağlı addımlar (6, 7)
       2. bölmə açarı    — «Bölmələr» addımında söndürülən bölmənin öz addımı
                           da yox olur ki, müştəri lazımsız formanı doldurmasın.
     Doldurulmuş məlumat SİLİNMİR — bölmə yenidən açılanda addım öz datası
     ilə birlikdə geri qayıdır. */
  const hiddenStepIds = Object.entries(SECTION_STEP_ID)
    .filter(([sectionId]) => !isSectionOn(data, sectionId))
    .map(([, stepId]) => stepId)

  const visibleSteps = BUILDER_STEP_ORDER.filter(
    n => !lockedSteps.includes(n) && !hiddenStepIds.includes(n)
  )
  const VISIBLE_TOTAL = visibleSteps.length

  /* initialStep-i görünən addımlara uyğunlaşdır */
  const safeInitialStep = (() => {
    if (!initialStep) return 1
    const idx = visibleSteps.indexOf(initialStep)
    return idx >= 0 ? idx + 1 : visibleSteps.length
  })()

  /* ⚠ Phase 35: addım sırası dəyişkəndir (paket + bölmə açarları), ona görə
     KÖHNƏ snapshot/draft mövqeyi diapazondan çıxa bilər — həmişə sıxılır. */
  const clampStep = (n) => Math.min(Math.max(1, n), VISIBLE_TOTAL)

  const [stepRaw, setStep] = useState(() => (
    snapshot?.step && snapshot.step > 0 ? clampStep(snapshot.step) : safeInitialStep
  ))
  /* Bölmə söndürüləndə siyahı qısala bilər — render həmişə etibarlı mövqe görür */
  const step = clampStep(stepRaw)

  const [errors, setErrors] = useState({})
  /* Addım keçidi animasiyasının istiqaməti (1 irəli, -1 geri) — yalnız görünüş */
  const [dir, setDir] = useState(1)
  /* Serverin təyin etdiyi KANONİK slug (aytekin-ve-ferid-abc234).
     QR və qalereya linkləri adlardan yenidən hesablanmamalıdır — əks
     halda eyni adlı iki cütlük eyni foto qovluğunu paylaşar. */
  const [canonicalSlug, setCanonicalSlug] = useState('')
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
  /* ── Şablon seçimi (Phase 4 — DB inteqrasiyası) ──
     Artıq `data.templateId` sahəsindədir: autosave → draft → submit → approve
     → invitations.form_data zəncirinin hamısından keçir və reload-dan sonra
     bərpa olunur. Boş dəyər: bax templateConfig › resolveBuilderTemplateId. */
  const selectedTemplate = resolveBuilderTemplateId(data.templateId, { isAdmin })
  const setSelectedTemplate = (id) => set('templateId', id)
  /* Phase 45.1 — builder-dən çıxan data (autosave draft, önbaxış → sifariş)
     `templateId: selectedTemplate` daşıyır: boş dəyər server-də simple-luxury
     olurdu, müştəri isə Royal Gold-u «Seçildi» görürdü. */

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
    /* Snapshot varsa (eyni tabda önbaxışdan qayıdış) server draft-ı tətbiq
       etmirik — daha təzə vəziyyət onsuz da yüklənib. */
    const hasUrlData = new URLSearchParams(window.location.search).get('data')
    if (!hasUrlData && !snapshot) {
      getDraft(sid)
        .then(function(draft) {
          if (!draft?.found || !draft.form_data) return
          setData(function(prev) { return { ...prev, ...draft.form_data } })
          if (draft.current_step > 1) setStep(clampStep(draft.current_step))
          setDraftRestored(true) /* banner göstər */
        })
        .catch(function() {}) /* draft restore non-critical */
    }
  }, [isAdmin])

  /* ── Tarixçə: cari giriş addımı bilsin; GERİ/İRƏLİ düyməsi addımı dəyişsin ── */
  const stepRef = useRef(step)
  useEffect(() => {
    stepRef.current = step
    if (window.history.state?.stage === 'builder') patchState({ step })
  }, [step])
  useEffect(() => {
    const onPop = () => {
      const s = window.history.state
      if (s?.stage !== 'builder' || !Number.isFinite(s.step) || s.step === stepRef.current) return
      setDir(s.step < stepRef.current ? -1 : 1)
      setStep(s.step)
      scrollBuilderToTop()
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  /* ── Autosave: data/step dəyişəndə 800ms debounce ilə saxla ── */
  useEffect(() => {
    if (isAdmin) return
    /* sessionStorage sinxrondur — debounce-a ehtiyac yoxdur, hər dəyişiklikdə
       dərhal yazılır ki, istifadəçi dərhal önbaxışa keçsə belə itki olmasın. */
    saveBuilderSnapshot({ data, step })
  }, [data, step, isAdmin])

  useEffect(() => {
    if (!isHydrated || !sessionIdRef.current || isAdmin) return
    clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(function() {
      const pkg = data.package || data.selectedPackage || pkgId || 'SADE'
      saveDraft(sessionIdRef.current, { ...data, templateId: selectedTemplate }, pkg, step).catch(function() {})
    }, 800)
    return function() { clearTimeout(autosaveTimer.current) }
  }, [data, step, isHydrated, isAdmin, selectedTemplate])

  const set = (key, val) => {
    setData((d) => ({ ...d, [key]: val }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const isCouple = COUPLE_TYPES.includes(data.eventType)
  const isCorp   = CORP_TYPES.includes(data.eventType)

  const partnerUi = PARTNER_UI[lang] || PARTNER_UI.az

  const extraTitles = STEP_EXTRA_TITLES[lang] || STEP_EXTRA_TITLES.az

  /* Addım id → başlıq (sıra deyil, ID ilə — bax BUILDER_STEP_ORDER) */
  const STEP_TITLES = {
    0: extraTitles[0],
    1: tr.step1_title,
    2: tr.step2_title,
    3: tr.step3_title,
    4: tr.step4_title,
    5: tr.step_music_title,
    6: tr.step5_title,
    7: tr.step6_title,
    8: partnerUi.stepLabel,
    9: extraTitles[9],
    10: tr.step_lovestory_title || extraTitles[10],
  }
  const titleOf = (id) => STEP_TITLES[id] || ''

  /* Görünən addımlar içərisindəki mövqedən həqiqi addım nömrəsi */
  const actualStep = visibleSteps[step - 1] ?? 0

  /* ── Phase 35 — bölmə açarları (data.sections) ── */
  const sections = data.sections || {}
  const toggleSection = (id) => {
    setData((d) => ({
      ...d,
      sections: { ...(d.sections || {}), [id]: !isSectionOn(d, id) },
    }))
  }
  /* ⚠ `lovestory` DEFAULT BAĞLIDIR, ona görə boş obyekt onu AÇMIR —
     açıq-aşkar `true` yazılır (bax data/sections.js › DEFAULT_OFF). */
  const enableAllSections = () => setData((d) => ({ ...d, sections: { lovestory: true } }))

  const validate = () => {
    const e = {}
    if (actualStep === 1) {
      if (isCorp && !data.eventName?.trim()) e.eventName = true
      /* Yoxlama sırası formadakı sıra ilə eynidir: əvvəl Bəy, sonra Gəlin */
      if (isCouple && !data.groomName.trim()) e.groomName = true
      if (!isCorp && !data.brideName.trim()) e.brideName = true
      if (!data.date) e.date = true
      if (!data.time) e.time = true
    }
    if (actualStep === 2) {
      if (!data.venueName.trim()) e.venueName = true
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const scrollToTop = scrollBuilderToTop

  /* Hər addım ayrıca tarixçə girişidir — telefonun GERİ düyməsi əvvəlki addıma
     aparır (əvvəl builder-in ortasında GERİ saytdan çıxırdı). Köhnə girişdə
     mövqe saxlanılmır: qayıdanda addımın başına sürüşülür. */
  const goStep = (target, d, scroll = true) => {
    const n = clampStep(target)
    if (n === step) return
    pushView(currentUrl(),
      { view: window.history.state?.view || 'landing', stage: 'builder', step: n },
      { stage: 'builder', step, scrollY: null })
    setDir(d)
    setStep(n)
    if (scroll) scrollToTop()
  }

  const next = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    if (validate()) goStep(step + 1, 1)
  }
  const prev = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    goStep(step - 1, -1)
  }
  const handleSubmit = async (e) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    if (submitLoading) return
    if (!validate()) return
    setSubmitLoading(true)
    try {
      await onSubmit({ ...data, templateId: selectedTemplate })
      trackEvent('builder_completed', { lang, package: pkgId, step: VISIBLE_TOTAL })
    } catch {
      /* üst komponent xətaları idarə edir */
    } finally {
      setSubmitLoading(false)
    }
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
    const slug = computeInviteSlug(data)
    setApproving(true)
    setApproveError('')
    try {
      /* draft_code sifarişin unikal kimliyidir — kanonik slug ondan
         törəyir (aytekin-ve-ferid-abc234). Eyni adlı iki cütlük artıq
         eyni slug ala bilmir və bir-birinin dəvətnaməsini üstündən
         yazmır. Təkrar approve eyni slug-ı qaytarır (idempotent). */
      const draftCode = new URLSearchParams(window.location.search).get('draft')

      const saveResult = await saveInvitation(slug, data, draftCode)
      const finalSlug = saveResult?.slug || slug
      setCanonicalSlug(finalSlug)

      if (draftCode) {
        try {
          await approveDraft(draftCode, finalSlug)
        } catch (approveErr) {
          console.error('approve_draft uğursuz:', approveErr)
          /* saveInvitation rollback edilmir — dəvətnamə saxlanıldı */
        }
      }

      const link = buildShortLiveLink(finalSlug)
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
    <div id="builder-top" className="mx-auto w-full max-w-[1040px]">

      {/* ── Sıfırlama Təsdiq Pəncərəsi ── */}
      <ConfirmDialog
        open={showResetConfirm}
        lang={lang}
        title="Əminsiniz?"
        description="Cari qaralama silinəcək. Yeni dəvətnaməyə başlamaq istəyirsiniz?"
        confirmLabel="Bəli, başla"
        cancelLabel="Ləğv et"
        destructive
        onConfirm={handleNewDraft}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* ── Təsdiq Modalı ── */}
      {showApproveModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[200] px-4"
          style={{ background: 'rgba(15,10,5,0.65)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowApproveModal(false) }}
        >
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-luxe ring-1 ring-gold/25 animate-fade-up">
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
              <div className="mb-6 rounded-2xl bg-cream px-5 py-4 ring-1 ring-inset ring-beige-dark">
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

      {/* ── Builder çərçivəsi (UI redesign 2026-10) ──
          Addım siyahısı, keçid, validasiya, avtomatik saxlama — hamısı yuxarıdakı
          state/funksiyalardadır; BuilderShell yalnız görünüşdür.
          `allowJump` — köhnə builder kimi istənilən addıma keçmək olur. */}
      <BuilderShell
        lang={lang}
        hideHeader
        allowJump
        steps={visibleSteps.map((id) => ({ id: String(id), label: titleOf(id) }))}
        current={step - 1}
        direction={dir}
        onStepClick={(i) => goStep(i + 1, i + 1 >= step ? 1 : -1, false)}
        onPrev={prev}
        onNext={step < VISIBLE_TOTAL ? next : handleSubmit}
        isLast={step === VISIBLE_TOTAL}
        nextLoading={submitLoading}
        nextLabel={step < VISIBLE_TOTAL ? tr.btn_next : tr.btn_create}
        notice={draftRestored && !isAdmin ? (
          <Notice
            variant="draft"
            lang={lang}
            onDismiss={() => setDraftRestored(false)}
            action={<NoticeButton onClick={() => setShowResetConfirm(true)}>Yeni Başlat</NoticeButton>}
          >
            Əvvəlki dəvətnaməniz yükləndi
          </Notice>
        ) : null}
      >
      <StepCard
        title={actualStep === 8 ? partnerUi.title.replace(/^🤝\s*/, '') : titleOf(actualStep)}
        subtitle={(STEP_DESCRIPTIONS[lang] || STEP_DESCRIPTIONS.az)[actualStep]}
      >

        {/* STEP 0 — DİZAYN SEÇİMİ (Phase 35: builderin İLK addımı).
            Əvvəl 1-ci addımın altında bir blok idi; funksionallıq eynidir,
            yalnız yeri dəyişdi — `data.templateId` axını toxunulmazdır. */}
        {actualStep === 0 && (
          <TemplateSelect
            value={selectedTemplate}
            onChange={setSelectedTemplate}
            lang={lang}
            hideHeading
          />
        )}

        {/* STEP 9 — DƏVƏTNAMƏ BÖLMƏLƏRİ (Phase 35) */}
        {actualStep === 9 && (
          <SectionsStep
            lang={lang}
            pkgId={pkgId}
            sections={sections}
            onToggle={toggleSection}
            onAllOn={enableAllSections}
          />
        )}

        {/* STEP 10 — BİZİM HEKAYƏMİZ (Phase 43).
            Addım YALNIZ bölmə açıq olanda görünür (SECTION_STEP_ID),
            yəni mövcud axına heç bir əlavə addım gəlmir. */}
        {actualStep === 10 && (
          <LoveStoryStep
            rows={data.loveStory || []}
            onChange={(rows) => set('loveStory', rows)}
            lang={lang}
          />
        )}

        {/* STEP 1 */}
        {actualStep === 1 && (
          <div className="space-y-6 pb-6 sm:space-y-8 sm:pb-10">
            {/* Tədbir növü */}
            <ChoiceGroup legend={tr.event_type || 'Tədbir növü'} className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
              {EVENT_TYPES.map(({ id }) => (
                <SelectCard
                  key={id}
                  name="eventType"
                  value={id}
                  checked={data.eventType === id}
                  onChange={(v) => set('eventType', v)}
                  icon={EVENT_ICONS[id]}
                  label={tr[`event_${id}`]}
                  lang={lang}
                />
              ))}
            </ChoiceGroup>

            {/* Korporativ / Digər — Tədbirin Adı + Təşkilatçı */}
            {isCorp ? (
              <>
                <div>
                  <Label required>{tr.event_name_label}</Label>
                  <Input
                    value={data.eventName || ''}
                    onChange={(e) => set('eventName', e.target.value)}
                    placeholder={tr.event_name_label}
                    invalid={!!errors.eventName}
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
              /* Toy / Nişan — cütlük adları.
                 ⚠ Phase 27: sıra BƏY → GƏLİN. Yalnız göstərim sırası dəyişdi;
                 `brideName`/`groomName` data açarları OLDUĞU KİMİ qalır. */
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                <div>
                  <Label required>{tr.groom_label}</Label>
                  <Input
                    value={data.groomName}
                    onChange={(e) => set('groomName', e.target.value)}
                    placeholder="Məs: Murad"
                    invalid={!!errors.groomName}
                  />
                </div>
                <div>
                  <Label required>{tr.bride_label}</Label>
                  <Input
                    value={data.brideName}
                    onChange={(e) => set('brideName', e.target.value)}
                    placeholder="Məs: Leyla"
                    invalid={!!errors.brideName}
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
                  invalid={!!errors.brideName}
                />
              </div>
            )}

            {/* Tarix & Vaxt */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
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

            {/* ⚠ Phase 35: «Dizayn seç» bloku buradan ÇIXARILDI — artıq
                builderin 0-cı (ilk) addımıdır. Bax: actualStep === 0. */}
          </div>
        )}

        {/* STEP 2 */}
        {actualStep === 2 && (
          <div className="space-y-6 sm:space-y-8">
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
            {/* Məkan qeydi — MƏCBURİ DEYİL, validasiyaya girmir.
                Boş qalsa dəvətnamədə heç nə göstərilmir. */}
            <div>
              <Label>{tr.venue_note_label}</Label>
              <Input
                type="text"
                value={data.venueNote || ''}
                onChange={(e) => set('venueNote', e.target.value)}
                placeholder={tr.venue_note_placeholder}
              />
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

        {/* STEP 4 — Dress Code (Phase 25.3 — premium kart dizaynı) */}
        {actualStep === 4 && (
          <div className="space-y-6 sm:space-y-8">
            <div>
              <Label>{tr.dresscode_type_label}</Label>
              {/* Kartların adının dəyişdirilə bildiyini bildirən qısa izah */}
              <p className={`${hintClass} -mt-1 mb-3`}>{tr.dresscode_custom_label}</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {DRESS_CODE_OPTIONS.map(({ id, icon: DressIcon, colors }) => {
                  /* Kartın adı və kişi/qadın mətnləri fərdiləşdirilə bilər. Boşdursa
                     standart qalır → bu sahəsi olmayan köhnə sifarişlər eyni görünür. */
                  const defaultLabel = tr[`dresscode_${id}_label`] || id
                  const gDef = resolveDressGenders(id, lang)
                  const genders = data.dressCodeGenders || {}
                  const setGender = (sex, v) => set('dressCodeGenders', {
                    ...genders,
                    [id]: { ...(genders[id] || {}), [sex]: v },
                  })
                  return (
                    <PaletteCard
                      key={id}
                      name="dresscode"
                      value={id}
                      selected={data.dressCodePalette === id}
                      onSelect={(v) => set('dressCodePalette', v)}
                      icon={DressIcon}
                      title={defaultLabel}
                      subtitle={[gDef.male, gDef.female].filter(Boolean).join(' · ')}
                      colors={colors}
                      customTitle={data.dressCodeLabels?.[id] || ''}
                      onCustomTitleChange={(v) => set('dressCodeLabels', { ...(data.dressCodeLabels || {}), [id]: v })}
                      styleA={genders[id]?.male || ''}
                      onStyleAChange={(v) => setGender('male', v)}
                      styleB={genders[id]?.female || ''}
                      onStyleBChange={(v) => setGender('female', v)}
                      lang={lang}
                    >
                      <div className="flex gap-5 text-[13px] text-brown-dark">
                        <span className="inline-flex items-center gap-2">
                          <User size={15} className="text-gold-deep" strokeWidth={1.5} />
                          {tr.dresscode_groom_icon}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Sparkles size={15} className="text-gold-deep" strokeWidth={1.5} />
                          {tr.dresscode_bride_icon}
                        </span>
                      </div>
                    </PaletteCard>
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

        {/* STEP 5 — 🎵 Musiqi (Phase 25.3 — bütün paketlərdə) */}
        {actualStep === 5 && (
          <MusicStep
            music={data.music || null}
            onChange={(m) => set('music', m)}
            lang={lang}
          />
        )}

        {/* STEP 6 — Oturma Planı */}
        {actualStep === 6 && (
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

        {/* STEP 7 — Foto Qalereya & QR İdarəetmə */}
        {actualStep === 7 && (
          <GalleryAdminStep data={data} isCouple={isCouple} isCorp={isCorp} isAdmin={isAdmin || adminMode} canonicalSlug={canonicalSlug} />
        )}

        {/* STEP 8 — Partnyorlar (bütün paketlərdə son addım) */}
        {actualStep === 8 && (
          <PartnersStep lang={lang} pkgId={pkgId} />
        )}
      </StepCard>
      </BuilderShell>

      {/* ── Admin İdarəetmə Paneli ── */}
      {(isAdmin || adminMode) && (
        <div className="mx-auto mt-8 max-w-[780px] overflow-hidden rounded-3xl bg-olive-mist/70 ring-1 ring-inset ring-olive/25">
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
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-olive px-8 text-[12px] font-semibold uppercase tracking-label text-white shadow-soft transition-[filter] duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
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

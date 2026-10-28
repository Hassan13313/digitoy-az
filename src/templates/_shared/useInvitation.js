import { useCallback, useEffect, useRef, useState } from 'react'
import { buildPresetMusic, PRESET_TRACKS, MUSIC_PLAY_MODES, shouldAutoPlay } from '../../data/music'
import { getSectionVisibility } from '../../data/sections'
import { formatAzDate, formatTime24, formatFullDateByLang, dateParts } from '../../utils/dateFormat'
import { unlockAudio } from '../../utils/audioUnlock'
import { trackEvent } from '../../utils/analytics'
import { useCountdown } from '../../hooks/useCountdown'
import { useTimeline } from '../../hooks/useTimeline'
import { useSeating } from '../../hooks/useSeating'
import { useRsvp } from '../../hooks/useRsvp'
import { useGuestbook } from '../../hooks/useGuestbook'
import { useGallery } from '../../hooks/useGallery'
import { useMusicPlayer } from '../../hooks/useMusicPlayer'
import { useMusicPrompt } from '../../hooks/useMusicPrompt'
import t from '../../data/translations'
import { applyThemeOverrides, mergeSectionLabels, withStringOverrides, makeLabelResolver, sectionHead } from '../../data/adminOverrides'
import { directionsUrl, openMapUrl } from './geo'
import { makeOpeningText, phrase } from './openingSpec'
import { copyPrefix } from './copyText'

/* ─────────────────────────────────────────────────────────────────────────────
   useInvitation — premium redizayn şablonlarının ORTAQ MƏNTİQ QATI (UI yox)

   NƏ ÜÇÜN: köhnə `TemplateShell` həm məntiqi, həm də MARKUP-u ortaq
   saxlayırdı — nəticədə 13 şablon eyni skeletdə, eyni sırada, eyni kart və
   düymələrlə görünürdü (yalnız rəng fərqli idi). İndi ayrılıb:
     • bu hook   → TemplateShell-in ETDİYİ HƏR ŞEY (7 hook, bölmə
                   görünürlüyü, admin override-ları, musiqi, analitika)
     • şablon    → yalnız öz vizual dili və bölmələrin öz forması

   ⚠ DAVRANIŞ TemplateShell ilə EYNİDİR:
     • theme  → applyThemeOverrides (admin rəng/şrift/əmsal)
     • L()    → şablonun metafora adları + admin bölmə adları
     • tr     → admin mətn override-ları (Proxy, yoxdursa eyni obyekt)
     • rsvpL / gbookL / seatingL → prefiksli admin override-ları
     • S      → paket icazəsi AND cütlüyün bölmə seçimi
     • musiqi → <audio> açılışdan ƏVVƏL mount olur; açılış toxunuşunda
                `music.play()` sinxron çağırılır (iOS jest qaydası)
   ───────────────────────────────────────────────────────────────────────── */

const DEFAULT_MUSIC = buildPresetMusic(PRESET_TRACKS[0], { playMode: MUSIC_PLAY_MODES.AUTO })

export function useInvitation({
  templateId, baseTheme, sectionLabels = null,
  lang, weddingData, isDemoMode = false, initialGuestbook,
  adminOverrides = null, startOpened = false,
}) {
  const theme = applyThemeOverrides(baseTheme, adminOverrides)
  const adminStrings = adminOverrides?.strings || null
  const tr = withStringOverrides(t[lang] || t.az, adminStrings, lang)
  const L = makeLabelResolver(mergeSectionLabels(sectionLabels, adminOverrides), lang)
  const [opened, setOpened] = useState(startOpened)

  const isCouple = ['toy', 'nishan'].includes(weddingData.eventType)
  const isCorp   = ['corporate', 'other'].includes(weddingData.eventType)
  const eventLabels = {
    toy: tr.event_toy, nishan: tr.event_nishan,
    birthday: tr.event_birthday, corporate: tr.event_corporate,
    other: weddingData.eventName || tr.event_other,
  }
  const eventLabel = eventLabels[weddingData.eventType] || tr.event_toy
  const ot = makeOpeningText(templateId, { weddingData, lang, isCouple, isCorp, eventLabel }, adminOverrides?.opening || null)

  const activePkgId = isDemoMode ? 'PREMIUM' : (weddingData.package || 'SADE')
  const S = getSectionVisibility(weddingData, activePkgId)
  const showStory = !!(S.lovestory && Array.isArray(weddingData.loveStory) && weddingData.loveStory.length > 0)

  const invMusic = S.music ? (weddingData?.music || DEFAULT_MUSIC) : null
  const autoPlay = shouldAutoPlay(invMusic)

  /* ── 7 HOOK — biznes məntiqinin yeganə mənbəyi ── */
  const cd       = useCountdown({ date: weddingData.date, time: weddingData.time, lang, eventType: weddingData.eventType, eventName: weddingData.eventName })
  const timeline = useTimeline({ lang, eventType: weddingData.eventType, programSteps: weddingData.programSteps })
  const { inputRef: seatInputRef, ...seating } = useSeating({ seatingPlan: weddingData.seatingPlan, lang })
  const { inputRef: rsvpInputRef, ...rsvp }    = useRsvp({ lang, weddingData })
  const gbook    = useGuestbook({ lang, initialMessages: initialGuestbook })
  const gallery  = useGallery({ weddingData, isCouple, isCorp })
  const rsvpL    = withStringOverrides(rsvp.labels,    adminStrings, lang, 'rsvp.')
  const gbookL   = withStringOverrides(gbook.labels,   adminStrings, lang, 'gbook.')
  const seatingL = withStringOverrides(seating.labels, adminStrings, lang, 'seating.')

  const music = useMusicPlayer({ lang, music: invMusic, autoStart: opened && autoPlay })
  const [musicPrompt, dismissMusicPrompt] = useMusicPrompt({ enabled: opened && music.hasMusic })

  /* Dəvətnamə açıldı — demo/önbaxışda gözləyən kuki banneri indi çıxa bilər (utils/consent.js) */
  useEffect(() => {
    if (opened) window.dispatchEvent(new Event('digitoy:invitation-opened'))
  }, [opened])

  useEffect(() => {
    if (!isDemoMode) trackEvent('invitation_opened', { lang, event_type: weddingData?.eventType })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Tarix köməkçiləri ── */
  const { formattedDate, dayName } = formatAzDate(weddingData.date, lang)
  const dp = dateParts(weddingData.date, lang)
  const rawTime = weddingData.time ? formatTime24(weddingData.time) : ''
  const time = rawTime && rawTime !== '—' ? rawTime : ''
  const fullDate = formatFullDateByLang(weddingData.date, lang)

  /* ── Adlar ── */
  const heroTitle = L('hero', 'title', null)
  const single = weddingData.eventName || weddingData.brideName || ''

  return {
    theme, tr, L, K: (key) => L(key, 'kicker', null), lang,
    opened, setOpened,
    isCouple, isCorp, eventLabel, ot, S, showStory,
    cd, timeline, seating, seatInputRef, rsvp, rsvpInputRef, gbook, gallery,
    rsvpL, gbookL, seatingL,
    music, musicPrompt, dismissMusicPrompt, autoPlay,
    dirUrl: directionsUrl(weddingData), mapUrl: openMapUrl(weddingData),
    formattedDate, dayName, dp, time, fullDate,
    heroTitle, single,
    groom: weddingData.groomName || '', bride: weddingData.brideName || '',
    /* Adlar arasındakı bağlayıcı: premium dizaynlar «&» işlədir; admin
       «Mətnlər › Hero › «və» bağlayıcısı»-nı yazıbsa onun mətni (TemplateShell
       bu sətri həmişə `tr.inv_and`-dən göstərirdi). */
    and: adminStrings?.inv_and ? tr.inv_and : '&',
    footer: sectionHead(L, 'footer'),
    /* Şablonun öz mətnləri (`<şablon>/copy.js › TXT`) + admin override-ları
       (`strings['tpl_<id>.<açar>']`): aktiv dil → AZ → şablonun mətni */
    copy: (dict) => withStringOverrides(dict[lang] || dict.az, adminStrings, lang, copyPrefix(templateId)),
    storyAdminTheme: adminOverrides?.theme || null,
    storyCopy: adminOverrides?.story?.text || null,
  }
}

/**
 * Açılış ekranının «qapısı»: toxunuş/klaviatura, iOS musiqi kilidinin açılması
 * və `ms` sonra dəvətnamənin açılması. Şablon yalnız `opening` vəziyyətinə
 * görə öz animasiyasını çəkir.
 * ⚠ `onOpenStart` toxunuş hadisəsinin İÇİNDƏ çağırılır (iOS Safari səs icazəsi).
 *
 * `revealAt` (ms, ixtiyari) — dəvətnamə pərdə çəkilənə qədər GÖZLƏMİR, bu andan
 * pərdənin ALTINDA render olunur. Ağır açılışı olan telefonlarda pərdə
 * çəkiləndə boş fon görünməsin deyə. Bunu işlədən şablon açılışı `inv.opened`-ə
 * görə yox, `gone`-a görə gizlətməlidir (bax oriental-luxe).
 * `finish()` — açılışı bitirir (sabit referans). `ms: null` olarsa taymer
 * qurulmur: şablon `finish()`-i özü çağırır (məs. pərdənin CSS animasiyası
 * bitəndə).
 */
export function useGate({ inv, ms = 1300, label, revealAt = null }) {
  const [opening, setOpening] = useState(false)
  const [gone, setGone] = useState(false)
  const timer = useRef(null)
  const reveal = useRef(null)
  useEffect(() => () => { clearTimeout(timer.current); clearTimeout(reveal.current) }, [])
  const { setOpened } = inv
  const finish = useCallback(() => { clearTimeout(timer.current); setGone(true); setOpened(true) }, [setOpened])
  const start = () => {
    if (opening) return
    unlockAudio()
    if (inv.autoPlay) inv.music.play()
    setOpening(true)
    if (revealAt != null) reveal.current = setTimeout(() => setOpened(true), revealAt)
    if (ms != null) timer.current = setTimeout(finish, ms)
  }
  const gateProps = {
    onClick: start,
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start() } },
    'aria-label': label || inv.ot.text('cta') || phrase('open', inv.ot.lang),
  }
  return { opening, gone, start, finish, gateProps }
}

/** Açılışdakı ad sətri — admin override-ı varsa tək sətir, yoxsa «Ad & Ad» */
export function openingNames(inv) {
  const titleOv = inv.ot.override('title')
  if (titleOv !== undefined) return { titleOv, first: titleOv, second: '' }
  if (inv.isCouple) return { titleOv, first: inv.groom, second: inv.bride }
  return { titleOv, first: inv.single, second: '' }
}

/** Masa axtarışı sahəsinin funksional propları (stil şablondadır) */
export function seatInputProps(inv, listId) {
  const { seating } = inv
  return {
    ref: inv.seatInputRef,
    type: 'text',
    value: seating.query,
    onChange: (e) => { seating.setQuery(e.target.value); seating.setActiveIdx(-1); if (seating.selected) seating.setSelected(null) },
    onKeyDown: seating.onKeyDown,
    placeholder: inv.seatingL.hint,
    role: 'combobox',
    'aria-expanded': seating.suggestions.length > 0,
    'aria-controls': listId,
    'aria-autocomplete': 'list',
    autoComplete: 'off',
  }
}

/** RSVP ad sahəsinin funksional propları */
export function rsvpInputProps(inv) {
  const { rsvp } = inv
  return {
    ref: inv.rsvpInputRef,
    type: 'text',
    value: rsvp.query,
    onChange: (e) => { rsvp.setQuery(e.target.value); rsvp.setActiveIdx(-1); if (rsvp.selected) rsvp.setSelected(null) },
    onKeyDown: rsvp.onKeyDown,
    placeholder: inv.rsvpL.namePh,
    required: !rsvp.useGuestMode,
    autoComplete: 'off',
  }
}

/** RSVP seçimləri (etiketlər admin override-lıdır) */
export function rsvpOptions(inv) {
  return [
    { val: 'yes',   label: inv.rsvpL.yes },
    { val: 'no',    label: inv.rsvpL.no },
    { val: 'maybe', label: inv.rsvpL.maybe },
  ]
}

/** RSVP vəziyyəti: 'closed' | 'already' | 'done' | 'form' */
export function rsvpState(rsvp) {
  if (rsvp.rsvpClosed && !rsvp.submitted) return 'closed'
  if (rsvp.alreadyDone) return 'already'
  if (rsvp.submitted) return 'done'
  return 'form'
}

/** Hex + alpha → rgba */
export function alpha(hex, a) {
  const h = String(hex || '').replace('#', '')
  if (h.length !== 6) return hex
  const n = parseInt(h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

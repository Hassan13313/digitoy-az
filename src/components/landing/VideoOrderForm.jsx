/* ══════════════════════════════════════════════════
   VİDEO paketi (29 ₼) — videolu dəvətnamə sifarişi (2026-11-18)

   3 addım: 1 Video nümunəsi · 2 Məlumatlar · 3 Sifariş → WhatsApp.
   Veb-dəvətnamə YARADILMIR: sifariş draft_invitations-a package=VIDEO ilə
   yazılır (admin «Sifarişlər»də görür) və WhatsApp hazır mesajla açılır.

   ⚠ Ayrı session id (`digitoy_video_session_id`): submit_draft eyni sessiyanın
   SON draft-ını yeniləyir — əsas builder-in id-si işlənsəydi, video sifarişi
   müştərinin yarımçıq veb-dəvətnaməsinin üstünə yazılardı.
   ⚠ Form datası `music` açarını İŞLƏTMİR (`videoMusic`): `music` veb-dəvətnamənin
   pleyer obyektidir və admin tərəfdə başqa məna daşıyır.
══════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from 'react'
import {
  Heart, Diamond, Cake, Briefcase, Sparkles, Flame, Crown, Baby, HeartHandshake,
  GraduationCap, PartyPopper, LayoutGrid, Link2, MessageCircle, Music, PenLine, Wand2, Clock, MapPin,
} from 'lucide-react'
import BuilderShell, { StepCard } from '../builder/BuilderShell'
import { Field, TextInput, DateInput, TimeInput, Textarea, ChoiceGroup, SelectCard } from '../builder/fields'
import { Notice } from '../builder/feedback'
import { MusicTrackRow } from '../builder/media'
import ContactPhoneField from '../builder/ContactPhoneField'
import VideoSamplePicker from './VideoSamplePicker'
import PromoCodeField from './PromoCodeField'
import { EVENT_TYPES, AGE_EVENT_TYPES, COUPLE_TYPES, CORP_TYPES, WHATSAPP_NUMBER } from '../../data/constants'
import { PRESET_TRACKS, formatSeconds } from '../../data/music'
import { describeVideoSource, findVideoSample, normalizeSampleLink, sampleTitle, videoMusicLabel } from '../../data/videoSamples'
import { videoCopy } from '../../data/videoOrderCopy'
import { buildVideoWhatsAppUrl } from '../../utils/whatsappOrder'
import { waChatUrl } from '../../utils/waLink'
import { submitDraft } from '../../utils/api'
import { readCustomerPhone, saveCustomerPhone, normalizeCustomerPhone } from '../../utils/customerPhone'
import { formatFullDateByLang } from '../../utils/dateFormat'
import { trackEvent } from '../../utils/analytics'
import t from '../../data/translations'

const EVENT_ICONS = {
  toy: Heart, nishan: Diamond, birthday: Cake, corporate: Briefcase, other: Sparkles,
  xina: Flame, sunnet: Crown, baby: Baby, anniversary: HeartHandshake, graduation: GraduationCap, bachelorette: PartyPopper,
}
const STEP_IDS = ['sample', 'details', 'order']
const STORE_KEY = 'digitoy_video_order'
const SID_KEY = 'digitoy_video_session_id'

const EMPTY = {
  package: 'VIDEO',
  eventType: 'toy', groomName: '', brideName: '', eventName: '', age: '',
  date: '', time: '', venueName: '', inviteText: '', note: '',
  video: { source: 'sample', sampleId: '', link: '' },
  videoMusic: { mode: 'auto', trackId: '', title: '', artist: '', custom: '' },
}

/* Səhifə yenilənsə də forma itməsin (yalnız bu brauzerdə) */
function readStore() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
    if (s && typeof s === 'object' && s.data) {
      const d = s.data
      return {
        step: Math.min(Math.max(0, Number(s.step) || 0), STEP_IDS.length - 1),
        data: { ...EMPTY, ...d, package: 'VIDEO', video: { ...EMPTY.video, ...d.video }, videoMusic: { ...EMPTY.videoMusic, ...d.videoMusic } },
      }
    }
  } catch { /* private mode / pozulmuş JSON */ }
  return { step: 0, data: EMPTY }
}
function writeStore(v) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(v)) } catch { /* private mode */ }
}
const randomId = () => (typeof crypto !== 'undefined' && crypto.randomUUID)
  ? crypto.randomUUID()
  : Math.random().toString(36).slice(2) + Date.now().toString(36)
function videoSessionId() {
  try {
    let sid = localStorage.getItem(SID_KEY)
    if (!sid) { sid = randomId(); localStorage.setItem(SID_KEY, sid) }
    return sid
  } catch {
    return randomId()
  }
}

export default function VideoOrderForm({ lang = 'az' }) {
  const c = videoCopy(lang)
  const tr = t[lang] || t.az
  const [init] = useState(readStore)
  const [data, setData] = useState(init.data)
  const [step, setStep] = useState(init.step)
  const [dir, setDir] = useState(1)
  const [errors, setErrors] = useState({})
  const [phone, setPhone] = useState(() => readCustomerPhone())
  const [promo, setPromo] = useState(null)   /* PromoCodeField nəticəsi (server yoxlayıb) */
  const [sent, setSent] = useState(false)

  useEffect(() => { writeStore({ data, step }) }, [data, step])
  useEffect(() => { saveCustomerPhone(phone.trim()) }, [phone])

  const isCouple = COUPLE_TYPES.includes(data.eventType)
  const isCorp = CORP_TYPES.includes(data.eventType)

  const set = (k, v) => {
    setData((d) => ({ ...d, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }
  const setVideo = (patch) => {
    setData((d) => ({ ...d, video: { ...d.video, ...patch } }))
    setErrors((e) => ({ ...e, sample: undefined, link: undefined }))
  }
  const setMusic = (patch) => {
    setData((d) => ({ ...d, videoMusic: { ...d.videoMusic, ...patch } }))
    setErrors((e) => ({ ...e, music: undefined }))
  }

  const validate = (s) => {
    const e = {}
    const req = c.errRequired
    if (s === 0) {
      if (data.video.source === 'sample' && !findVideoSample(data.video.sampleId)) e.sample = c.errSample
      if (data.video.source === 'link' && !normalizeSampleLink(data.video.link)) e.link = c.errLink
    }
    if (s === 1) {
      if (isCorp && !data.eventName.trim()) e.eventName = req
      if (isCouple && !data.groomName.trim()) e.groomName = req
      if (!isCorp && !data.brideName.trim()) e.brideName = req
      if (!data.date) e.date = req
      const m = data.videoMusic
      if ((m.mode === 'preset' && !m.trackId) || (m.mode === 'own' && !m.custom.trim())) e.music = c.errMusic
    }
    return e
  }

  const goStep = (n) => {
    const to = Math.min(Math.max(0, n), STEP_IDS.length - 1)
    if (to === step) return
    setDir(to > step ? 1 : -1)
    setStep(to)
  }
  const next = () => {
    const e = validate(step)
    setErrors(e)
    if (Object.keys(e).length === 0) goStep(step + 1)
  }

  /* Sifariş: əvvəlcə WhatsApp (klikin içində, sinxron — popup bloklanmasın),
     sonra draft fonda serverə yazılır. */
  const order = () => {
    for (const s of [0, 1]) {
      const e = validate(s)
      if (Object.keys(e).length) { setErrors(e); goStep(s); return }
    }
    const v = data.video
    const payload = {
      ...data,
      video: {
        source: v.source,
        sampleId: v.source === 'sample' ? v.sampleId : '',
        link: v.source === 'link' ? normalizeSampleLink(v.link) : '',
      },
    }
    /* Promokod yalnız WhatsApp mesajına və submitDraft-ın ayrıca sahəsinə (form_data-ya yox) */
    const url = buildVideoWhatsAppUrl(promo ? { ...payload, promo } : payload, WHATSAPP_NUMBER)
    const promoCode = promo?.code || ''
    const ev = { lang, package: 'VIDEO', ...(promoCode && { promo: promoCode }) }
    submitDraft(videoSessionId(), payload, 'VIDEO', normalizeCustomerPhone(phone) || '', promoCode)
      .then((r) => { if (r?.draft_code) trackEvent('order_submitted', ev) })
      .catch(() => {})
    trackEvent('whatsapp_order_clicked', ev)
    const w = window.open(url, '_blank')
    if (w) { try { w.opener = null } catch { /* cross-origin */ } } else { setTimeout(() => { window.location.href = url }, 350) }
    setSent(true)
  }

  const id = STEP_IDS[step]
  const isLast = step === STEP_IDS.length - 1
  const directWa = waChatUrl(WHATSAPP_NUMBER, encodeURIComponent(c.directWaText))

  return (
    /* #builder-top — LandingPage › settleOnBuilder bu elementi gözləyir */
    <div id="builder-top">
    <BuilderShell
      lang={lang}
      hideHeader
      steps={STEP_IDS.map((s) => ({ id: s, label: c.steps[s] }))}
      current={step}
      direction={dir}
      onStepClick={(i) => { if (i < step) goStep(i) }}
      onPrev={() => goStep(step - 1)}
      onNext={isLast ? order : next}
      isLast={isLast}
      nextLabel={isLast ? c.orderBtn : undefined}
      notice={sent ? <Notice variant="success" lang={lang} onDismiss={() => setSent(false)}>{c.sentNote}</Notice> : null}
    >
      <StepCard title={c.steps[id]} subtitle={c.stepSub[id]}>
        {id === 'sample' && (
          <div className="space-y-6">
            <a
              href={directWa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_order_clicked', { lang, package: 'VIDEO', direct: true })}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-olive-mist px-4 text-[13.5px] font-medium text-olive ring-1 ring-inset ring-olive/25 transition-colors hover:bg-olive hover:text-white"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              {c.directWa}
            </a>

            <ChoiceGroup legend={c.sourceLegend} className="grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-3">
              {[['sample', LayoutGrid], ['link', Link2], ['whatsapp', MessageCircle]].map(([src, Icon]) => (
                <SelectCard
                  key={src}
                  name="videoSource"
                  value={src}
                  checked={data.video.source === src}
                  onChange={(val) => setVideo({ source: val })}
                  icon={Icon}
                  label={c.sources[src][0]}
                  description={c.sources[src][1]}
                  lang={lang}
                />
              ))}
            </ChoiceGroup>

            {data.video.source === 'sample' && (
              <VideoSamplePicker lang={lang} value={data.video.sampleId} onChange={(sid) => setVideo({ sampleId: sid })} error={errors.sample} />
            )}
            {data.video.source === 'link' && (
              <Field id="video-link" label={c.linkLabel} required hint={c.linkHint} error={errors.link} lang={lang}>
                <TextInput
                  id="video-link"
                  type="url"
                  inputMode="url"
                  value={data.video.link}
                  onChange={(val) => setVideo({ link: val })}
                  icon={Link2}
                  placeholder={c.linkPh}
                  maxLength={500}
                  hint={c.linkHint}
                  error={errors.link}
                />
              </Field>
            )}
            {data.video.source === 'whatsapp' && <Notice lang={lang}>{c.whatsappNote}</Notice>}
          </div>
        )}

        {id === 'details' && (
          <div className="space-y-7 sm:space-y-8">
            <ChoiceGroup legend={c.eventLegend} className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
              {EVENT_TYPES.map(({ id: ev }) => (
                <SelectCard
                  key={ev}
                  name="videoEventType"
                  value={ev}
                  checked={data.eventType === ev}
                  onChange={(v) => set('eventType', v)}
                  icon={EVENT_ICONS[ev]}
                  label={tr[`event_${ev}`]}
                  lang={lang}
                />
              ))}
            </ChoiceGroup>

            <NameFields data={data} set={set} errors={errors} tr={tr} lang={lang} isCouple={isCouple} isCorp={isCorp} />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
              <Field id="video-date" label={tr.date_label} required error={errors.date} lang={lang}>
                <DateInput id="video-date" value={data.date} onChange={(v) => set('date', v)} error={errors.date} lang={lang} />
              </Field>
              <Field id="video-time" label={tr.time_label} recommended lang={lang}>
                <TimeInput id="video-time" value={data.time} onChange={(v) => set('time', v)} />
              </Field>
            </div>

            <Field id="video-venue" label={c.venueLabel} recommended lang={lang}>
              <TextInput id="video-venue" value={data.venueName} onChange={(v) => set('venueName', v)} icon={MapPin} placeholder={c.venuePh} maxLength={120} />
            </Field>

            <Field id="video-text" label={c.textLabel} optional hint={c.textHint} lang={lang}>
              <Textarea id="video-text" value={data.inviteText} onChange={(v) => set('inviteText', v)} placeholder={c.textPh} rows={3} maxLength={600} hint={c.textHint} />
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={c.presetsLabel}>
                {c.presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => set('inviteText', p)}
                    aria-pressed={data.inviteText === p}
                    title={p}
                    className={`min-h-[40px] max-w-full rounded-2xl px-3.5 py-2 text-left text-[12.5px] leading-snug ring-1 ring-inset transition-colors ${
                      data.inviteText === p ? 'bg-espresso text-cream ring-espresso' : 'bg-white text-brown-dark ring-beige-dark hover:ring-gold/60'
                    }`}
                  >
                    {p.length > 48 ? `${p.slice(0, 46).trimEnd()}…` : p}
                  </button>
                ))}
              </div>
            </Field>

            <MusicChoice lang={lang} value={data.videoMusic} onChange={setMusic} error={errors.music} />

            <Field id="video-note" label={c.noteLabel} optional lang={lang}>
              <Textarea id="video-note" value={data.note} onChange={(v) => set('note', v)} placeholder={c.notePh} rows={3} maxLength={600} />
            </Field>
          </div>
        )}

        {id === 'order' && (
          <div className="space-y-6">
            <OrderSummary data={data} lang={lang} tr={tr} isCouple={isCouple} isCorp={isCorp} onEdit={goStep} />
            <p className="flex items-start gap-2.5 rounded-2xl bg-gold-mist/50 px-4 py-3.5 text-[14px] leading-snug text-brown-dark ring-1 ring-inset ring-gold/25">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" strokeWidth={1.8} aria-hidden="true" />
              {c.readyNote}
            </p>
            <ContactPhoneField value={phone} onChange={setPhone} lang={lang} />
            <PromoCodeField lang={lang} pkg="VIDEO" sessionId={videoSessionId()} value={promo} onChange={setPromo} />
            <p className="text-[13px] leading-snug text-brown-dark/85">{c.orderHint}</p>
          </div>
        )}
      </StepCard>
    </BuilderShell>
    </div>
  )
}

function NameFields({ data, set, errors, tr, lang, isCouple, isCorp }) {
  if (isCorp) {
    return (
      <Field id="video-event-name" label={tr.event_name_label} required error={errors.eventName} lang={lang}>
        <TextInput id="video-event-name" value={data.eventName} onChange={(v) => set('eventName', v)} error={errors.eventName} maxLength={80} />
      </Field>
    )
  }
  if (isCouple) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <Field id="video-groom" label={tr.groom_label} required error={errors.groomName} lang={lang}>
          <TextInput id="video-groom" value={data.groomName} onChange={(v) => set('groomName', v)} error={errors.groomName} maxLength={40} autoComplete="off" />
        </Field>
        <Field id="video-bride" label={tr.bride_label} required error={errors.brideName} lang={lang}>
          <TextInput id="video-bride" value={data.brideName} onChange={(v) => set('brideName', v)} error={errors.brideName} maxLength={40} autoComplete="off" />
        </Field>
      </div>
    )
  }
  const withAge = AGE_EVENT_TYPES.includes(data.eventType)
  return (
    <div className={`grid grid-cols-1 gap-6 sm:gap-8 ${withAge ? 'sm:grid-cols-2' : ''}`}>
      <Field id="video-name" label={tr[`name_label_${data.eventType}`] || tr.person_name_label} required error={errors.brideName} lang={lang}>
        <TextInput id="video-name" value={data.brideName} onChange={(v) => set('brideName', v)} error={errors.brideName} maxLength={40} autoComplete="off" />
      </Field>
      {withAge && (
        <Field id="video-age" label={tr[`age_label_${data.eventType}`] || tr.age_label} lang={lang}>
          <TextInput id="video-age" inputMode="numeric" value={data.age} onChange={(v) => set('age', v.replace(/\D/g, '').slice(0, 3))} placeholder={tr.age_placeholder} />
        </Field>
      )}
    </div>
  )
}

/* Fon musiqisi: hazır siyahı (dinlə + seç) · öz mahnısı · «siz seçin» */
function MusicChoice({ lang, value, onChange, error }) {
  const c = videoCopy(lang)
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(null)
  const [buffering, setBuffering] = useState(false)

  /* pause() MP3-ün (4–6 MB) yüklənməsini dayandırmır — src də silinir */
  const release = () => {
    const a = audioRef.current
    if (a) { a.pause(); a.removeAttribute('src'); a.load() }
  }
  const stop = () => { release(); setPlaying(null); setBuffering(false) }
  useEffect(() => release, [])

  const toggle = (trk) => {
    if (!audioRef.current) {
      const a = new Audio()
      a.preload = 'none'
      a.addEventListener('ended', () => setPlaying(null))
      audioRef.current = a
    }
    const a = audioRef.current
    if (playing === trk.id) { stop(); return }
    a.src = trk.file
    setPlaying(trk.id)
    setBuffering(true)
    a.play().catch(() => setPlaying(null)).finally(() => setBuffering(false))
  }

  return (
    <div className="space-y-4">
      <ChoiceGroup legend={c.musicLegend} id="video-music" error={error} className="grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-3">
        {[['preset', Music], ['own', PenLine], ['auto', Wand2]].map(([mode, Icon]) => (
          <SelectCard
            key={mode}
            name="videoMusicMode"
            value={mode}
            checked={value.mode === mode}
            onChange={(m) => { if (m !== 'preset') stop(); onChange({ mode: m }) }}
            icon={Icon}
            label={c.music[mode][0]}
            description={c.music[mode][1]}
            lang={lang}
          />
        ))}
      </ChoiceGroup>

      {value.mode === 'preset' && (
        <div className="space-y-2.5">
          {PRESET_TRACKS.map((trk) => (
            <MusicTrackRow
              key={trk.id}
              title={trk.title}
              artist={trk.artist}
              duration={formatSeconds(trk.duration)}
              tint={trk.accent}
              playing={playing === trk.id}
              buffering={playing === trk.id && buffering}
              onTogglePlay={() => toggle(trk)}
              selected={value.trackId === trk.id}
              onSelect={() => onChange({ trackId: trk.id, title: trk.title, artist: trk.artist || '' })}
              lang={lang}
            />
          ))}
        </div>
      )}
      {value.mode === 'own' && (
        <Field id="video-music-own" label={c.musicOwnLabel} required lang={lang}>
          <TextInput id="video-music-own" value={value.custom} onChange={(v) => onChange({ custom: v })} icon={Music} placeholder={c.musicOwnPh} maxLength={300} />
        </Field>
      )}
      {value.mode === 'auto' && <p className="text-[13px] leading-snug text-brown-dark/85">{c.musicAutoNote}</p>}
    </div>
  )
}

function OrderSummary({ data, lang, tr, isCouple, isCorp, onEdit }) {
  const c = videoCopy(lang)
  const { sample, link } = describeVideoSource(data.video)
  const names = isCouple
    ? `${data.groomName} & ${data.brideName}`
    : isCorp ? data.eventName : `${data.brideName}${data.age ? ` (${data.age})` : ''}`
  const eventLabel = data.eventType === 'other' && data.eventName ? data.eventName : tr[`event_${data.eventType}`]

  const rows = [
    [c.sum.pkg, c.pkgLabel],
    [c.sum.sample, sample ? sampleTitle(sample, lang) : link ? `${c.sampleLink}: ${link}` : c.sampleWa, 0],
    [c.sum.event, eventLabel, 1],
    [c.sum.names, names, 1],
    [c.sum.when, [data.date ? formatFullDateByLang(data.date, lang) : '', data.time].filter(Boolean).join(' · ') || '—', 1],
    [c.sum.venue, data.venueName.trim() || '—', 1],
    [c.sum.text, data.inviteText.trim() || c.textAuto, 1],
    [c.sum.music, videoMusicLabel(data.videoMusic, c.musicAuto), 1],
    ...(data.note.trim() ? [[c.sum.note, data.note.trim(), 1]] : []),
  ]

  return (
    <section aria-labelledby="video-summary-title">
      <h3 id="video-summary-title" className="font-serif text-[22px] text-ink">{c.summaryTitle}</h3>
      <dl className="mt-3 divide-y divide-beige-dark/70 overflow-hidden rounded-2xl bg-cream/70 ring-1 ring-inset ring-beige-dark">
        {rows.map(([label, value, stepIdx]) => (
          <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5 px-4 py-3 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:items-baseline">
            <dt className="text-[12px] font-semibold text-brown-dark/80 sm:text-[13px]">{label}</dt>
            <dd className="col-span-2 row-start-2 break-words text-[14.5px] leading-snug text-ink sm:col-span-1 sm:row-start-auto">{value}</dd>
            {stepIdx != null && (
              <button
                type="button"
                onClick={() => onEdit(stepIdx)}
                className="col-start-2 row-start-1 min-h-[32px] text-[12.5px] font-medium text-gold-deep underline-offset-4 hover:underline sm:col-start-3"
              >
                {c.edit}
              </button>
            )}
          </div>
        ))}
      </dl>
    </section>
  )
}

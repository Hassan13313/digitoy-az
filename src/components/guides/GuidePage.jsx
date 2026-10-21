import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import SubpageHeader, { SubpageFooter } from '../public/SubpageHeader'
import { LegalRelated } from '../public/legal'
import { TemplatesCta } from '../public/templates'
import { FOCUS } from '../public/shared'
import { GUIDES, findGuide } from '../../data/guides'
import { spaClick } from '../../utils/siteRoutes'
import { formatDayMonthYear } from '../../utils/dateFormat'
import { consent } from '../../utils/consent'

/* ─────────────────────────────────────────────────────────────────────────────
   BƏLƏDÇİ SƏHİFƏSİ — /toy-devetnamesi-metnleri və s. (Phase 52, SEO)

   Mətn public/guides/<slug>.json-dadır. İlk açılışda seo.php həmin JSON-u
   səhifəyə <script id="dt-guide-data"> kimi qoyur — əlavə sorğu olmur;
   SPA daxilində keçiddə isə fetch edilir. Məzmun yalnız Azərbaycancadır
   (Google yalnız AZ versiyanı indeksləyir), ona görə dil seçimi yoxdur.

   Görünüşün tək «səsli» elementi nümunə mətn kartıdır: kiçik dəvətnamə
   kimi çərçivəli, [yer tutucular] vurğulanır ki, nəyi dəyişmək lazım
   olduğu bir baxışda görünsün. Qalan hər şey hüquqi səhifələrin sakit
   tipoqrafiyasıdır.
   ───────────────────────────────────────────────────────────────────────── */

function readInline(slug) {
  try {
    const el = document.getElementById('dt-guide-data')
    const d = el ? JSON.parse(el.textContent) : null
    return d && d.slug === slug ? d : null
  } catch {
    return null
  }
}

/* «[Bəyin adı]» kimi yer tutucuları vurğula */
function Sample({ text }) {
  return text.split(/(\[[^\]]+\])/).map((part, i) =>
    /^\[[^\]]+\]$/.test(part)
      ? <span key={i} className="rounded-[5px] bg-gold-mist/80 px-1 not-italic text-gold-deep">{part}</span>
      : part,
  )
}

function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
  /* Köhnə brauzer / http — gizli textarea ilə */
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.cssText = 'position:fixed;opacity:0'
  document.body.appendChild(ta)
  ta.select()
  const ok = document.execCommand('copy')
  ta.remove()
  return ok ? Promise.resolve() : Promise.reject(new Error('copy'))
}

function SampleCard({ text }) {
  const [status, setStatus] = useState('idle')   // idle | copied | failed
  useEffect(() => {
    if (status === 'idle') return undefined
    const t = setTimeout(() => setStatus('idle'), 2200)
    return () => clearTimeout(t)
  }, [status])
  const copy = () => copyText(text).then(() => setStatus('copied'), () => setStatus('failed'))

  return (
    <figure className="relative rounded-[22px] bg-white/90 px-5 pb-5 pt-8 shadow-soft ring-1 ring-inset ring-gold/25 sm:px-10 sm:pt-10">
      <span aria-hidden="true" className="pointer-events-none absolute inset-[7px] rounded-[16px] border border-gold/15" />
      <blockquote className="relative whitespace-pre-line text-center font-serif text-[19px] leading-[1.6] text-ink sm:text-[21px]">
        <Sample text={text} />
      </blockquote>
      <figcaption className="relative mt-6 flex justify-center">
        <button
          type="button"
          onClick={copy}
          className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-[13.5px] font-medium text-brown-dark ring-1 ring-inset ring-gold/35 transition-colors duration-200 hover:bg-gold-mist/60 ${FOCUS}`}
        >
          {status === 'copied'
            ? <Check className="h-4 w-4 text-gold-deep" strokeWidth={2} aria-hidden="true" />
            : <Copy className="h-4 w-4 text-gold-deep" strokeWidth={1.7} aria-hidden="true" />}
          <span aria-live="polite">
            {status === 'copied' ? 'Kopyalandı' : status === 'failed' ? 'Kopyalamaq alınmadı — mətni seçib kopyalayın' : 'Mətni kopyala'}
          </span>
        </button>
      </figcaption>
    </figure>
  )
}

function Body({ blocks = [] }) {
  return blocks.map((b, i) => {
    if (typeof b === 'string') return <p key={i}>{b}</p>
    if (b?.list) return (
      <ul key={i} className="space-y-2.5">
        {b.list.map((item, j) => (
          <li key={j} className="relative pl-6">
            <span aria-hidden="true" className="absolute left-0.5 top-[0.72em] h-1.5 w-1.5 rotate-45 bg-gold" />
            {item}
          </li>
        ))}
      </ul>
    )
    if (b?.steps) return (
      <ol key={i} className="space-y-4">
        {b.steps.map((item, j) => (
          <li key={j} className="flex gap-4">
            <span aria-hidden="true" className="w-6 shrink-0 font-serif text-[22px] italic leading-[1.4] lining-nums text-gold-deep">{j + 1}</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    )
    return null
  })
}

export default function GuidePage({ slug, onBack, onCreate }) {
  const meta = findGuide(slug)
  const [loaded, setLoaded] = useState(() => {
    const d = readInline(slug)
    return d ? { slug, data: d, error: false } : { slug: null, data: null, error: false }
  })
  const data = loaded.slug === slug ? loaded.data : null
  const error = loaded.slug === slug && loaded.error

  useEffect(() => {
    if (loaded.slug === slug) return undefined
    let alive = true
    fetch(`/guides/${slug}.json`)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() })
      .then((d) => { if (alive) setLoaded({ slug, data: d, error: false }) })
      .catch(() => { if (alive) setLoaded({ slug, data: null, error: true }) })
    return () => { alive = false }
  }, [slug, loaded.slug])

  /* /toy-devetnamesi-metnleri#seirli — mətn gələndən sonra bölməyə sürüş */
  useEffect(() => {
    if (!data) return
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView({ block: 'start' })
  }, [data])

  const nav = (e, href) => spaClick(e, href)
  const related = (data?.related || [])
    .map(findGuide).filter(Boolean)
    .map((g) => ({ href: `/${g.slug}`, label: g.label }))

  return (
    <div className="dt-site dt-page min-h-screen bg-cream text-brown-dark">
      <SubpageHeader lang="az" backLabel="Ana səhifə" onBack={(e) => { e?.preventDefault?.(); onBack() }} />

      <main lang="az" className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <nav aria-label="Yol">
          <ol className="flex flex-wrap items-center gap-x-2 text-[13px] text-brown-dark">
            <li><a href="/" onClick={(e) => { e.preventDefault(); onBack() }} className={`rounded underline-offset-4 hover:text-ink hover:underline ${FOCUS}`}>Ana səhifə</a></li>
            <li aria-hidden="true" className="text-gold">/</li>
            <li aria-current="page" className="text-ink">{meta?.label}</li>
          </ol>
        </nav>

        {error ? (
          <div className="mt-16" role="alert">
            <p className="text-[16px]">Səhifənin mətni yüklənmədi. İnternet bağlantısını yoxlayıb yenidən cəhd edin.</p>
            <button type="button" onClick={() => window.location.reload()} className={`mt-5 inline-flex h-11 items-center rounded-full px-5 text-[14px] font-medium text-ink ring-1 ring-inset ring-gold/40 hover:bg-gold-mist/60 ${FOCUS}`}>
              Yenidən yüklə
            </button>
          </div>
        ) : !data ? (
          <p className="mt-16 text-[15px]" role="status">Yüklənir…</p>
        ) : (
          <article className="mt-6">
            <header>
              <h1 className="font-serif text-[2.5rem] font-medium leading-[1.06] tracking-[-0.01em] text-ink [text-wrap:balance] sm:text-[3.25rem]">
                {data.h1}
              </h1>
              <div aria-hidden="true" className="mt-6 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
              <p className="mt-5 text-[13px] text-brown-dark">
                Yenilənib: <time dateTime={data.updated}>{formatDayMonthYear(data.updated, 'az')}</time>
              </p>
            </header>

            <div className="mt-8 max-w-[68ch] space-y-5 text-[17px] leading-[1.8] text-[#3A312D] sm:text-[18px] [&>p:first-child]:font-serif [&>p:first-child]:text-[21px] [&>p:first-child]:leading-[1.55] [&>p:first-child]:text-ink sm:[&>p:first-child]:text-[23px]">
              <Body blocks={data.intro} />
            </div>

            <nav aria-label="Bu səhifədə" className="mt-9">
              <ul className="flex flex-wrap gap-2">
                {data.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className={`inline-flex min-h-[40px] items-center rounded-full bg-white/70 px-4 text-[13.5px] text-brown-dark ring-1 ring-inset ring-gold/25 transition-colors hover:bg-gold-mist/60 hover:text-ink ${FOCUS}`}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-12 space-y-14 sm:mt-14 sm:space-y-16">
              {data.sections.map((s) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-24">
                  <h2 id={`${s.id}-title`} className="border-t border-gold/25 pt-7 font-serif text-[26px] font-medium leading-tight text-ink sm:text-[30px]">
                    {s.title}
                  </h2>
                  {s.body?.length > 0 && (
                    <div className="mt-5 max-w-[68ch] space-y-5 text-[16.5px] leading-[1.8] text-[#3A312D] sm:text-[17px]">
                      <Body blocks={s.body} />
                    </div>
                  )}
                  {s.samples?.length > 0 && (
                    <div className="mt-7 space-y-5">
                      {s.samples.map((t, i) => <SampleCard key={i} text={t} />)}
                    </div>
                  )}
                </section>
              ))}

              {data.faq?.length > 0 && (
                <section aria-labelledby="faq-title">
                  <h2 id="faq-title" className="border-t border-gold/25 pt-7 font-serif text-[26px] font-medium leading-tight text-ink sm:text-[30px]">
                    Tez-tez verilən suallar
                  </h2>
                  <dl className="mt-6 max-w-[68ch] space-y-7">
                    {data.faq.map((f) => (
                      <div key={f.q}>
                        <dt className="font-serif text-[21px] leading-snug text-ink">{f.q}</dt>
                        <dd className="mt-2 text-[16.5px] leading-[1.8] text-[#3A312D] sm:text-[17px]">{f.a}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </div>

            <div className="mt-16 space-y-10">
              {data.cta && <TemplatesCta lang="az" title={data.cta.title} text={data.cta.text} buttonLabel="Dəvətnaməni hazırla" onCreate={onCreate} />}
              {related.length > 0 && <LegalRelated lang="az" title="Digər bələdçilər" items={related} onNavigate={nav} />}
            </div>
          </article>
        )}
      </main>

      <SubpageFooter
        lang="az"
        navLabel="Bələdçilər"
        links={GUIDES.map((g) => ({ href: `/${g.slug}`, label: g.label }))}
        onNavigate={nav}
        action={{ label: 'Kuki ayarları', onClick: () => consent.openSettings() }}
      />
    </div>
  )
}

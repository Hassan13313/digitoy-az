// ════════════════════════════════════════════════════════════════
// Sifariş Xülasəsi — bütün məlumatın icmalı + sifariş düyməsi (YALNIZ görünüş)
// Boş sahələr «Göstərilməyib» kimi görünür; onEditStep verilərsə hər sətirdə
// «Düzəlt» düyməsi həmin addıma qaytarır.
// ════════════════════════════════════════════════════════════════
import { CalendarDays, Eye, Images, ListOrdered, MapPin, Music, PencilLine, Shirt, Users } from 'lucide-react';
import t from '../../data/translations';
import { WhatsAppIcon } from '../landing/v2/ui';
import { Spinner } from './feedback';

const tx = (lang) => t[lang] ?? t.az ?? {};

/**
 * @param {object} p
 * @param {string} [p.eventLabel]        «Toy»
 * @param {string[]} p.names             ['Nicat', 'Aysel'] (bir ad da ola bilər)
 * @param {string} [p.dateText]          «12 iyun 2027, Şənbə»
 * @param {string} [p.timeText]          «19:00»
 * @param {string} [p.venue]  @param {string} [p.venueNote]
 * @param {{time:string, icon?:string, text:string}[]} [p.program]
 * @param {{title:string, subtitle?:string, colors?:string[]}} [p.dress]
 * @param {{title:string, artist?:string}} [p.music]
 * @param {string} [p.seating]           «DigiToy hazırlayacaq»
 * @param {string} [p.gallery]           «QR foto paylaşımı aktivdir» və ya link
 * @param {string[]} [p.sections]        Açıq bölmələrin adları
 * @param {{id:string, icon:React.ComponentType, label:string, value:React.ReactNode, stepId?:string}[]} [p.extraRows]
 * @param {string} [p.packageName]  @param {string|number} [p.price]
 * @param {(stepId:string)=>void} [p.onEditStep]
 * @param {()=>void} p.onOrder           WhatsApp ilə sifariş
 * @param {boolean} [p.ordering]         Spinner
 * @param {()=>void} [p.onPreview]       «Dəvətnaməni gör»
 * @param {()=>void} [p.onEdit]          «Redaktə et» (builder-ə qayıt)
 * @param {string} [p.termsHref='/terms'] @param {string} [p.privacyHref='/privacy']
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export default function OrderSummary({
  eventLabel,
  names = [],
  dateText,
  timeText,
  venue,
  venueNote,
  program = [],
  dress,
  music,
  seating,
  gallery,
  sections = [],
  extraRows = [],
  packageName,
  price,
  onEditStep,
  onOrder,
  ordering = false,
  onPreview,
  onEdit,
  termsHref = '/terms',
  privacyHref = '/privacy',
  lang = 'az',
}) {
  const x = tx(lang);
  const empty = (
    <span className="font-serif text-[16px] italic text-brown-muted">{x.summaryEmpty ?? 'Göstərilməyib'}</span>
  );

  const rows = [
    {
      id: 'date',
      stepId: 'event',
      icon: CalendarDays,
      label: x.summaryDate ?? 'Tarix və vaxt',
      value: dateText ? (
        <>
          <span className="block text-[16px] text-ink">{dateText}</span>
          {timeText && <span className="mt-0.5 block text-[14px] lining-nums text-brown-dark">{timeText}</span>}
        </>
      ) : null,
    },
    {
      id: 'venue',
      stepId: 'venue',
      icon: MapPin,
      label: x.summaryVenue ?? 'Məkan',
      value: venue ? (
        <>
          <span className="block text-[16px] text-ink">{venue}</span>
          {venueNote && <span className="mt-0.5 block text-[14px] text-brown-dark">{venueNote}</span>}
        </>
      ) : null,
    },
    {
      id: 'program',
      stepId: 'program',
      icon: ListOrdered,
      label: x.summaryProgram ?? 'Proqram',
      value: program.length ? (
        <ol className="space-y-1.5">
          {program.map((r, i) => (
            <li key={i} className="grid grid-cols-[52px_24px_minmax(0,1fr)] items-baseline gap-2 text-[15px]">
              <span className="font-semibold lining-nums tabular-nums text-gold-deep">{r.time}</span>
              <span aria-hidden="true">{r.icon}</span>
              <span className="text-ink">{r.text}</span>
            </li>
          ))}
        </ol>
      ) : null,
    },
    {
      id: 'dress',
      stepId: 'dress',
      icon: Shirt,
      label: x.summaryDress ?? 'Geyim tərzi',
      value: dress ? (
        <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span>
            <span className="block text-[16px] text-ink">{dress.title}</span>
            {dress.subtitle && <span className="block text-[13.5px] text-brown-dark">{dress.subtitle}</span>}
          </span>
          {dress.colors?.length > 0 && (
            <span className="flex gap-1.5" aria-hidden="true">
              {dress.colors.map((c) => (
                <span
                  key={c}
                  className="h-4 w-4 rounded-full ring-1 ring-inset ring-black/10"
                  style={{ backgroundColor: c }}
                />
              ))}
            </span>
          )}
        </span>
      ) : null,
    },
    {
      id: 'music',
      stepId: 'music',
      icon: Music,
      label: x.summaryMusic ?? 'Fon musiqisi',
      value: music ? (
        <span className="text-[16px] text-ink">
          {music.title}
          {music.artist && <span className="text-brown-dark"> — {music.artist}</span>}
        </span>
      ) : null,
    },
    {
      id: 'seating',
      stepId: 'seating',
      icon: Users,
      label: x.summarySeating ?? 'Oturma planı',
      value: seating ? <span className="text-[16px] text-ink">{seating}</span> : null,
    },
    {
      id: 'gallery',
      stepId: 'gallery',
      icon: Images,
      label: x.summaryGallery ?? 'Foto qalereya',
      value: gallery ? <span className="break-all text-[16px] text-ink">{gallery}</span> : null,
    },
    ...extraRows,
  ];

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <article className="relative overflow-hidden rounded-[32px] bg-white shadow-luxe">
        {/* dəvətnamə üslublu baş hissə */}
        <header className="grain relative bg-gradient-to-b from-gold-mist/70 to-white px-6 pb-8 pt-10 text-center sm:px-10">
          <span aria-hidden="true" className="absolute inset-x-12 top-0 h-px bg-gold-line" />
          <span aria-hidden="true" className="absolute inset-3 rounded-[26px] border border-gold/20" />
          {eventLabel && (
            <p className="relative text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-deep">{eventLabel}</p>
          )}
          <h3 className="relative mt-3 font-serif text-[40px] font-medium leading-[1.05] text-ink sm:text-[52px]">
            {names.filter(Boolean).map((n, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-3 font-normal italic text-gold-rich">&amp;</span>}
                {n}
              </span>
            ))}
          </h3>
          {packageName && (
            <p className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-espresso px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-light">
              {packageName}
              {price != null && (
                <>
                  <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-gold" />
                  <span className="lining-nums">{price} ₼</span>
                </>
              )}
            </p>
          )}
        </header>

        <dl className="divide-y divide-gold/15 px-5 sm:px-10">
          {rows.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.id} className="grid grid-cols-[40px_minmax(0,1fr)_auto] gap-x-4 py-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-mist/80 text-gold-deep">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep">{r.label}</dt>
                  <dd className="mt-1.5">{r.value ?? empty}</dd>
                </div>
                {onEditStep && r.stepId && (
                  <button
                    type="button"
                    onClick={() => onEditStep(r.stepId)}
                    aria-label={`${r.label} — ${x.summaryFix ?? 'düzəlt'}`}
                    className="-mr-2 grid h-11 w-11 place-items-center self-start rounded-full text-brown-muted transition-colors hover:bg-gold-mist/60 hover:text-gold-deep"
                  >
                    <PencilLine className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                  </button>
                )}
              </div>
            );
          })}
          {sections.length > 0 && (
            <div className="py-5">
              <dt className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
                {x.summarySections ?? 'Dəvətnamə bölmələri'}
              </dt>
              <dd className="mt-3 flex flex-wrap gap-1.5">
                {sections.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-cream px-3 py-1.5 text-[12.5px] text-brown-dark ring-1 ring-inset ring-gold/25"
                  >
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </article>

      {/* hərəkətlər */}
      <div className="mt-7 grid gap-3 sm:grid-cols-[1.3fr_1fr]">
        <button
          type="button"
          onClick={onOrder}
          disabled={ordering}
          aria-busy={ordering || undefined}
          className="group relative inline-flex h-14 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-espresso-grad px-6 text-[13px] font-semibold uppercase tracking-label text-cream shadow-lift ring-1 ring-inset ring-gold/30 transition-[transform,box-shadow] duration-300 ease-luxe hover:-translate-y-0.5 hover:shadow-luxe disabled:opacity-70"
        >
          {ordering ? (
            <Spinner size="sm" tone="light" lang={lang} />
          ) : (
            <WhatsAppIcon className="h-[18px] w-[18px] text-gold-light" />
          )}
          {x.summaryOrder ?? 'WhatsApp ilə sifariş et'}
        </button>
        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-white/60 px-6 text-[13px] font-semibold uppercase tracking-label text-gold-deep ring-1 ring-inset ring-gold/55 transition-colors hover:bg-gold-mist/60"
          >
            <Eye className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            {x.summaryPreview ?? 'Dəvətnaməni gör'}
          </button>
        )}
      </div>
      <p className="mt-4 text-center text-[13px] leading-relaxed text-brown-dark">
        {x.summaryConsentA ?? 'Sifariş verməklə'}{' '}
        <a
          href={termsHref}
          className="font-medium text-gold-deep underline decoration-gold/50 underline-offset-[3px] hover:decoration-gold-deep"
        >
          {x.summaryTerms ?? 'İstifadə şərtlərini'}
        </a>{' '}
        {x.summaryConsentB ?? 'və'}{' '}
        <a
          href={privacyHref}
          className="font-medium text-gold-deep underline decoration-gold/50 underline-offset-[3px] hover:decoration-gold-deep"
        >
          {x.summaryPrivacy ?? 'Məxfilik siyasətini'}
        </a>{' '}
        {x.summaryConsentC ?? 'qəbul edirəm'}
      </p>
      {onEdit && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-[12px] font-semibold uppercase tracking-label text-brown-dark transition-colors hover:text-ink"
          >
            <PencilLine className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            {x.summaryEdit ?? 'Redaktə et'}
          </button>
        </div>
      )}
    </div>
  );
}

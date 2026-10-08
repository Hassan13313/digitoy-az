// ════════════════════════════════════════════════════════════════
// Builder — seçim kartları və sətirləri (YALNIZ görünüş)
// Bütün seçim kartları native radio üzərində qurulub: eyni `name` = bir qrup,
// ox düymələri və Space/Enter avtomatik işləyir.
// ════════════════════════════════════════════════════════════════
import { useId } from 'react';
import { ArrowUpRight, Check, Copy, Eye, Lock, Pin, Sparkles } from 'lucide-react';
import t from '../../data/translations';
import { WhatsAppIcon } from '../landing/v2/ui';
import { Switch } from './fields';

const tx = (lang) => t[lang] ?? t.az ?? {};

/** Seçilmiş kartın sağ üst küncündəki işarə */
function CheckBadge({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-6 w-6 place-items-center rounded-full bg-espresso text-gold-light shadow-soft ring-2 ring-white ${className}`}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
    </span>
  );
}

/** «Paketdə yoxdur» nişanı */
export function LockedChip({ lang = 'az', className = '' }) {
  const x = tx(lang);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-beige px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-brown-dark ${className}`}
    >
      <Lock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
      {x.lockedInPackage ?? 'Paketdə yoxdur'}
    </span>
  );
}

const cardRing = (selected, off) =>
  selected
    ? 'bg-gold-mist/55 ring-2 ring-espresso shadow-soft'
    : off
      ? 'bg-beige/40 ring-1 ring-beige-dark'
      : 'bg-white ring-1 ring-beige-dark group-hover:ring-gold/60 group-hover:shadow-soft';

// ════════════════════════════════════════════════════════════════
/**
 * Dəvətnamə bölməsi sətri: ikon + ad + izah + açar. Kilidli variant qıfıl göstərir.
 * @param {object} p
 * @param {React.ComponentType} p.icon
 * @param {string} p.title
 * @param {string} [p.description]
 * @param {boolean} p.checked
 * @param {(checked:boolean)=>void} p.onChange
 * @param {boolean} [p.locked]        Paketdə yoxdur — açar deaktiv
 * @param {()=>void} [p.onUpgrade]    Kilidli sətirdə «Paketi yüksəlt» linki
 * @param {string} [p.note]           Kiçik qeyd (məs. «Bu addım builder-dən çıxarıldı»)
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function SectionToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  locked,
  onUpgrade,
  note,
  lang = 'az',
}) {
  const x = tx(lang);
  const descId = useId();
  const active = checked && !locked;
  return (
    <div className="flex items-center gap-4 py-4 sm:gap-5">
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-colors duration-300 ${
          active
            ? 'bg-espresso text-gold-light'
            : locked
              ? 'bg-beige text-brown-muted'
              : 'bg-gold-mist/70 text-gold-deep'
        }`}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[15px] font-medium ${locked ? 'text-brown-dark/80' : active ? 'text-ink' : 'text-brown-dark'}`}
        >
          {title}
        </p>
        {description && (
          <p id={descId} className="mt-0.5 text-[13px] leading-snug text-brown-dark/80">
            {description}
          </p>
        )}
        {note && <p className="mt-1 font-serif text-[14px] italic text-gold-deep">{note}</p>}
        {locked && onUpgrade && (
          <button
            type="button"
            onClick={onUpgrade}
            className="mt-1.5 inline-flex min-h-[32px] items-center gap-1 text-[12px] font-semibold text-gold-deep underline decoration-gold/50 underline-offset-[3px] hover:decoration-gold-deep"
          >
            {x.upgradePackage ?? 'Paketi yüksəlt'}
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </button>
        )}
      </div>
      {locked ? (
        <LockedChip lang={lang} className="shrink-0" />
      ) : (
        <Switch checked={checked} onChange={onChange} label={title} describedBy={description ? descId : undefined} />
      )}
    </div>
  );
}

/** SectionToggleRow-ları ayırıcı xətlərlə qruplaşdırır */
export function ToggleList({ children, className = '' }) {
  return <div className={`divide-y divide-gold/15 border-y border-gold/15 ${className}`}>{children}</div>;
}

// ════════════════════════════════════════════════════════════════
/**
 * Şablon önbaxış kartı.
 * @param {object} p
 * @param {string} p.name           radio qrup adı (məs. "template")
 * @param {string} p.value          şablon id-si
 * @param {string} p.title          «Royal Gold»
 * @param {string} [p.description]  «Klassik lüks toy üslubu»
 * @param {boolean} p.selected
 * @param {(value:string)=>void} p.onSelect
 * @param {React.ReactNode} [p.preview]   Kiçik önbaxış (sizin mövcud thumbnail komponentiniz)
 * @param {string} [p.imageSrc]           …və ya şəkil
 * @param {boolean} [p.live]              «Canlı» nişanı
 * @param {()=>void} [p.onPreview]        «Önbaxış» düyməsi
 * @param {boolean} [p.locked]
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function TemplateCard({
  name,
  value,
  title,
  description,
  selected,
  onSelect,
  preview,
  imageSrc,
  live,
  onPreview,
  locked,
  lang = 'az',
}) {
  const x = tx(lang);
  return (
    <div className="group relative flex flex-col">
      <label className={`relative block ${locked ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <input
          type="radio"
          name={name}
          value={value}
          checked={!!selected}
          disabled={locked}
          onChange={() => onSelect?.(value)}
          className="peer sr-only"
        />
        <span
          className={`block overflow-hidden rounded-2xl transition-[box-shadow,transform] duration-300 ease-luxe peer-focus-visible:ring-2 peer-focus-visible:ring-gold-deep peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-cream ${
            selected
              ? 'shadow-lift ring-2 ring-espresso'
              : 'ring-1 ring-beige-dark group-hover:-translate-y-1 group-hover:shadow-lift group-hover:ring-gold/60'
          }`}
        >
          <span className="relative block aspect-[3/4] w-full overflow-hidden bg-beige">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
                /* Digitoy: şəkil telefon ekranıdır (390×844) — adlar və tarix yuxarı üçdə birdədir */
                style={{ objectPosition: '50% 16%' }}
              />
            ) : (
              <span className="block h-full w-full transition-transform duration-700 ease-luxe group-hover:scale-[1.03]">
                {preview}
              </span>
            )}
            {live && (
              <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-olive shadow-soft backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-olive" aria-hidden="true" />
                {x.templateLive ?? 'Canlı'}
              </span>
            )}
            {selected && <CheckBadge className="absolute right-2.5 top-2.5" />}
            {locked && (
              <span className="absolute inset-0 grid place-items-center bg-cream/70 backdrop-blur-[2px]">
                <LockedChip lang={lang} />
              </span>
            )}
          </span>
          <span className="block bg-white px-3.5 pb-3.5 pt-3">
            <span className="flex items-center justify-between gap-2">
              <span
                className={`truncate font-serif text-[18px] leading-tight ${selected ? 'text-ink' : 'text-ink/90'}`}
              >
                {title}
              </span>
            </span>
            {description && <span className="mt-1 block truncate text-[12px] text-brown-dark/85">{description}</span>}
          </span>
        </span>
      </label>
      {onPreview && (
        <button
          type="button"
          onClick={onPreview}
          aria-label={`${title} — ${x.templatePreview ?? 'Önbaxış'}`}
          className="mt-2 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-[12px] text-[11px] font-semibold uppercase tracking-label text-brown-dark transition-colors hover:bg-white hover:text-gold-deep"
        >
          <Eye className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
          {x.templatePreview ?? 'Önbaxış'}
        </button>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Böyük seçim kartı (oturma planı üsulu, qalereya seçimi, musiqi mənbəyi və s.).
 * Seçiləndə `children` kartın içində açılır (orada input ola bilər).
 * @param {object} p
 * @param {string} p.name
 * @param {string} p.value
 * @param {boolean} p.selected
 * @param {(value:string)=>void} p.onSelect
 * @param {React.ComponentType} [p.icon]
 * @param {string} p.title
 * @param {string} [p.description]
 * @param {string} [p.badge]           Məs. «+15 AZN», «Tövsiyə olunur»
 * @param {boolean} [p.locked]
 * @param {boolean} [p.disabled]
 * @param {React.ReactNode} [p.children]  Seçiləndə görünən əlavə məzmun
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function OptionCard({
  name,
  value,
  selected,
  onSelect,
  icon: Icon,
  title,
  description,
  badge,
  locked,
  disabled,
  children,
  lang = 'az',
}) {
  const off = locked || disabled;
  return (
    <div
      className={`group relative rounded-2xl transition-[box-shadow,background-color] duration-300 ease-luxe ${cardRing(selected, off)}`}
    >
      <label
        className={`flex items-start gap-4 p-4 sm:items-center sm:p-5 ${off ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={!!selected}
          disabled={off}
          onChange={() => onSelect?.(value)}
          className="peer sr-only"
        />
        {/* klaviatura fokusu bütün kartı əhatə edir */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl peer-focus-visible:ring-2 peer-focus-visible:ring-gold-deep peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-cream"
        />
        {Icon && (
          <span
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
              selected
                ? 'bg-espresso text-gold-light'
                : off
                  ? 'bg-beige text-brown-muted'
                  : 'bg-gold-mist/80 text-gold-deep'
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className={`text-[15.5px] font-semibold ${off ? 'text-brown-dark/80' : 'text-ink'}`}>{title}</span>
            {badge && (
              <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-espresso">
                {badge}
              </span>
            )}
            {locked && <LockedChip lang={lang} />}
          </span>
          {description && (
            <span className="mt-1 block text-[13.5px] leading-snug text-brown-dark/90">{description}</span>
          )}
        </span>
        <span
          aria-hidden="true"
          className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 ring-inset transition-colors sm:mt-0 ${
            selected ? 'bg-espresso text-gold-light ring-espresso' : 'bg-white ring-beige-dark'
          }`}
        >
          {selected && <Check className="h-3.5 w-3.5" strokeWidth={2.6} />}
        </span>
      </label>
      {selected && children && (
        <div className="border-t border-gold/20 px-4 pb-5 pt-4 sm:px-5 sm:pl-[84px]">{children}</div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Geyim tərzi kartı (köhnə versiyanın quruluşu): ikon, ad, alt yazı, kiçik rəng nöqtələri.
 * Redaktə props-ları verilərsə, kartın altında «Kartın adı» + iki üslub sahəsi görünür.
 * @param {object} p
 * @param {string} p.name
 * @param {string} p.value
 * @param {boolean} p.selected
 * @param {(value:string)=>void} p.onSelect
 * @param {React.ComponentType} [p.icon]
 * @param {string} p.title             «Rəsmi»
 * @param {string} [p.subtitle]        «Klassik Kostyum · Rəsmi Geyim»
 * @param {string[]} [p.colors]        Kiçik nöqtələr üçün hex rənglər (məs. ['#1A1A1A','#F2F0EC','#C5A059'])
 * @param {string} [p.customTitle]     Kartın adı (istifadəçinin yazdığı)
 * @param {(v:string)=>void} [p.onCustomTitleChange]
 * @param {string} [p.styleA]          Birinci üslub, məs. «Klassik Kostyum»
 * @param {(v:string)=>void} [p.onStyleAChange]
 * @param {string} [p.styleB]          İkinci üslub, məs. «Rəsmi Geyim»
 * @param {(v:string)=>void} [p.onStyleBChange]
 * @param {React.ReactNode} [p.children]  Əlavə məzmun (seçiləndə görünür)
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function PaletteCard({
  name,
  value,
  selected,
  onSelect,
  icon: Icon,
  title,
  subtitle,
  colors = [],
  customTitle,
  onCustomTitleChange,
  styleA,
  onStyleAChange,
  styleB,
  onStyleBChange,
  children,
  lang = 'az',
}) {
  const x = tx(lang);
  const editable = !!(onCustomTitleChange || onStyleAChange || onStyleBChange);
  const shownTitle = customTitle?.trim() || title;
  /* Digitoy: hər üslub öz standartına düşür (köhnə builder qaydası — data/dressCode.js) */
  const [subA, subB] = (subtitle || '').split(' · ');
  const shownSub = [styleA?.trim() || subA, styleB?.trim() || subB].filter(Boolean).join(' · ');
  const editCls =
    'h-10 w-full min-w-0 rounded-[12px] bg-white px-3 text-[16px] text-ink ring-1 ring-inset ring-beige-dark placeholder:text-brown-muted/80 transition-shadow hover:ring-gold/60 focus:outline-none focus:ring-2 focus:ring-gold-deep sm:text-[14px]';

  return (
    <div className="flex flex-col gap-2.5">
      <div
        className={`group relative rounded-3xl transition-[box-shadow,background-color,transform] duration-300 ease-luxe ${cardRing(selected, false)} ${
          selected ? '' : 'hover:-translate-y-0.5'
        }`}
      >
        <label className="flex cursor-pointer items-center gap-4 p-5">
          <input
            type="radio"
            name={name}
            value={value}
            checked={!!selected}
            onChange={() => onSelect?.(value)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl peer-focus-visible:ring-2 peer-focus-visible:ring-gold-deep peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-cream"
          />
          {selected && <CheckBadge className="absolute right-4 top-4" />}
          {Icon && (
            <span
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ring-1 ring-inset transition-colors ${
                selected ? 'bg-espresso text-gold-light ring-espresso' : 'bg-cream text-gold-deep ring-gold/30'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
            </span>
          )}
          <span className="min-w-0 flex-1 pr-6">
            <span className="block truncate text-[16px] font-semibold text-ink">{shownTitle}</span>
            {shownSub && <span className="mt-0.5 block truncate text-[13px] text-brown-dark/90">{shownSub}</span>}
            {colors.length > 0 && (
              <span className="mt-3 flex gap-1.5" aria-hidden="true">
                {colors.map((c) => (
                  <span
                    key={c}
                    className="h-4 w-4 rounded-full ring-1 ring-inset ring-black/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </span>
            )}
          </span>
        </label>
        {selected && children && <div className="border-t border-gold/20 px-5 pb-5 pt-4">{children}</div>}
      </div>

      {/* köhnə versiyadakı kimi: kartın altında adı və üslubları dəyişmək */}
      {editable && (
        <div className="grid grid-cols-2 gap-2 px-1">
          {onCustomTitleChange && (
            <input
              type="text"
              value={customTitle ?? ''}
              onChange={(e) => onCustomTitleChange(e.target.value, e)}
              placeholder={title}
              aria-label={`${x.paletteCardName ?? 'Kartın adı'} — ${title}`}
              className={`${editCls} col-span-2`}
            />
          )}
          {onStyleAChange && (
            <input
              type="text"
              value={styleA ?? ''}
              onChange={(e) => onStyleAChange(e.target.value, e)}
              placeholder={subtitle?.split(' · ')[0] ?? ''}
              aria-label={`${x.paletteStyle1 ?? 'Birinci üslub'} — ${title}`}
              className={editCls}
            />
          )}
          {onStyleBChange && (
            <input
              type="text"
              value={styleB ?? ''}
              onChange={(e) => onStyleBChange(e.target.value, e)}
              placeholder={subtitle?.split(' · ')[1] ?? ''}
              aria-label={`${x.paletteStyle2 ?? 'İkinci üslub'} — ${title}`}
              className={editCls}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Partnyor endirim kartı.
 * @param {object} p
 * @param {string} p.name              «Vagzali.az»
 * @param {React.ReactNode} [p.logo]   Loqo (<img>); verilməsə adın ilk hərfi
 * @param {string} [p.description]
 * @param {string} p.discount          «15%-dək»
 * @param {string} [p.packageLabel]    «Sizin paketiniz»
 * @param {string} [p.howTo]           İstifadə qaydası (məs. «"Digitoy müştərisiyəm" deyin»)
 * @param {string} [p.instagramUrl]
 * @param {string} [p.whatsappUrl]
 * @param {string} [p.disclaimer]
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function PartnerCard({
  name,
  logo,
  description,
  discount,
  packageLabel,
  howTo,
  instagramUrl,
  whatsappUrl,
  disclaimer,
  lang = 'az',
}) {
  const x = tx(lang);
  return (
    <article className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-soft ring-1 ring-gold/20 sm:p-8">
      <span
        aria-hidden="true"
        className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,rgba(232,213,163,0.45),transparent)]"
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-cream font-serif text-2xl italic text-gold-deep ring-1 ring-gold/30">
            {logo ?? name?.[0]}
          </span>
          <div>
            <h4 className="font-serif text-[26px] leading-tight text-ink">{name}</h4>
            {description && <p className="mt-0.5 text-[13.5px] text-brown-dark/90">{description}</p>}
          </div>
        </div>
        {/* endirim möhürü */}
        <div className="flex shrink-0 items-center gap-3 self-start rounded-2xl bg-espresso-grad px-5 py-3 text-cream shadow-lift ring-1 ring-inset ring-gold/30">
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-gold-light">
              {packageLabel ?? x.partnerYourPackage ?? 'Sizin paketiniz'}
            </p>
            <p className="font-serif text-[30px] leading-none lining-nums">{discount}</p>
          </div>
          <span className="text-[11px] uppercase tracking-[0.14em] text-sand">{x.partnerDiscount ?? 'endirim'}</span>
        </div>
      </div>

      {howTo && (
        <div className="relative mt-6 flex items-start gap-3 rounded-2xl bg-gold-mist/50 px-4 py-3.5 text-[14px] leading-relaxed text-brown-dark">
          <Pin className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" strokeWidth={1.8} aria-hidden="true" />
          <span>{howTo}</span>
        </div>
      )}

      {(instagramUrl || whatsappUrl) && (
        <div className="relative mt-6 grid gap-2.5 sm:grid-cols-2">
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white text-[12px] font-semibold uppercase tracking-label text-gold-deep ring-1 ring-inset ring-gold/45 transition-colors hover:bg-gold-mist/50"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
              </svg>
              Instagram
            </a>
          )}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-espresso text-[12px] font-semibold uppercase tracking-label text-cream ring-1 ring-inset ring-gold/30 transition-colors hover:bg-espresso-soft"
            >
              <WhatsAppIcon className="h-4 w-4 text-gold-light" />
              WhatsApp
            </a>
          )}
        </div>
      )}
      {disclaimer && <p className="relative mt-5 text-[12px] leading-relaxed text-brown-dark/80">{disclaimer}</p>}
    </article>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * QR foto paylaşım kartı (Foto qalereya addımı).
 * @param {object} p
 * @param {React.ReactNode} p.qr        QR şəkli/komponenti (sizin mövcud QR generatorunuz)
 * @param {string} p.url                Qalereya linki
 * @param {string[]} [p.features]       «QR paylaşım», «HD yükləmə» …
 * @param {()=>void} [p.onCopy]         Linki kopyala
 * @param {boolean} [p.copied]          true olanda «Kopyalandı» göstərilir
 * @param {string} [p.title] @param {string} [p.text]
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function QrShareCard({ qr, url, features = [], onCopy, copied, title, text, lang = 'az' }) {
  const x = tx(lang);
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-mist/70 via-cream to-white p-5 ring-1 ring-gold/30 sm:p-7">
      <span aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gold-line" />
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-espresso text-gold-light">
          <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
            {x.qrEyebrow ?? 'Foto paylaşım sistemi'}
          </p>
          <p className="font-serif text-[21px] leading-tight text-ink">
            {title ?? x.qrTitle ?? 'Qonaqlar bu QR vasitəsilə şəkil göndərəcək'}
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-[164px_minmax(0,1fr)] sm:items-center">
        <div className="mx-auto w-[164px] rounded-2xl bg-white p-3 shadow-lift ring-1 ring-gold/25">
          <div className="aspect-square w-full [&>*]:h-full [&>*]:w-full">{qr}</div>
        </div>
        <div className="min-w-0">
          <p className="text-[14px] leading-relaxed text-brown-dark">
            {text ??
              x.qrText ??
              'Masa kartlarına bu QR kodu yapışdırın. Qonaqlar skan edərək toy şəkillərini birbaşa sistemə yükləyəcəklər.'}
          </p>
          {features.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-[13px] text-ink">
                  <Check className="h-3.5 w-3.5 shrink-0 text-gold-deep" strokeWidth={2.4} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white p-1.5 pl-4 ring-1 ring-inset ring-beige-dark">
            <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-brown-dark" title={url}>
              {url}
            </span>
            {onCopy && (
              <button
                type="button"
                onClick={onCopy}
                className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[12px] px-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                  copied ? 'bg-olive text-white' : 'bg-espresso text-cream hover:bg-espresso-soft'
                }`}
                aria-live="polite"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {copied ? (x.copied ?? 'Kopyalandı') : (x.copy ?? 'Kopyala')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// /templates — şablon vitrini komponentləri (YALNIZ görünüş)
//   TemplatesIntro · FilterBar · TemplatesGrid · TemplateCard · TemplatesEmpty · TemplatesCta
// Filtrləmə məntiqi sizdədir: komponentlər yalnız props göstərir və callback çağırır.
// ════════════════════════════════════════════════════════════════
import { useCallback, useId, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { ArrowRight, Eye, Lock, RotateCcw, Sparkles } from 'lucide-react';
import { FOCUS, FOCUS_DARK, Kicker, Rule, StatusChip } from './shared';

const EASE = [0.22, 1, 0.36, 1];

// ════════════════════════════════════════════════════════════════
/**
 * Səhifə girişi: eyebrow + başlıq + giriş mətni.
 * @param {object} p
 * @param {string} [p.eyebrow='Dizayn kolleksiyası']
 * @param {string} [p.title='Dəvətnamə Şablonları']
 * @param {string} [p.text]
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function TemplatesIntro({
  eyebrow = 'Dizayn kolleksiyası',
  title = 'Dəvətnamə Şablonları',
  text = 'Hər şablon ayrıca dizayn dilidir — rəng, şrift, animasiya və açılış ekranı fərqlidir. Bəyəndiyinizi seçin, məlumatlarınız eyni qalır.',
  lang = 'az',
}) {
  return (
    <div lang={lang} className="max-w-3xl">
      <Kicker lang={lang}>{eyebrow}</Kicker>
      <h1 className="mt-4 font-serif text-[2.6rem] font-medium leading-[1.04] tracking-[-0.01em] text-ink [text-wrap:balance] sm:text-[3.5rem] lg:text-[4.25rem]">
        {title}
      </h1>
      <Rule className="mt-6" />
      <p className="mt-6 max-w-[56ch] text-[15.5px] leading-[1.75] text-brown-dark sm:text-[17px]">{text}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * @typedef {{ id: string, label: string, count?: number }} FilterOption
 */

/**
 * İki çip sətri (status və kateqoriya) + sayğac + «Filtri sıfırla».
 * Mobildə hər sətir öz içində üfüqi sürüşür (səhifə eninə daşmır), desktopda sətrə sığır.
 * @param {object} p
 * @param {FilterOption[]} p.statuses
 * @param {FilterOption[]} p.categories
 * @param {string} p.status                Seçilmiş status id-si (məs. 'all')
 * @param {string} p.category              Seçilmiş kateqoriya id-si
 * @param {(id:string)=>void} p.onStatus
 * @param {(id:string)=>void} p.onCategory
 * @param {number} p.total                 Bütün şablonların sayı
 * @param {number} p.visibleCount          Filtrdən sonra görünənlərin sayı
 * @param {()=>void} p.onReset
 * @param {boolean} [p.isFiltered]         Default: status !== allId || category !== allId
 * @param {string} [p.allId='all']
 * @param {string} [p.statusLegend='Vəziyyət']
 * @param {string} [p.categoryLegend='Kateqoriya']
 * @param {string} [p.resetLabel='Filtri sıfırla']
 * @param {(visible:number, total:number)=>string} [p.formatCount]  Default: «16 şablon» / «4 / 16 şablon»
 * @param {string} [p.bleedClassName]      Mobil sürüşmə sətrinin kənara çıxması (səhifə padding-inə uyğun)
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function FilterBar({
  statuses = [],
  categories = [],
  status,
  category,
  onStatus,
  onCategory,
  total,
  visibleCount,
  onReset,
  isFiltered,
  allId = 'all',
  statusLegend = 'Vəziyyət',
  categoryLegend = 'Kateqoriya',
  resetLabel = 'Filtri sıfırla',
  formatCount = (v, t) => (v === t ? `${t} şablon` : `${v} / ${t} şablon`),
  bleedClassName = '-mx-5 px-5 sm:mx-0 sm:px-0',
  lang = 'az',
}) {
  const filtered = isFiltered ?? (status !== allId || category !== allId);
  return (
    <div lang={lang} className="space-y-5">
      {statuses.length > 0 && (
        <ChipRow
          legend={statusLegend}
          options={statuses}
          value={status}
          onChange={onStatus}
          bleedClassName={bleedClassName}
        />
      )}
      {categories.length > 0 && (
        <ChipRow
          legend={categoryLegend}
          options={categories}
          value={category}
          onChange={onCategory}
          bleedClassName={bleedClassName}
        />
      )}
      <div className="flex h-11 items-center justify-between gap-4 border-t border-gold/20 pt-5">
        <p aria-live="polite" className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brown-dark">
          <span className="lining-nums tabular-nums">{formatCount(visibleCount, total)}</span>
        </p>
        {filtered && (
          <button
            type="button"
            onClick={onReset}
            className={`inline-flex h-11 items-center gap-2 rounded-full px-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-gold-deep transition-colors hover:bg-gold-mist/60 ${FOCUS}`}
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            {resetLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function ChipRow({ legend, options, value, onChange, bleedClassName }) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id}>
      <p id={id} className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brown-dark/90">
        {legend}
      </p>
      <div
        className={`overflow-x-auto [scrollbar-width:none] sm:overflow-visible [&::-webkit-scrollbar]:hidden ${bleedClassName}`}
      >
        <ul className="flex w-max gap-2 py-1 sm:w-auto sm:flex-wrap">
          {options.map((o) => {
            const active = o.id === value;
            return (
              <li key={o.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange?.(o.id)}
                  className={`inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[11.5px] font-semibold uppercase tracking-[0.14em] transition-[background-color,color,box-shadow] duration-300 ease-luxe ${FOCUS} ${
                    active
                      ? 'bg-espresso text-cream shadow-soft'
                      : 'bg-white text-brown-dark ring-1 ring-inset ring-beige-dark hover:text-ink hover:ring-gold/60'
                  }`}
                >
                  {o.label}
                  {typeof o.count === 'number' && (
                    <span
                      className={`text-[11px] font-medium lining-nums tabular-nums ${
                        active ? 'text-gold-light' : 'text-brown-dark/80'
                      }`}
                    >
                      {o.count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Kart şəbəkəsi. Filtr dəyişəndə kartlar yumşaq yer dəyişir, gələn/gedən kartlar sönür.
 * (layout="position" — şəkillər əyilmir, 16 kartda da səlisdir.)
 * @param {object} p
 * @param {any[]} p.items
 * @param {(item:any)=>string} p.getKey
 * @param {(item:any, index:number)=>React.ReactNode} p.renderItem
 * @param {string} [p.className]  Default: 1 → 2 → 3 sütun
 * @param {string} [p.label]      Siyahının aria-label-i
 */
export function TemplatesGrid({
  items = [],
  getKey,
  renderItem,
  label,
  className = 'grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7',
}) {
  return (
    <MotionConfig reducedMotion="user">
      <ul className={className} aria-label={label}>
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item, i) => (
            <motion.li
              key={getKey(item)}
              layout="position"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {renderItem(item, i)}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </MotionConfig>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Şablon kartı. Bütün kart BİR düymədir (onPreview) — içində ikinci klik hədəfi yoxdur.
 * Şəkil: telefon ekranı (390×844, DPR 2 → 780×1688) şablonun öz fonunda «səhnə» üzərində,
 * telefonun yuxarı ~80%-i görünür: başlıq, adlar, tarix, məkan və geri sayımın başı.
 * Şəkil yüklənənə qədər ekran `background` rəngində, `accent` rəngində yumşaq yer tutucu göstərilir.
 *
 * @param {object} p
 * @param {string} p.name                  «Royal Gold» (ingiliscə — <span lang="en"> içində göstərilir)
 * @param {string} [p.nameLang='en']
 * @param {string} [p.statusLabel]         «Canlı»
 * @param {'positive'|'info'|'muted'} [p.statusTone='positive']
 * @param {string} [p.categoryLabel]       «Lüks»
 * @param {string} [p.description]         «Klassik lüks toy üslubu»
 * @param {string} [p.image]               '/img/templates/royal-gold.webp'
 * @param {string} [p.imageAlt]            Default: «{name} şablonunun önbaxışı»
 * @param {number} [p.imageWidth=780]  @param {number} [p.imageHeight=1688]
 * @param {'lazy'|'eager'} [p.loading='lazy']
 * @param {string} p.accent                Şablonun vurğu rəngi (yer tutucu, parıltı)
 * @param {string} p.background            Şablonun fon rəngi (səhnə və yer tutucu)
 * @param {boolean} [p.locked]             Seçilə bilməz — qıfıl nişanı göstərilir (önbaxış yenə açılır)
 * @param {string} [p.lockedLabel='Kilidli']
 * @param {()=>void} p.onPreview
 * @param {string} [p.previewLabel='Önbaxış']
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function TemplateCard({
  name,
  nameLang = 'en',
  statusLabel,
  statusTone = 'positive',
  categoryLabel,
  description,
  image,
  imageAlt,
  imageWidth = 780,
  imageHeight = 1688,
  loading = 'lazy',
  accent = '#C5A059',
  background = '#F4F1EA',
  locked = false,
  lockedLabel = 'Kilidli',
  onPreview,
  previewLabel = 'Önbaxış',
  lang = 'az',
}) {
  const descId = useId();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  // keşdən dərhal gələn şəkil üçün
  const imgRef = useCallback((node) => {
    if (node && node.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <button
      type="button"
      lang={lang}
      onClick={onPreview}
      aria-label={`${previewLabel}: ${name}`}
      aria-describedby={descId}
      className={`group relative block w-full rounded-[26px] bg-white p-2 text-left shadow-soft ring-1 ring-beige-dark/80 transition-[transform,box-shadow] duration-500 ease-luxe hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0 ${FOCUS}`}
    >
      {/* ── Səhnə ─────────────────────────────────────────── */}
      <span
        className="relative block aspect-[10/11] overflow-hidden rounded-[20px]"
        style={{ backgroundColor: background }}
      >
        {/* vurğu rəngində işıq + incə çərçivə */}
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-90"
          style={{ background: `radial-gradient(60% 55% at 50% 62%, ${accent}40, transparent 70%)` }}
        />
        <span aria-hidden="true" className="absolute inset-0 rounded-[20px] ring-1 ring-inset ring-black/[0.06]" />

        {/* telefon — aşağıdan kəsilir */}
        <span className="absolute left-1/2 top-6 block w-[72%] -translate-x-1/2 transition-transform duration-700 ease-luxe group-hover:-translate-y-1.5 motion-reduce:group-hover:translate-y-0 sm:top-7 sm:w-[64%]">
          <span className="block rounded-t-[30px] bg-[#171312] px-[5px] pt-[5px] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
            <span className="relative block overflow-hidden rounded-t-[25px]" style={{ backgroundColor: background }}>
              {/* yer tutucu */}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 flex aspect-[780/1688] flex-col items-center pt-[34%] transition-opacity duration-500 ${
                  loaded ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span
                  className="h-1.5 w-[22%] rounded-full motion-safe:animate-pulse"
                  style={{ backgroundColor: `${accent}55` }}
                />
                <span
                  className="mt-4 h-4 w-[46%] rounded-full motion-safe:animate-pulse"
                  style={{ backgroundColor: `${accent}40` }}
                />
                <span
                  className="mt-2 h-4 w-[38%] rounded-full motion-safe:animate-pulse"
                  style={{ backgroundColor: `${accent}40` }}
                />
                <span className="mt-5 h-px w-[24%]" style={{ backgroundColor: `${accent}80` }} />
                <span
                  className="mt-4 h-2 w-[30%] rounded-full motion-safe:animate-pulse"
                  style={{ backgroundColor: `${accent}33` }}
                />
              </span>
              {image && !failed ? (
                <img
                  key={image}
                  ref={imgRef}
                  src={image}
                  alt={imageAlt ?? `${name} şablonunun önbaxışı`}
                  width={imageWidth}
                  height={imageHeight}
                  loading={loading}
                  decoding="async"
                  onLoad={() => setLoaded(true)}
                  onError={() => setFailed(true)}
                  className={`relative block h-auto w-full transition-opacity duration-700 ease-luxe ${
                    loaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ) : (
                <span aria-hidden="true" className="block aspect-[780/1688] w-full" />
              )}
            </span>
          </span>
        </span>

        {/* aşağı kənarda yumşaq keçid */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-16"
          style={{ background: `linear-gradient(to top, ${background}, transparent)` }}
        />

        {/* üst nişanlar */}
        <span className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {statusLabel && <StatusChip label={statusLabel} tone={statusTone} lang={lang} className="shadow-soft" />}
        </span>
        {locked && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-espresso/85 px-2.5 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.14em] text-cream backdrop-blur">
            <Lock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
            {lockedLabel}
          </span>
        )}
      </span>

      {/* ── Mətn ──────────────────────────────────────────── */}
      <span className="block px-3 pb-3 pt-4">
        {categoryLabel && (
          <span className="block text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
            {categoryLabel}
          </span>
        )}
        <span className="mt-1 block font-serif text-[24px] font-medium leading-tight text-ink">
          <span lang={nameLang}>{name}</span>
        </span>
        <span id={descId} className="mt-1 block text-[13.5px] leading-snug text-brown-dark">
          {[categoryLabel, statusLabel, locked ? lockedLabel : null].filter(Boolean).length > 0 && (
            <span className="sr-only">
              {[categoryLabel, statusLabel, locked ? lockedLabel : null].filter(Boolean).join(', ')}.{' '}
            </span>
          )}
          {description}
        </span>
        <span
          aria-hidden="true"
          className="mt-4 flex items-center justify-between border-t border-gold/20 pt-3 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-gold-deep"
        >
          <span className="inline-flex items-center gap-2">
            <Eye className="h-4 w-4" strokeWidth={1.6} />
            {previewLabel}
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-mist/70 transition-[transform,background-color] duration-300 ease-luxe group-hover:translate-x-0.5 group-hover:bg-espresso group-hover:text-gold-light">
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        </span>
      </span>
    </button>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Filtrə uyğun şablon olmadıqda.
 * @param {object} p
 * @param {string} [p.title='Bu filtrə uyğun şablon tapılmadı.']
 * @param {string} [p.text]           Əlavə izah (istəyə bağlı)
 * @param {string} [p.resetLabel='Filtri sıfırla']
 * @param {()=>void} p.onReset
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function TemplatesEmpty({
  title = 'Bu filtrə uyğun şablon tapılmadı.',
  text,
  resetLabel = 'Filtri sıfırla',
  onReset,
  lang = 'az',
}) {
  return (
    <div
      lang={lang}
      role="status"
      className="flex flex-col items-center rounded-[28px] border border-dashed border-gold/45 bg-white/60 px-6 py-14 text-center"
    >
      <svg viewBox="0 0 120 80" className="h-20 w-[120px]" aria-hidden="true" fill="none">
        <rect x="18" y="22" width="84" height="52" rx="4" fill="#FFFDF8" stroke="#C5A059" strokeWidth="1.4" />
        <path d="M18 24 L60 52 L102 24" stroke="#C5A059" strokeWidth="1.4" />
        <path d="M60 4v8M44 8l4 6M76 8l-4 6" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      </svg>
      <p className="mt-5 font-serif text-[24px] leading-tight text-ink">{title}</p>
      {text && <p className="mt-2 max-w-[40ch] text-[14.5px] leading-relaxed text-brown-dark">{text}</p>}
      <button
        type="button"
        onClick={onReset}
        className={`mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-espresso px-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-espresso-soft ${FOCUS}`}
      >
        <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        {resetLabel}
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Səhifənin sonundakı çağırış bloku.
 * @param {object} p
 * @param {string} [p.title='Bəyəndiyiniz dizaynla başlayın']
 * @param {string} [p.text]
 * @param {string} [p.buttonLabel='Dəvətnaməni hazırla']
 * @param {()=>void} p.onCreate
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function TemplatesCta({
  title = 'Bəyəndiyiniz dizaynla başlayın',
  text = 'Şablonu sifariş formasının ilk addımında da seçə və dəyişə bilərsiniz.',
  buttonLabel = 'Dəvətnaməni hazırla',
  onCreate,
  lang = 'az',
}) {
  return (
    <section
      lang={lang}
      className="relative overflow-hidden rounded-[30px] bg-espresso-grad px-6 py-10 text-center shadow-luxe sm:px-12 sm:py-12 md:flex md:items-center md:justify-between md:gap-10 md:text-left"
    >
      <span aria-hidden="true" className="absolute inset-x-12 top-0 h-px bg-gold-line" />
      <span
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(232,213,163,0.22),transparent)]"
      />
      <div className="relative">
        <h2 className="font-serif text-[30px] font-medium leading-tight text-cream sm:text-[36px]">{title}</h2>
        {text && <p className="mx-auto mt-3 max-w-[46ch] text-[15px] leading-relaxed text-sand md:mx-0">{text}</p>}
      </div>
      <button
        type="button"
        onClick={onCreate}
        className={`group relative mt-7 inline-flex h-14 shrink-0 items-center justify-center gap-2.5 rounded-full bg-gold px-8 text-[13px] font-semibold uppercase tracking-[0.16em] text-espresso shadow-lift transition-[transform,background-color] duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-[#CDA963] md:mt-0 ${FOCUS_DARK}`}
      >
        <Sparkles className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        {buttonLabel}
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </button>
    </section>
  );
}

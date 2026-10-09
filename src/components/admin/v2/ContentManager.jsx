// ════════════════════════════════════════════════════════════════
// ContentManager — «Dəvətnamə məzmunu» (YALNIZ görünüş)
//
// Desktop: solda redaktor (yapışqan tab başlığı), sağda «Canlı önbaxış» (telefon /
// desktop). Mobil: «Redaktə / Önbaxış» keçidi. Altda «Hamısını sıfırla», saxlanmamış
// dəyişikliklərin sayı və «Saxla».
//
// Məlumat tam idarə olunur (controlled): `values` — redaktədəki vəziyyət, `savedValues` —
// sonuncu saxlanmış vəziyyət (dəyişiklik nişanları üçün), `defaults` — şablonun öz
// dəyərləri (placeholder və «sıfırla» üçün). Hər dəyişiklikdə `onChange(next, path)`.
//
// İki işarə: • «dəyişib» = saxlanmamış dəyişiklik; ↺ = sahəni şablonun dəyərinə qaytar
// (mətn sahəsi boşalır — boş sahə şablonun öz mətnini göstərir).
// ════════════════════════════════════════════════════════════════
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Ban,
  Check,
  Eye,
  EyeOff,
  FileText,
  ImagePlus,
  Image as ImageIcon,
  LayoutList,
  Lock,
  Monitor,
  Palette,
  PencilLine,
  Plus,
  RotateCcw,
  Smartphone,
  Smile,
  Sparkles,
  Trash2,
  Type,
  BookHeart,
  X,
} from 'lucide-react';
import {
  Button,
  ChangedBadge,
  ColorField,
  ConfirmDialog,
  FOCUS,
  IconButton,
  Input,
  LANGS,
  Modal,
  Notice,
  OpStatus,
  RangeField,
  ResetFieldButton,
  SegmentedControl,
  Spinner,
  Switch,
  Tabs,
  Textarea,
  Toast,
  cx,
} from './adminUi';

// ── Kiçik köməkçilər ─────────────────────────────────────────────
const get = (o, path) => path.reduce((a, k) => (a == null ? undefined : a[k]), o);
const setIn = (o, [k, ...rest], v) => {
  const base = Array.isArray(o) ? [...(o ?? [])] : { ...(o ?? {}) };
  base[k] = rest.length ? setIn(o?.[k], rest, v) : v;
  return base;
};
const same = (a, b) => JSON.stringify(a ?? '') === JSON.stringify(b ?? '');
/** İki obyekt arasında fərqli «yarpaq» sahələrin sayı. */
export function diffCount(a, b) {
  if (Array.isArray(a) || Array.isArray(b)) return same(a, b) ? 0 : 1;
  if (a && typeof a === 'object') {
    const keys = new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})]);
    let n = 0;
    keys.forEach((k) => {
      n += diffCount(a?.[k], b?.[k]);
    });
    return n;
  }
  if (b && typeof b === 'object') return diffCount(b, a);
  return (a ?? '') === (b ?? '') ? 0 : 1;
}

export const CONTENT_TABS = [
  { id: 'texts', label: 'Mətnlər', icon: FileText, localized: true },
  { id: 'opening', label: 'Açılış', icon: Sparkles, localized: true },
  { id: 'story', label: 'Love Story', icon: BookHeart, localized: true },
  { id: 'colors', label: 'Rənglər', icon: Palette },
  { id: 'typography', label: 'Tipoqrafiya', icon: Type },
  { id: 'sections', label: 'Bölmələr', icon: LayoutList },
];

const EMBLEM_MODES = [
  { value: 'auto', label: 'Avtomatik', icon: Sparkles, hint: 'Şablonun öz nişanı' },
  { value: 'none', label: 'Boş', icon: Ban, hint: 'Nişan göstərilmir' },
  { value: 'text', label: 'Mətn', icon: Type, hint: 'Məs. baş hərflər' },
  { value: 'sticker', label: 'Stiker', icon: Smile, hint: 'Hazır stikerlərdən' },
  { value: 'image', label: 'Şəkil', icon: ImageIcon, hint: 'Öz şəkliniz' },
];

/**
 * @typedef {object} ContentSchema
 * @property {{id:string,title:string,hint?:string,fields:{key:string,label:string,localized?:boolean,multiline?:boolean,short?:boolean}[]}[]} textSections
 *           «Mətnlər» tabının kartları (Hero, Sayğac, Məkan / Xəritə, Proqram …). `localized` — labelə «(AZ)» əlavə olunur.
 * @property {{key:string,label:string}[]} openingFields  Açılış yazıları (üst yazı, adlar, tarix, düymə, ipucu)
 * @property {string[]} [stickers]  Stiker seçimləri (emoji və ya qısa simvol)
 * @property {{key:string,label:string,hint?:string}[]} colorTokens  Şablonun rəng tokenləri
 * @property {{heading:FontOption[],body:FontOption[]}} fonts
 * @property {{min:number,max:number,step:number}} [scale]  Şrift ölçüsü (%)
 * @property {{id:string,label:string,hint?:string,locked?:boolean}[]} sections  Dəvətnamə bölmələri
 * @typedef {{value:string,label:string,family:string}} FontOption  `family` — CSS font-family (siyahıda nümunə üçün)
 *
 * @typedef {object} ContentValues
 * @property {Record<'az'|'en'|'ru',Record<string,string>>} texts  Boş sətir = şablonun mətni
 * @property {{emblem:'auto'|'none'|'text'|'sticker'|'image',emblemText?:string,emblemSticker?:string,emblemImage?:string,
 *            texts:Record<string,Record<string,string>>,hidden:Record<string,boolean>}} opening
 * @property {{chapters:{id:string,date?:string,sticker?:string,images?:string[],title?:Record<string,string>,text?:Record<string,string>}[]}} story
 * @property {Record<string,string>} colors  token → #HEX
 * @property {{heading:string,body:string,scale:number}} typography
 * @property {Record<string,boolean>} sections  bölmə id → açıq/bağlı
 */

/**
 * @param {object} p
 * @param {boolean} p.open  @param {()=>void} p.onClose  Saxlanmamış dəyişiklik varsa əvvəlcə xəbərdarlıq çıxır
 * @param {string} p.slug  @param {string} [p.templateName]  Başlıqda: «/slug · Royal Gold»
 * @param {ContentValues} p.values  @param {ContentValues} p.savedValues  @param {ContentValues} p.defaults
 * @param {ContentSchema} p.schema
 * @param {(next:ContentValues, path:(string|number)[])=>void} p.onChange
 * @param {()=>void|Promise<void>} p.onSave  @param {'idle'|'saving'|'saved'|'error'} [p.saveState]  @param {string} [p.saveError]
 * @param {()=>void} p.onResetAll  «Hamısını sıfırla» (təsdiqdən sonra)
 * @param {import('react').ReactNode} p.previewSlot  Canlı önbaxış (iframe) — siz verirsiniz
 * @param {boolean} [p.previewLoading]  Önbaxış yenilənir
 * @param {'phone'|'desktop'} [p.device]  @param {(d:'phone'|'desktop')=>void} [p.onDevice]
 * @param {string} [p.tab]  @param {(t:string)=>void} [p.onTab]
 * @param {'az'|'en'|'ru'} [p.lang]  @param {(l:string)=>void} [p.onLang]
 * @param {(file:File)=>void} [p.onUploadEmblem]  Açılış nişanı şəkli  @param {number|null} [p.emblemProgress]  0–100
 * @param {(chapterId:string, files:File[])=>void} [p.onUploadStoryImages]  @param {string|null} [p.storyUploadingId]
 * @param {{opening?:import('react').ReactNode,story?:import('react').ReactNode}} [p.customTabs]  Digitoy: tab məzmununu əvəz edir
 * @param {Partial<Record<string,number>>} [p.extraDirty]  Digitoy: customTabs-dakı saxlanmamış dəyişikliklər
 * @param {(sectionId:string)=>void} [p.onFocusSection]  Digitoy: önbaxışı bölməyə sürüşdür
 */
export default function ContentManager({
  open,
  onClose,
  slug,
  templateName,
  values,
  savedValues,
  defaults,
  schema,
  onChange,
  onSave,
  saveState = 'idle',
  saveError = 'Saxlamaq alınmadı. Yenidən cəhd edin.',
  onResetAll,
  previewSlot,
  previewLoading = false,
  device: deviceProp,
  onDevice,
  tab: tabProp,
  onTab,
  lang: langProp,
  onLang,
  onUploadEmblem,
  emblemProgress = null,
  onUploadStoryImages,
  storyUploadingId = null,
  customTabs = {},
  extraDirty = {},
  onFocusSection,
}) {
  const [tabInner, setTabInner] = useState('texts');
  const [langInner, setLangInner] = useState('az');
  const [deviceInner, setDeviceInner] = useState('phone');
  const [mode, setMode] = useState('edit');
  const [confirm, setConfirm] = useState(null); // 'close' | 'reset' | { chapter }
  const [toast, setToast] = useState(false);
  const scroller = useRef(null);
  const tab = tabProp ?? tabInner;
  const lang = langProp ?? langInner;
  const device = deviceProp ?? deviceInner;
  const setTab = (t) => {
    setTabInner(t);
    onTab?.(t);
    scroller.current?.scrollTo({ top: 0 });
  };
  const setLang = (l) => {
    setLangInner(l);
    onLang?.(l);
  };
  const setDevice = (d) => {
    setDeviceInner(d);
    onDevice?.(d);
  };

  const prevSave = useRef(saveState);
  useEffect(() => {
    if (prevSave.current === 'saving' && saveState === 'saved') setToast(true);
    prevSave.current = saveState;
  }, [saveState]);

  const extraTotal = Object.values(extraDirty).reduce((n, v) => n + (v || 0), 0);
  const dirty = diffCount(values, savedValues) + extraTotal;
  const tabDirty = (id) => diffCount(values?.[id], savedValues?.[id]) + (extraDirty[id] || 0);
  const changed = (path) => !same(get(values, path), get(savedValues, path));
  const set = (path, v) => onChange?.(setIn(values, path, v), path);
  const requestClose = () => (dirty > 0 ? setConfirm('close') : onClose?.());
  const activeTab = CONTENT_TABS.find((t) => t.id === tab) ?? CONTENT_TABS[0];

  const ctx = { values, defaults, schema, lang, set, changed, onFocusSection };

  return (
    <>
      <Modal
        open={open}
        onClose={requestClose}
        size="full"
        bodyPadding={false}
        footerLayout="bar"
        title="Dəvətnamə məzmunu"
        description={
          <span className="font-mono text-[13px]">
            /{slug}
            {templateName && <span className="font-sans"> · {templateName}</span>}
          </span>
        }
        headerExtra={
          <div className="border-b border-[#EEE8DF] px-5 py-2 lg:hidden">
            <SegmentedControl
              block
              label="Görünüş"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'edit', label: 'Redaktə', icon: PencilLine },
                { value: 'preview', label: 'Önbaxış', icon: Eye },
              ]}
            />
          </div>
        }
        footer={
          <>
            <Button
              variant="ghost"
              destructive
              icon={RotateCcw}
              onClick={() => setConfirm('reset')}
              disabled={saveState === 'saving'}
            >
              <span className="max-sm:hidden">Hamısını sıfırla</span>
              <span className="sm:hidden">Sıfırla</span>
            </Button>
            <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
              <div className="min-w-0 max-md:hidden">
                {saveState === 'error' ? (
                  <OpStatus state="error" text={saveError} />
                ) : saveState === 'saved' && dirty === 0 ? (
                  <OpStatus state="done" text="Saxlanıldı" />
                ) : dirty > 0 ? (
                  <p className="flex items-center gap-2 text-[13.5px] text-[#6E5114]" aria-live="polite">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#B8903A]" />
                    {dirty} dəyişiklik saxlanmayıb
                  </p>
                ) : (
                  <p className="text-[13.5px] text-[#6B5E54]">Bütün dəyişikliklər saxlanılıb</p>
                )}
              </div>
              <Button
                variant="primary"
                icon={Check}
                loading={saveState === 'saving'}
                disabled={dirty === 0}
                onClick={onSave}
              >
                {saveState === 'saving' ? 'Saxlanılır…' : dirty > 0 ? `Saxla (${dirty})` : 'Saxla'}
              </Button>
            </div>
          </>
        }
      >
        <div className="flex min-h-0 flex-1">
          {/* ── Redaktor ── */}
          <section
            aria-label="Redaktor"
            className={cx('min-h-0 min-w-0 flex-1 flex-col', mode === 'preview' ? 'hidden lg:flex' : 'flex')}
          >
            <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="sticky top-0 z-20 border-b border-[#EEE8DF] bg-white/95 px-5 backdrop-blur sm:px-6">
                <Tabs
                  label="Məzmun bölmələri"
                  idPrefix="cm"
                  value={tab}
                  onChange={setTab}
                  className="border-b-0"
                  tabs={CONTENT_TABS.map((t) => {
                    const n = tabDirty(t.id);
                    return {
                      ...t,
                      label: (
                        <>
                          {t.label}
                          {n > 0 && (
                            <span
                              className="h-2 w-2 rounded-full bg-[#B8903A]"
                              aria-label={`${n} saxlanmamış dəyişiklik`}
                              role="img"
                            />
                          )}
                        </>
                      ),
                    };
                  })}
                />
                {activeTab.localized && (
                  <div className="flex flex-wrap items-center gap-3 pb-3">
                    <SegmentedControl
                      size="sm"
                      label="Məzmun dili"
                      value={lang}
                      onChange={setLang}
                      options={['az', 'en', 'ru'].map((l) => ({
                        value: l,
                        label: LANGS[l].short,
                        hint: LANGS[l].label,
                      }))}
                    />
                    <span className="text-[13px] text-[#6B5E54]">
                      Redaktə dili: <span lang={LANGS[lang].lang}>{LANGS[lang].label}</span>
                    </span>
                  </div>
                )}
              </div>
              <div
                role="tabpanel"
                id={`cm-panel-${tab}`}
                aria-labelledby={`cm-tab-${tab}`}
                className="space-y-4 px-5 py-5 sm:px-6"
              >
                {tab === 'texts' && <TextsTab {...ctx} />}
                {tab === 'opening' && customTabs.opening}
                {tab === 'opening' && !customTabs.opening && (
                  <OpeningTab {...ctx} onUploadEmblem={onUploadEmblem} emblemProgress={emblemProgress} />
                )}
                {tab === 'story' && customTabs.story}
                {tab === 'story' && !customTabs.story && (
                  <StoryTab
                    {...ctx}
                    onUploadStoryImages={onUploadStoryImages}
                    storyUploadingId={storyUploadingId}
                    onDeleteChapter={(ch, i) => setConfirm({ chapter: ch, index: i })}
                  />
                )}
                {tab === 'colors' && <ColorsTab {...ctx} />}
                {tab === 'typography' && <TypographyTab {...ctx} />}
                {tab === 'sections' && <SectionsTab {...ctx} />}
              </div>
            </div>
          </section>

          {/* ── Canlı önbaxış ── */}
          <PreviewPane
            device={device}
            onDevice={setDevice}
            loading={previewLoading}
            hidden={mode !== 'preview'}
          >
            {previewSlot}
          </PreviewPane>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirm === 'close'}
        title="Saxlanmamış dəyişikliklər var"
        description={`${dirty} dəyişiklik saxlanmayıb. Bağlasanız, onlar itəcək.`}
        confirmLabel="Saxlamadan bağla"
        cancelLabel="Redaktəyə qayıt"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          onClose?.();
        }}
      />
      <ConfirmDialog
        open={confirm === 'reset'}
        title="Hamısını sıfırlamaq?"
        description="Bütün mətnlər, açılış və hekayə düzəlişləri, rənglər və şriftlər şablonun öz dəyərlərinə qayıdacaq (bölmə görünürlüyü dəyişmir). «Saxla» basmayana qədər dəvətnamə dəyişmir."
        confirmLabel="Hamısını sıfırla"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          onResetAll?.();
        }}
      />
      <ConfirmDialog
        open={Boolean(confirm?.chapter)}
        title="Fəsli silmək?"
        description={
          confirm?.chapter &&
          `«${confirm.chapter.title?.az || `${confirm.index + 1}-ci fəsil`}» bütün dillərdə və şəkilləri ilə silinəcək.`
        }
        confirmLabel="Fəsli sil"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          const list = values.story?.chapters ?? [];
          set(
            ['story', 'chapters'],
            list.filter((c) => c.id !== confirm.chapter.id),
          );
          setConfirm(null);
        }}
      />
      <Toast
        open={toast}
        message="Dəyişikliklər saxlanıldı."
        onClose={() => setToast(false)}
        aboveNav={false}
      />
    </>
  );
}

// ── Önbaxış paneli ───────────────────────────────────────────────
function PreviewPane({ device, onDevice, loading, hidden, children }) {
  const box = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const DESK = 1280;
  const scale = size.w ? Math.min(1, size.w / DESK) : 0.3;
  return (
    <aside
      aria-label="Canlı önbaxış"
      className={cx(
        'min-h-0 w-full shrink-0 flex-col border-[#EEE8DF] bg-[#F3EEE6] lg:w-[440px] lg:border-l xl:w-[480px]',
        hidden ? 'hidden lg:flex' : 'flex',
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#E5DED2] px-4 py-2">
        <p lang="az" className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[#5C4A3A]">
          Canlı önbaxış
        </p>
        <SegmentedControl
          size="sm"
          label="Önbaxış ekranı"
          value={device}
          onChange={onDevice}
          options={[
            {
              value: 'phone',
              label: <span className="sr-only">Telefon</span>,
              icon: Smartphone,
              hint: 'Telefon',
            },
            {
              value: 'desktop',
              label: <span className="sr-only">Desktop</span>,
              icon: Monitor,
              hint: 'Desktop',
            },
          ]}
        />
      </div>
      <div ref={box} className="relative min-h-0 flex-1 overflow-hidden p-4">
        {device === 'phone' ? (
          <div className="mx-auto h-full max-h-[780px] w-full max-w-[380px] overflow-hidden rounded-[30px] bg-black shadow-[0_20px_50px_-24px_rgba(28,22,20,0.6)] ring-[6px] ring-espresso">
            {children}
          </div>
        ) : (
          <div
            className="overflow-hidden rounded-[8px] bg-white shadow-[0_12px_32px_-18px_rgba(28,22,20,0.5)] ring-1 ring-[#D6CCBC]"
            style={{ width: DESK * scale, height: Math.max(200, size.h - 32) }}
          >
            <div
              style={{
                width: DESK,
                height: Math.max(200, size.h - 32) / scale,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              {children}
            </div>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F3EEE6]/70" role="status">
            <span className="flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13.5px] font-medium text-espresso shadow">
              <Spinner /> Önbaxış yenilənir…
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}

// ── Ortaq sahə ───────────────────────────────────────────────────
function TextField({
  label,
  value,
  placeholder,
  onChange,
  changed,
  multiline,
  short,
  hidden,
  onToggleHidden,
  lang,
}) {
  const fid = useId();
  const hasValue = Boolean(value);
  const C = multiline ? Textarea : Input;
  return (
    <div className={cx('rounded-[8px]', changed && '-mx-2 bg-[#FDF8EC] px-2 py-1.5')}>
      <div className="mb-1.5 flex min-h-[28px] items-center gap-2">
        <label htmlFor={fid} className="text-[13px] font-semibold text-[#3F342E]">
          {label}
        </label>
        {changed && <ChangedBadge />}
        {hidden && (
          <span className="rounded-full bg-[#EFEBE5] px-2 py-0.5 text-[12px] font-medium text-[#51483F]">
            Gizlədilib
          </span>
        )}
        <span className="ml-auto flex">
          {hasValue && (
            <ResetFieldButton onClick={() => onChange('')} label="Şablon mətninə qaytar" field={label} />
          )}
          {onToggleHidden && (
            <IconButton
              size="sm"
              icon={hidden ? EyeOff : Eye}
              label={hidden ? `Göstər: ${label}` : `Gizlət: ${label}`}
              aria-pressed={hidden}
              onClick={onToggleHidden}
              tooltipAlign="end"
            />
          )}
        </span>
      </div>
      <C
        id={fid}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={hidden}
        lang={lang}
        rows={multiline ? 3 : undefined}
        className={short ? 'sm:max-w-[260px]' : ''}
      />
    </div>
  );
}

const placeholderFor = (defaults, group, lang, key) =>
  get(defaults, [group, lang, key]) || get(defaults, [group, 'az', key]) || '';

// ── 1. Mətnlər ───────────────────────────────────────────────────
function TextsTab({ values, defaults, schema, lang, set, changed, onFocusSection }) {
  return (
    <>
      <Notice tone="info">
        Bölmə başlıqlarını dəyişə bilərsiniz. Boş buraxılan sahə şablonun öz mətnini saxlayır — heç nə itmir.
      </Notice>
      {schema.textSections.map((sec) => {
        const n = sec.fields.filter((f) => changed(['texts', lang, f.key])).length;
        return (
          <section
            key={sec.id}
            aria-labelledby={`ts-${sec.id}`}
            className="rounded-[12px] ring-1 ring-inset ring-[#E5DED2]"
            onFocusCapture={() => onFocusSection?.(sec.id)}
          >
            <header className="flex items-start justify-between gap-3 rounded-t-[12px] bg-[#FAF8F4] px-4 py-3">
              <div>
                <h3 id={`ts-${sec.id}`} className="text-[15px] font-semibold text-espresso">
                  {sec.title}
                </h3>
                {sec.hint && <p className="mt-0.5 text-[13px] leading-snug text-[#6B5E54]">{sec.hint}</p>}
              </div>
              {n > 0 && <ChangedBadge label={`${n} dəyişib`} className="shrink-0" />}
            </header>
            <div className="grid gap-4 px-4 py-4 sm:grid-cols-2">
              {sec.fields.map((f) => (
                <div key={f.key} className={f.short ? '' : 'sm:col-span-2'}>
                  <TextField
                    label={f.localized ? `${f.label} (${LANGS[lang].short})` : f.label}
                    value={get(values, ['texts', lang, f.key])}
                    placeholder={placeholderFor(defaults, 'texts', lang, f.key)}
                    onChange={(v) => set(['texts', lang, f.key], v)}
                    changed={changed(['texts', lang, f.key])}
                    multiline={f.multiline}
                    lang={LANGS[lang].lang}
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

// ── 2. Açılış ────────────────────────────────────────────────────
function OpeningTab({ values, defaults, schema, lang, set, changed, onUploadEmblem, emblemProgress }) {
  const o = values.opening ?? {};
  const mode = o.emblem ?? 'auto';
  const stickers = schema.stickers ?? ['💍', '🕊️', '🌸', '✨', '❤️', '🥂', '🌿', '👑'];
  return (
    <>
      <Notice tone="info">Dəvətnamə açılmazdan əvvəl qonağın gördüyü ekran: mərkəzi nişan və yazılar.</Notice>
      <section aria-labelledby="op-emblem" className="rounded-[12px] p-4 ring-1 ring-inset ring-[#E5DED2]">
        <div className="mb-3 flex items-center gap-2">
          <h3 id="op-emblem" className="text-[15px] font-semibold text-espresso">
            Mərkəzi nişan
          </h3>
          {changed(['opening', 'emblem']) && <ChangedBadge />}
        </div>
        <div role="radiogroup" aria-labelledby="op-emblem" className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {EMBLEM_MODES.map((m) => {
            const on = m.value === mode;
            const Icon = m.icon;
            return (
              <button
                key={m.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => set(['opening', 'emblem'], m.value)}
                className={cx(
                  'flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-[8px] px-2 py-2.5 text-center ring-1 ring-inset transition-colors',
                  on
                    ? 'bg-gold-mist/70 text-espresso ring-2 ring-[#A9822F]'
                    : 'bg-white text-[#3F342E] ring-[#E5DED2] hover:bg-[#FAF8F4]',
                  FOCUS,
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-[13.5px] font-medium">{m.label}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[12.5px] text-[#6B5E54]">
          {EMBLEM_MODES.find((m) => m.value === mode)?.hint}
        </p>

        {mode === 'text' && (
          <div className="mt-4 max-w-[260px]">
            <TextField
              label="Nişan mətni"
              value={o.emblemText}
              placeholder="A & N"
              onChange={(v) => set(['opening', 'emblemText'], v)}
              changed={changed(['opening', 'emblemText'])}
            />
          </div>
        )}
        {mode === 'sticker' && (
          <div className="mt-4">
            <p id="op-stk" className="mb-2 text-[13px] font-semibold text-[#3F342E]">
              Stiker
            </p>
            <div role="radiogroup" aria-labelledby="op-stk" className="flex flex-wrap gap-2">
              {stickers.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={o.emblemSticker === s}
                  aria-label={`Stiker ${s}`}
                  onClick={() => set(['opening', 'emblemSticker'], s)}
                  className={cx(
                    'flex h-12 w-12 items-center justify-center rounded-[8px] text-[24px] ring-1 ring-inset',
                    o.emblemSticker === s
                      ? 'bg-gold-mist ring-2 ring-[#A9822F]'
                      : 'bg-white ring-[#E5DED2] hover:bg-[#FAF8F4]',
                    FOCUS,
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {mode === 'image' && (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#F3EEE6] ring-1 ring-inset ring-[#E5DED2]">
              {o.emblemImage ? (
                <img src={o.emblemImage} alt="Nişan şəkli" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-6 w-6 text-[#8A7D72]" aria-hidden="true" />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <FilePickButton
                accept="image/*"
                onFiles={(f) => onUploadEmblem?.(f[0])}
                disabled={emblemProgress != null}
              >
                {emblemProgress != null
                  ? `Yüklənir… ${Math.round(emblemProgress)}%`
                  : o.emblemImage
                    ? 'Başqa şəkil'
                    : 'Şəkil yüklə'}
              </FilePickButton>
              {o.emblemImage && (
                <Button
                  variant="ghost"
                  destructive
                  icon={Trash2}
                  onClick={() => set(['opening', 'emblemImage'], null)}
                >
                  Sil
                </Button>
              )}
            </div>
          </div>
        )}
      </section>

      <section aria-labelledby="op-texts" className="rounded-[12px] ring-1 ring-inset ring-[#E5DED2]">
        <header className="rounded-t-[12px] bg-[#FAF8F4] px-4 py-3">
          <h3 id="op-texts" className="text-[15px] font-semibold text-espresso">
            Yazılar
          </h3>
          <p className="mt-0.5 text-[13px] text-[#6B5E54]">
            «Göz» düyməsi yazını açılış ekranında gizlədir (bütün dillərdə).
          </p>
        </header>
        <div className="space-y-4 px-4 py-4">
          {schema.openingFields.map((f) => {
            const hidden = Boolean(o.hidden?.[f.key]);
            return (
              <TextField
                key={f.key}
                label={`${f.label} (${LANGS[lang].short})`}
                value={get(values, ['opening', 'texts', lang, f.key])}
                placeholder={
                  get(defaults, ['opening', 'texts', lang, f.key]) ||
                  get(defaults, ['opening', 'texts', 'az', f.key]) ||
                  ''
                }
                onChange={(v) => set(['opening', 'texts', lang, f.key], v)}
                changed={changed(['opening', 'texts', lang, f.key]) || changed(['opening', 'hidden', f.key])}
                hidden={hidden}
                onToggleHidden={() => set(['opening', 'hidden', f.key], !hidden)}
                lang={LANGS[lang].lang}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}

// ── 3. Love Story ────────────────────────────────────────────────
function StoryTab({
  values,
  schema,
  lang,
  set,
  changed,
  onUploadStoryImages,
  storyUploadingId,
  onDeleteChapter,
}) {
  const chapters = values.story?.chapters ?? [];
  const open = values.sections?.story !== false;
  const stickers = schema.stickers ?? ['💍', '🕊️', '🌸', '✨', '❤️', '🥂'];
  const move = (i, d) => {
    const next = [...chapters];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    set(['story', 'chapters'], next);
  };
  const add = () =>
    set(
      ['story', 'chapters'],
      [
        ...chapters,
        { id: `ch-${Date.now().toString(36)}`, date: '', sticker: '', images: [], title: {}, text: {} },
      ],
    );
  return (
    <>
      {!open && (
        <Notice
          tone="warning"
          icon={Lock}
          title="Bu bölmə dəvətnamədə bağlıdır"
          action={
            <Button size="sm" variant="primary" onClick={() => set(['sections', 'story'], true)}>
              Bölməni aç
            </Button>
          }
        >
          Fəsilləri hazırlaya bilərsiniz, amma bölmə açılana qədər qonaqlar görməyəcək.
        </Notice>
      )}
      {chapters.length === 0 && (
        <p className="rounded-[12px] bg-[#FAF8F4] px-4 py-6 text-center text-[14px] text-[#6B5E54]">
          Hələ fəsil yoxdur — ilk fəsli əlavə edin.
        </p>
      )}
      <ol className="space-y-4">
        {chapters.map((ch, i) => {
          const base = ['story', 'chapters', i];
          return (
            <li key={ch.id} className="rounded-[12px] ring-1 ring-inset ring-[#E5DED2]">
              <header className="flex items-center gap-2 rounded-t-[12px] bg-[#FAF8F4] py-2 pl-4 pr-2">
                <span className="text-[24px]" aria-hidden="true">
                  {ch.sticker || '·'}
                </span>
                <h3 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-espresso">
                  {i + 1}-ci fəsil{ch.title?.[lang] ? ` — ${ch.title[lang]}` : ''}
                </h3>
                {changed(base) && <ChangedBadge />}
                <IconButton
                  size="sm"
                  icon={ArrowUp}
                  label="Yuxarı apar"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                />
                <IconButton
                  size="sm"
                  icon={ArrowDown}
                  label="Aşağı apar"
                  disabled={i === chapters.length - 1}
                  onClick={() => move(i, 1)}
                />
              </header>
              <div className="grid gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_200px]">
                <TextField
                  label={`Başlıq (${LANGS[lang].short})`}
                  value={ch.title?.[lang]}
                  placeholder={ch.title?.az || 'Məs. İlk görüş'}
                  onChange={(v) => set([...base, 'title', lang], v)}
                  changed={changed([...base, 'title', lang])}
                  lang={LANGS[lang].lang}
                />
                <TextField
                  label="Tarix"
                  value={ch.date}
                  placeholder="Məs. Mart 2021"
                  onChange={(v) => set([...base, 'date'], v)}
                  changed={changed([...base, 'date'])}
                />
                <div className="sm:col-span-2">
                  <TextField
                    label={`Mətn (${LANGS[lang].short})`}
                    value={ch.text?.[lang]}
                    placeholder={ch.text?.az || 'Bu fəslin hekayəsi…'}
                    onChange={(v) => set([...base, 'text', lang], v)}
                    changed={changed([...base, 'text', lang])}
                    multiline
                    lang={LANGS[lang].lang}
                  />
                </div>
                <div className="sm:col-span-2">
                  <p className="mb-2 text-[13px] font-semibold text-[#3F342E]">Şəkillər</p>
                  <ul className="flex flex-wrap gap-2">
                    {(ch.images ?? []).map((src, k) => (
                      <li key={src + k} className="relative">
                        <img
                          src={src}
                          alt={`${i + 1}-ci fəsil, ${k + 1}-ci şəkil`}
                          className="h-20 w-20 rounded-[8px] object-cover ring-1 ring-black/10"
                        />
                        <button
                          type="button"
                          aria-label={`${k + 1}-ci şəkli sil`}
                          onClick={() =>
                            set(
                              [...base, 'images'],
                              ch.images.filter((_, j) => j !== k),
                            )
                          }
                          className={cx(
                            "absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-espresso text-cream shadow ring-2 ring-white before:absolute before:-inset-1.5 before:content-['']",
                            FOCUS,
                          )}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                    <li>
                      {storyUploadingId === ch.id ? (
                        <span
                          className="flex h-20 w-20 items-center justify-center rounded-[8px] bg-[#FAF8F4] ring-1 ring-inset ring-[#E5DED2]"
                          role="status"
                        >
                          <Spinner label="Şəkil yüklənir" className="h-5 w-5 text-[#6B5E54]" />
                        </span>
                      ) : (
                        <FilePickButton
                          accept="image/*"
                          multiple
                          tile
                          onFiles={(files) => onUploadStoryImages?.(ch.id, files)}
                          label={`${i + 1}-ci fəslə şəkil əlavə et`}
                        />
                      )}
                    </li>
                  </ul>
                </div>
                <div className="sm:col-span-2">
                  <p id={`stk-${ch.id}`} className="mb-2 text-[13px] font-semibold text-[#3F342E]">
                    Stiker
                  </p>
                  <div role="radiogroup" aria-labelledby={`stk-${ch.id}`} className="flex flex-wrap gap-1.5">
                    {['', ...stickers].map((s) => (
                      <button
                        key={s || 'none'}
                        type="button"
                        role="radio"
                        aria-checked={(ch.sticker || '') === s}
                        aria-label={s ? `Stiker ${s}` : 'Stikersiz'}
                        onClick={() => set([...base, 'sticker'], s)}
                        className={cx(
                          'flex h-11 w-11 items-center justify-center rounded-[8px] text-[20px] ring-1 ring-inset',
                          (ch.sticker || '') === s
                            ? 'bg-gold-mist ring-2 ring-[#A9822F]'
                            : 'bg-white ring-[#E5DED2] hover:bg-[#FAF8F4]',
                          FOCUS,
                        )}
                      >
                        {s || <Ban className="h-4 w-4 text-[#8A7D72]" aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end sm:col-span-2">
                  <Button
                    variant="ghost"
                    destructive
                    icon={Trash2}
                    size="sm"
                    onClick={() => onDeleteChapter(ch, i)}
                  >
                    Fəsli sil
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        onClick={add}
        className={cx(
          'flex h-14 w-full items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#D6CCBC] text-[14.5px] font-medium text-[#3F342E] hover:border-[#A9822F] hover:bg-[#FAF8F4]',
          FOCUS,
        )}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Fəsil əlavə et
      </button>
    </>
  );
}

// ── 4. Rənglər ───────────────────────────────────────────────────
function ColorsTab({ values, defaults, schema, set, changed }) {
  if (schema.lockedNote) return <Notice tone="warning">{schema.lockedNote}</Notice>;
  return (
    <>
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 flex-1 overflow-hidden rounded-[8px] ring-1 ring-inset ring-black/10"
          aria-hidden="true"
        >
          {schema.colorTokens.map((t) => (
            <span key={t.key} className="flex-1" style={{ background: values.colors?.[t.key] }} />
          ))}
        </div>
      </div>
      <p className="text-[13.5px] text-[#6B5E54]">
        Rəng seçicisinə toxunun və ya hex kodu yazın. ↺ rəngi şablonun öz rənginə qaytarır.
      </p>
      <div className="grid gap-2.5 xl:grid-cols-2">
        {schema.colorTokens.map((t) => (
          <ColorField
            key={t.key}
            label={t.label}
            hint={t.hint}
            value={values.colors?.[t.key]}
            defaultValue={defaults.colors?.[t.key]}
            changed={changed(['colors', t.key])}
            onChange={(v) => set(['colors', t.key], v)}
          />
        ))}
      </div>
    </>
  );
}

// ── 5. Tipoqrafiya ───────────────────────────────────────────────
function FontChoice({ title, options, value, onChange, sample, sampleClass, changedFlag, defaultValue }) {
  const id = `font-${title}`.replace(/\W+/g, '-');
  return (
    <section aria-labelledby={id}>
      <div className="mb-2 flex items-center gap-2">
        <h3 id={id} className="text-[15px] font-semibold text-espresso">
          {title}
        </h3>
        {changedFlag && <ChangedBadge />}
        {defaultValue && value !== defaultValue && (
          <span className="ml-auto">
            <ResetFieldButton
              onClick={() => onChange(defaultValue)}
              label="Şablon şriftinə qaytar"
              field={title}
            />
          </span>
        )}
      </div>
      <div role="radiogroup" aria-labelledby={id} className="grid gap-2 sm:grid-cols-2">
        {options.map((f) => {
          const on = f.value === value;
          return (
            <button
              key={f.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(f.value)}
              className={cx(
                'relative flex min-h-[84px] flex-col justify-center rounded-[8px] px-4 py-3 text-left ring-1 ring-inset transition-colors',
                on ? 'bg-gold-mist/50 ring-2 ring-[#A9822F]' : 'bg-white ring-[#E5DED2] hover:bg-[#FAF8F4]',
                FOCUS,
              )}
            >
              <span
                className={cx('block truncate text-espresso', sampleClass)}
                style={{ fontFamily: f.family }}
              >
                {sample}
              </span>
              <span className="mt-1 block text-[12.5px] text-[#6B5E54]">
                {f.label}
                {f.value === defaultValue && ' · şablonun şrifti'}
              </span>
              {on && <Check className="absolute right-3 top-3 h-4 w-4 text-gold-deep" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TypographyTab({ values, defaults, schema, set, changed }) {
  const t = values.typography ?? {};
  const sc = schema.scale ?? { min: 90, max: 115, step: 5 };
  if (schema.lockedNote) return <Notice tone="warning">{schema.lockedNote}</Notice>;
  return (
    <div className="space-y-6">
      <FontChoice
        title="Başlıq şrifti"
        options={schema.fonts.heading}
        value={t.heading}
        defaultValue={defaults.typography?.heading}
        onChange={(v) => set(['typography', 'heading'], v)}
        changedFlag={changed(['typography', 'heading'])}
        sample="Aysel & Nicat"
        sampleClass="text-[26px] leading-tight"
      />
      <FontChoice
        title="Mətn şrifti"
        options={schema.fonts.body}
        value={t.body}
        defaultValue={defaults.typography?.body}
        onChange={(v) => set(['typography', 'body'], v)}
        changedFlag={changed(['typography', 'body'])}
        sample="Bu özəl günü bizimlə paylaşın"
        sampleClass="text-[15px]"
      />
      {schema.scaleFields ? (
        schema.scaleFields.map((f) => (
          <div
            key={f.key}
            className={cx(
              'rounded-[12px] p-4 ring-1 ring-inset ring-[#E5DED2]',
              changed(['typography', f.key]) && 'bg-[#FDF8EC]',
            )}
          >
            <RangeField
              label={
                <span className="inline-flex items-center gap-2">
                  {f.label} {changed(['typography', f.key]) && <ChangedBadge />}
                </span>
              }
              value={t[f.key] ?? 100}
              min={sc.min}
              max={sc.max}
              step={sc.step}
              format={(v) => `${v}%`}
              ends={['Kiçik', 'Böyük']}
              onChange={(v) => set(['typography', f.key], v)}
              hint={f.hint}
            />
          </div>
        ))
      ) : (
      <div
        className={cx(
          'rounded-[12px] p-4 ring-1 ring-inset ring-[#E5DED2]',
          changed(['typography', 'scale']) && 'bg-[#FDF8EC]',
        )}
      >
        <RangeField
          label={
            <span className="inline-flex items-center gap-2">
              Şrift ölçüsü {changed(['typography', 'scale']) && <ChangedBadge />}
            </span>
          }
          value={t.scale ?? 100}
          min={sc.min}
          max={sc.max}
          step={sc.step}
          format={(v) => `${v}%`}
          ends={['Kiçik', 'Böyük']}
          onChange={(v) => set(['typography', 'scale'], v)}
          hint="Bütün dəvətnamədə mətnləri birlikdə böyüdür və ya kiçildir."
        />
      </div>
      )}
    </div>
  );
}

// ── 6. Bölmələr ──────────────────────────────────────────────────
function SectionsTab({ values, schema, set, changed }) {
  const on = schema.sections.filter((s) => values.sections?.[s.id] !== false).length;
  return (
    <>
      <p className="text-[14px] text-[#5C4A3A]">
        {on} / {schema.sections.length} bölmə açıqdır. Bağlı bölmə dəvətnamədə görünmür, məzmunu isə silinmir.
      </p>
      <ul className="divide-y divide-[#EEE8DF] rounded-[12px] px-4 ring-1 ring-inset ring-[#E5DED2]">
        {schema.sections.map((s) => (
          <li key={s.id} className="py-3">
            <Switch
              checked={values.sections?.[s.id] !== false}
              onChange={(v) => set(['sections', s.id], v)}
              disabled={s.locked}
              label={s.label}
              description={s.hint}
              badge={
                s.locked ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EFEBE5] px-2 py-0.5 text-[12px] font-medium text-[#51483F]">
                    <Lock className="h-3 w-3" aria-hidden="true" /> Həmişə açıq
                  </span>
                ) : changed(['sections', s.id]) ? (
                  <ChangedBadge />
                ) : null
              }
            />
          </li>
        ))}
      </ul>
    </>
  );
}

// ── Fayl seçimi düyməsi ──────────────────────────────────────────
function FilePickButton({ accept, multiple = false, onFiles, disabled, children, tile = false, label }) {
  const ref = useRef(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const files = [...(e.target.files ?? [])];
          if (files.length) onFiles?.(files);
          e.target.value = '';
        }}
      />
      {tile ? (
        <button
          type="button"
          aria-label={label}
          onClick={() => ref.current?.click()}
          className={cx(
            'flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-[8px] border-2 border-dashed border-[#D6CCBC] text-[12px] font-medium text-[#5C4A3A] hover:border-[#A9822F]',
            FOCUS,
          )}
        >
          <ImagePlus className="h-5 w-5" aria-hidden="true" />
          Əlavə et
        </button>
      ) : (
        <Button icon={ImagePlus} onClick={() => ref.current?.click()} disabled={disabled}>
          {children}
        </Button>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// TranslationDialog — «Məzmun tərcüməsi» (YALNIZ görünüş)
//
// Desktopda AZ orijinal (solda) və tərcümə (sağda) yan-yanadır; mobildə alt-alta.
// Neçə sahənin boş qaldığı göstərilir, «Yalnız boşlar» filtri var. «Lüğətlə doldur»
// və saxlama məntiqi SİZDƏDİR (onAutofill, onSave).
// ════════════════════════════════════════════════════════════════
import { useState } from 'react';
import { CircleCheck, Languages, WandSparkles } from 'lucide-react';
import {
  Button,
  ConfirmDialog,
  LANGS,
  Modal,
  Notice,
  OpStatus,
  SegmentedControl,
  Tabs,
  Textarea,
  cx,
} from './adminUi';

/**
 * @typedef {{key:string,label?:string,source:string,time?:string,multiline?:boolean}} TrField
 *          label — sahənin adı (məs. «Gəlinin adı»); time — proqram sətri üçün saat
 * @typedef {{id:string,title?:string,fields:TrField[]}} TrGroup
 */

/**
 * @param {object} p
 * @param {boolean} p.open  @param {()=>void} p.onClose  @param {string} p.slug
 * @param {('en'|'ru')[]} [p.langs=['en','ru']]  @param {'en'|'ru'} [p.lang]  @param {(l:string)=>void} [p.onLang]
 * @param {TrGroup[]} p.groups  Sahələr (birinci qrupun başlığı olmaya bilər; «Tədbir proqramı» — saatlı)
 * @param {Record<string,Record<string,string>>} p.values  { en: { key: 'mətn' }, ru: {…} }
 * @param {Record<string,string[]>} [p.auto]  Lüğətdən doldurulub, hələ dəyişdirilməyib: { en: ['venueNote', …] }
 * @param {(lang:string, key:string, value:string)=>void} p.onChange
 * @param {(lang:string)=>void} [p.onAutofill]  «Lüğətlə doldur»  @param {boolean} [p.autofilling]
 * @param {()=>void|Promise<void>} p.onSave  @param {'idle'|'saving'|'saved'|'error'} [p.saveState]  @param {string} [p.saveError]
 * @param {number} [p.dirty]  Saxlanmamış dəyişiklik sayı — bağlayanda xəbərdarlıq üçün
 */
export default function TranslationDialog({
  open,
  onClose,
  slug,
  langs = ['en', 'ru'],
  lang: langProp,
  onLang,
  groups = [],
  values = {},
  auto = {},
  onChange,
  onAutofill,
  autofilling = false,
  onSave,
  saveState = 'idle',
  saveError = 'Saxlamaq alınmadı. Yenidən cəhd edin.',
  dirty = 0,
}) {
  const [langInner, setLangInner] = useState(langs[0]);
  const [filter, setFilter] = useState('all');
  const [confirmClose, setConfirmClose] = useState(false);
  const lang = langProp ?? langInner;
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setFilter('all');
  }

  const all = groups.flatMap((g) => g.fields);
  const emptyOf = (l) => all.filter((f) => !values?.[l]?.[f.key]?.trim()).length;
  const empty = emptyOf(lang);
  const autoSet = new Set(auto?.[lang] ?? []);
  const L = LANGS[lang];
  const requestClose = () => (dirty > 0 ? setConfirmClose(true) : onClose?.());

  return (
    <>
      <Modal
        open={open}
        onClose={requestClose}
        size="xl"
        title={
          <span className="inline-flex items-center gap-2">
            <Languages className="h-5 w-5 text-gold-deep" aria-hidden="true" />
            Məzmun tərcüməsi
          </span>
        }
        description={<span className="font-mono text-[13px]">{slug}</span>}
        footer={
          <>
            <Button onClick={requestClose} disabled={saveState === 'saving'}>
              Bağla
            </Button>
            <Button
              variant="primary"
              loading={saveState === 'saving'}
              onClick={onSave}
              disabled={dirty === 0 && saveState !== 'error'}
            >
              {saveState === 'saving' ? 'Saxlanılır…' : 'Saxla'}
            </Button>
          </>
        }
      >
        <div className="sticky -top-2 z-10 -mx-5 mb-4 border-b border-[#EEE8DF] bg-white px-5 pt-1 sm:-mx-6 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-x-3">
            <Tabs
              label="Tərcümə dili"
              value={lang}
              onChange={(l) => {
                setLangInner(l);
                onLang?.(l);
              }}
              className="border-b-0"
              tabs={langs.map((l) => {
                const n = emptyOf(l);
                return {
                  id: l,
                  label: (
                    <>
                      <span lang={LANGS[l].lang}>{LANGS[l].label}</span>
                      <span
                        className={cx('text-[12.5px] font-normal', n ? 'text-[#6E5114]' : 'text-[#3D5530]')}
                      >
                        {n ? `${n} boş` : 'tam'}
                      </span>
                    </>
                  ),
                };
              })}
            />
            {onAutofill && (
              <Button
                size="sm"
                icon={WandSparkles}
                loading={autofilling}
                onClick={() => onAutofill(lang)}
                className="mb-2"
              >
                Lüğətlə doldur
              </Button>
            )}
          </div>
        </div>

        <Notice tone="info" className="mb-4">
          «Avtomatik» nişanlı mətnlər daxili lüğətdən doldurulub — istədiyinizi dəyişə bilərsiniz,
          dəyişdiyiniz mətn bir daha avtomatik yenilənmir. Boş buraxılan sahə orijinal Azərbaycan mətnini
          göstərir.
        </Notice>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-[14px] text-[#3F342E]" aria-live="polite">
            {empty === 0 ? (
              <>
                <CircleCheck className="h-4 w-4 text-olive" aria-hidden="true" /> Bütün {all.length} sahə
                tərcümə olunub
              </>
            ) : (
              <>
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#B8903A]" />
                Boş sahə: <strong className="font-semibold tabular-nums">{empty}</strong> / {all.length}
              </>
            )}
          </p>
          <SegmentedControl
            size="sm"
            label="Sahələri süz"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'Hamısı' },
              { value: 'empty', label: `Yalnız boşlar (${empty})` },
            ]}
          />
        </div>

        {/* Sütun başlıqları (desktop) */}
        <div className="mb-2 hidden grid-cols-2 gap-5 text-[12.5px] font-semibold text-[#5C4A3A] md:grid">
          <span>Azərbaycanca (orijinal)</span>
          <span lang={L.lang}>{L.label}</span>
        </div>

        <div className="space-y-6">
          {groups.map((g) => {
            const fields = g.fields.filter((f) => filter === 'all' || !values?.[lang]?.[f.key]?.trim());
            if (!fields.length) return null;
            return (
              <section key={g.id} aria-label={g.title}>
                {g.title && (
                  <h3
                    lang="az"
                    className="mb-3 border-b border-[#EEE8DF] pb-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[#5C4A3A]"
                  >
                    {g.title}
                  </h3>
                )}
                <ul className="space-y-4">
                  {fields.map((f) => {
                    const v = values?.[lang]?.[f.key] ?? '';
                    const isAuto = autoSet.has(f.key);
                    const id = `tr-${lang}-${f.key}`;
                    return (
                      <li key={f.key} className="grid gap-2 md:grid-cols-2 md:gap-5">
                        <div className="min-w-0">
                          <p className="mb-1 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-[#3F342E]">
                            {f.time && (
                              <span className="font-mono text-[13px] font-medium text-gold-deep">
                                {f.time}
                              </span>
                            )}
                            <span id={`${id}-l`}>{f.label ?? f.source}</span>
                          </p>
                          {f.label && (
                            <p
                              lang="az"
                              className="rounded-[8px] bg-[#FAF8F4] px-3 py-2.5 text-[14px] italic leading-snug text-[#3F342E] md:min-h-11"
                            >
                              {f.source}
                            </p>
                          )}
                        </div>
                        <div className="min-w-0 md:pt-[26px]">
                          <div className="relative">
                            <Textarea
                              id={id}
                              rows={f.multiline ? 3 : 1}
                              aria-labelledby={`${id}-l`}
                              aria-describedby={isAuto ? `${id}-a` : undefined}
                              lang={L.lang}
                              value={v}
                              onChange={(e) => onChange?.(lang, f.key, e.target.value)}
                              placeholder={`${L.label} tərcüməsi…`}
                              className={cx('min-h-11 py-2.5', isAuto && 'pr-[104px]', !v && 'bg-[#FFFDF8]')}
                            />
                            {isAuto && (
                              <span
                                id={`${id}-a`}
                                className="pointer-events-none absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#FBF1DC] px-2 py-0.5 text-[12px] font-medium text-[#6E5114]"
                              >
                                <WandSparkles className="h-3 w-3" aria-hidden="true" />
                                Avtomatik
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
          {filter === 'empty' && empty === 0 && (
            <p className="rounded-[12px] bg-olive-mist px-4 py-6 text-center text-[14px] text-[#2E3F24]">
              Boş sahə qalmayıb.
            </p>
          )}
        </div>
        {(saveState === 'saved' || saveState === 'error') && (
          <OpStatus
            className="mt-4"
            state={saveState === 'saved' ? 'done' : 'error'}
            text={saveState === 'saved' ? 'Tərcümə saxlanıldı' : saveError}
          />
        )}
      </Modal>
      <ConfirmDialog
        open={confirmClose}
        title="Saxlanmamış tərcümələr var"
        description={`${dirty} dəyişiklik saxlanmayıb. Bağlasanız, onlar itəcək.`}
        confirmLabel="Saxlamadan bağla"
        cancelLabel="Geri qayıt"
        onCancel={() => setConfirmClose(false)}
        onConfirm={() => {
          setConfirmClose(false);
          onClose?.();
        }}
      />
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// PreviewBar — /demo/template/:id üzərində üzən önbaxış paneli (YALNIZ görünüş)
//
// Yerləşmə:
//   • Ekranın AŞAĞISINDA üzür → şablonun öz yapışqan başlığını (yuxarıda ~56px) örtmür.
//   • Tünd şüşə fon (blur + 74% espresso) → həm tünd, həm açıq şablonlarda oxunaqlıdır.
//   • Tam rejim: mobil — tam en (kənarlardan 12px), desktop — mərkəzdə maks. 720px.
//   • Compact rejim: SOL aşağı küncdə kiçik həb (ad + «Seç»); sağdan 88px boş saxlanılır,
//     ona görə sağ küncdəki musiqi dairəsi ilə toqquşmur. Ortadakı «toxunun» ipucu üçün
//     açılış ekranında compact rejimdə başlamaq tövsiyə olunur.
//
// SABİT ÖLÇÜLƏR (safe-area daxil DEYİL):
//   tam, < 640px  : hündürlük 64px  + alt boşluq 12px  → musiqi düymələrini 76px qaldırın
//   tam, ≥ 640px  : hündürlük 72px  + alt boşluq 12px  → 84px qaldırın
//   compact       : hündürlük 52px  + alt boşluq 12px  → qaldırmaq lazım deyil (sağda 88px boşdur);
//                   musiqi dairəsi sağ kənardan 88px-dən geniş yer tutursa, 64px qaldırın
//   Hamısına əlavə et: env(safe-area-inset-bottom)
//   Nümunə: bottom: calc(76px + 16px + env(safe-area-inset-bottom))
//   Hazır funksiya: getPreviewBarOffset({ compact, viewportWidth })
// ════════════════════════════════════════════════════════════════
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { FOCUS_DARK, StatusChip } from './shared';
import { PREVIEW_BAR } from './previewBarMetrics';

const GLASS =
  'bg-[rgba(28,23,21,0.74)] text-cream shadow-[0_18px_44px_-14px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-[rgba(232,213,163,0.24)] backdrop-blur-xl backdrop-saturate-150';

/**
 * @param {object} p
 * @param {string} p.templateName              «Royal Gold» (<span lang="en"> içində göstərilir)
 * @param {string} [p.nameLang='en']
 * @param {string} [p.statusLabel]             «Canlı»
 * @param {'positive'|'info'|'muted'} [p.statusTone='positive']
 * @param {boolean} [p.canChoose=true]         false → əsas düymə deaktiv, «Tezliklə»
 * @param {boolean} [p.compact=false]          Kiçik həb rejimi
 * @param {()=>void} p.onToggleCompact
 * @param {()=>void} p.onBack                  «← Şablonlar»
 * @param {()=>void} p.onChoose                «Bu dizaynla sifariş et»
 * @param {string} [p.kicker='Önbaxış']
 * @param {string} [p.backLabel='Şablonlar']
 * @param {string} [p.chooseLabel='Bu dizaynla sifariş et']  Desktop (≥ 640px)
 * @param {string} [p.chooseShortLabel='Sifariş et']         Mobil tam rejim
 * @param {string} [p.selectLabel='Seç']                      Compact rejim
 * @param {string} [p.soonLabel='Tezliklə']
 * @param {string} [p.collapseLabel='Paneli kiçilt']
 * @param {string} [p.expandLabel='Paneli aç']
 * @param {string} [p.regionLabel='Şablon önbaxışı']          Ekran oxuyucu üçün bölgə adı
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export default function PreviewBar({
  templateName,
  nameLang = 'en',
  statusLabel,
  statusTone = 'positive',
  canChoose = true,
  compact = false,
  onToggleCompact,
  onBack,
  onChoose,
  kicker = 'Önbaxış',
  backLabel = 'Şablonlar',
  chooseLabel = 'Bu dizaynla sifariş et',
  chooseShortLabel = 'Sifariş et',
  selectLabel = 'Seç',
  soonLabel = 'Tezliklə',
  collapseLabel = 'Paneli kiçilt',
  expandLabel = 'Paneli aç',
  regionLabel = 'Şablon önbaxışı',
  lang = 'az',
}) {
  const reduce = useReducedMotion();
  const anim = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 } }
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.98 },
        transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
      };

  const chooseBtnBase = `inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[0.12em] transition-[background-color,transform] duration-300 ease-luxe ${FOCUS_DARK}`;
  const chooseOn = 'bg-gold text-espresso hover:-translate-y-px hover:bg-[#CDA963] active:translate-y-0';
  const chooseOff = 'cursor-not-allowed bg-white/10 text-sand';

  return (
    <MotionConfig reducedMotion="user">
      <div
        lang={lang}
        role="region"
        aria-label={regionLabel}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] sm:px-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          {compact ? (
            <motion.div
              key="compact"
              {...anim}
              style={{ maxWidth: `calc(100% - ${PREVIEW_BAR.reserveRight - 12}px)` }}
              className={`pointer-events-auto mr-auto flex h-[52px] w-max items-center gap-1 rounded-full p-1 ${GLASS}`}
            >
              <button
                type="button"
                onClick={onToggleCompact}
                aria-expanded={false}
                aria-label={expandLabel}
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-gold-light transition-colors hover:bg-white/10 ${FOCUS_DARK}`}
              >
                <ChevronUp className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
              <span className="min-w-0 truncate px-1.5 font-serif text-[17px] leading-none">
                <span className="sr-only">{kicker}: </span>
                <span lang={nameLang}>{templateName}</span>
              </span>
              <button
                type="button"
                onClick={canChoose ? onChoose : undefined}
                disabled={!canChoose}
                className={`${chooseBtnBase} h-11 px-4 text-[11px] ${canChoose ? chooseOn : chooseOff}`}
              >
                {canChoose ? selectLabel : soonLabel}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="full"
              {...anim}
              className={`pointer-events-auto mx-auto flex h-16 w-full max-w-[720px] items-center gap-2 rounded-[22px] p-2.5 sm:h-[72px] sm:gap-3 sm:rounded-[26px] sm:px-3 ${GLASS}`}
            >
              <button
                type="button"
                onClick={onBack}
                aria-label={backLabel}
                className={`inline-flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-full text-sand ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/10 hover:text-cream sm:h-12 sm:w-auto sm:px-4 ${FOCUS_DARK}`}
              >
                <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                <span className="hidden text-[12px] font-semibold uppercase tracking-[0.14em] sm:inline">
                  {backLabel}
                </span>
              </button>

              <span aria-hidden="true" className="hidden h-8 w-px shrink-0 bg-white/15 sm:block" />

              <div className="min-w-0 flex-1 px-0.5">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[10px] font-semibold uppercase leading-none tracking-[0.24em] text-gold-light">
                    {kicker}
                  </p>
                  {statusLabel && (
                    <StatusChip
                      label={statusLabel}
                      tone={statusTone}
                      dark
                      lang={lang}
                      className="hidden sm:inline-flex"
                    />
                  )}
                </div>
                <p className="mt-1 truncate font-serif text-[18px] leading-tight text-cream sm:text-[22px]">
                  <span lang={nameLang}>{templateName}</span>
                  {statusLabel && <span className="sr-only">, {statusLabel}</span>}
                </p>
              </div>

              <button
                type="button"
                onClick={canChoose ? onChoose : undefined}
                disabled={!canChoose}
                className={`${chooseBtnBase} h-11 px-4 text-[11px] sm:h-12 sm:px-6 sm:text-[12px] ${canChoose ? chooseOn : chooseOff}`}
              >
                {canChoose ? (
                  <>
                    <Sparkles className="hidden h-4 w-4 sm:block" strokeWidth={1.8} aria-hidden="true" />
                    <span className="sm:hidden">{chooseShortLabel}</span>
                    <span className="hidden sm:inline">{chooseLabel}</span>
                  </>
                ) : (
                  soonLabel
                )}
              </button>

              <button
                type="button"
                onClick={onToggleCompact}
                aria-expanded={true}
                aria-label={collapseLabel}
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sand transition-colors hover:bg-white/10 hover:text-cream sm:h-12 sm:w-12 ${FOCUS_DARK}`}
              >
                <ChevronDown className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

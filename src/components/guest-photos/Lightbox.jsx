// ════════════════════════════════════════════════════════════════
// 3) Şəkil baxışı (lightbox) — YALNIZ görünüş
//   Lightbox · ReactionBar · LightboxActions
// Jestlər: sola/sağa sürüşdür → əvvəlki/növbəti, aşağı çək → bağla.
// Klaviatura: ← → Esc. Fokus içəridə qalır, bağlananda kliklənən xanaya qayıdır.
// ════════════════════════════════════════════════════════════════
import { useRef, useState } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Trash2, X } from 'lucide-react';
import { DownloadButton } from './gallery';
import { useBodyScrollLock, useFocusTrap, useKeys } from './hooks';
import { DEFAULT_REACTIONS, FOCUS_DARK, formatNumber } from './tokens';


/**
 * @typedef {object} LightboxItem
 * @property {string} id
 * @property {'image'|'video'} [type]
 * @property {string} src            Böyük ölçülü şəkil və ya video faylı
 * @property {string} [poster]       Video kadrı
 * @property {string} [alt]
 * @property {string} [name]         Fayl adı: «IMG_20260919_191402.JPG»
 * @property {boolean} [featured]
 */

/**
 * @param {object} p
 * @param {LightboxItem[]} p.items
 * @param {number} p.index                     Açıq elementin indeksi (null/-1 → bağlı)
 * @param {(i:number)=>void} p.onIndex
 * @param {()=>void} p.onClose
 * @param {boolean} [p.loop=false]
 * @param {Record<string, number>} [p.reactionCounts]   Cari element üçün: { '❤️': 12, '😍': 4 }
 * @param {string|null} [p.myReaction]          Bu qonağın cari elementə verdiyi emoji
 * @param {(emoji:string)=>void} [p.onReact]    Eyni emojiyə ikinci toxunuş → siz geri alın
 * @param {boolean} [p.reactionsDisabled]
 * @param {{emoji:string,label:string}[]} [p.reactions]
 * @param {boolean} [p.canManage]
 * @param {(item:LightboxItem)=>void} [p.onFeature]
 * @param {(item:LightboxItem)=>void} [p.onDownload]   Qonaq da endirə bilər
 * @param {'idle'|'loading'|'done'|'error'} [p.downloadState]
 * @param {(item:LightboxItem)=>void} [p.onDelete]     Təsdiqi siz açın (ConfirmDialog)
 * @param {object} [p.labels]   { dialog, close, prev, next, of, feature, unfeature, delete, reactions, download:{…} }
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export default function Lightbox(props) {
  const open = props.index != null && props.index >= 0 && props.items?.[props.index];
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{open && <LightboxInner key="lb" {...props} />}</AnimatePresence>
    </MotionConfig>
  );
}

function LightboxInner({
  items,
  index,
  onIndex,
  onClose,
  loop = false,
  reactionCounts = {},
  myReaction = null,
  onReact,
  reactionsDisabled = false,
  reactions = DEFAULT_REACTIONS,
  canManage = false,
  onFeature,
  onDownload,
  downloadState = 'idle',
  onDelete,
  labels = {},
  lang = 'az',
}) {
  const L = {
    dialog: 'Şəkil baxışı',
    close: 'Bağla',
    prev: 'Əvvəlki',
    next: 'Növbəti',
    ...labels,
  };
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [dir, setDir] = useState(0);
  const dragY = useMotionValue(0);
  const fade = useTransform(dragY, [0, 320], [1, 0.25]);

  useBodyScrollLock(true);
  useFocusTrap(ref, true, { onEscape: onClose });

  const n = items.length;
  const item = items[index];
  const hasPrev = loop ? n > 1 : index > 0;
  const hasNext = loop ? n > 1 : index < n - 1;
  const go = (d) => {
    if ((d < 0 && !hasPrev) || (d > 0 && !hasNext)) return;
    setDir(d);
    dragY.set(0);
    onIndex((index + d + n) % n);
  };
  useKeys({ ArrowLeft: () => go(-1), ArrowRight: () => go(1) });

  const neighbours = [items[index - 1], items[index + 1]].filter((x) => x && x.type !== 'video');

  return (
    <motion.div
      ref={ref}
      lang={lang}
      role="dialog"
      aria-modal="true"
      aria-label={L.dialog}
      className="fixed inset-0 z-[90] flex h-[100dvh] flex-col overflow-hidden bg-[#0D0A09] text-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      {/* fon: cari şəklin bulanıq rəngi */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ opacity: fade }}
      >
        {(item.poster || (item.type !== 'video' && item.src)) && (
          <img
            src={item.poster || item.src}
            alt=""
            className="absolute inset-0 h-full w-full scale-125 object-cover opacity-35 blur-3xl"
          />
        )}
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,10,9,0.35),rgba(13,10,9,0.9))]" />
      </motion.div>

      {/* yuxarı sətir */}
      <div className="relative z-10 flex items-center gap-2 px-3 pb-2 pt-[calc(env(safe-area-inset-top,0px)+10px)] sm:px-5">
        <p
          lang={lang}
          className="min-w-0 flex-1 truncate pl-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-sand"
          aria-live="polite"
        >
          <span className="lining-nums tabular-nums text-cream">
            {index + 1} / {n}
          </span>
          {item.name && (
            <span className="ml-2 font-normal normal-case tracking-[0.04em] text-sand/90">· {item.name}</span>
          )}
        </p>
        <LightboxActions
          item={item}
          canManage={canManage}
          onFeature={onFeature}
          onDownload={onDownload}
          downloadState={downloadState}
          onDelete={onDelete}
          labels={L}
        />
        <button
          type="button"
          onClick={onClose}
          aria-label={L.close}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-cream ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/20 ${FOCUS_DARK}`}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* səhnə */}
      <div className="relative z-0 min-h-0 flex-1">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <Slide
            key={item.id}
            item={item}
            dir={dir}
            reduce={reduce}
            dragY={dragY}
            onSwipe={go}
            onDismiss={onClose}
          />
        </AnimatePresence>

        {hasPrev && (
          <NavButton side="left" label={L.prev} onClick={() => go(-1)}>
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </NavButton>
        )}
        {hasNext && (
          <NavButton side="right" label={L.next} onClick={() => go(1)}>
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </NavButton>
        )}
      </div>

      {/* reaksiyalar */}
      <div className="relative z-10 flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom,0px)+14px)] pt-3">
        {onReact && (
          <ReactionBar
            reactions={reactions}
            counts={reactionCounts}
            mine={myReaction}
            onReact={onReact}
            disabled={reactionsDisabled}
            label={L.reactions}
          />
        )}
      </div>

      {/* qonşu şəkilləri əvvəlcədən yüklə */}
      <div aria-hidden="true" className="hidden">
        {neighbours.map((x) => (
          <img key={x.id} src={x.src} alt="" />
        ))}
      </div>
    </motion.div>
  );
}

function Slide({ item, dir, reduce, dragY, onSwipe, onDismiss }) {
  const x = useMotionValue(0);
  const isVideo = item.type === 'video';
  return (
    <motion.div
      className="absolute inset-0 flex touch-none items-center justify-center px-0 sm:px-20"
      custom={dir}
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 70 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -70 }}
      transition={{ duration: reduce ? 0.12 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={isVideo ? undefined : { x, y: dragY }}
      drag={isVideo ? false : true}
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={{ left: 0.7, right: 0.7, top: 0.1, bottom: 0.9 }}
      onDragEnd={(_, info) => {
        const { offset, velocity } = info;
        if (Math.abs(offset.x) > Math.abs(offset.y)) {
          if (offset.x < -70 || velocity.x < -500) onSwipe(1);
          else if (offset.x > 70 || velocity.x > 500) onSwipe(-1);
        } else if (offset.y > 120 || velocity.y > 700) {
          onDismiss();
        }
      }}
    >
      {isVideo ? (
        <video
          key={item.src}
          src={item.src}
          poster={item.poster}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="max-h-full max-w-full bg-black object-contain sm:rounded-[8px]"
        />
      ) : (
        <img
          src={item.src}
          alt={item.alt ?? ''}
          draggable={false}
          className="pointer-events-none h-full w-full select-none object-contain"
        />
      )}
    </motion.div>
  );
}

function NavButton({ side, label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-cream ring-1 ring-inset ring-white/20 backdrop-blur-md transition-colors hover:bg-black/55 sm:h-14 sm:w-14 ${
        side === 'left' ? 'left-2 sm:left-5' : 'right-2 sm:right-5'
      } ${FOCUS_DARK}`}
    >
      {children}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Reaksiya sətri. Bir qonaq · bir media · bir reaksiya: seçilmiş emoji vurğulanır,
 * eyni emojiyə ikinci toxunuş onReact(emoji) çağırır — geri almağı siz edirsiniz.
 * @param {object} p
 * @param {{emoji:string,label:string}[]} [p.reactions]
 * @param {Record<string,number>} [p.counts]
 * @param {string|null} [p.mine]
 * @param {(emoji:string)=>void} p.onReact
 * @param {boolean} [p.disabled]
 * @param {string} [p.label='Reaksiya ver']
 */
export function ReactionBar({
  reactions = DEFAULT_REACTIONS,
  counts = {},
  mine = null,
  onReact,
  disabled = false,
  label = 'Reaksiya ver',
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center gap-1.5 rounded-full bg-black/35 p-1.5 ring-1 ring-inset ring-white/15 backdrop-blur-md"
    >
      {reactions.map(({ emoji, label: name }) => {
        const on = mine === emoji;
        const c = counts[emoji] ?? 0;
        return (
          <motion.button
            key={emoji}
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={() => onReact?.(emoji)}
            disabled={disabled}
            aria-pressed={on}
            aria-label={`${name}: ${c}`}
            className={`inline-flex h-12 min-w-[48px] items-center justify-center gap-1.5 rounded-full px-2.5 transition-[background-color,box-shadow] duration-200 disabled:opacity-60 ${FOCUS_DARK} ${
              on ? 'bg-gold/25 ring-2 ring-inset ring-gold-light' : 'hover:bg-white/10'
            }`}
          >
            <motion.span
              aria-hidden="true"
              className="text-[22px] leading-none"
              animate={on ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              {emoji}
            </motion.span>
            {c > 0 && (
              <span
                className={`text-[13px] font-semibold lining-nums tabular-nums ${on ? 'text-gold-light' : 'text-cream'}`}
              >
                {formatNumber(c)}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Yuxarı sağdakı əməliyyatlar: HD endir (hamı), seçilmiş et və sil (cütlük).
 * @param {object} p
 * @param {LightboxItem} p.item
 * @param {boolean} [p.canManage]
 * @param {(item)=>void} [p.onFeature] @param {(item)=>void} [p.onDownload] @param {(item)=>void} [p.onDelete]
 * @param {'idle'|'loading'|'done'|'error'} [p.downloadState]
 * @param {object} [p.labels]   { feature:'Seçilmişlərə əlavə et', unfeature:'Seçilmişlərdən çıxar', delete:'Sil', download:{…} }
 */
export function LightboxActions({
  item,
  canManage,
  onFeature,
  onDownload,
  downloadState = 'idle',
  onDelete,
  labels = {},
}) {
  const L = {
    feature: 'Seçilmişlərə əlavə et',
    unfeature: 'Seçilmişlərdən çıxar',
    delete: 'Sil',
    ...labels,
  };
  const iconBtn = `grid h-11 w-11 shrink-0 place-items-center rounded-full ring-1 ring-inset transition-colors ${FOCUS_DARK}`;
  return (
    <div className="flex items-center gap-1.5">
      {onDownload && (
        <DownloadButton
          state={downloadState}
          onClick={() => onDownload(item)}
          dark
          iconOnlyOnMobile
          labels={L.download}
        />
      )}
      {canManage && onFeature && (
        <button
          type="button"
          onClick={() => onFeature(item)}
          aria-pressed={!!item.featured}
          aria-label={item.featured ? L.unfeature : L.feature}
          title={item.featured ? L.unfeature : L.feature}
          className={`${iconBtn} ${item.featured ? 'bg-gold-rich text-white ring-gold-light/50' : 'bg-white/10 text-cream ring-white/20 hover:bg-white/20'}`}
        >
          <Star
            className={`h-[18px] w-[18px] ${item.featured ? 'fill-white' : ''}`}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>
      )}
      {canManage && onDelete && (
        <button
          type="button"
          onClick={() => onDelete(item)}
          aria-label={L.delete}
          title={L.delete}
          className={`${iconBtn} bg-white/10 text-cream ring-white/20 hover:bg-rust hover:text-white`}
        >
          <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

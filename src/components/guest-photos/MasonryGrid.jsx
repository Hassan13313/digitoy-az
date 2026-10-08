// ════════════════════════════════════════════════════════════════
// MasonryGrid — sıranı qoruyan mozaika (YALNIZ görünüş)
//
// Necə işləyir:
//  • Hər element sırası ilə ən QISA sütuna qoyulur → göz soldan sağa, yuxarıdan aşağı oxuyur
//    (CSS columns kimi sütun-sütun DEYİL). DOM sırası = elementlərin sırası → Tab sırası da düzgündür.
//  • Nisbət serverdən gəlmir: şəkil yüklənənə qədər `estimateAspect` (default 4:5) yer tutur,
//    MediaTile yüklənəndə onAspect(ratio) çağırır → yalnız həmin xananın hündürlüyü yumşaq dəyişir.
//  • Xananın sütunu onun nisbəti bilinən kimi yadda saxlanılır: «Daha çox yüklənir…» ilə SONA əlavə
//    olunan elementlər köhnələri yerindən oynatmır. Sıra dəyişəndə (sıralama, silmə) düzülüş yenidən qurulur.
//  • 500 element: sadə absolute yerləşmə (virtualizasiya lazım deyil), şəkillər loading="lazy".
// ════════════════════════════════════════════════════════════════
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useElementWidth } from './hooks';
import { Btn, Spinner } from './shared';
import { defaultColumnsFor } from './tokens';


/**
 * @template T
 * @param {object} p
 * @param {T[]} p.items
 * @param {(item:T)=>string} p.getKey
 * @param {(item:T, index:number, layout:{onAspect:(ratio:number)=>void, width:number, height:number})=>React.ReactNode} p.renderItem
 *        MediaTile-a `onAspect`-i ötürün ki, nisbət bilinəndə xana öz ölçüsünü alsın.
 * @param {(item:T)=>number|undefined} [p.getAspect]   Nisbət əvvəlcədən bilinirsə (en/hündürlük)
 * @param {number} [p.estimateAspect=0.8]               Yer tutucu nisbəti
 * @param {(width:number)=>number} [p.columnsFor]       Default: 2 / 3 / 4
 * @param {number} [p.gap]                              Default: mobil 8px, ≥640 12px
 * @param {()=>void} [p.onLoadMore]                     Sona yaxınlaşanda (və düymə ilə) çağırılır
 * @param {boolean} [p.hasMore]
 * @param {boolean} [p.loadingMore]
 * @param {string} [p.loadMoreLabel='Daha çox göstər']
 * @param {string} [p.loadingMoreLabel='Daha çox yüklənir…']
 * @param {string} [p.label]                            Siyahının aria-label-i
 */
export default function MasonryGrid({
  items,
  getKey,
  renderItem,
  getAspect,
  estimateAspect = 0.8,
  columnsFor = defaultColumnsFor,
  gap,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  loadMoreLabel = 'Daha çox göstər',
  loadingMoreLabel = 'Daha çox yüklənir…',
  label,
  lang = 'az',
}) {
  const ref = useRef(null);
  const width = useElementWidth(ref);
  const reduce = useReducedMotion();
  const [aspects, setAspects] = useState({});
  const assign = useRef({ cols: 0, keys: [], map: new Map() });

  const onAspectFor = useCallback(
    (key) => (ratio) => {
      if (!ratio || !Number.isFinite(ratio)) return;
      const r = Math.min(3, Math.max(0.33, ratio)); // çox uzun panoramlar şəbəkəni pozmasın
      setAspects((a) => (Math.abs((a[key] ?? 0) - r) < 0.01 ? a : { ...a, [key]: r }));
    },
    [],
  );

  const cols = width ? columnsFor(width) : 2;
  const g = gap ?? (width >= 640 ? 12 : 8);
  const colW = width ? (width - g * (cols - 1)) / cols : 0;

  /* Sütun təyinatı keşi qəsdən ref-dədir: render zamanı oxunur/yazılır, amma nəticə yalnız
     items/aspects-dən asılıdır (StrictMode-un ikinci render-i eyni nəticəni verir).
     Layihə React Compiler işlətmir. */
  /* eslint-disable react-hooks/refs */
  const layout = useMemo(() => {
    if (!colW) return { boxes: [], height: 0 };
    const keys = items.map(getKey);
    const a = assign.current;
    // köhnə açarlar eyni sıradadırsa (yalnız sona əlavə) → təyinatı saxla
    const prefixSame =
      a.cols === cols && a.keys.length <= keys.length && a.keys.every((k, i) => keys[i] === k);
    if (!prefixSame) assign.current = { cols, keys: [], map: new Map() };
    const map = assign.current.map;

    const heights = new Array(cols).fill(0);
    const boxes = items.map((item, i) => {
      const key = keys[i];
      const known = aspects[key] ?? getAspect?.(item);
      const ratio = known ?? estimateAspect;
      const h = Math.round(colW / ratio);
      let col = map.get(key);
      if (col == null) {
        col = heights.indexOf(Math.min(...heights));
        // sütun yalnız nisbət bilinəndə «kilidlənir»: yer tutucular real ölçülərə görə yenidən düzülür,
        // yüklənmiş xanalar isə bir daha sütun dəyişmir
        if (known) map.set(key, col);
      }
      const box = { key, x: col * (colW + g), y: heights[col], w: colW, h };
      heights[col] += h + g;
      return box;
    });
    assign.current.keys = keys;
    return { boxes, height: Math.max(0, Math.max(...heights) - g) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, aspects, colW, cols, g, estimateAspect]);
  /* eslint-enable react-hooks/refs */

  // sona yaxınlaşanda növbəti səhifə
  const sentinel = useRef(null);
  const loadRef = useRef(onLoadMore);
  useLayoutEffect(() => {
    loadRef.current = onLoadMore;
  });
  useEffect(() => {
    if (!hasMore || loadingMore || !sentinel.current) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) loadRef.current?.();
      },
      { rootMargin: '900px 0px' },
    );
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [hasMore, loadingMore, items.length]);

  return (
    <div lang={lang}>
      <ul ref={ref} aria-label={label} className="relative w-full" style={{ height: layout.height }}>
        {layout.boxes.map((b, i) => (
          <li
            key={b.key}
            className={`absolute left-0 top-0 ${reduce ? '' : 'transition-[transform,height] duration-500 ease-luxe'}`}
            style={{
              width: b.w,
              height: b.h,
              transform: `translate3d(${b.x}px, ${b.y}px, 0)`,
            }}
          >
            {renderItem(items[i], i, {
              onAspect: onAspectFor(b.key),
              width: b.w,
              height: b.h,
            })}
          </li>
        ))}
      </ul>
      <div ref={sentinel} aria-hidden="true" className="h-px" />
      {(hasMore || loadingMore) && (
        <div className="mt-8 flex justify-center" aria-live="polite">
          {loadingMore ? (
            <p className="inline-flex h-12 items-center gap-2.5 text-[13px] font-medium text-brown-dark">
              <Spinner className="h-4 w-4 text-gold-deep" />
              {loadingMoreLabel}
            </p>
          ) : (
            <Btn variant="ghost" icon={ChevronDown} onClick={onLoadMore}>
              {loadMoreLabel}
            </Btn>
          )}
        </div>
      )}
    </div>
  );
}

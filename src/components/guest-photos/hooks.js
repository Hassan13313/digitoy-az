// ════════════════════════════════════════════════════════════════
// Qonaq fotoları — kiçik UI hook-ları (fetch / storage YOXDUR)
// ════════════════════════════════════════════════════════════════
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

/**
 * Fokus tələsi: aktivdirsə Tab/Shift+Tab konteynerdən çıxmır, Esc onEscape-i çağırır,
 * bağlananda fokus əvvəlki elementə (məs. kliklənən xanaya) qayıdır.
 * @param {React.RefObject<HTMLElement>} ref
 * @param {boolean} active
 * @param {{onEscape?: ()=>void, initialFocus?: React.RefObject<HTMLElement>, restoreFocus?: boolean}} [o]
 */
export function useFocusTrap(ref, active, { onEscape, initialFocus, restoreFocus = true } = {}) {
  const escRef = useRef(onEscape);
  useLayoutEffect(() => {
    escRef.current = onEscape;
  });

  useEffect(() => {
    if (!active) return undefined;
    const previous = document.activeElement;
    const node = ref.current;
    const raf = requestAnimationFrame(() => {
      const target = initialFocus?.current ?? node?.querySelector(FOCUSABLE) ?? node;
      target?.focus?.({ preventScroll: true });
    });
    const onKey = (e) => {
      if (e.key === 'Escape' && escRef.current) {
        e.preventDefault();
        escRef.current();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const list = [...node.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (!list.length) {
        e.preventDefault();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === first || !node.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      if (restoreFocus && previous && typeof previous.focus === 'function')
        previous.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}

/**
 * Səhifə sürüşməsini kilidləyir (modal / lightbox açıq olanda).
 * @param {boolean} active
 */
export function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    const { overflow, paddingRight } = document.body.style;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [active]);
}

/**
 * Hərəkətsizlik taymeri: siçan/klaviatura/toxunuşdan `ms` sonra false qaytarır.
 * TV slayd şouda idarəetməni və kursoru gizlətmək üçün.
 * @param {number} [ms=4000]
 * @param {boolean} [enabled=true]
 * @returns {boolean} active — istifadəçi son `ms` ərzində hərəkət edibsə true
 */
export function useIdle(ms = 4000, enabled = true) {
  const [active, setActive] = useState(true);
  useEffect(() => {
    if (!enabled) return undefined;
    let t = setTimeout(() => setActive(false), ms);
    const wake = () => {
      setActive(true);
      clearTimeout(t);
      t = setTimeout(() => setActive(false), ms);
    };
    const evs = ['mousemove', 'pointerdown', 'keydown', 'wheel', 'touchstart'];
    evs.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      clearTimeout(t);
      evs.forEach((e) => window.removeEventListener(e, wake));
    };
  }, [ms, enabled]);
  return !enabled || active;
}

/**
 * Elementin enini izləyir (ResizeObserver). İlk render-dən əvvəl ölçülür → sıçrama yoxdur.
 * @param {React.RefObject<HTMLElement>} ref
 * @returns {number}
 */
export function useElementWidth(ref) {
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setW(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

/**
 * Bütün pəncərəyə fayl sürüklənməsini izləyir (desktop drag & drop).
 * Yalnız UI: buraxılan faylları onFiles(FileList)-ə ötürür, yükləmə sizdədir.
 * @param {{onFiles: (files: FileList)=>void, disabled?: boolean}} o
 * @returns {boolean} active — fayl ekran üzərində sürüklənir
 */
export function useWindowFileDrop({ onFiles, disabled = false }) {
  const [active, setActive] = useState(false);
  const depth = useRef(0);
  const cb = useRef(onFiles);
  useLayoutEffect(() => {
    cb.current = onFiles;
  });

  useEffect(() => {
    if (disabled) return undefined;
    const hasFiles = (e) => [...(e.dataTransfer?.types ?? [])].includes('Files');
    const enter = (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth.current += 1;
      setActive(true);
    };
    const over = (e) => {
      if (hasFiles(e)) e.preventDefault();
    };
    const leave = (e) => {
      if (!hasFiles(e)) return;
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setActive(false);
    };
    const drop = (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth.current = 0;
      setActive(false);
      if (e.dataTransfer.files?.length) cb.current?.(e.dataTransfer.files);
    };
    window.addEventListener('dragenter', enter);
    window.addEventListener('dragover', over);
    window.addEventListener('dragleave', leave);
    window.addEventListener('drop', drop);
    return () => {
      window.removeEventListener('dragenter', enter);
      window.removeEventListener('dragover', over);
      window.removeEventListener('dragleave', leave);
      window.removeEventListener('drop', drop);
    };
  }, [disabled]);

  return active;
}

/**
 * Özü sönən element üçün taymer (Toast, «+2 yeni şəkil»).
 * @param {boolean} open
 * @param {number} ms
 * @param {()=>void} onDone
 */
export function useAutoDismiss(open, ms, onDone) {
  const cb = useRef(onDone);
  useLayoutEffect(() => {
    cb.current = onDone;
  });
  useEffect(() => {
    if (!open || !ms) return undefined;
    const t = setTimeout(() => cb.current?.(), ms);
    return () => clearTimeout(t);
  }, [open, ms]);
}

/** Klaviatura qısayolları (yalnız `enabled` olanda). map: { ArrowLeft: fn, ' ': fn, ... } */
export function useKeys(map, enabled = true) {
  const ref = useRef(map);
  useLayoutEffect(() => {
    ref.current = map;
  });
  const handler = useCallback((e) => {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    const fn = ref.current[e.key];
    if (fn) {
      e.preventDefault();
      fn(e);
    }
  }, []);
  useEffect(() => {
    if (!enabled) return undefined;
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, handler]);
}

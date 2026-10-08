// ════════════════════════════════════════════════════════════════
// Hüquqi səhifələr üçün kiçik UI hook-ları (fetch / storage YOXDUR)
// ════════════════════════════════════════════════════════════════
import { useEffect, useState } from 'react';

/**
 * Ekranda oxunan bölmənin id-si: başlığı `offset` px xəttini keçən sonuncu bölmə.
 * Səhifənin sonuna çatanda sonuncu bölmə aktiv olur (qısa son bölmələr üçün).
 * @param {string[]} ids          Bölmə id-ləri (sıra ilə)
 * @param {{offset?: number}} [o] Yapışqan başlıq + boşluq (default 140px)
 * @returns {string|null}
 */
export function useActiveSection(ids, { offset = 140 } = {}) {
  const [active, setActive] = useState(ids[0] ?? null);
  const key = ids.join('|');

  useEffect(() => {
    if (!ids.length) return undefined;
    let raf = 0;
    const calc = () => {
      raf = 0;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = ids[ids.length - 1];
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, offset]);

  return active;
}

/**
 * Elementin oxunma faizi (0…1): başlanğıcı ekranın yuxarısına çatanda 0,
 * sonu ekranın aşağısına çatanda 1.
 * @param {React.RefObject<HTMLElement>} ref
 * @returns {number}
 */
export function useReadingProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total));
      setProgress((prev) => (Math.abs(prev - p) < 0.002 ? prev : p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);

  return progress;
}

/** Header hündürlüyünü nəzərə alaraq bölməyə hamar sürüşmə */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  // Fokusu bölməyə ötür ki, klaviatura/ekran oxuyucu istifadəçisi də yerini bilsin
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

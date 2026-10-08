// Önbaxış panelinin ölçüləri — panel və onu yerləşdirən kod (musiqi düymələrinin qalxması) eyni rəqəmləri işlədir
export const PREVIEW_BAR = {
  fullMobile: 64,
  fullDesktop: 72,
  compact: 52,
  gap: 12,
  breakpoint: 640,
  /** compact rejimdə sağda boş saxlanılan en (musiqi dairəsi üçün) */
  reserveRight: 88,
};

/**
 * Panelin ekranın altından tutduğu yer (px, safe-area daxil deyil).
 * Musiqi düymələrini bu qədər + öz boşluğunuz qədər qaldırın.
 * @param {{compact?: boolean, viewportWidth?: number, liftForCompact?: boolean}} o
 * @returns {number}
 */
export function getPreviewBarOffset({ compact = false, viewportWidth = 390, liftForCompact = false } = {}) {
  if (compact) return liftForCompact ? PREVIEW_BAR.compact + PREVIEW_BAR.gap : 0;
  const h = viewportWidth >= PREVIEW_BAR.breakpoint ? PREVIEW_BAR.fullDesktop : PREVIEW_BAR.fullMobile;
  return h + PREVIEW_BAR.gap;
}

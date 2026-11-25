/* ─────────────────────────────────────────────────────────────────────────────
   PROMOKOD (2026-11-25) — müştəri tərəfi köməkçiləri.

   Qaydanın özü (tarix, paket, limit, qiymət) serverdədir: api/promo_lib.php.
   Burada yalnız: `?kod=` linkindən kodu yadda saxlamaq, mətnlər (AZ/EN/RU) və
   admin üçün WhatsApp sifariş sətirləri (həmişə AZ).

   Promokod HEÇ VAXT form_data-ya yazılmır (form_data dəvətnamədə açıq olur) —
   sifarişə submitDraft(…, promoCode) ilə ayrıca gedir.
   ───────────────────────────────────────────────────────────────────────── */

const STORE_KEY = 'digitoy_promo'

export const PROMO_REASONS = ['NOT_FOUND', 'INACTIVE', 'NOT_STARTED', 'EXPIRED', 'PACKAGE', 'LIMIT', 'RATE_LIMITED', 'NETWORK']

export const PROMO_COPY = {
  az: {
    toggle: 'Promokodunuz var?',
    label: 'Promokod',
    placeholder: 'Məs. QARACUMA',
    apply: 'Tətbiq et',
    remove: 'Sil',
    applied: 'Promokod tətbiq olundu',
    checking: 'Yoxlanılır…',
    empty: 'Promokodu yazın',
    total: 'Yekun qiymət',
    reasons: {
      NOT_FOUND: 'Belə promokod tapılmadı. Yazılışı yoxlayın.',
      INACTIVE: 'Bu promokod artıq aktiv deyil.',
      NOT_STARTED: 'Bu promokod hələ başlamayıb.',
      EXPIRED: 'Bu promokodun vaxtı bitib.',
      PACKAGE: 'Bu promokod seçdiyiniz paketə aid deyil.',
      LIMIT: 'Bu promokodun limiti dolub.',
      RATE_LIMITED: 'Çox cəhd oldu. 10 dəqiqə sonra yenidən yoxlayın.',
      NETWORK: 'Yoxlamaq alınmadı. İnterneti yoxlayıb yenidən cəhd edin.',
    },
  },
  en: {
    toggle: 'Have a promo code?',
    label: 'Promo code',
    placeholder: 'E.g. QARACUMA',
    apply: 'Apply',
    remove: 'Remove',
    applied: 'Promo code applied',
    checking: 'Checking…',
    empty: 'Enter your promo code',
    total: 'Total',
    reasons: {
      NOT_FOUND: 'We could not find this promo code. Please check the spelling.',
      INACTIVE: 'This promo code is no longer active.',
      NOT_STARTED: 'This promo code has not started yet.',
      EXPIRED: 'This promo code has expired.',
      PACKAGE: 'This promo code does not apply to the package you chose.',
      LIMIT: 'This promo code has reached its limit.',
      RATE_LIMITED: 'Too many attempts. Please try again in 10 minutes.',
      NETWORK: 'We could not check the code. Check your connection and try again.',
    },
  },
  ru: {
    toggle: 'Есть промокод?',
    label: 'Промокод',
    placeholder: 'Напр. QARACUMA',
    apply: 'Применить',
    remove: 'Убрать',
    applied: 'Промокод применён',
    checking: 'Проверяем…',
    empty: 'Введите промокод',
    total: 'Итого',
    reasons: {
      NOT_FOUND: 'Такой промокод не найден. Проверьте написание.',
      INACTIVE: 'Этот промокод больше не действует.',
      NOT_STARTED: 'Этот промокод ещё не начал действовать.',
      EXPIRED: 'Срок действия промокода истёк.',
      PACKAGE: 'Этот промокод не действует для выбранного пакета.',
      LIMIT: 'Лимит этого промокода исчерпан.',
      RATE_LIMITED: 'Слишком много попыток. Попробуйте через 10 минут.',
      NETWORK: 'Не удалось проверить код. Проверьте интернет и попробуйте снова.',
    },
  },
}

export const promoCopy = (lang) => PROMO_COPY[lang] || PROMO_COPY.az

/** `?kod=QARACUMA` linki (Instagram story, influenser) — kodu yadda saxlayır. */
export function capturePromoFromUrl(search = typeof window !== 'undefined' ? window.location.search : '') {
  const kod = new URLSearchParams(search).get('kod')
  const v = (kod || '').trim().slice(0, 40)
  if (!v) return null
  try { localStorage.setItem(STORE_KEY, v) } catch { /* private mode */ }
  return v
}

export function getStoredPromo() {
  try { return localStorage.getItem(STORE_KEY) || '' } catch { return '' }
}

export function clearStoredPromo() {
  try { localStorage.removeItem(STORE_KEY) } catch { /* private mode */ }
}

/** «−30%» və ya «−20₼» */
export const promoDiscountLabel = (p) => (p.kind === 'percent' ? `−${p.amount}%` : `−${p.amount}₼`)

/** Admin üçün WhatsApp sifariş sətirləri (AZ). Kod tətbiq olunmayıbsa boş massiv. */
export function promoWaLines(promo) {
  if (!promo?.ok) return []
  return [
    `🎟 Promokod: ${promo.code} (${promoDiscountLabel(promo)})`,
    `💰 Yekun: ${promo.price_final}₼ (${promo.price_base}₼ əvəzinə)`,
  ]
}

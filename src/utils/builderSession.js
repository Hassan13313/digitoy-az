/* ─────────────────────────────────────────────────────────────────────────────
   BUILDER SESSION — builder vəziyyətinin sinxron snapshot-u (sessionStorage).

   NƏ ÜÇÜN: `BuilderForm` forma məlumatlarını öz state-ində saxlayır. İstifadəçi
   şablon önbaxışına keçib geri qayıdanda komponent yenidən mount olur və state
   sıfırlanır. Əvvəllər bərpa YALNIZ serverə async sorğu ilə gedirdi
   (`getDraft` → save_draft.php): gecikmə olurdu, qısa müddət boş forma
   görünürdü, API əlçatmaz olsa məlumat tamamilə itirdi.

   Bu modul eyni məlumatı sessionStorage-da saxlayır — oxunuşu SİNXRONdur, yəni
   `useState` initializer-ində birinci render-də tətbiq olunur: nə flash, nə də
   şəbəkə asılılığı.

   ⚠ Server draft-ı ƏVƏZ ETMİR: o, cihazlararası/sessiyalararası bərpa üçün
   qalır və yalnız burada snapshot olmayanda tətbiq edilir.

   ⚠ sessionStorage QƏSDƏN seçilib (localStorage yox): yalnız cari tabda
   yaşayır, tab bağlananda təmizlənir — köhnə sifarişin qalıqları yeni
   dəvətnaməyə keçmir.
   ───────────────────────────────────────────────────────────────────────── */

const KEY = 'digitoy_builder_state'

/** Builder vəziyyətini yaz (data + cari addım) */
export function saveBuilderSnapshot(snapshot) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...snapshot, savedAt: Date.now() }))
  } catch { /* private mode / kvota — bərpa olmayacaq, axın pozulmur */ }
}

/** Snapshot-u oxu (yoxdursa null). Silmir — Preview→Back→Preview üçün qalır. */
export function readBuilderSnapshot() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' && parsed.data ? parsed : null
  } catch { return null }
}

/** Yalnız açıq "yenidən başla" hallarında çağırılır (logo, İndi Başla, sifariş) */
export function clearBuilderSnapshot() {
  try { sessionStorage.removeItem(KEY) } catch { /* private mode */ }
}

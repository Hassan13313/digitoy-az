import { createElement, useEffect, Suspense } from 'react'
import { TemplateProvider } from './TemplateProvider'
import TemplateBoundary from './TemplateBoundary'
import { getTemplateComponent } from './registry'
import { DEFAULT_TEMPLATE_ID, resolveTemplateId } from './templateConfig'
import { ensureTemplateFonts } from './fonts'
import { trackTemplateView, trackTemplateFallback } from './templateAnalytics'

/* Şablon chunk-ı yüklənənə qədər krem fon (yalnız lazy şablonlarda görünür —
   simple-luxury statik import olduğu üçün heç vaxt bu vəziyyətə düşmür). */
function TemplateLoader() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div style={{
        width: 40, height: 40,
        border: '1px solid rgba(197,160,89,0.25)',
        borderTop: '1px solid rgba(197,160,89,0.8)',
        borderRadius: '50%',
        animation: 'spin 0.9s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE RENDERER — Template Engine-in yeganə giriş nöqtəsi.

     <TemplateRenderer template="simple-luxury" weddingData={...} lang={...} />

   Məsuliyyətləri:
     1. id-ni etibarlı şablona çevirmək (naməlum/deaktiv → simple-luxury fallback)
     2. TemplateProvider ilə konteksti qurmaq
     3. Uyğun şablon komponentini render edib bütün propsları ötürmək

   TƏHLÜKƏSİZLİK: `isPreview` false olanda (yəni real müştəri dəvətnaməsi)
   yalnız enabled=true şablonlar render olunur. Hazırlanmaqda olan şablon
   id-si DB-yə düşsə belə müştəri simple-luxury görəcək.
   ───────────────────────────────────────────────────────────────────────── */
export default function TemplateRenderer({ template, isPreview = false, ...templateProps }) {
  const templateId = resolveTemplateId(template, { allowDisabled: isPreview })
  const didFallback = !!template && templateId !== template

  /* simple-luxury-dən başqa şablonlar öz şrift ailələrini işlədir — render
     anında yüklənir. simple-luxury heç vaxt bura düşmür → mövcud müştərilərin
     yüklənmə profili dəyişmir. */
  if (templateId !== DEFAULT_TEMPLATE_ID) ensureTemplateFonts()

  /* Analitika (hələ göndərilmir — bax templateAnalytics.js) */
  useEffect(() => {
    trackTemplateView(templateId, { is_preview: isPreview })
    if (didFallback) trackTemplateFallback(template, templateId)
  }, [templateId, isPreview, didFallback, template])

  /* createElement — komponent registry-dən (modul səviyyəsində sabit obyekt)
     gəlir, render zamanı yaradılmır; JSX yazılışı linter-i yanlış xəbərdarlığa
     salır, ona görə birbaşa createElement istifadə olunur. */
  const content = createElement(getTemplateComponent(templateId), {
    ...templateProps,
    isPreview,
  })

  /* Nasaz şablon çökərsə ağ ekran yerinə default şablon göstərilir */
  const safeFallback = templateId === DEFAULT_TEMPLATE_ID
    ? null
    : createElement(getTemplateComponent(DEFAULT_TEMPLATE_ID), { ...templateProps, isPreview })

  return (
    <TemplateProvider templateId={templateId} isPreview={isPreview}>
      <TemplateBoundary templateId={templateId} fallback={safeFallback}>
        {templateId === DEFAULT_TEMPLATE_ID
          ? content /* statik import — Suspense lazım deyil, render axını dəyişmir */
          : <Suspense fallback={<TemplateLoader />}>{content}</Suspense>}
      </TemplateBoundary>
    </TemplateProvider>
  )
}

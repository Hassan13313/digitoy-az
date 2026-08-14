import TemplateRenderer from '../../templates/TemplateRenderer'
import { DEFAULT_TEMPLATE_ID } from '../../templates/templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   INVITATION PAGE — dəvətnamə marşrutunun nazik giriş qatı.

   Artıq burada HEÇ BİR dizayn markup-ı yoxdur. Bütün vizual struktur
   `src/templates/<id>/` altındadır; bu komponent yalnız hansı şablonun
   render olunacağını həll edir və məlumatı Template Engine-ə ötürür.

   Şablon seçimi ardıcıllığı:
     1. weddingData.templateId  (gələcək DB inteqrasiyası üçün hazırdır)
     2. simple-luxury           (bütün mövcud müştərilər — dəyişməz default)

   Naməlum və ya hazırlanmaqda olan (enabled=false) id gəlsə,
   TemplateRenderer avtomatik simple-luxury-yə düşür — müştəri heç vaxt
   yarımçıq şablon görmür.
   ───────────────────────────────────────────────────────────────────────── */
export default function InvitationPage({
  lang, setLang, weddingData, onBack,
  isDemoMode = false, initialGuestbook, isAdmin = false,
}) {
  const templateId = weddingData?.templateId || DEFAULT_TEMPLATE_ID

  return (
    <TemplateRenderer
      template={templateId}
      lang={lang}
      setLang={setLang}
      weddingData={weddingData}
      onBack={onBack}
      isDemoMode={isDemoMode}
      initialGuestbook={initialGuestbook}
      isAdmin={isAdmin}
    />
  )
}

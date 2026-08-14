import { createContext, useContext, useMemo } from 'react'
import { DEFAULT_TEMPLATE_ID, getTemplateConfig, resolveTemplateId } from './templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE PROVIDER — aktiv şablonun kontekstini ağaca ötürür.

   Şablon daxilindəki istənilən komponent `useTemplate()` ilə hansı şablonun
   render olunduğunu, onun metadata-sını və preview rejimində olub-olmadığını
   öyrənə bilər — prop drilling olmadan.
   ───────────────────────────────────────────────────────────────────────── */

const TemplateContext = createContext(null)

export function TemplateProvider({ templateId, isPreview = false, children }) {
  const value = useMemo(() => {
    const id = resolveTemplateId(templateId, { allowDisabled: isPreview })
    return {
      templateId: id,
      config: getTemplateConfig(id),
      isPreview,
      /* İstənilən id reyestrdən kənar idisə (köhnə/xarab data) — fallback işə düşüb */
      isFallback: id !== templateId,
    }
  }, [templateId, isPreview])

  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>
}

/**
 * Aktiv şablon konteksti.
 * Provider-dən kənarda çağırılsa təhlükəsiz default qaytarır (simple-luxury) —
 * beləliklə şablon komponentlərini təkbaşına da render etmək olar.
 */
export function useTemplate() {
  const ctx = useContext(TemplateContext)
  if (ctx) return ctx
  return {
    templateId: DEFAULT_TEMPLATE_ID,
    config: getTemplateConfig(DEFAULT_TEMPLATE_ID),
    isPreview: false,
    isFallback: false,
  }
}

import { getTemplateConfig, getTemplateName, DEFAULT_TEMPLATE_ID } from '../../templates/templateConfig'
import { hasLegacyVersion } from '../../templates/legacy/registry'

/* Admin siyahıları üçün şablon adı + rəng nöqtəsi (v2 TemplateLabel).
   TemplateCell ilə eyni qayda: ad və rəng YALNIZ templateConfig-dən gəlir,
   boş template_id → default şablon. */
export function templateMeta(templateId) {
  const id = templateId || DEFAULT_TEMPLATE_ID
  const cfg = getTemplateConfig(id)
  return { name: getTemplateName(id) || id, color: cfg?.theme?.primary || '#C5A059' }
}

/** Siyahı üçün: redizayndan əvvəlki görünüşdə qalan dəvətnamə «· köhnə dizayn» ilə
    işarələnir (versiya 1 və şablonun köhnə versiyası var — bax templates/legacy). */
export function templateMetaVersioned(templateId, version) {
  const meta = templateMeta(templateId)
  const legacy = Number(version) === 1 && hasLegacyVersion(templateId || DEFAULT_TEMPLATE_ID)
  return legacy ? { ...meta, name: `${meta.name} · köhnə dizayn` } : meta
}

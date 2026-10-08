import { getTemplateConfig, getTemplateName, DEFAULT_TEMPLATE_ID } from '../../templates/templateConfig'

/* Admin siyahıları üçün şablon adı + rəng nöqtəsi (v2 TemplateLabel).
   TemplateCell ilə eyni qayda: ad və rəng YALNIZ templateConfig-dən gəlir,
   boş template_id → default şablon. */
export function templateMeta(templateId) {
  const id = templateId || DEFAULT_TEMPLATE_ID
  const cfg = getTemplateConfig(id)
  return { name: getTemplateName(id) || id, color: cfg?.theme?.primary || '#C5A059' }
}

import { useEffect, useState } from 'react'
import PreviewBar from './PreviewBar'
import { getPreviewBarOffset, PREVIEW_BAR } from './previewBarMetrics'
import { getTemplateConfig, getStatusMeta, isTemplateSelectable } from '../../templates/templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   Şablon önbaxışının alt paneli (/demo/template/:id) — UI redesign 2026-10.
   Köhnə «ÖNBAXIŞ · ROYAL GOLD · ROYAL-GOLD» yazı zolağını əvəz edir.

   • Şablonun dizaynına toxunmur. Panel aşağıdadır; şablonun musiqi düymələri
     `--dt-preview-offset` CSS dəyişəni qədər qalxır (default 0 — real
     dəvətnamələrdə heç nə dəyişmir).
   • Mobildə kiçik həb rejimində başlayır ki, açılış ekranının aşağıdakı
     «toxunun» ipucunu örtməsin; istifadəçi paneli aça bilər.
   ───────────────────────────────────────────────────────────────────────── */

const UI = {
  az: { kicker: 'Önbaxış', back: 'Geri', choose: 'Bu dizaynla sifariş et', chooseShort: 'Sifariş et', select: 'Seç', soon: 'Tezliklə', collapse: 'Paneli kiçilt', expand: 'Paneli aç', region: 'Şablon önbaxışı' },
  en: { kicker: 'Preview', back: 'Back', choose: 'Order with this design', chooseShort: 'Order', select: 'Select', soon: 'Soon', collapse: 'Collapse panel', expand: 'Expand panel', region: 'Template preview' },
  ru: { kicker: 'Просмотр', back: 'Назад', choose: 'Заказать с этим дизайном', chooseShort: 'Заказать', select: 'Выбрать', soon: 'Скоро', collapse: 'Свернуть панель', expand: 'Развернуть панель', region: 'Предпросмотр шаблона' },
}

const isNarrow = () => typeof window !== 'undefined' && window.innerWidth < PREVIEW_BAR.breakpoint

export default function TemplatePreviewBar({ templateId, lang = 'az', onBack, onChoose }) {
  const ui = UI[lang] || UI.az
  const cfg = getTemplateConfig(templateId)
  const badge = getStatusMeta(cfg?.status, lang)
  const [compact, setCompact] = useState(isNarrow)

  /* Şablonun musiqi düymələri panelin üstündə qalsın */
  useEffect(() => {
    const apply = () => {
      const px = getPreviewBarOffset({ compact, viewportWidth: window.innerWidth })
      document.documentElement.style.setProperty('--dt-preview-offset', `${px}px`)
    }
    apply()
    window.addEventListener('resize', apply)
    return () => {
      window.removeEventListener('resize', apply)
      document.documentElement.style.removeProperty('--dt-preview-offset')
    }
  }, [compact])

  return (
    <PreviewBar
      lang={lang}
      templateName={cfg?.name || templateId}
      statusLabel={badge?.label}
      statusTone={badge?.tone || 'positive'}
      canChoose={isTemplateSelectable(templateId)}
      compact={compact}
      onToggleCompact={() => setCompact((c) => !c)}
      onBack={onBack}
      onChoose={onChoose}
      kicker={ui.kicker}
      backLabel={ui.back}
      chooseLabel={ui.choose}
      chooseShortLabel={ui.chooseShort}
      selectLabel={ui.select}
      soonLabel={ui.soon}
      collapseLabel={ui.collapse}
      expandLabel={ui.expand}
      regionLabel={ui.region}
    />
  )
}

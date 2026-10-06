import { LEGAL_DOCS } from '../../data/legal/docs'
import { legalUi } from '../../data/legal/ui'
import { spaClick } from '../../utils/siteRoutes'
import { consent } from '../../utils/consent'

/* ─────────────────────────────────────────────────────────────────────────────
   Footer-in hüquqi sətri (Phase 47): 3 sənəd + «Kuki ayarları».
   tone="dark" — landing footer-i (espresso fon), tone="light" — krem səhifələr.
   Linklər adi <a href>-dir: Ctrl/orta klik yeni tabda açır, adi klik isə
   səhifəni yeniləmədən keçir (siteRoutes.spaClick).
   ───────────────────────────────────────────────────────────────────────── */

export default function FooterLegalLinks({ lang = 'az', tone = 'dark' }) {
  const ui = legalUi(lang).links
  const cls = tone === 'dark'
    ? 'text-white/60 hover:text-gold'
    : 'text-brown-dark hover:text-ink'
  const item = `${cls} text-[12px] no-underline hover:underline underline-offset-4 bg-transparent border-0 p-0 cursor-pointer min-h-[32px] inline-flex items-center transition-colors duration-200`

  return (
    <nav aria-label={ui.privacy} className="flex flex-wrap justify-center gap-x-6 gap-y-1">
      {LEGAL_DOCS.map((d) => (
        <a key={d.id} href={d.path} onClick={(e) => spaClick(e, d.path)} className={item}>{ui[d.id]}</a>
      ))}
      <button type="button" onClick={() => consent.openSettings()} className={item}>{ui.cookies}</button>
    </nav>
  )
}

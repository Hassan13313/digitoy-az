import { legalUi, LEGAL_LINK } from '../../data/legal/ui'
import { legalDoc } from '../../data/legal/docs'

/* ─────────────────────────────────────────────────────────────────────────────
   Sifariş düyməsinin altındakı razılıq qeydi (Phase 47):
   «Sifariş verməklə İstifadə şərtlərini və Məxfilik siyasətini qəbul edirəm».
   Linklər YENİ TABDA açılır — builder/önbaxış vəziyyəti itməsin.
   Rənglər çağıranın palitrasından gəlir (şablonlarda fon fərqlidir).
   ───────────────────────────────────────────────────────────────────────── */

export default function OrderLegalNote({ lang = 'az', color, linkColor = LEGAL_LINK, style }) {
  const n = legalUi(lang).orderNote
  const link = (id, label) => (
    <a
      href={legalDoc(id).path} target="_blank" rel="noopener"
      style={{ color: linkColor, textDecoration: 'underline', textUnderlineOffset: 3 }}
    >
      {label}
    </a>
  )
  return (
    <p style={{
      margin: '10px auto 0', maxWidth: 340, fontSize: 11, lineHeight: 1.55,
      letterSpacing: 0, textTransform: 'none', textAlign: 'center', color, ...style,
    }}>
      {n.pre}{link('terms', n.terms)}{n.mid}{link('privacy', n.privacy)}{n.post}
    </p>
  )
}

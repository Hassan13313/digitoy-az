import { Component } from 'react'
import { trackTemplateError } from './templateAnalytics'

/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE BOUNDARY — "broken template" müdafiəsi.

   Şablon komponenti render zamanı çöksə (throw), React bütün ağacı söndürür
   və qonaq AĞ EKRAN görür. Bu sərhəd həmin halı tutur və `fallback`-i
   (default şablon = simple-luxury) render edir.

   Beləliklə validation layer tam olur:
     etibarsız id  → resolveTemplateId (templateConfig)
     nasaz komponent → TemplateBoundary (bu fayl)
   ───────────────────────────────────────────────────────────────────────── */
export default class TemplateBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    /* Analitika bayrağı bağlıdırsa no-op; konsola həmişə yazılır ki,
       daxili testdə problem gizli qalmasın. */
    trackTemplateError(this.props.templateId, error?.message)
    console.error(`[Template] "${this.props.templateId}" render xətası — default şablona keçilir:`, error)
  }

  /* Şablon dəyişəndə sərhədi sıfırla (məs. preview route-da id dəyişdi) */
  componentDidUpdate(prevProps) {
    if (prevProps.templateId !== this.props.templateId && this.state.failed) {
      this.setState({ failed: false })
    }
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}

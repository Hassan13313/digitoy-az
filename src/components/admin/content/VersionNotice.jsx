import { Button, Notice } from '../v2/adminUi'
import { TEMPLATE_VERSION_LEGACY, TEMPLATE_VERSION_CURRENT } from '../../../templates/legacy/registry'

/* Şablon versiyası: köhnə dizayndakı dəvətnaməni müştərinin razılığı ilə yeniyə
   keçirmək (və lazım olsa geri qaytarmaq) — iki addımlı təsdiq */
export default function VersionNotice({ legacy, state, setState, onSwitch }) {
  const target = legacy ? TEMPLATE_VERSION_CURRENT : TEMPLATE_VERSION_LEGACY
  const action = legacy ? 'Yeni dizayna keçir' : 'Köhnə dizayna qaytar'
  return (
    <Notice
      tone={legacy ? 'warning' : 'info'}
      title={legacy ? 'Bu dəvətnamə köhnə dizayndadır' : 'Yeni dizayn'}
    >
      <p className="text-[13px] leading-snug">
        {legacy
          ? 'Müştəri dəvətnaməni premium redizayndan əvvəl təsdiqləyib, ona görə köhnə görünüşdə saxlanılır. Yeni dizayna yalnız müştərinin razılığı ilə keçirin — qonaqlar dəyişikliyi dərhal görəcək.'
          : 'Dəvətnamə yeni dizayndadır. Müştəri köhnə görünüşü istəsə geri qaytarmaq olar.'}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {state.confirm ? (
          <>
            <Button size="sm" onClick={() => onSwitch(target)} disabled={state.busy}>
              {state.busy ? 'Dəyişdirilir…' : `Bəli, ${action.toLocaleLowerCase('az')}`}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setState((s) => ({ ...s, confirm: false }))} disabled={state.busy}>Ləğv et</Button>
          </>
        ) : (
          <Button size="sm" variant={legacy ? 'primary' : 'ghost'} onClick={() => setState((s) => ({ ...s, confirm: true, error: '' }))}>
            {action}
          </Button>
        )}
        {state.error && <span role="alert" className="text-[13px] text-[#B42318]">{state.error}</span>}
      </div>
    </Notice>
  )
}

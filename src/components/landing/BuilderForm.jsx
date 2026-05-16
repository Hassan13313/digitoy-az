import { useState } from 'react'
import { Heart, Diamond, Cake, Briefcase, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { DRESS_CODE_PALETTES, EVENT_TYPES } from '../../data/constants'
import t from '../../data/translations'

const EVENT_ICONS = { toy: Heart, nishan: Diamond, birthday: Cake, corporate: Briefcase }
const TOTAL_STEPS = 5

function Label({ children, required }) {
  return (
    <label className="block text-[10px] tracking-[0.22em] uppercase text-brown-muted mb-3 font-medium">
      {children} {required && <span className="text-gold">*</span>}
    </label>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`luxury-input ${className}`}
    />
  )
}

function Textarea({ ...props }) {
  return (
    <textarea
      {...props}
      rows={5}
      className="w-full border-0 border-b border-beige-dark bg-transparent text-ink text-sm px-0 py-3 focus:outline-none focus:border-gold transition-colors duration-300 placeholder:text-brown-muted/40 resize-none rounded-none"
    />
  )
}

export default function BuilderForm({ lang, initialData, onSubmit }) {
  const tr = t[lang]
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState({})

  const set = (key, val) => {
    setData((d) => ({ ...d, [key]: val }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const steps = [
    tr.step1_title, tr.step2_title, tr.step3_title,
    tr.step4_title, tr.step5_title,
  ]

  const validate = () => {
    const e = {}
    if (step === 1) {
      if (!data.brideName.trim()) e.brideName = true
      if (!data.groomName.trim()) e.groomName = true
      if (!data.date) e.date = true
      if (!data.time) e.time = true
    }
    if (step === 2) {
      if (!data.venueName.trim()) e.venueName = true
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (validate()) setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  const prev = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = () => {
    if (validate()) onSubmit(data)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center mb-14">
        {steps.map((title, i) => {
          const n = i + 1
          const done = n < step
          const active = n === step
          return (
            <div key={n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-7 h-7 flex items-center justify-center text-[10px] font-medium transition-all duration-300 ${
                    done
                      ? 'bg-gold text-white'
                      : active
                      ? 'border border-gold text-gold bg-transparent'
                      : 'border border-beige-dark text-brown-muted/40 bg-transparent'
                  }`}
                >
                  {done ? <Check size={11} strokeWidth={2} /> : n}
                </div>
                <span className={`hidden sm:block text-[9px] tracking-[0.12em] uppercase text-center max-w-[56px] leading-tight ${active ? 'text-gold' : 'text-brown-muted/50'}`}>
                  {title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-all duration-500 ${done ? 'step-line-active' : 'bg-beige-dark/60'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="bg-cream border border-beige-dark/60 px-10 py-12">
        <h3 className="font-serif text-xl text-ink mb-10 font-light tracking-tight">{steps[step - 1]}</h3>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <Label>{tr.event_type || 'Mərasim növü'}</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                {EVENT_TYPES.map(({ id }) => {
                  const Icon = EVENT_ICONS[id]
                  const label = tr[`event_${id}`]
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set('eventType', id)}
                      className={`flex flex-col items-center gap-2.5 py-5 border transition-all duration-200 ${
                        data.eventType === id
                          ? 'border-gold bg-gold/[0.04] text-gold'
                          : 'border-beige-dark/70 text-brown-muted/70 hover:border-gold/40 hover:text-brown-muted'
                      }`}
                    >
                      <Icon size={16} strokeWidth={1.5} />
                      <span className="text-[10px] tracking-[0.12em] uppercase">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <Label required>{tr.bride_label}</Label>
                <Input
                  value={data.brideName}
                  onChange={(e) => set('brideName', e.target.value)}
                  placeholder="Leyla"
                  className={errors.brideName ? 'border-b-red-300' : ''}
                />
              </div>
              <div>
                <Label required>{tr.groom_label}</Label>
                <Input
                  value={data.groomName}
                  onChange={(e) => set('groomName', e.target.value)}
                  placeholder="Murad"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <Label required>{tr.date_label}</Label>
                <Input
                  type="date"
                  value={data.date}
                  onChange={(e) => set('date', e.target.value)}
                />
              </div>
              <div>
                <Label required>{tr.time_label}</Label>
                <Input
                  type="time"
                  value={data.time}
                  onChange={(e) => set('time', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <Label required>{tr.venue_label}</Label>
              <Input
                value={data.venueName}
                onChange={(e) => set('venueName', e.target.value)}
                placeholder="Şahmar Restoran, Bakı"
              />
            </div>
            <div>
              <Label>{tr.maps_label}</Label>
              <Input
                value={data.googleMapsUrl}
                onChange={(e) => set('googleMapsUrl', e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
            <div>
              <Label>{tr.waze_label}</Label>
              <Input
                value={data.wazeUrl}
                onChange={(e) => set('wazeUrl', e.target.value)}
                placeholder="https://waze.com/ul?..."
              />
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <Label>{tr.palette_label}</Label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                {DRESS_CODE_PALETTES.map((pal) => (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => set('dressCodePalette', pal.id)}
                    className={`text-left p-5 border transition-all duration-200 ${
                      data.dressCodePalette === pal.id
                        ? 'border-gold bg-gold/[0.04]'
                        : 'border-beige-dark/60 hover:border-gold/35'
                    }`}
                  >
                    <div className="flex gap-2 mb-4">
                      {pal.colors.map((c) => (
                        <div
                          key={c}
                          className="w-5 h-5 rounded-full border border-white/50 shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-ink tracking-wide">{pal.label[lang]}</p>
                    <p className="text-[11px] text-brown-muted mt-1 leading-relaxed font-light">{pal.description[lang]}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>{tr.dresscode_desc_label}</Label>
              <Textarea
                value={data.dressCodeDescription}
                onChange={(e) => set('dressCodeDescription', e.target.value)}
                placeholder={tr.dresscode_placeholder}
              />
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <Label>{tr.seating_label}</Label>
              <Textarea
                value={data.seatingPlan}
                onChange={(e) => set('seatingPlan', e.target.value)}
                placeholder={tr.seating_placeholder}
                rows={7}
              />
              <p className="text-[11px] text-brown-muted/70 mt-3 leading-relaxed tracking-wide font-light">{tr.seating_help}</p>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <Label>{tr.gallery_label}</Label>
              <Input
                value={data.galleryLink}
                onChange={(e) => set('galleryLink', e.target.value)}
                placeholder={tr.gallery_placeholder}
              />
              <p className="text-[11px] text-brown-muted/70 mt-3 leading-relaxed tracking-wide font-light">{tr.gallery_help}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prev}
          disabled={step === 1}
          className="flex items-center gap-2 px-7 py-3.5 border border-beige-dark/70 text-brown-muted text-[10px] tracking-[0.22em] uppercase hover:border-gold/50 hover:text-gold transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={13} strokeWidth={1.5} />
          {tr.btn_prev}
        </button>

        {step < TOTAL_STEPS ? (
          <button
            onClick={next}
            className="flex items-center gap-2 btn-gold"
          >
            {tr.btn_next}
            <ChevronRight size={13} strokeWidth={1.5} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="btn-gold"
          >
            {tr.btn_create}
          </button>
        )}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// Necə işləyir? (#how-it-works) — 4 addımlı proses, qızılı xəttlə bağlanır
// İstifadə: <HowItWorks lang={lang} />
// ════════════════════════════════════════════════════════════════
import { motion, MotionConfig } from 'framer-motion';
import { ArrowRight, Clock, Gem, Link2, PenLine } from 'lucide-react';
import t from '../../../data/translations';
import { Button, Container, Eyebrow, Ornament, WhatsAppIcon } from './ui';
import { scrollToSection } from './scroll';

const EASE = [0.22, 1, 0.36, 1];

const getSteps = (x) => [
  {
    icon: Gem,
    title: x.step1Title ?? 'Paket Seçin',
    text: x.step1Text ?? 'Tədbirinizə uyğun imkanları müqayisə edin və sizə ən uyğun paketi seçin.',
    time: x.step1Time ?? '1 dəqiqə',
  },
  {
    icon: PenLine,
    title: x.step2Title ?? 'Formu Doldurun',
    text: x.step2Text ?? 'Ad-soyadlar, tarix, məkan, geyim tərzi, foto qalereya — hamısı addım-addım asancasına.',
    time: x.step2Time ?? '5 dəqiqə',
  },
  {
    icon: WhatsAppIcon,
    title: x.step3Title ?? 'WhatsApp-a Göndərin',
    text: x.step3Text ?? 'Hazır link avtomatik yaranır. Biryolluğa kopyalayıb qonaqlarınıza paylaşın.',
    time: x.step3Time ?? 'Anında',
  },
  {
    icon: Link2,
    title: x.step4Title ?? 'Linki Alın',
    text: x.step4Text ?? 'Qonaqlar linki açanda zərif dəvətnaməni görür — geri sayım, naviqasiya, proqram, hamısı.',
    time: x.step4Time ?? 'Qurulmadan hazır',
    final: true,
  },
];

/** onCta — «Paketlərə bax» (verilməsə #builder-section-a sürüşür) */
export default function HowItWorks({ lang = 'az', onCta }) {
  const x = t[lang] ?? t.az ?? {};
  const steps = getSteps(x);

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="how-it-works"
        aria-labelledby="how-title"
        className="relative overflow-hidden bg-cream py-24 sm:py-28 lg:py-36"
      >
        {/* incə üst xətt — Hero-dan ayırır */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 mx-auto h-px max-w-[1200px] bg-gold-line opacity-40"
        />

        <Container>
          {/* ── Başlıq: desktopda iki sütun ─────────────────────── */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16">
            <div>
              <Eyebrow>{x.howEyebrow ?? 'Addım-addım'}</Eyebrow>
              <h2
                id="how-title"
                className="mt-4 font-serif text-[2.5rem] font-medium leading-[1.05] tracking-[-0.01em] text-ink sm:text-5xl lg:text-[3.75rem]"
              >
                {x.howTitle ?? 'Necə İşləyir?'}
              </h2>
              <Ornament align="left" className="mt-6" />
            </div>
            <div className="lg:pb-2">
              <p className="text-base leading-relaxed text-brown-dark sm:text-lg">
                {x.howSubtitle ?? '4 sadə addımda zərif dəvətnaməniz hazırdır'}
              </p>
              <p className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-gold/35 bg-white/70 px-4 py-2 text-[13px] text-brown-dark">
                <Clock className="h-4 w-4 text-gold-deep" strokeWidth={1.6} aria-hidden="true" />
                {x.howTotalLabel ?? 'Ümumi vaxt:'}{' '}
                <span className="font-semibold text-ink">{x.howTotal ?? '~6 dəqiqə'}</span>
              </p>
            </div>
          </div>

          {/* ── Addımlar ─────────────────────────────────────────── */}
          <ol className="relative mt-16 grid gap-12 lg:mt-24 lg:grid-cols-4 lg:gap-8">
            {/* Birləşdirici xətt: mobildə şaquli, desktopda üfüqi. Görünəndə "çəkilir". */}
            <motion.span
              aria-hidden="true"
              className="absolute bottom-6 left-7 top-7 w-px origin-top bg-gradient-to-b from-gold/70 via-gold/45 to-gold/10 lg:hidden"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.6, ease: EASE }}
            />
            <motion.span
              aria-hidden="true"
              className="absolute left-7 right-[12%] top-8 hidden h-px origin-left bg-gradient-to-r from-gold/70 via-gold/45 to-gold/15 lg:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.6, ease: EASE }}
            />

            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li
                  key={i}
                  className="relative grid grid-cols-[56px_minmax(0,1fr)] items-start gap-x-5 lg:block"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: EASE }}
                >
                  {/* medalyon */}
                  <div className="relative z-10 flex items-center lg:justify-between">
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-full ring-1 ring-inset ${
                        s.final
                          ? 'bg-espresso-grad text-gold-light shadow-lift ring-gold/40'
                          : 'bg-white text-gold-deep shadow-soft ring-gold/35'
                      }`}
                    >
                      <Icon className="h-[22px] w-[22px]" strokeWidth={1.4} aria-hidden="true" />
                    </span>
                    {/* böyük dekorativ rəqəm (yalnız desktop) */}
                    <span
                      aria-hidden="true"
                      className="hidden bg-cream pl-3 pr-1 font-serif text-[64px] font-normal italic leading-none lining-nums text-gold-light lg:block"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="lg:mt-8 lg:pr-4">
                    <p className="text-[11px] font-semibold uppercase tracking-label text-gold-deep">
                      {x.howStep ?? 'Addım'} <span className="lining-nums">{String(i + 1).padStart(2, '0')}</span>
                    </p>
                    <h3 className="mt-2 font-serif text-[1.75rem] font-medium leading-tight text-ink lg:text-[1.55rem]">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-[34ch] text-[15px] leading-[1.7] text-brown-dark">{s.text}</p>
                    <p
                      className={`mt-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                        s.final ? 'bg-espresso text-gold-light' : 'bg-gold-mist text-gold-deep'
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                      {s.time}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>

          <div className="mt-16 flex justify-center lg:mt-20">
            <Button variant="outline" size="lg" onClick={onCta ?? (() => scrollToSection('builder-section'))}>
              {x.howCta ?? 'Paketlərə bax'}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
          </div>
        </Container>
      </section>
    </MotionConfig>
  );
}

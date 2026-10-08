// ════════════════════════════════════════════════════════════════
// FAQ (#faq) — akkordeon, eyni anda yalnız bir sual açıq
// İstifadə:
//   <FAQ lang={lang} whatsappUrl="https://wa.me/994XXXXXXXXX" />
//   <FAQ lang={lang} items={[{ q: '...', a: '...' }, ...]} />
// Suallar t[lang].faq massivindən ({ q, a }) gəlir; yoxdursa aşağıdakı nümunələr istifadə olunur.
// ════════════════════════════════════════════════════════════════
import { useEffect, useId, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import t from '../../../data/translations';
import { Container, Eyebrow, Ornament, WhatsAppIcon } from './ui';

// Cavablar saytdakı məlumatlara əsaslanır. `todo: true` olanların cavabını
// MÜTLƏQ öz mətninizlə əvəz edin (t[lang].faq) — onları mən bilmirəm.
const DEFAULT_FAQ = [
  {
    q: 'Rəqəmsal dəvətnamə necə sifariş edilir?',
    a: 'Paketinizi seçin, formu doldurun (ad-soyadlar, tarix, məkan, geyim tərzi və s.) — dəvətnamənizin linki avtomatik yaranır. Bütün proses təxminən 5–6 dəqiqə çəkir.',
  },
  { q: 'Dəvətnamənin istifadə müddəti nə qədərdir?', a: 'Cavabı öz mətninizlə əvəz edin.', todo: true },
  {
    q: 'Qonaqlar dəvətnaməni necə açır?',
    a: 'Qonaqlar WhatsApp və ya istənilən mesajlaşma vasitəsi ilə göndərdiyiniz linkə toxunur — dəvətnamə telefonun brauzerində dərhal açılır, heç bir tətbiq yükləmək lazım deyil.',
  },
  {
    q: 'Hazırlıq müddəti nə qədərdir?',
    a: 'Formu doldurmaq təxminən 5 dəqiqə çəkir. Form tamamlanan kimi link avtomatik yaranır və paylaşmağa hazır olur.',
  },
  { q: 'Eyni link neçə nəfər tərəfindən açıla bilər?', a: 'Cavabı öz mətninizlə əvəz edin.', todo: true },
  {
    q: 'İştirak Təsdiqi sistemi necə işləyir?',
    a: 'Qonaqlar dəvətnamədə «Gələcəyəm» və ya «Gələ bilmirəm» seçir və gələcək qonaq sayını qeyd edir. Siz cavabları real vaxtda görürsünüz. Bu funksiya VİP və Premium paketlərdə mövcuddur.',
  },
  { q: 'Dəvətnamənin məlumatlarını sonra dəyişmək olarmı?', a: 'Cavabı öz mətninizlə əvəz edin.', todo: true },
  { q: 'Neçə dil dəstəklənir?', a: 'Cavabı öz mətninizlə əvəz edin.', todo: true },
  { q: 'Ödəniş necə edilir?', a: 'Cavabı öz mətninizlə əvəz edin.', todo: true },
  { q: 'Dəvətnamə neçə müddət aktiv qalır?', a: 'Cavabı öz mətninizlə əvəz edin.', todo: true },
];

/** jsonLd — FAQPage strukturlaşdırılmış məlumatı. Digitoy-da serverdədir (seo.php), default söndürülüb ki, təkrarlanmasın. */
export default function FAQ({ lang = 'az', items, whatsappUrl = 'https://wa.me/994000000000', jsonLd: withJsonLd = false }) {
  const x = t[lang] ?? t.az ?? {};
  const source = items ?? x.faq ?? DEFAULT_FAQ;
  // Cavabı olmayan (todo) suallar canlı saytda gizlənir, yalnız dev-də görünür
  const list = import.meta.env?.PROD ? source.filter((i) => !i.todo) : source;
  const uid = useId();
  const [open, setOpen] = useState(0);

  useEffect(() => {
    if (import.meta.env?.DEV && source.some((i) => i.todo)) {
      console.warn('[FAQ] Bəzi sualların cavabı nümunə mətndir — t[lang].faq əlavə edin.');
    }
  }, [source]);

  // Google üçün FAQPage strukturlaşdırılmış məlumat (yalnız real cavablar)
  const jsonLd = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: list
          .filter((i) => !i.todo)
          .map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
      }),
    [list],
  );

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-cream py-24 sm:py-28 lg:py-36">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-[1200px] bg-gold-line opacity-40"
      />
      {withJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}

      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-20">
          {/* ── Sol: başlıq + əlaqə (desktopda yapışqan) ─────────── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>{x.faqEyebrow ?? 'FAQ'}</Eyebrow>
            <h2
              id="faq-title"
              className="mt-4 font-serif text-[2.5rem] font-medium leading-[1.05] tracking-[-0.01em] text-ink [text-wrap:balance] sm:text-5xl lg:text-[3.5rem]"
            >
              {x.faqTitle ?? 'Tez-tez verilən suallar'}
            </h2>
            <Ornament align="left" className="mt-6" />

            {/* cavab tapmayanlar üçün — yalnız desktopda burada, mobildə siyahının altında */}
            <HelpCard x={x} whatsappUrl={whatsappUrl} className="mt-10 hidden lg:block" />
          </div>

          {/* ── Sağ: akkordeon ───────────────────────────────────── */}
          <div>
            <ul className="border-t border-gold/20">
              {list.map((item, i) => {
                const isOpen = open === i;
                const btnId = `${uid}-q-${i}`;
                const panelId = `${uid}-a-${i}`;
                return (
                  <li key={i} className="border-b border-gold/20">
                    <h3>
                      <button
                        id={btnId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpen(isOpen ? -1 : i)}
                        className="group flex w-full items-center gap-5 py-6 text-left sm:py-7"
                      >
                        <span
                          aria-hidden="true"
                          className={`hidden w-7 shrink-0 font-serif text-lg italic lining-nums tabular-nums transition-colors duration-300 sm:block ${
                            isOpen ? 'text-gold-deep' : 'text-gold/70'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`flex-1 text-[16px] font-medium leading-snug transition-colors duration-300 sm:text-[17px] ${
                            isOpen ? 'text-ink' : 'text-brown-dark group-hover:text-ink'
                          }`}
                        >
                          {item.q}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-500 ease-luxe ${
                            isOpen
                              ? 'rotate-45 bg-espresso text-gold-light'
                              : 'bg-gold-mist/80 text-gold-deep group-hover:bg-gold-mist'
                          }`}
                        >
                          <Plus className="h-4 w-4" strokeWidth={1.8} />
                        </span>
                      </button>
                    </h3>
                    {/* grid-rows 0fr → 1fr: JS ölçməsiz hamar açılma */}
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-luxe ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden" inert={!isOpen ? true : undefined}>
                        <p className="max-w-[60ch] pb-7 pr-14 text-[15px] leading-[1.75] text-brown-dark sm:pl-12">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <HelpCard x={x} whatsappUrl={whatsappUrl} className="mt-10 lg:hidden" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function HelpCard({ x, whatsappUrl, className = '' }) {
  return (
    <div className={`rounded-3xl bg-white/80 p-6 shadow-soft ring-1 ring-gold/20 sm:p-7 ${className}`}>
      <p className="font-serif text-2xl leading-tight text-ink">
        {x.faqHelpTitle ?? 'Sualınızın cavabını tapmadınız?'}
      </p>
      <p className="mt-2 text-[14.5px] leading-relaxed text-brown-dark">
        {x.faqHelpText ?? 'WhatsApp-da yazın — sizə şəxsən kömək edək.'}
      </p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-5 inline-flex h-12 items-center gap-2.5 rounded-full bg-espresso-grad px-6 text-[11px] font-semibold uppercase tracking-label text-cream shadow-lift ring-1 ring-inset ring-gold/30 transition-transform duration-300 ease-luxe hover:-translate-y-0.5"
      >
        <WhatsAppIcon className="h-[18px] w-[18px] text-gold-light" />
        {x.faqHelpCta ?? 'WhatsApp ilə yazın'}
      </a>
    </div>
  );
}

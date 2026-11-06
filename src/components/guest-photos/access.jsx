// ════════════════════════════════════════════════════════════════
// Albomun məxfiliyi (2026-11-06) — YALNIZ görünüş
//   GalleryLocked · ViewLinkPanel
//   Albomu yalnız idarəçi və müştərinin paylaşdığı baxış linkinin sahibi
//   görür (bax api/gallery_auth.php › galleryViewToken).
// ════════════════════════════════════════════════════════════════
import { useState } from 'react';
import { Check, Copy, ImagePlus, Link2, Lock } from 'lucide-react';
import { Btn } from './shared';

/**
 * Baxış linki olmayan ziyarətçi üçün: albom bağlıdır, şəkil göndərmək açıqdır.
 * @param {object} p
 * @param {()=>void} [p.onUpload]
 */
export function GalleryLocked({ onUpload, lang = 'az' }) {
  return (
    <section
      lang={lang}
      role="status"
      className="mx-auto flex max-w-[520px] flex-col items-center rounded-[28px] bg-white/70 px-6 py-14 text-center ring-1 ring-inset ring-gold/30"
    >
      <span className="grid h-16 w-16 place-items-center rounded-full bg-gold-mist/70 ring-1 ring-inset ring-gold/40">
        <Lock className="h-7 w-7 text-gold-deep" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-serif text-[28px] leading-tight text-ink">Albom məxfidir</h1>
      <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-brown-dark">
        Qonaq şəkillərinə yalnız dəvət sahibinin paylaşdığı link ilə baxmaq olar.
        Şəkil və videolarınızı isə göndərə bilərsiniz.
      </p>
      {onUpload && (
        <Btn variant="primary" size="lg" icon={ImagePlus} onClick={onUpload} className="mt-7">
          Şəkil göndər
        </Btn>
      )}
    </section>
  );
}

/**
 * İdarəçi üçün: albomu kimlə istəsə paylaşsın deyə baxış linki.
 * @param {object} p
 * @param {string} p.url
 */
export function ViewLinkPanel({ url, lang = 'az' }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }).catch(() => { /* icazə yoxdur — link sahədə görünür, əl ilə kopyalanır */ });
  };
  return (
    <section lang={lang} className="rounded-2xl bg-white/80 px-4 py-3.5 ring-1 ring-inset ring-gold/30">
      <h2 className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
        <Link2 className="h-[18px] w-[18px] shrink-0 text-gold-deep" strokeWidth={1.6} aria-hidden="true" />
        Albomun baxış linki
      </h2>
      <p className="mt-1 text-[13px] leading-relaxed text-brown-dark">
        Qonaqlar şəkil göndərir, amma albomu yalnız bu linki göndərdiyiniz şəxslər görür.
        Linklə baxmaq və endirmək olar, silmək olmaz.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={url}
          aria-label="Albomun baxış linki"
          onFocus={(e) => e.target.select()}
          className="h-11 min-w-0 flex-1 rounded-full bg-cream px-4 text-[12.5px] text-brown-dark ring-1 ring-inset ring-gold/30"
        />
        <Btn variant="ghost" size="sm" icon={copied ? Check : Copy} onClick={copy}>
          {copied ? 'Kopyalandı' : 'Kopyala'}
        </Btn>
      </div>
    </section>
  );
}

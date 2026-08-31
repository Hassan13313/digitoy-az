#!/usr/bin/env python3
"""
DIGITOY.AZ — Deploy ZIP qurucusu

    python scripts/make-deploy-zip.py <etiket>
    (ondan əvvəl: npm run build)

ZIP dist/ qovluğunun məzmunundan qurulur və birbaşa public_html/ içinə
açılmaq üçün nəzərdə tutulub.

TƏHLÜKƏSİZLİK QAYDALARI (buradakı istisnalar TƏSADÜFİ deyil):

  • config.local.php / config.production.php  → ZIP-Ə DÜŞMÜR.
    Bunlar ADMIN_KEY və verilənlər bazası parolunu saxlayır. Serverdəki
    nüsxə HƏQİQƏT MƏNBƏYİDİR — deploy onu heç vaxt üstündən yazmamalıdır.

  • uploads/ içindəki media → ZIP-Ə DÜŞMÜR.
    Yalnız uploads/.htaccess daxil edilir. ZIP açılışı mövcud faylları
    silmir, ona görə real müştəri mediası toxunulmaz qalır.

  • Repo zibili (təsadüfən yaradılmış boş fayllar, .claude-flow və s.)
    → ZIP-Ə DÜŞMÜR.
"""
import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')

# Serverdəki nüsxə həqiqət mənbəyidir — üstündən yazma
SECRET_FILES = {'config.local.php', 'config.production.php'}

# Repo zibili / yalnız-lokal artefaktlar
JUNK_DIRS  = {'.claude-flow', '_logs', 'node_modules', '.git'}
JUNK_NAMES = {'$mime', 'qiymetlendirilebilir', 'desktop.ini', '.DS_Store'}


def is_junk(rel: str) -> bool:
    parts = rel.replace('\\', '/').split('/')
    name = parts[-1]

    if any(p in JUNK_DIRS for p in parts):
        return True
    if name in JUNK_NAMES or name in SECRET_FILES:
        return True
    # api/api kimi təsadüfi iç-içə kopyalar
    if len(parts) >= 2 and parts[0] == 'api' and parts[1] == 'api':
        return True
    # Uzantısı olmayan 0 baytlıq fayllar — pozulmuş shell əmrlərinin qalığı
    full = os.path.join(DIST, rel)
    if '.' not in name and os.path.isfile(full) and os.path.getsize(full) == 0:
        return True
    return False


def main() -> int:
    if not os.path.isdir(DIST):
        print('dist/ tapılmadı — əvvəlcə `npm run build` işlədin', file=sys.stderr)
        return 1

    label = sys.argv[1] if len(sys.argv) > 1 else 'deploy'
    out = os.path.join(os.path.dirname(ROOT), f'digitoy-deploy-{label}.zip')

    added, skipped = [], []
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for base, dirs, files in os.walk(DIST):
            dirs[:] = [d for d in dirs if d not in JUNK_DIRS]
            for f in files:
                full = os.path.join(base, f)
                rel = os.path.relpath(full, DIST).replace('\\', '/')
                if is_junk(rel):
                    skipped.append(rel)
                    continue
                z.write(full, rel)
                added.append(rel)

    print(f'ZIP: {out}')
    print(f'  {len(added)} fayl əlavə edildi, {len(skipped)} atıldı')
    for s in sorted(skipped):
        print(f'    atıldı: {s}')

    # Təhlükəsizlik yoxlaması — sirr sızıbsa ZIP-i sil
    with zipfile.ZipFile(out) as z:
        leaked = [n for n in z.namelist() if os.path.basename(n) in SECRET_FILES]
    if leaked:
        os.remove(out)
        print(f'DAYANDIRILDI: sirr faylı ZIP-ə düşdü: {leaked}', file=sys.stderr)
        return 2

    print('  ✓ sirr faylı yoxdur')
    return 0


if __name__ == '__main__':
    sys.exit(main())

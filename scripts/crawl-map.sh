#!/usr/bin/env bash
# ══════════════════════════════════════════════════
# DIGITOY.AZ — Marşrut xəritəsi (200/301/404) + SEO meta yoxlaması
#
# Deploy-dan sonra işlədilir: hər marşrut ailəsinin statusunu, yönləndirmə
# zəncirini və indekslənmə vəziyyətini bir cədvəldə göstərir.
#
#   BASE=https://digitoy.az SLUG=aytekin-ve-ferid bash scripts/crawl-map.sh
#
# YALNIZ OXUYUR — heç bir POST/DELETE göndərmir.
# ══════════════════════════════════════════════════
set -u
BASE="${BASE:-https://digitoy.az}"
SLUG="${SLUG:-aytekin-ve-ferid}"

hdr() { printf '\n\033[1m%s\033[0m\n' "$1"; }

# probe <yol> [gözlənilən_status] [gözlənilən_robots]
probe() {
  local path="$1" wantCode="${2:-}" wantRobots="${3:-}"
  local out; out=$(curl -s -m 30 -o /tmp/_crawl.html -w '%{http_code}|%{redirect_url}|%{size_download}|%{time_total}' "$BASE$path")
  local code="${out%%|*}"; local rest="${out#*|}"
  local redir="${rest%%|*}"; rest="${rest#*|}"
  local size="${rest%%|*}"; local time="${rest#*|}"

  local robots canon
  robots=$(grep -oP '(?<=name="robots" content=")[^"]*' /tmp/_crawl.html 2>/dev/null | head -1)
  canon=$(grep -oP '(?<=rel="canonical" href=")[^"]*' /tmp/_crawl.html 2>/dev/null | head -1)

  local mark=' '
  [ -n "$wantCode" ] && { [ "$code" = "$wantCode" ] && mark='✓' || mark='✗'; }
  if [ -n "$wantRobots" ]; then
    case "$robots" in *"$wantRobots"*) : ;; *) mark='✗';; esac
  fi

  printf '  %s %-38s %s  %6sB %5.2fs  %s%s\n' \
    "$mark" "$path" "$code" "$size" "$time" \
    "${robots:+robots=$robots}" "${canon:+  canon=${canon#https://digitoy.az}}"
  [ -n "$redir" ] && printf '      → %s\n' "$redir"
}

hdr "1) İCTİMAİ SƏHİFƏLƏR — indekslənməlidir"
probe "/"                      200 "index, follow"
probe "/templates"             200 "index, follow"
probe "/demo"                  200 "index, follow"

hdr "2) DƏVƏTNAMƏ MARŞRUTLARI — işləməli, amma indekslənməməli"
probe "/invite/$SLUG"                   200 "noindex"
probe "/invite/$SLUG/foto"              200 "noindex"
probe "/invite/$SLUG/qalereya-idare"    200 "noindex"
probe "/invite/$SLUG?view=live"         200 "noindex"
probe "/invite/$SLUG/"                  200 "noindex"

hdr "3) DƏVƏTNAMƏ — mövcud olmayan slug (SPA 200 qaytarır, JS 'tapılmadı' göstərir)"
probe "/invite/bele-bir-toy-yoxdur-12345"  200 "noindex"

hdr "4) ADMİN — indekslənməməli"
probe "/admin"           200 "noindex"
probe "/admin/photos"    200 "noindex"

hdr "5) STATİK SEO FAYLLARI"
probe "/robots.txt"        200
probe "/sitemap.xml"       200
probe "/llms.txt"          200
probe "/site.webmanifest"  200
probe "/favicon.ico"       200
probe "/og-image.jpg"      200

hdr "6) API — ictimai oxuma vs qorunan"
probe "/api/health.php"                       200
probe "/api/get_photos.php?slug=$SLUG"        200
probe "/api/get_invitation.php?slug=$SLUG"    200
probe "/api/gallery_link.php?slug=$SLUG"      401
probe "/api/media_audit.php"                  401
probe "/api/config.php"                       403
probe "/api/gallery_auth.php"                 403
probe "/api/slug_alloc.php"                   403
probe "/api/media_store.php"                  403

hdr "7) NAMƏLUM MARŞRUTLAR — SPA 200 verir, amma noindex olmalıdır"
probe "/bele-sehife-yoxdur"     200 "noindex"
probe "/invite"                 200 "noindex"
probe "/demo/template/royal-gold" 200 "noindex"

hdr "8) SİLİNMİŞ FAYL"
probe "/icons.svg"   200 "noindex"

#!/usr/bin/env bash
# ══════════════════════════════════════════════════
# DIGITOY.AZ — Qalereya upload/delete regression testləri
#
# 2026-08-31 hadisəsinin təkrarlanmaması üçün: hər test o vaxt real
# olaraq pozulmuş bir davranışı qoruyur.
#
# İşlət:
#   php -d upload_max_filesize=100M -d post_max_size=104M -S 127.0.0.1:8099 -t public/ &
#   BASE=http://127.0.0.1:8099 MEDIA=/path/to/fixtures bash tests/gallery_e2e_test.sh
# ══════════════════════════════════════════════════
set -u

BASE="${BASE:-http://127.0.0.1:8099}"
MEDIA="${MEDIA:?MEDIA qovluğu (test fayllları) təyin edilməlidir}"
PHP="${PHP:-php}"
SLUG="${SLUG:-zz-e2e-test}"
OTHER_SLUG="zz-e2e-other"

pass=0; fail=0
ok()   { pass=$((pass+1)); printf '  ok   %s\n' "$1"; }
bad()  { fail=$((fail+1)); printf '  FAIL %s\n     gözlənilən: %s\n     alınan:     %s\n' "$1" "$2" "$3"; }
check(){ [ "$2" = "$3" ] && ok "$1" || bad "$1" "$2" "$3"; }
has()  { case "$2" in *"$3"*) ok "$1";; *) bad "$1" "içərisində '$3'" "$2";; esac; }

# Qalereya tokenlərini yarat (admin ADMIN_KEY-i ilə imzalanır)
mint() {
  "$PHP" -r '
    require_once "public/api/config.local.php";
    require_once "public/api/gallery_auth.php";
    $t = mintGalleryToken($argv[1]);
    echo $t["token"];
  ' "$1"
}

TOKEN=$(mint "$SLUG")
OTHER_TOKEN=$(mint "$OTHER_SLUG")

req() { # req <outfile> <curl args...>
  local out="$1"; shift
  curl -s -m 300 -o "$out" -w '%{http_code}' "$@"
}

# mingw-curl MSYS yollarini ";filename=" sintaksisi ile emal ede bilmir,
# ona gore butun kohne fayllar MEDIA (Windows-uslubu yol) icinde saxlanilir
TMP="$MEDIA"; R="$TMP/r.json"

echo
echo "── UPLOAD ──────────────────────────────────────"

code=$(req "$R" -F "slug=$SLUG" -F "photo=@$MEDIA/test_photo.jpg" "$BASE/api/upload_photo.php")
check "foto yüklənir" "200" "$code"
PHOTO_ID=$("$PHP" -r '$j=json_decode(file_get_contents($argv[1]),true); echo $j["id"] ?? "";' "$R")
has "foto üçün thumbnail yaradılır" "$(cat "$R")" "_thumb.jpg"

code=$(req "$R" -F "slug=$SLUG" -F "photo=@$MEDIA/vid_60s.mp4" "$BASE/api/upload_photo.php")
check "60 MB video (≈60 san 1080p) yüklənir" "200" "$code"
VIDEO_ID=$("$PHP" -r '$j=json_decode(file_get_contents($argv[1]),true); echo $j["id"] ?? "";' "$R")

code=$(req "$R" -F "slug=$SLUG" -F "photo=@$MEDIA/vid_iphone.mov" -F "poster=@$MEDIA/test_poster.jpg" "$BASE/api/upload_photo.php")
check "iPhone .mov + poster yüklənir" "200" "$code"
has "video posteri saxlanılır" "$(cat "$R")" "_poster.jpg"
MOV_ID=$("$PHP" -r '$j=json_decode(file_get_contents($argv[1]),true); echo $j["id"] ?? "";' "$R")

code=$(req "$R" -F "slug=$SLUG" -F "photo=@$MEDIA/vid_over.mp4" "$BASE/api/upload_photo.php")
check "95 MB fayl 413 ilə rədd edilir" "413" "$code"
MSG=$("$PHP" -r '$j=json_decode(file_get_contents($argv[1]),true); echo $j["message"] ?? "";' "$R")
has "limit aşımı AYDIN mesaj verir" "$MSG" "Fayl çox böyükdür"
has "daimi xəta kimi işarələnir" "$(cat "$R")" '"permanent":true'

# post_max_size aşımı — REGRESSION: əvvəl yanıldıcı "Valid slug required" idi
"$PHP" -r '$f=fopen($argv[1],"wb"); $c=str_repeat("\0",1048576); for($i=0;$i<110;$i++) fwrite($f,$c); fclose($f);' "$TMP/huge.bin"
code=$(req "$R" -F "slug=$SLUG" -F "photo=@$TMP/huge.bin" "$BASE/api/upload_photo.php")
check "post_max_size aşımı 413 qaytarır" "413" "$code"
has "REGRESSION: 'Valid slug required' DEYİL" "$(cat "$R")" "REQUEST_TOO_LARGE"

printf 'MZ\x90\x00\x03\x00\x00\x00 fake exe' > "$TMP/evil.exe"
code=$(req "$R" -F "slug=$SLUG" -F "photo=@$TMP/evil.exe;filename=innocent.jpg" "$BASE/api/upload_photo.php")
check "icra olunan fayl (uzantı saxtakarlığı) rədd edilir" "415" "$code"

printf '<?php system($_GET["c"]); ?>' > "$TMP/shell.php"
code=$(req "$R" -F "slug=$SLUG" -F "photo=@$TMP/shell.php;filename=shell.php.jpg" "$BASE/api/upload_photo.php")
check "PHP web-shell rədd edilir" "415" "$code"

code=$(req "$R" -F "slug=../../etc" -F "photo=@$MEDIA/test_photo.jpg" "$BASE/api/upload_photo.php")
check "slug-da path traversal rədd edilir" "400" "$code"

echo
echo "── QALEREYA MANİFESTİ ──────────────────────────"

code=$(req "$R" "$BASE/api/get_photos.php?slug=$SLUG")
check "manifest oxunur" "200" "$code"
COUNT=$("$PHP" -r '$j=json_decode(file_get_contents($argv[1]),true); echo count($j["photos"]);' "$R")
check "3 media görünür (thumb/poster ayrıca sayılmır)" "3" "$COUNT"
has "video posteri thumbUrl kimi verilir" "$(cat "$R")" "_poster.jpg"

echo
echo "── DELETE (əsas hadisə) ────────────────────────"

code=$(req "$R" -X POST -H "Content-Type: application/json" \
  -d "{\"slug\":\"$SLUG\",\"id\":\"$PHOTO_ID\"}" "$BASE/api/delete_photo.php")
check "tokensiz silmə 401 ilə rədd edilir" "401" "$code"

code=$(req "$R" -X POST -H "Content-Type: application/json" -H "X-Gallery-Token: $OTHER_TOKEN" \
  -d "{\"slug\":\"$SLUG\",\"id\":\"$PHOTO_ID\"}" "$BASE/api/delete_photo.php")
check "BAŞQA toyun tokeni ilə silmə rədd edilir (IDOR)" "401" "$code"

code=$(req "$R" -X POST -H "Content-Type: application/json" -H "X-Gallery-Token: $TOKEN" \
  -d "{\"slug\":\"$SLUG\",\"id\":\"../../../api/config.php\"}" "$BASE/api/delete_photo.php")
check "silmədə path traversal rədd edilir" "400" "$code"
[ -f public/api/config.php ] && ok "config.php toxunulmayıb" || bad "config.php toxunulmayıb" "mövcud" "SİLİNİB"

code=$(req "$R" -X POST -H "Content-Type: application/json" -H "X-Gallery-Token: $TOKEN" \
  -d "{\"slug\":\"$SLUG\",\"id\":\"$PHOTO_ID\"}" "$BASE/api/delete_photo.php")
check "düzgün token ilə silmə uğurludur" "200" "$code"

# REGRESSION: əsas hadisə — refresh-dən sonra media geri qayıdırdı
req "$R" "$BASE/api/get_photos.php?slug=$SLUG" > /dev/null
RESURRECTED=$("$PHP" -r '
  $j=json_decode(file_get_contents($argv[1]),true);
  foreach($j["photos"] as $p) if($p["id"]===$argv[2]) { echo "BƏLİ"; exit; }
  echo "XEYR";' "$R" "$PHOTO_ID")
check "REGRESSION: refresh-dən sonra media GERİ QAYITMIR" "XEYR" "$RESURRECTED"

[ ! -f "public/uploads/$SLUG/${PHOTO_ID%.*}_thumb.jpg" ] \
  && ok "thumbnail də silinir (orfan qalmır)" \
  || bad "thumbnail də silinir" "yoxdur" "hələ də var"

code=$(req "$R" -X POST -H "Content-Type: application/json" -H "X-Gallery-Token: $TOKEN" \
  -d "{\"slug\":\"$SLUG\",\"id\":\"$PHOTO_ID\"}" "$BASE/api/delete_photo.php")
check "ikiqat silmə idempotentdir (xəta vermir)" "200" "$code"
has "ikiqat silmə 'already' qaytarır" "$(cat "$R")" '"already":true'

code=$(req "$R" -X POST -H "Content-Type: application/json" -H "X-Gallery-Token: $TOKEN" \
  -d "{\"slug\":\"$SLUG\",\"id\":\"$MOV_ID\"}" "$BASE/api/delete_photo.php")
check "video silinir" "200" "$code"
[ ! -f "public/uploads/$SLUG/${MOV_ID%.*}_poster.jpg" ] \
  && ok "video posteri də silinir" \
  || bad "video posteri də silinir" "yoxdur" "hələ də var"

echo
echo "── ADMİN GERİYƏ UYĞUNLUĞU ──────────────────────"
# Admin paneli qalereya tokeni olmadan da işləməyə davam etməlidir
ADMIN_TOKEN=$("$PHP" -r '
  require_once "public/api/config.local.php";
  $iat=time(); $exp=$iat+3600; $p=rtrim(strtr(base64_encode("$iat:$exp"),"+/","-_"),"=");
  echo $p.".".hash_hmac("sha256",$p,ADMIN_KEY);')

code=$(req "$R" -F "slug=$SLUG" -F "photo=@$MEDIA/test_photo.jpg" "$BASE/api/upload_photo.php")
check "admin üçün yükləmə işləyir" "200" "$code"
ADMIN_ID=$("$PHP" -r '$j=json_decode(file_get_contents($argv[1]),true); echo $j["id"] ?? "";' "$R")

code=$(req "$R" -X POST -H "Content-Type: application/json" -H "X-Admin-Token: $ADMIN_TOKEN" \
  -d "{\"slug\":\"$SLUG\",\"id\":\"$ADMIN_ID\"}" "$BASE/api/delete_photo.php")
check "admin tokeni ilə silmə işləyir (panel pozulmayıb)" "200" "$code"

code=$(req "$R" -X POST -H "Content-Type: application/json" -H "X-Admin-Token: ${ADMIN_TOKEN}xx" \
  -d "{\"slug\":\"$SLUG\",\"id\":\"$ADMIN_ID\"}" "$BASE/api/delete_photo.php")
check "saxta admin tokeni rədd edilir" "401" "$code"

code=$(req "$R" "$BASE/api/gallery_link.php?slug=$SLUG")
check "idarəetmə linki tokensiz verilmir" "401" "$code"
code=$(req "$R" -H "X-Admin-Token: $ADMIN_TOKEN" "$BASE/api/gallery_link.php?slug=$SLUG")
check "admin idarəetmə linki yarada bilir" "200" "$code"
has "link ?k= tokeni daşıyır" "$(cat "$R")" "qalereya-idare?k="

code=$(req "$R" "$BASE/api/media_audit.php")
check "audit tokensiz verilmir" "401" "$code"
code=$(req "$R" -H "X-Admin-Token: $ADMIN_TOKEN" "$BASE/api/media_audit.php")
check "admin auditi oxuya bilir" "200" "$code"
has "audit source-of-truth-u bildirir" "$(cat "$R")" '"source_of_truth": "filesystem"'

echo
echo "── SƏHİFƏLƏMƏ ──────────────────────────────────"
code=$(req "$R" "$BASE/api/get_photos.php?slug=$SLUG&limit=1")
check "limit parametri qəbul olunur" "200" "$code"
PAGED=$("$PHP" -r '$j=json_decode(file_get_contents($argv[1]),true); echo count($j["photos"]);' "$R")
check "limit=1 bir element qaytarır" "1" "$PAGED"

echo
echo "── TELEMETRİYA ─────────────────────────────────"
LOG="public/api/_logs/media-$(date -u +%Y-%m-%d).log"
[ -f "$LOG" ] && ok "media log faylı yaradılır" || bad "media log faylı" "mövcud" "yoxdur"
if [ -f "$LOG" ]; then
  has "upload_completed loglanır" "$(cat "$LOG")" "upload_completed"
  has "upload_failed səbəbi loglanır"  "$(cat "$LOG")" "too_large"
  has "delete_completed loglanır" "$(cat "$LOG")" "delete_completed"
fi

echo
printf '%s keçdi, %s uğursuz\n' "$pass" "$fail"
[ "$fail" -eq 0 ] || exit 1

#!/usr/bin/env bash
# ══════════════════════════════════════════════════
# DIGITOY.AZ — Hissəli / davam etdirilə bilən yükləmə testləri
#
# Sübut edir ki, böyük video server limitlərini DƏYİŞMƏDƏN keçir:
# hər sorğu ~4 MB-dır, yəni post_max_size (≈104M) heç vaxt sınanmır.
#
#   php -d upload_max_filesize=100M -d post_max_size=104M -S 127.0.0.1:8099 -t public/ &
#   BASE=... MEDIA=... PHP=... bash tests/chunked_upload_test.sh
# ══════════════════════════════════════════════════
set -u

BASE="${BASE:-http://127.0.0.1:8099}"
MEDIA="${MEDIA:?MEDIA qovluğu təyin edilməlidir}"
PHP="${PHP:-php}"
SLUG="${SLUG:-zz-chunk-test}"
CHUNK=$((4 * 1024 * 1024))

pass=0; fail=0
ok()  { pass=$((pass+1)); printf '  ok   %s\n' "$1"; }
bad() { fail=$((fail+1)); printf '  FAIL %s\n     gözlənilən: %s\n     alınan:     %s\n' "$1" "$2" "$3"; }
check(){ [ "$2" = "$3" ] && ok "$1" || bad "$1" "$2" "$3"; }
has() { case "$2" in *"$3"*) ok "$1";; *) bad "$1" "içərisində '$3'" "$2";; esac; }

R="$MEDIA/chunk_r.json"

newId() { "$PHP" -r 'echo bin2hex(random_bytes(12));'; }

# sendChunk <file> <uploadId> <index> <total> <filesize> [offset]
sendChunk() {
  local f="$1" id="$2" idx="$3" total="$4" size="$5"
  local off=$((idx * CHUNK))
  "$PHP" -r '
    $src=fopen($argv[1],"rb"); fseek($src,(int)$argv[2]);
    $out=fopen($argv[3],"wb");
    stream_copy_to_stream($src,$out,(int)$argv[4]);
    fclose($src); fclose($out);
  ' "$f" "$off" "$MEDIA/chunk.bin" "$CHUNK"

  curl -s -m 120 -o "$R" -w '%{http_code}' \
    -F "slug=$SLUG" -F "uploadId=$id" -F "chunkIndex=$idx" \
    -F "totalChunks=$total" -F "fileSize=$size" \
    -F "chunk=@$MEDIA/chunk.bin" "$BASE/api/upload_chunk.php"
}

# uploadWhole <file> — bütün faylı hissə-hissə göndər, son HTTP kodu qaytar
uploadWhole() {
  local f="$1"
  local size; size=$("$PHP" -r 'echo filesize($argv[1]);' "$f")
  local total=$(( (size + CHUNK - 1) / CHUNK ))
  local id; id=$(newId)
  local code=""
  for ((i=0; i<total; i++)); do
    code=$(sendChunk "$f" "$id" "$i" "$total" "$size")
    [ "$code" = "200" ] || { echo "$code"; return; }
  done
  echo "$code"
}

echo
echo "── HİSSƏ-HİSSƏ YÜKLƏMƏ ─────────────────────────"

code=$(uploadWhole "$MEDIA/vid_100mb.mp4")
check "100 MB video yüklənir (tək sorğu limiti 90 MB olsa da)" "200" "$code"
has "son hissə tamamlanmış media qaytarır" "$(cat "$R")" '"done":true'

# Hər sorğunun gövdəsinin server tavanından kiçik olduğunu sübut et
BODY=$("$PHP" -r 'echo filesize($argv[1]);' "$MEDIA/chunk.bin")
[ "$BODY" -le 4194304 ] && ok "hər sorğunun gövdəsi ≤ 4 MB (post_max_size sınanmır)" \
  || bad "sorğu gövdəsi ≤ 4 MB" "≤4194304" "$BODY"

echo
echo "── DAVAM ETDİRMƏ (bağlantı kəsilməsi) ──────────"

SIZE=$("$PHP" -r 'echo filesize($argv[1]);' "$MEDIA/vid_100mb.mp4")
TOTAL=$(( (SIZE + CHUNK - 1) / CHUNK ))
ID=$(newId)

# İlk 3 hissəni göndər, sonra "bağlantı kəsilir"
for i in 0 1 2; do sendChunk "$MEDIA/vid_100mb.mp4" "$ID" "$i" "$TOTAL" "$SIZE" > /dev/null; done

RECEIVED=$(curl -s -m 30 "$BASE/api/upload_chunk.php?slug=$SLUG&uploadId=$ID" \
  | "$PHP" -r '$j=json_decode(stream_get_contents(STDIN),true); echo (int)$j["received"];')
check "server davam nöqtəsini bildirir" "$((3 * CHUNK))" "$RECEIVED"

# Sıfırdan deyil, qaldığı yerdən davam et
code=""
for ((i=3; i<TOTAL; i++)); do
  code=$(sendChunk "$MEDIA/vid_100mb.mp4" "$ID" "$i" "$TOTAL" "$SIZE")
  [ "$code" = "200" ] || break
done
check "kəsilmədən sonra qaldığı yerdən tamamlanır" "200" "$code"
has "yükləmə tamamlandı" "$(cat "$R")" '"done":true'

echo
echo "── TƏHLÜKƏSİZLİK ───────────────────────────────"

# Zibil məzmun İLK hissədə rədd edilməlidir (2 GB yığılmasın)
"$PHP" -r '$f=fopen($argv[1],"wb"); fwrite($f,str_repeat("\x00",1048576)); fclose($f);' "$MEDIA/junk.bin"
ID2=$(newId)
code=$(curl -s -m 60 -o "$R" -w '%{http_code}' \
  -F "slug=$SLUG" -F "uploadId=$ID2" -F "chunkIndex=0" -F "totalChunks=200" \
  -F "fileSize=838860800" -F "chunk=@$MEDIA/junk.bin" "$BASE/api/upload_chunk.php")
check "zibil məzmun İLK hissədə rədd edilir (DoS müdafiəsi)" "415" "$code"
LEFT=$(curl -s -m 30 "$BASE/api/upload_chunk.php?slug=$SLUG&uploadId=$ID2" \
  | "$PHP" -r '$j=json_decode(stream_get_contents(STDIN),true); echo (int)$j["received"];')
check "rədd edilən yükləmə diskdə iz qoymur" "0" "$LEFT"

# 2 GB-dan böyük iddia
ID3=$(newId)
code=$(curl -s -m 60 -o "$R" -w '%{http_code}' \
  -F "slug=$SLUG" -F "uploadId=$ID3" -F "chunkIndex=0" -F "totalChunks=1" \
  -F "fileSize=3221225472" -F "chunk=@$MEDIA/junk.bin" "$BASE/api/upload_chunk.php")
check "3 GB iddiası rədd edilir (2 GB tavanı)" "413" "$code"

# uploadId formatı
code=$(curl -s -m 60 -o "$R" -w '%{http_code}' \
  -F "slug=$SLUG" -F "uploadId=../../../etc/passwd" -F "chunkIndex=0" -F "totalChunks=1" \
  -F "fileSize=1048576" -F "chunk=@$MEDIA/junk.bin" "$BASE/api/upload_chunk.php")
check "uploadId-də path traversal rədd edilir" "400" "$code"

# Elan edilən ölçüdən çox göndərmək
ID4=$(newId)
curl -s -m 60 -o /dev/null -F "slug=$SLUG" -F "uploadId=$ID4" -F "chunkIndex=0" \
  -F "totalChunks=1" -F "fileSize=1048576" -F "chunk=@$MEDIA/vid_small.mp4" \
  "$BASE/api/upload_chunk.php" > /dev/null
code=$(curl -s -m 60 -o "$R" -w '%{http_code}' -F "slug=$SLUG" -F "uploadId=$ID4" \
  -F "chunkIndex=1" -F "totalChunks=1" -F "fileSize=1048576" -F "chunk=@$MEDIA/junk.bin" \
  "$BASE/api/upload_chunk.php")
[ "$code" = "400" ] && ok "elan edilən ölçüdən artıq göndərmək bloklanır" \
  || bad "artıq göndərmə bloklanır" "400" "$code"

# Sıra pozulması — eyni faylı iki tabda göndərmək faylı KORLAMAMALIDIR
ID5=$(newId)
SZ=$("$PHP" -r 'echo filesize($argv[1]);' "$MEDIA/vid_100mb.mp4")
TOT=$(( (SZ + CHUNK - 1) / CHUNK ))
sendChunk "$MEDIA/vid_100mb.mp4" "$ID5" 0 "$TOT" "$SZ" > /dev/null
code=$(sendChunk "$MEDIA/vid_100mb.mp4" "$ID5" 0 "$TOT" "$SZ")   # eyni hissə TƏKRAR
check "təkrar/sıradankənar hissə korlamır, 409 verir" "409" "$code"
has "server həqiqi mövqeyi bildirir (client davam edə bilsin)" "$(cat "$R")" '"received"'
code=$(sendChunk "$MEDIA/vid_100mb.mp4" "$ID5" 5 "$TOT" "$SZ")   # sıradan atlayış
check "sıradan atlayan hissə rədd edilir" "409" "$code"

echo
echo "── QALEREYA TUTARLILIĞI ────────────────────────"
COUNT=$(curl -s -m 30 "$BASE/api/get_photos.php?slug=$SLUG" \
  | "$PHP" -r '$j=json_decode(stream_get_contents(STDIN),true); echo count($j["photos"]);')
check "yalnız tamamlanmış media qalereyada görünür" "2" "$COUNT"

STALE=$(ls public/uploads/_incoming/*.part 2>/dev/null | wc -l | tr -d ' ')
check "yarımçıq fayllar qalereya qovluğuna düşmür" "0" "$(ls public/uploads/$SLUG/*.part 2>/dev/null | wc -l | tr -d ' ')"

echo
printf '%s keçdi, %s uğursuz\n' "$pass" "$fail"
[ "$fail" -eq 0 ] || exit 1

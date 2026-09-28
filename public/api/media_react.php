<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — MEDİA REAKSİYALARI (Phase 43)

   POST /api/media_react.php
   body: { slug, id, emoji, visitor }        emoji: '' → reaksiyanı GERİ AL
   → { ok, id, counts, total, mine }

   BİR QONAQ · BİR MEDİA · BİR REAKSİYA. Bu qayda DB-də UNIQUE açarla
   təmin edilir (uq_reaction), ona görə iki paralel toxunuş da ikinci sətir
   yaratmır — `ON DUPLICATE KEY UPDATE` sadəcə emojini dəyişir.

   ⚠ NƏ ÜÇÜN QONAQ KİMLİYİ BRAUZERDƏN GƏLİR: qalereyada hesab sistemi
   yoxdur (qonaq QR skan edib gəlir — qeydiyyat tələb etmək reaksiyaları
   tamamilə öldürür). `visitor` localStorage-dəki təsadüfi hex-dir, şəxsi
   məlumat DEYİL və heç yerdə kimliyə bağlanmır.
   ⚠ Bu, sui-istifadəyə qarşı MÜTLƏQ müdafiə deyil — yeni id yaradıb yenidən
   səs vermək mümkündür. Ona görə IP üzrə sürüşən pəncərə limiti var
   (`rateGate`). Toy qalereyasında bu tarazlıq düzgündür: sərt müdafiənin
   qiyməti (giriş tələbi) faydasından qat-qat böyükdür.
   ⚠ Reaksiya qalereyanın ÖZÜNÜ dəyişmir: media faylları, sıralama və
   silmə məntiqi toxunulmaz qalır. Cədvəl silinsə reaksiyalar sıfırlanır,
   qalereya isə işləməyə davam edir.
══════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/gallery_media.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$body    = json_decode(file_get_contents('php://input'), true);
$slug    = trim($body['slug']    ?? '');
$rawId   = trim($body['id']      ?? '');
$emoji   = trim($body['emoji']   ?? '');
$visitor = trim($body['visitor'] ?? '');

if (!$slug || !isValidSlug($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid slug required']);
    exit;
}
if (!isSafeMediaName($rawId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid media id required']);
    exit;
}
if (!isValidVisitorId($visitor)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid visitor id required']);
    exit;
}
/* Boş emoji = geri alma. Əks halda AĞ SİYAHIDA olmalıdır. */
if ($emoji !== '' && !in_array($emoji, GALLERY_REACTIONS, true)) {
    http_response_code(422);
    echo json_encode(['error' => 'UNSUPPORTED_EMOJI']);
    exit;
}

/* ── Sui-istifadə qapısı ──
   IP üzrə 60 saniyədə 40 reaksiya. Toy qalereyasında real qonaq bir
   dəqiqədə 40 şəklə toxunmur; skript isə dərhal dayanır. */
if (!rateGate('react:' . clientIp(), 40, 60)) {
    http_response_code(429);
    echo json_encode([
        'error'   => 'RATE_LIMIT',
        'message' => 'Çox sürətli toxunuş. Bir az sonra yenidən cəhd edin.',
    ]);
    exit;
}

/* ── Media HƏQİQƏTƏN mövcuddurmu? ──
   Olmayan fayla reaksiya yazmaq cədvəli uydurma sətirlərlə doldurardı.
   Yalnız bir `is_file()` — ucuzdur. */
if (!is_file(galleryUploadDir($slug) . $rawId)) {
    http_response_code(404);
    echo json_encode(['error' => 'MEDIA_NOT_FOUND']);
    exit;
}

ensureTables();

try {
    $db = getDB();
    if ($emoji === '') {
        $st = $db->prepare(
            'DELETE FROM media_reactions
              WHERE slug = :s AND filename = :f AND visitor_id = :v'
        );
        $st->execute([':s' => $slug, ':f' => $rawId, ':v' => $visitor]);
    } else {
        $st = $db->prepare(
            'INSERT INTO media_reactions (slug, filename, visitor_id, emoji)
             VALUES (:s, :f, :v, :e)
             ON DUPLICATE KEY UPDATE emoji = VALUES(emoji)'
        );
        $st->execute([':s' => $slug, ':f' => $rawId, ':v' => $visitor, ':e' => $emoji]);
    }

    /* Yeni sayğacları qaytar — client optimistik dəyəri həqiqi ilə dəyişir */
    $agg = $db->prepare(
        'SELECT emoji, COUNT(*) AS cnt FROM media_reactions
          WHERE slug = :s AND filename = :f GROUP BY emoji'
    );
    $agg->execute([':s' => $slug, ':f' => $rawId]);

    $counts = [];
    $total  = 0;
    foreach ($agg->fetchAll() as $r) {
        $counts[$r['emoji']] = (int) $r['cnt'];
        $total += (int) $r['cnt'];
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error'   => 'REACTION_FAILED',
        'message' => 'Reaksiya yazıla bilmədi. Bir az sonra yenidən cəhd edin.',
    ]);
    exit;
}

echo json_encode([
    'ok'     => true,
    'id'     => $rawId,
    'counts' => $counts ?: new stdClass(),
    'total'  => $total,
    'mine'   => $emoji !== '' ? $emoji : null,
], JSON_UNESCAPED_UNICODE);

<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);

$invId  = trim($body['invitation_id'] ?? '');
$name   = strip_tags(trim($body['guest_name'] ?? ''));
$msg    = strip_tags(trim($body['message']    ?? ''));
$status = $body['attendance_status']  ?? null;
$extra  = max(0, min(10, (int)($body['extra_guests'] ?? 0)));

if (!$invId || !$name) {
    http_response_code(422);
    echo json_encode(['error' => 'invitation_id and guest_name required']);
    exit;
}

if ($status !== null && !in_array($status, ['yes', 'maybe', 'no'], true)) {
    http_response_code(422);
    echo json_encode(['error' => 'attendance_status must be yes, maybe or no']);
    exit;
}

/* ── Phase 39: honeypot ──
   Frontend gözə görünməyən `website` sahəsi göndərir; insan onu heç vaxt
   doldurmur, formanı avtomatik dolduran bot isə demək olar həmişə doldurur.
   Bota UĞUR cavabı qaytarırıq — səhv görsə strategiyasını dəyişər. */
if (trim($body['website'] ?? '') !== '') {
    echo json_encode(['ok' => true, 'id' => 0]);
    exit;
}

/* ── Phase 37: slug formatı + dəvətnamənin mövcudluğu ──
   Əvvəl bu endpointdə slug yoxlaması ÜMUMİYYƏTLƏ yox idi — istənilən
   mətn `invitation_id` kimi qəbul edilir və bazaya yazılırdı. */
if (!isValidSlug($invId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid invitation_id required']);
    exit;
}

ensureTables();
$db = getDB();

if (!invitationExists($db, $invId)) {
    http_response_code(404);
    echo json_encode(['error' => 'INVITATION_NOT_FOUND']);
    exit;
}

/* ── Phase 39: spam sürət qapısı ──
   ⚠ AÇAR SEÇİMİ VACİBDİR. Yalnız IP üzrə limit toy məkanında FƏLAKƏTDİR:
   150 qonaq eyni WiFi-dən, yəni eyni ictimai IP-dən yazır və bir-birini
   bloklayır (bu tələyə upload_photo.php-də artıq düşülüb və düzəldilib).
   Ona görə iki qat qoyulur:
     1) Eyni ad + eyni toy + eyni IP → 60 saniyədə 1 dəfə. Bu, təsadüfi
        ikiqat göndərişi və tək botun təkrarını dayandırır, fərqli
        qonaqlara TOXUNMUR.
     2) (toy, IP) cütü üçün saatda 60 mesaj — real toy üçün əlçatmaz
        yüksək, skript üçün isə divar. */
$ip = clientIp();
if (!rateGate('gb_dup|' . $invId . '|' . $ip . '|' . mb_strtolower($name), 1, 60)) {
    http_response_code(429);
    echo json_encode(['error' => 'TOO_SOON', 'message' => 'Mesajınız az öncə göndərildi.']);
    exit;
}
if (!rateGate('gb_ip|' . $invId . '|' . $ip, 60, 3600)) {
    http_response_code(429);
    echo json_encode(['error' => 'RATE_LIMITED', 'message' => 'Çox sayda mesaj göndərildi. Bir az sonra yenidən cəhd edin.']);
    exit;
}

$st = $db->prepare("
    INSERT INTO guest_responses (invitation_id, guest_name, message, attendance_status, extra_guests)
    VALUES (:inv, :name, :msg, :status, :extra)
");
$st->execute([
    ':inv'    => substr($invId, 0, 120),
    ':name'   => substr($name,  0, 255),
    /* Phase 39 — mesaj kəsilir. Əvvəl TEXT sahəsinə 64 KB-a qədər yazıla
       bilirdi; qonşu submit_attendance.php artıq 1000-ə kəsir. Real təbrik
       mesajları üçün 1000 simvol bol-bol kifayətdir. */
    ':msg'    => $msg !== '' ? mb_substr($msg, 0, 1000) : null,
    ':status' => $status,
    ':extra'  => $extra,
]);

echo json_encode(['ok' => true, 'id' => $db->lastInsertId()]);

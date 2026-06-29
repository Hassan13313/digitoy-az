<?php
/* ══════════════════════════════════════════════════
   POST /api/migrate_guests.php  (Admin tələb olunur)
   Body: { invitation_id: "slug" } | { all: true }
   Mövcud oturma planı mətni → guests cədvəlinə köçür.
   İdempotent: eyni adlı qonaqları yenidən əlavə etmir.
   Phase 22 — Guest Management Refactor
══════════════════════════════════════════════════ */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

requireAdmin();

$body  = json_decode(file_get_contents('php://input'), true);
$invId = isset($body['invitation_id']) ? trim($body['invitation_id']) : null;
$all   = !empty($body['all']);

ensureTables();
$db = getDB();

/* ── Seating planını mətn formatından parse et ── */
function parseSeatingText(string $text): array {
    $tables = [];
    foreach (explode(';', $text) as $entry) {
        $entry = trim($entry);
        if (!$entry) continue;
        $ci = strpos($entry, ':');
        if ($ci === false) continue;
        $tableLabel = trim(substr($entry, 0, $ci));
        $guestPart  = trim(substr($entry, $ci + 1));
        $guests     = array_filter(array_map('trim', explode(',', $guestPart)));
        if ($tableLabel && $guests) {
            $tables[] = ['table_id' => $tableLabel, 'guests' => array_values($guests)];
        }
    }
    return $tables;
}

/* ── Bir dəvətnaməni köçür ── */
function migrateOne(PDO $db, string $slug): array {
    $st = $db->prepare("SELECT form_data FROM invitations WHERE slug = :slug LIMIT 1");
    $st->execute([':slug' => $slug]);
    $row = $st->fetch();
    if (!$row) return ['slug' => $slug, 'skipped' => true, 'reason' => 'not_found'];

    $data    = json_decode($row['form_data'], true) ?? [];
    $seating = trim($data['seatingPlan'] ?? $data['seating'] ?? '');
    if (!$seating) return ['slug' => $slug, 'skipped' => true, 'reason' => 'no_seating_plan'];

    $tables = parseSeatingText($seating);
    if (empty($tables)) return ['slug' => $slug, 'skipped' => true, 'reason' => 'empty_seating'];

    /* Mövcud qonaqlar — idempotent üçün */
    $existing = $db->prepare("SELECT table_id, full_name FROM guests WHERE invitation_id = :inv");
    $existing->execute([':inv' => $slug]);
    $existSet = [];
    foreach ($existing->fetchAll() as $e) {
        $existSet[strtolower($e['table_id']) . '|' . strtolower($e['full_name'])] = true;
    }

    $insert = $db->prepare("
        INSERT INTO guests (invitation_id, table_id, full_name)
        VALUES (:inv, :tbl, :name)
    ");

    $added = 0;
    $skippedGuests = 0;
    foreach ($tables as $t) {
        foreach ($t['guests'] as $name) {
            $key = strtolower($t['table_id']) . '|' . strtolower($name);
            if (isset($existSet[$key])) { $skippedGuests++; continue; }
            $insert->execute([
                ':inv'  => $slug,
                ':tbl'  => substr($t['table_id'], 0, 80),
                ':name' => substr($name, 0, 255),
            ]);
            $added++;
        }
    }

    return ['slug' => $slug, 'added' => $added, 'skipped_guests' => $skippedGuests];
}

$results = [];

if ($all) {
    /* Bütün approved dəvətnamələri köçür */
    $slugs = $db->query("SELECT slug FROM invitations")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($slugs as $slug) {
        $results[] = migrateOne($db, $slug);
    }
} elseif ($invId) {
    $results[] = migrateOne($db, substr($invId, 0, 120));
} else {
    http_response_code(422);
    echo json_encode(['error' => 'invitation_id or all:true required']);
    exit;
}

$totalAdded   = array_sum(array_column($results, 'added'));
$totalSkipped = array_sum(array_column($results, 'skipped_guests'));

echo json_encode([
    'ok'            => true,
    'total_added'   => $totalAdded,
    'total_skipped' => $totalSkipped,
    'results'       => $results,
]);

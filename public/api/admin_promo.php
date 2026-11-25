<?php
/* ═══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — admin «Promokodlar» (2026-11-25)

   GET                                   → { items: promoList() } (hər kodun istifadə sayı ilə)
   POST { action:'create', ...forma }    → { ok, item }       · 422 {errors} · 409 DUPLICATE
   POST { action:'update', id, ...forma }→ { ok, item }       (kodun özü dəyişmir)
   POST { action:'set_active', id, active }
   POST { action:'delete', id }          → yalnız heç bir sifarişdə işlənməyibsə; əks halda 409 IN_USE

   Forma sahələri və qaydalar: promo_lib.php › promoValidateInput.
   ═══════════════════════════════════════════════════════════════════════════ */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/promo_lib.php';

requireAdmin();
ensureTables();
$db = getDB();

function promoReply(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function promoItem(PDO $db, int $id): ?array {
    foreach (promoList($db) as $item) if ($item['id'] === $id) return $item;
    return null;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    promoReply(200, ['items' => promoList($db)]);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    promoReply(405, ['error' => 'GET or POST required']);
}

$body   = json_decode((string) file_get_contents('php://input'), true);
$body   = is_array($body) ? $body : [];
$action = is_string($body['action'] ?? null) ? $body['action'] : '';
$idRaw  = $body['id'] ?? null;
$id     = is_int($idRaw) ? $idRaw : (is_string($idRaw) && ctype_digit($idRaw) ? (int) $idRaw : 0);

$existing = null;
if ($action !== 'create') {
    $st = $db->prepare('SELECT * FROM promo_codes WHERE id = :id LIMIT 1');
    $st->execute([':id' => $id]);
    $existing = $st->fetch(PDO::FETCH_ASSOC) ?: null;
    if (!$existing) promoReply(404, ['error' => 'NOT_FOUND']);
}

switch ($action) {
    case 'create':
    case 'update': {
        if ($action === 'update') $body['code'] = $existing['code'];
        $v = promoValidateInput($body);
        if ($v['errors']) promoReply(422, ['error' => 'INVALID', 'errors' => $v['errors']]);
        $c = $v['clean'];
        $params = [
            ':kind' => $c['kind'], ':amount' => $c['amount'], ':packages' => $c['packages'],
            ':starts_on' => $c['starts_on'], ':ends_on' => $c['ends_on'], ':max_uses' => $c['max_uses'],
            ':owner' => $c['owner'], ':note' => $c['note'],
        ];
        if ($action === 'create') {
            try {
                $db->prepare('INSERT INTO promo_codes (code, kind, amount, packages, starts_on, ends_on, max_uses, owner, note)
                              VALUES (:code, :kind, :amount, :packages, :starts_on, :ends_on, :max_uses, :owner, :note)')
                   ->execute($params + [':code' => $c['code']]);
            } catch (PDOException $e) {
                if ((string) $e->getCode() === '23000') {
                    promoReply(409, ['error' => 'DUPLICATE', 'errors' => ['code' => 'Bu kod artıq var']]);
                }
                throw $e;
            }
            $id = (int) $db->lastInsertId();
        } else {
            $db->prepare('UPDATE promo_codes SET kind = :kind, amount = :amount, packages = :packages,
                              starts_on = :starts_on, ends_on = :ends_on, max_uses = :max_uses,
                              owner = :owner, note = :note
                          WHERE id = :id')
               ->execute($params + [':id' => $id]);
        }
        adminAuditLog("promo_$action", null, $c['code']);
        promoReply(200, ['ok' => true, 'item' => promoItem($db, $id)]);
    }

    case 'set_active': {
        $active = !empty($body['active']) ? 1 : 0;
        $db->prepare('UPDATE promo_codes SET active = :a WHERE id = :id')->execute([':a' => $active, ':id' => $id]);
        adminAuditLog($active ? 'promo_on' : 'promo_off', null, $existing['code']);
        promoReply(200, ['ok' => true, 'item' => promoItem($db, $id)]);
    }

    case 'delete': {
        /* İşlənmiş kodu silmək sifarişlərdəki izi qırar — yalnız söndürmək olar */
        $used = $db->prepare('SELECT COUNT(*) FROM draft_invitations WHERE promo_code = :c');
        $used->execute([':c' => $existing['code']]);
        if ((int) $used->fetchColumn() > 0) promoReply(409, ['error' => 'IN_USE']);
        $db->prepare('DELETE FROM promo_codes WHERE id = :id')->execute([':id' => $id]);
        adminAuditLog('promo_delete', null, $existing['code']);
        promoReply(200, ['ok' => true]);
    }

    default:
        promoReply(400, ['error' => 'Unknown action']);
}

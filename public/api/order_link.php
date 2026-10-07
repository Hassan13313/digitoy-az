<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Phase 48: sifariş ↔ dəvətnamə əlaqəsinin TƏK qaydası
   invitations.draft_code = sifarişin kodu (Phase 33+, save_invitation onu
   yeniləyir) üstündür; kodsuz köhnə dəvətnamələr üçün approved_slug.
   İşlədənlər: get_draft, get_orders_list, admin_purge, purge_lib.
   YALNIZ include edilir (api/.htaccess). tests/order_link_test.php
══════════════════════════════════════════════════ */

/** Sifarişin CANLI dəvətnaməsinin slug-ı; yoxdursa null.
    ⚠ Sütun-sütun JOIN QƏSDƏN yoxdur: prod MariaDB-də invitations
    (utf8mb4 default) və draft_invitations (utf8mb4_unicode_ci) fərqli
    collation-dadır → «Illegal mix of collations». Parametr isə sütunun
    collation-una uyğunlaşır. */
function orderInvitationSlug(PDO $db, ?string $approvedSlug, ?string $draftCode): ?string {
    if (!$approvedSlug && !$draftCode) return null;
    static $for = null, $q = null;   /* siyahıda hər sətir üçün yenidən prepare olunmasın */
    if ($for !== $db) {
        $for = $db;
        $q   = $db->prepare('SELECT COALESCE((SELECT slug FROM invitations WHERE draft_code = :c LIMIT 1),'
                          . ' (SELECT slug FROM invitations WHERE slug = :s LIMIT 1))');
    }
    $q->execute([':c' => $draftCode ?: null, ':s' => $approvedSlug ?: null]);
    $slug = $q->fetchColumn();
    $q->closeCursor();
    return $slug ?: null;
}

/** Dəvətnaməyə bağlı sifarişlər (id, draft_code) — orderInvitationSlug-un əksi:
    yalnız əlaqə qaydası məhz BU dəvətnaməni verən sifarişlər. */
function invitationOrders(PDO $db, string $slug, ?string $code): array {
    $st = $db->prepare('SELECT id, draft_code, approved_slug FROM draft_invitations
                        WHERE approved_slug = :s OR (draft_code = :c AND :c2 <> \'\')');
    $st->execute([':s' => $slug, ':c' => (string) $code, ':c2' => (string) $code]);
    $out = [];
    foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $o) {
        if (orderInvitationSlug($db, $o['approved_slug'], $o['draft_code']) === $slug) {
            $out[] = ['id' => $o['id'], 'draft_code' => $o['draft_code']];
        }
    }
    return $out;
}

/** Admin detalı: sifariş koduna görə, expires_at-dan ASILI OLMAYARAQ
    (müddət yalnız müştərinin qaralama bərpası üçündür). */
function orderByCode(PDO $db, string $draftCode): ?array {
    $st = $db->prepare('SELECT id, draft_code, package, current_step, status, form_data,
                               customer_phone, submitted_at, approved_slug
                        FROM draft_invitations WHERE draft_code = :code LIMIT 1');
    $st->execute([':code' => $draftCode]);
    return $st->fetch(PDO::FETCH_ASSOC) ?: null;
}

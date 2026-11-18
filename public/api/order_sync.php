<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — Sifariş ↔ Dəvətnamə sinxronluğu (2026-11-18)

   PROBLEM: sifarişin öz nüsxəsi (draft_invitations.form_data) və dəvətnamə
   (invitations.form_data) ayrı idi. Admin «Dəvətnamələr» bölməsində dizayn /
   bölmə / tərcümə düzəlişləri edirdi (invitations-a yazılır), sonra
   «Sifarişlər»dən təsdiq və ya «Builder-də aç» → saxla — köhnə sifariş nüsxəsi
   dəvətnamənin ÜSTÜNƏ yazılırdı və düzəlişlər itirdi.

   QAYDA: dəvətnamə yarandıqdan sonra HƏQİQƏT MƏNBƏYİ dəvətnamədir.
     • get_draft (admin) dəvətnamənin hazırkı form_data-sını da qaytarır —
       sifariş səhifəsi və builder ONU açır.
     • Təsdiq: dəvətnamə varsa yalnız status dəyişir (front-end).
     • save_invitation: admin-ə məxsus açarlar gəlməyibsə saxlanılan qorunur
       və nəticə sifariş nüsxəsinə də yazılır (siyahıdakı adlar eyni qalsın).
   Funksiyalar DB-siz test edilir: tests/order_sync_test.php
   ══════════════════════════════════════════════════════════════════════════ */

/* Yalnız admin bölməsinin yazdığı açarlar — builder/sifariş nüsxəsində olmur */
const ADMIN_OWNED_KEYS = ['admin'];

/** Gələn form_data-da admin açarı yoxdursa saxlanılanı köçürür (heç nə silinmir). */
function preserveAdminOwnedKeys(array $stored, array $incoming): array {
    foreach (ADMIN_OWNED_KEYS as $k) {
        if (!array_key_exists($k, $incoming) && array_key_exists($k, $stored)) {
            $incoming[$k] = $stored[$k];
        }
    }
    return $incoming;
}

/** Sifarişə bağlı dəvətnamənin form_data-sı (yoxdursa null). */
function invitationFormDataBySlug(PDO $db, ?string $slug): ?array {
    if (!$slug) return null;
    $st = $db->prepare('SELECT form_data FROM invitations WHERE slug = :s LIMIT 1');
    $st->execute([':s' => $slug]);
    $raw = $st->fetchColumn();
    if ($raw === false || $raw === null) return null;
    $fd = json_decode((string) $raw, true);
    return is_array($fd) ? $fd : null;
}

/** Dəvətnamənin son halını sifariş nüsxəsinə yazır (status, kod, telefon toxunulmur). */
function mirrorInvitationToDraft(PDO $db, string $draftCode, string $json): void {
    if ($draftCode === '' || !preg_match('/^DT-[A-Z0-9]{6}$/', $draftCode)) return;
    $st = $db->prepare('UPDATE draft_invitations SET form_data = :d WHERE draft_code = :c');
    $st->execute([':d' => $json, ':c' => $draftCode]);
}

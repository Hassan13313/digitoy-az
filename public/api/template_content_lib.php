<?php
/* ═══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — şablon səviyyəli məzmun: ortaq köməkçilər (2026-11)

   YALNIZ include edilir (api/.htaccess birbaşa girişi bağlayır).
   Oxuma FAIL-OPEN-dur: cədvəl hələ yoxdursa (miqrasiya işləməyib) və ya DB
   xətası olarsa boş nəticə qayıdır — dəvətnamə heç vaxt bu səbəbdən sınmır.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Həm toyda, həm ad günündə olan dizaynlar — ad günü versiyasının məzmunu ayrıdır.
   ⚠ templateConfig.js › `concepts` ilə eyni (tests/admin_whitelists_test.mjs). */
const TC_BIRTHDAY_VARIANTS = ['modern-black', 'boarding-pass', 'cinema-premiere', 'vinyl-record', 'gazette'];

/** Şablon + tədbir → DB açarı */
function tcKey(string $templateId, string $eventType): string {
    return ($eventType === 'birthday' && in_array($templateId, TC_BIRTHDAY_VARIANTS, true))
        ? $templateId . '@birthday'
        : $templateId;
}

function tcValidKey($key): bool {
    return is_string($key) && (bool) preg_match('/^[a-z0-9-]{1,60}(@birthday)?$/', $key);
}

/** { admin: {...}, sections: {...} } — yoxdursa boş obyektlər */
function tcRead(PDO $db, string $key): array {
    $empty = ['admin' => new stdClass(), 'sections' => new stdClass()];
    try {
        $st = $db->prepare('SELECT content FROM template_content WHERE template_key = :k LIMIT 1');
        $st->execute([':k' => $key]);
        $raw = $st->fetchColumn();
    } catch (Throwable $e) {
        return $empty;
    }
    if ($raw === false) return $empty;
    $c = json_decode((string) $raw, true);
    if (!is_array($c)) return $empty;
    return [
        'admin'    => (isset($c['admin']) && is_array($c['admin']) && $c['admin']) ? $c['admin'] : new stdClass(),
        'sections' => (isset($c['sections']) && is_array($c['sections']) && $c['sections']) ? $c['sections'] : new stdClass(),
    ];
}

<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Kanonik slug ayırıcısı

   PROBLEM (Phase 33-dən əvvəl — MƏLUMAT İTKİSİ):
   Slug adlardan hesablanır: "Aytekin" + "Fərid" → `aytekin-ve-ferid`.
   save_invitation.php şəkilçini
       substr(md5($slug . 'digitoy'), 0, 6)
   ilə düzəldirdi — yəni şəkilçi YALNIZ ADIN funksiyası idi. Nəticədə:

     • İki fərqli "Aytekin və Fərid" cütlüyü TAM EYNİ kanonik slug alırdı;
     • `INSERT ... ON DUPLICATE KEY UPDATE` ikinci cütlüyün məlumatı ilə
       birincinin dəvətnaməsini SƏSSİZCƏ ÜSTÜNDƏN YAZIRDI;
     • hər iki toy eyni `uploads/<slug>/` qovluğunu paylaşırdı — bir toyun
       qonaqları digərinin qalereyasına yükləyir, bir cütlük digərinin
       şəkillərini görür və silə bilirdi.

   HƏLL — üç mərhələli, heç vaxt üstündən yazmayan ayırma:
     1) Dəqiq slug mövcuddur           → həmin sətir yenilənir.
     2) Bu draft_code üçün sətir var   → o yenilənir (idempotent).
     3) Yeni sətir                     → şəkilçi sifarişin ÖZ unikal
        kodundan (draft_code) törəyir; kod yoxdursa boş yer tapılana
        qədər təsadüfi şəkilçi sınanır.

   Ayrı fayldadır ki, məntiq real DB olmadan (SQLite ilə) test edilə bilsin
   — bax: tests/slug_alloc_test.php
══════════════════════════════════════════════════ */

/* Qarışdırıla bilən simvollar (0/O, 1/l/I) YOXDUR — kod telefon ekranında oxunur */
const SLUG_CODE_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
const SLUG_CODE_LENGTH   = 6;
const DRAFT_CODE_PATTERN = '/^DT-[A-Z0-9]{6}$/';

function slugExists(PDO $db, string $candidate): bool {
    $q = $db->prepare('SELECT 1 FROM invitations WHERE slug = :s LIMIT 1');
    $q->execute([':s' => $candidate]);
    return (bool) $q->fetchColumn();
}

function randomSlugCode(): string {
    $code = '';
    for ($i = 0; $i < SLUG_CODE_LENGTH; $i++) {
        $code .= SLUG_CODE_ALPHABET[random_int(0, strlen(SLUG_CODE_ALPHABET) - 1)];
    }
    return $code;
}

/**
 * Bu sifariş üçün kanonik slug-ı həll et.
 *
 * @return array{action:'update_slug'|'update_code'|'insert', slug:string}
 *         action 'insert' olduqda çağıran tərəf YENİ sətir yaratmalıdır.
 * @throws RuntimeException boş slug tapılmadıqda
 */
function resolveCanonicalSlug(PDO $db, string $baseSlug, ?string $draftCode): array {
    $draftCode = is_string($draftCode) ? trim($draftCode) : '';
    $hasCode   = $draftCode !== '' && preg_match(DRAFT_CODE_PATTERN, $draftCode) === 1;

    /* 1) Bu sifarişin dəvətnaməsi artıq varsa — təkrar saxlama dublikat
          yaratmır. Bu yoxlama slug yoxlamasından ƏVVƏL gəlməlidir. */
    if ($hasCode) {
        $q = $db->prepare('SELECT slug FROM invitations WHERE draft_code = :c LIMIT 1');
        $q->execute([':c' => $draftCode]);
        $existing = $q->fetchColumn();
        if ($existing) {
            return ['action' => 'update_code', 'slug' => (string) $existing];
        }
    }

    /* 2) Dəqiq ad-slug mövcuddur.
          ⚠ Bu sətri YALNIZ kodumuz olmayanda yeniləyirik (admin köhnə
          dəvətnaməni redaktə edir). Kodumuz VARSA və yuxarıdakı axtarış
          heç nə tapmadısa, deməli bu sətir BAŞQA sifarişə aiddir —
          ona toxunmaq eyni adlı əvvəlki cütlüyün dəvətnaməsini məhv
          edərdi. Ad-slug-dan «eyni cütlükdür» nəticəsi ÇIXARMAQ OLMAZ.

          Nəticə: köhnə (kodsuz) dəvətnamə yeni kodla təkrar approve
          edilsə, üstündən yazmaq əvəzinə AYRICA sətir yaranır — bu,
          görünən və düzəldilə bilən haldır; məlumat itkisi isə deyil. */
    if (!$hasCode && slugExists($db, $baseSlug)) {
        return ['action' => 'update_slug', 'slug' => $baseSlug];
    }

    /* 3) Yeni kanonik slug.
          draft_code varsa şəkilçi ondan gəlir — YENİ təsadüfi ID uydurulmur
          və nəticə təkrar çağırışlarda dəyişmir. */
    if ($hasCode) {
        $candidate = $baseSlug . '-' . strtolower(substr($draftCode, 3));
        if (!slugExists($db, $candidate)) {
            return ['action' => 'insert', 'slug' => $candidate];
        }
    }

    for ($attempt = 0; $attempt < 12; $attempt++) {
        $candidate = $baseSlug . '-' . randomSlugCode();
        if (!slugExists($db, $candidate)) {
            return ['action' => 'insert', 'slug' => $candidate];
        }
    }

    throw new RuntimeException('Could not allocate a unique slug');
}

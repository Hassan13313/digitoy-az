<?php
/* ══════════════════════════════════════════════════
   Phase 46.1 — sifarişin «Sil» (soft delete) statusu sxemdə

   İşə salma:  php tests/draft_status_enum_test.php
   DB TƏLƏB ETMİR — config.php-dəki saf funksiya yoxlanılır.

   delete_draft.php status='deleted' + deleted_at yazır, amma runMigrations
   draft_invitations-ı ENUM('draft','submitted','approved','rejected') ilə,
   deleted_at OLMADAN yaradırdı. Canlıda sxem nə vaxtsa əllə düzəldilib;
   təzə DB-də (test.digitoy.az) «Sil» 500 verirdi. Miqrasiya mövcud ENUM
   dəyərlərini SAXLAYARAQ yalnız 'deleted' əlavə etməlidir.
══════════════════════════════════════════════════ */

$passed = 0;
$failed = 0;
function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

$src = file_get_contents(__DIR__ . '/../public/api/config.php');
if (!preg_match('/\nfunction draftStatusEnumWithDeleted\(.*?\n\}/s', $src, $m)) {
    echo "FAIL: `draftStatusEnumWithDeleted` config.php-də tapılmadı\n";
    exit(1);
}
eval($m[0]);

ok('köhnə sxem → deleted əlavə olunur',
   draftStatusEnumWithDeleted("enum('draft','submitted','approved','rejected')")
   === "ENUM('draft','submitted','approved','rejected','deleted')");
ok('artıq var → dəyişiklik yoxdur',
   draftStatusEnumWithDeleted("enum('draft','submitted','approved','rejected','deleted')") === null);
ok('əlavə dəyərlər saxlanılır, deleted varsa toxunulmur',
   draftStatusEnumWithDeleted("enum('draft','deleted','archived')") === null);
ok('naməlum əlavə dəyər itmir',
   draftStatusEnumWithDeleted("enum('draft','submitted','archived')") === "ENUM('draft','submitted','archived','deleted')");
ok('VARCHAR → dəyişiklik yoxdur', draftStatusEnumWithDeleted('varchar(20)') === null);
ok('boş tip → dəyişiklik yoxdur', draftStatusEnumWithDeleted('') === null);

/* runMigrations həqiqətən çağırır + versiya artırılıb (yoxsa canlıda işləməz) */
ok('runMigrations funksiyanı çağırır', (bool) preg_match('/=\s*draftStatusEnumWithDeleted\(/', $src));
ok('deleted_at sütunu əlavə olunur', (bool) preg_match('/ADD COLUMN deleted_at DATETIME/', $src));
ok('SCHEMA_VERSION >= 46', preg_match('/const SCHEMA_VERSION = (\d+);/', $src, $v) && (int) $v[1] >= 46);

echo "\n$passed ok, $failed FAIL\n";
exit($failed ? 1 : 0);

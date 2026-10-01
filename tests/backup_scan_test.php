<?php
/* ══════════════════════════════════════════════════
   Phase 46 — Baxım › backup vəziyyəti

   İşə salma:  php tests/backup_scan_test.php

   Xəta: panel «Backup tapılmadı» yazırdı, halbuki DirectAdmin backup-ı
   /home/<user>/backups/backup-<tarix>.tar.zst kimi saxlayır — nə həmin
   qovluq, nə də .zst uzantısı yoxlanılırdı.
══════════════════════════════════════════════════ */

$passed = 0;
$failed = 0;
function ok(string $label, bool $cond): void {
    global $passed, $failed;
    if ($cond) { $passed++; echo "  ok   $label\n"; }
    else       { $failed++; echo "  FAIL $label\n"; }
}

$src = file_get_contents(__DIR__ . '/../public/api/admin_maintenance.php');
if (!preg_match('/\nfunction backupScanDirs\(.*?\n\}/s', $src, $m)) { echo "FAIL: `backupScanDirs` tapılmadı\n"; exit(1); }
eval($m[0]);
ok('DirectAdmin qovluğu (/home/<user>/backups) siyahıdadır', strpos($src, "'/../../../../backups'") !== false);

$base = sys_get_temp_dir() . '/dt_bk_' . getmypid();
@mkdir($base . '/a', 0777, true); @mkdir($base . '/b', 0777, true);
file_put_contents($base . '/a/backup-Sep-30-2026-1.tar.zst', str_repeat('x', 10)); touch($base . '/a/backup-Sep-30-2026-1.tar.zst', time() - 86400 * 2);
file_put_contents($base . '/b/backup-Oct-01-2026-1.tar.zst', str_repeat('y', 25)); touch($base . '/b/backup-Oct-01-2026-1.tar.zst', time() - 3600);
file_put_contents($base . '/b/notes.txt', 'z');

$r = backupScanDirs([$base . '/a', $base . '/b', $base . '/missing']);
ok('.tar.zst tanınır, .txt sayılmır', $r['count'] === 2);
ok('ən yenisi seçilir', $r['file'] === 'backup-Oct-01-2026-1.tar.zst');
ok('ölçü qaytarılır', $r['size'] === 25);
ok('vaxt qaytarılır', abs($r['mtime'] - (time() - 3600)) < 5);
$empty = backupScanDirs([$base . '/missing']);
ok('heç nə yoxdursa mtime 0', $empty['mtime'] === 0 && $empty['count'] === 0 && $empty['file'] === null);

foreach (['a/backup-Sep-30-2026-1.tar.zst', 'b/backup-Oct-01-2026-1.tar.zst', 'b/notes.txt'] as $f) @unlink($base . '/' . $f);
@rmdir($base . '/a'); @rmdir($base . '/b'); @rmdir($base);

echo "\n$passed ok, $failed FAIL\n";
exit($failed ? 1 : 0);

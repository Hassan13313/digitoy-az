<?php
/**
 * DIGITOY — Config şablonu
 *
 * Bu faylı kopyalayın:
 *   - LOCAL mühit üçün:      config.local.php
 *   - PRODUCTION mühit üçün: config.production.php (serverdə, git-ə yüklənmir)
 *
 * config.php loader avtomatik seçir:
 *   localhost / 127.0.0.1  → config.local.php
 *   digitoy.az             → config.production.php
 */

/* ── Admin Key ──
   Bütün admin API əməliyyatları üçün */
define('ADMIN_KEY', 'CHANGE_ME');

/* ── MySQL ── */
define('DB_HOST', 'localhost');
define('DB_NAME', 'CHANGE_ME_DB_NAME');
define('DB_USER', 'CHANGE_ME_DB_USER');
define('DB_PASS', 'CHANGE_ME_DB_PASS');
define('DB_CHAR', 'utf8mb4');

/* ── CORS — icazə verilən originlər ──
   Local:      ['http://localhost:5175']
   Production: ['https://digitoy.az', 'https://www.digitoy.az']
*/
define('CORS_ALLOWED', [
    'https://digitoy.az',
    'https://www.digitoy.az',
    // LOCAL üçün əlavə et:
    // 'http://localhost:5175',
    // 'http://localhost:3000',
]);

<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Mərkəzi DB konfiqurasiyası
   Azhosting DirectAdmin / cPanel MySQL
══════════════════════════════════════════════════ */

/* ── CORS ── */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* ── MySQL bağlantı parametrləri ── */
define('DB_HOST', 'localhost');
define('DB_NAME', 'digitoy_db');
define('DB_USER', 'digitoy_user');
define('DB_PASS', 'CHANGE_ME_STRONG_PASSWORD');
define('DB_CHAR', 'utf8mb4');

/* ── PDO bağlantısı ── */
function getDB(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    try {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHAR;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'DB connection failed']);
        exit;
    }
    return $pdo;
}

/* ── Cədvəlləri avtomatik yarat (ilk açılışda) ── */
function ensureTables(): void {
    $db = getDB();
    $db->exec("
        CREATE TABLE IF NOT EXISTS invitations (
            id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            slug       VARCHAR(120) NOT NULL UNIQUE,
            form_data  MEDIUMTEXT   NOT NULL,
            created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_slug (slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    $db->exec("
        CREATE TABLE IF NOT EXISTS photos (
            id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            slug        VARCHAR(120) NOT NULL,
            url         TEXT         NOT NULL,
            filename    VARCHAR(255) NOT NULL,
            mime_type   VARCHAR(100) NOT NULL DEFAULT 'image/jpeg',
            file_size   INT UNSIGNED NOT NULL DEFAULT 0,
            uploaded_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_slug (slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
}

ensureTables();

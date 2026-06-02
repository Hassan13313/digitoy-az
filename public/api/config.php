<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Config Loader
   Avtomatik env aşkar edir: local | production
   Credentials bu faylda deyil — config.{env}.php-dədir
══════════════════════════════════════════════════ */

header('Content-Type: application/json; charset=utf-8');

/* ── Environment detection ── */
$_host   = strtolower($_SERVER['HTTP_HOST'] ?? '');
$_isLocal = (strpos($_host, 'localhost') !== false || strpos($_host, '127.0.0.1') !== false);
define('APP_ENV', $_isLocal ? 'local' : 'production');

/* ── Env faylını yüklə ── */
$_envFile = __DIR__ . '/config.' . APP_ENV . '.php';
if (!file_exists($_envFile)) {
    http_response_code(503);
    echo json_encode([
        'error' => 'Config file not found',
        'file'  => 'config.' . APP_ENV . '.php',
        'hint'  => 'config.example.php-ı şablon olaraq istifadə edin',
    ]);
    exit;
}
require_once $_envFile;

/* ── CORS — env faylındakı CORS_ALLOWED sabitindən oxunur ── */
$_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($_origin !== '') {
    $__allowed = defined('CORS_ALLOWED') ? CORS_ALLOWED : [];
    if (in_array($_origin, $__allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $_origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token, Authorization');
    } else {
        http_response_code(403);
        echo json_encode(['error' => 'Origin not allowed']);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* ── PDO bağlantısı (DB_* sabitləri env faylından gəlir) ── */
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

/* ── Cədvəlləri avtomatik yarat ── */
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
    $db->exec("
        CREATE TABLE IF NOT EXISTS guest_responses (
            id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            invitation_id     VARCHAR(120) NOT NULL,
            guest_name        VARCHAR(255) NOT NULL,
            message           TEXT,
            attendance_status ENUM('yes','no') DEFAULT NULL,
            extra_guests      TINYINT UNSIGNED NOT NULL DEFAULT 0,
            created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_inv (invitation_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    $db->exec("
        CREATE TABLE IF NOT EXISTS draft_invitations (
            id              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
            draft_code      VARCHAR(20)      DEFAULT NULL,
            session_id      VARCHAR(64)      NOT NULL,
            package         VARCHAR(50)      NOT NULL DEFAULT 'SADE',
            current_step    TINYINT UNSIGNED NOT NULL DEFAULT 1,
            status          ENUM('draft','submitted','approved','rejected')
                                             NOT NULL DEFAULT 'draft',
            customer_phone  VARCHAR(50)      DEFAULT NULL,
            form_data       MEDIUMTEXT       DEFAULT NULL,
            created_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP
                                                      ON UPDATE CURRENT_TIMESTAMP,
            submitted_at    DATETIME         DEFAULT NULL,
            approved_at     DATETIME         DEFAULT NULL,
            expires_at      DATETIME         NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY  uq_draft_code  (draft_code),
            INDEX idx_session_id  (session_id),
            INDEX idx_status      (status),
            INDEX idx_expires_at  (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
}

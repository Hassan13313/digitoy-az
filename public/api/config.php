<?php
/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Config Loader
   Avtomatik env aşkar edir: local | production
   Credentials bu faylda deyil — config.{env}.php-dədir
══════════════════════════════════════════════════ */

header('Content-Type: application/json; charset=utf-8');

/* ── Phase 4: Dizayn şablonu ──
   Frontend-dəki `templates/templateConfig.js → DEFAULT_TEMPLATE_ID` ilə
   EYNİ olmalıdır. Bütün köhnə/naməlum dəyərlər buna düşür. */
define('DEFAULT_TEMPLATE_ID', 'simple-luxury');

/** template_id-ni təhlükəsiz normallaşdır (yalnız a-z, 0-9, tire; max 50) */
function normalizeTemplateId($id): string {
    $id = is_string($id) ? strtolower(trim($id)) : '';
    if ($id === '' || !preg_match('/^[a-z0-9\-]{2,50}$/', $id)) return DEFAULT_TEMPLATE_ID;
    return $id;
}

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

    /* Lokal development originləri — Vite dev server portları.
       Server HTTP_HOST üzrə APP_ENV-i deyil, sorğunun öz originini
       yoxlayır: digitoy.az-a deploy olunmuş API-yə localhost-dan edilən
       fetch-lər də CORS-u keçə bilsin deyə bu siyahı production
       originlərinə ƏLAVƏ olunur (əvəz etmir). Wildcard yoxdur — yalnız
       developer-in öz maşınında çalışan dəqiq portlar icazəlidir,
       production originlərinin yoxlanması olduğu kimi qalır. */
    /* Dev originlər yalnız lokal mühitdə əlavə edilir (C10) */
    if (APP_ENV === 'local') {
        $__devOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
        ];
        $__allowed = array_merge($__allowed, $__devOrigins);
    }

    if (in_array($_origin, $__allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $_origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token, X-Gallery-Token, Authorization');
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
            updated_at DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
            attendance_status ENUM('yes','no','maybe') DEFAULT NULL,
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

    /* ── Phase 22: Qonaqlar cədvəli — oturma planının yeganə mənbəyi ── */
    $db->exec("
        CREATE TABLE IF NOT EXISTS guests (
            id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            invitation_id VARCHAR(120) NOT NULL,
            table_id      VARCHAR(80)  NOT NULL,
            full_name     VARCHAR(255) NOT NULL,
            seat_number   TINYINT UNSIGNED DEFAULT NULL,
            notes         TEXT         DEFAULT NULL,
            created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_invitation (invitation_id),
            INDEX idx_table (invitation_id, table_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    /* ── draft_invitations.approved_slug — köhnə sxemlərə əlavə et ── */
    $cols = $db->query("SHOW COLUMNS FROM draft_invitations LIKE 'approved_slug'")->fetchAll();
    if (empty($cols)) {
        $db->exec("ALTER TABLE draft_invitations ADD COLUMN approved_slug VARCHAR(120) DEFAULT NULL");
    }

    /* ── Phase 22: İştirak Cavabları — guest_id ilə əlaqəli ── */
    $db->exec("
        CREATE TABLE IF NOT EXISTS attendance (
            id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            guest_id         INT UNSIGNED NOT NULL,
            status           ENUM('GOING','NOT_GOING','MAYBE','NO_RESPONSE') NOT NULL DEFAULT 'NO_RESPONSE',
            submitted_at     DATETIME DEFAULT NULL,
            optional_message TEXT     DEFAULT NULL,
            extra_guests     TINYINT UNSIGNED NOT NULL DEFAULT 0,
            UNIQUE KEY uq_guest (guest_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    /* ── Phase 22 Polish: attendance.extra_guests — köhnə sxemlərə əlavə et ── */
    $aCols = $db->query("SHOW COLUMNS FROM attendance LIKE 'extra_guests'")->fetchAll();
    if (empty($aCols)) {
        $db->exec("ALTER TABLE attendance ADD COLUMN extra_guests TINYINT UNSIGNED NOT NULL DEFAULT 0");
    }

    /* ── reject_draft.php üçün: rejected_at + reject_reason sütunları ── */
    $rjCols = $db->query("SHOW COLUMNS FROM draft_invitations LIKE 'rejected_at'")->fetchAll();
    if (empty($rjCols)) {
        $db->exec("ALTER TABLE draft_invitations ADD COLUMN rejected_at DATETIME DEFAULT NULL");
        $db->exec("ALTER TABLE draft_invitations ADD COLUMN reject_reason TEXT DEFAULT NULL");
    }

    /* ── Phase 4: template_id — dizayn şablonu ──
       Mövcud bütün sətirlər DEFAULT_TEMPLATE_ID alır, yəni köhnə müştərilərin
       dəvətnaməsi dəyişmir. Sütun admin siyahısı/filtri və analitika üçündür;
       render mənbəyi həm bu sütun, həm də form_data.templateId-dir. */
    foreach (['invitations', 'draft_invitations'] as $tbl) {
        $tCols = $db->query("SHOW COLUMNS FROM `$tbl` LIKE 'template_id'")->fetchAll();
        if (empty($tCols)) {
            $db->exec("ALTER TABLE `$tbl`
                ADD COLUMN template_id VARCHAR(50) NOT NULL DEFAULT '" . DEFAULT_TEMPLATE_ID . "'");
            $db->exec("ALTER TABLE `$tbl` ADD INDEX idx_template_id (template_id)");
        }
    }

    /* ── Phase 33: invitations.draft_code — sifarişin unikal kimliyi ──
       NƏ ÜÇÜN: slug adlardan hesablanır (aytekin-ve-ferid). İki eyni adlı
       cütlük eyni slug verir. save_invitation.php isə şəkilçini
       substr(md5($slug.'digitoy'),0,6) ilə — yəni YALNIZ ADDAN — düzəldirdi,
       ona görə ikinci cütlük də EYNİ kanonik slug alırdı və
       ON DUPLICATE KEY UPDATE birincinin dəvətnaməsini SƏSSİZCƏ ÜSTÜNDƏN
       YAZIRDI (məlumat itkisi + hər iki toyun eyni uploads qovluğunu
       paylaşması).

       Bu sütun dəvətnaməni sifarişin ARTIQ MÖVCUD unikal kodu (draft_code,
       DT-XXXXXX, DB-də UNIQUE) ilə bağlayır: kanonik slug ondan törəyir,
       yəni həm unikaldır, həm də təkrar saxlamada DƏYİŞMİR (idempotent).

       ADDITIVE və IDEMPOTENT: sütun NULL qəbul edir, mövcud sətirlər
       toxunulmur, köhnə linklər işləməyə davam edir.
       ROLLBACK: `ALTER TABLE invitations DROP COLUMN draft_code;` —
       heç bir mövcud məlumat itmir. */
    $dcCols = $db->query("SHOW COLUMNS FROM invitations LIKE 'draft_code'")->fetchAll();
    if (empty($dcCols)) {
        $db->exec("ALTER TABLE invitations ADD COLUMN draft_code VARCHAR(20) DEFAULT NULL");
        /* UNIQUE: bir sifariş → bir dəvətnamə. NULL-lar MySQL-də unikallığa
           daxil deyil, ona görə köhnə sətirlərin hamısı NULL qala bilər. */
        $db->exec("ALTER TABLE invitations ADD UNIQUE KEY uq_inv_draft_code (draft_code)");
    }
}

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

/* ══════════════════════════════════════════════════
   Phase 37 — PAYLAŞILAN KÖMƏKÇİLƏR
   Aşağıdakı dörd funksiya əvvəllər endpointlərə səpələnmiş məntiqin
   YEGANƏ mənbəyidir. Davranış dəyişmir — yalnız bir yerə yığılır.
══════════════════════════════════════════════════ */

/* ── Slug validasiyası — TƏK MƏNBƏ ──
   NƏ ÜÇÜN: eyni qayda kod bazasında iki cür yazılmışdı. 8 endpoint
   `[a-z0-9-]` işlədirdi, 6-sı `[a-zA-Z0-9-]`. Phase 33-dən ƏVVƏLKİ
   sluglarda BÖYÜK HƏRF var (`sasas-ve-sasasa-DDE863`), ona görə
   kiçik-hərf-only variant həmin toylarda foto/video/musiqi yükləməsini,
   qalereya linkini və RSVP oxunuşunu SƏSSİZCƏ bağlayırdı — dəvətnamənin
   özü isə açılırdı, yəni cütlük problemi toy gününə qədər görmürdü.

   Qayda `get_invitation.php`-dakı ƏN GENİŞ variantdır: mövcud heç bir
   slug sıradan çıxmır, yalnız əvvəllər rədd edilənlər indi qəbul edilir.
   Path traversal qapalı qalır: nöqtə, kəsik və boşluq yoxdur. */
function isValidSlug($slug): bool {
    return is_string($slug) && preg_match('/^[a-zA-Z0-9\-]{2,120}$/', $slug) === 1;
}

/* ── Dəvətnamə həqiqətən mövcuddurmu? ──
   NƏ ÜÇÜN: yazma endpointləri slug-un formatını yoxlayırdı, amma real
   dəvətnaməyə aid olduğunu YOX. Uydurma slug göndərən hər sorğu serverdə
   yeni qovluq yaradır və 90 MB-a qədər fayl yazdıra bilirdi. */
function invitationExists(PDO $db, string $slug): bool {
    try {
        $q = $db->prepare('SELECT 1 FROM invitations WHERE slug = :s LIMIT 1');
        $q->execute([':s' => $slug]);
        return (bool) $q->fetchColumn();
    } catch (Throwable $e) {
        /* FAIL-OPEN: DB oxunmursa qonağın yükləməsini bloklamırıq —
           toy günü işləyən axını sındırmaq, sui-istifadə riskindən pisdir. */
        return true;
    }
}

/* ── Etibarlı müştəri IP-si ──
   NƏ ÜÇÜN: rate limit `HTTP_X_FORWARDED_FOR`-dan açarlanırdı, o isə
   MÜŞTƏRİNİN göndərdiyi başlıqdır — hər sorğuda dəyişdirməklə limit
   tamamilə keçilirdi. İndi XFF yalnız sorğu ETİBARLI proxy-dən gəldikdə
   oxunur; əks halda TCP-dən gələn `REMOTE_ADDR` işlədilir.
   TRUSTED_PROXIES env faylında təyin edilə bilər (CIDR yox, dəqiq IP). */
function clientIp(): string {
    $remote = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $trusted = defined('TRUSTED_PROXIES') ? (array) TRUSTED_PROXIES : [];

    if ($trusted && in_array($remote, $trusted, true) && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        /* Zəncirdəki İLK dəyər orijinal müştəridir */
        $first = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
        if (filter_var($first, FILTER_VALIDATE_IP)) return $first;
    }
    return $remote;
}

/* ── Admin əməliyyat jurnalı (Phase 39) ──
   Dağıdıcı əməliyyatların izi. Admin identifikatoru kimi tokenin `iat`
   hissəsi saxlanılır — sistemdə istifadəçi hesabı yoxdur, amma bu, bir
   giriş seansını digərindən ayırmağa imkan verir.
   ⚠ Heç vaxt istisna atmır: jurnal yazıla bilməsə əsas əməliyyat davam edir. */
function adminAuditLog(string $action, ?string $slug = null, ?string $detail = null): void {
    try {
        $db = getDB();
        $actor = 'unknown';
        $tok = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
        if ($tok === '' && !empty($_SERVER['HTTP_AUTHORIZATION'])
            && preg_match('/^Bearer\s+(.+)$/i', $_SERVER['HTTP_AUTHORIZATION'], $m)) {
            $tok = trim($m[1]);
        }
        if ($tok !== '' && ($dot = strrpos($tok, '.')) !== false) {
            $raw = base64_decode(strtr(substr($tok, 0, $dot), '-_', '+/'));
            if ($raw && ($p = explode(':', $raw, 2)) && count($p) === 2) {
                $actor = 'session:' . $p[0];   /* token iat — seans kimliyi */
            }
        }
        $st = $db->prepare(
            'INSERT INTO admin_audit (action, slug, actor, ip, detail)
             VALUES (:a, :s, :ac, :ip, :d)'
        );
        $st->execute([
            ':a'  => substr($action, 0, 60),
            ':s'  => $slug !== null ? substr($slug, 0, 120) : null,
            ':ac' => substr($actor, 0, 64),
            ':ip' => substr(clientIp(), 0, 45),
            ':d'  => $detail !== null ? substr($detail, 0, 500) : null,
        ]);
    } catch (Throwable $e) {
        /* jurnal əsas əməliyyatı heç vaxt bloklamır */
    }
}

/* ── Media indeksi (Phase 39) — TƏK MƏNBƏ ──
   `photos` cədvəli sxemdə var idi, amma HEÇ VAXT doldurulmurdu: qalereya da,
   dashboard da fayl sistemini gəzirdi. İki yükləmə yolu var və onlar AYRI
   saxlama məntiqi işlədir (`upload_photo.php` daxili, `upload_chunk.php` isə
   `media_store.php`), ona görə indeksləmə hər ikisinin çağırdığı bu funksiyadadır.

   ⚠ QALEREYA DAVRANIŞI DƏYİŞMİR — `get_photos.php` olduğu kimi qovluğu oxuyur.
   Cədvəl yalnız sayğac və hesabat üçündür, ona görə indeksin boş və ya
   natamam olması heç nəyi sındırmır.
   ⚠ Heç vaxt istisna atmır: indeks yazıla bilməsə media onsuz da diskdədir. */
function indexMediaRow(string $slug, string $filename, string $mime, int $size): void {
    try {
        $st = getDB()->prepare(
            'INSERT INTO photos (slug, url, filename, mime_type, file_size)
             VALUES (:s, :u, :f, :m, :z)'
        );
        $st->execute([
            ':s' => $slug,
            ':u' => '/uploads/' . $slug . '/' . $filename,
            ':f' => $filename,
            ':m' => $mime,
            ':z' => $size,
        ]);
    } catch (Throwable $e) {
        /* indeks köməkçidir — yükləmə uğurlu sayılır */
    }
}

/* ── Sürüşən pəncərəli sayğac (paylaşılan) ──
   `upload_photo.php`-dakı flock nümunəsinin ümumiləşdirilmiş variantı.
   TRUE qaytarırsa əməliyyata icazə var və sayğac artırılıb. */
function rateGate(string $key, int $limit, int $window): bool {
    $file = sys_get_temp_dir() . '/digitoy_rl_' . hash('sha256', $key) . '.json';
    $fp = @fopen($file, 'c+');
    if ($fp === false) return true;          /* yaza bilmiriksə bloklamırıq */

    $allowed = true;
    if (flock($fp, LOCK_EX)) {
        $raw  = stream_get_contents($fp);
        $data = $raw ? (json_decode($raw, true) ?: []) : [];
        $now  = time();
        $data = array_values(array_filter($data, fn($t) => ($now - $t) < $window));
        if (count($data) >= $limit) {
            $allowed = false;
        } else {
            $data[] = $now;
        }
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($data));
        fflush($fp);
        flock($fp, LOCK_UN);
    }
    fclose($fp);
    return $allowed;
}

/* ── Sxem versiyası (Phase 39) ──
   Sütun və ya cədvəl əlavə edəndə BU RƏQƏMİ ARTIR — əks halda miqrasiya
   canlıda işləməz. */
const SCHEMA_VERSION = 39;

/* ── Cədvəlləri avtomatik yarat ──
   Phase 39 OPTİMİZASİYASI: əvvəl bu funksiya HƏR sorğuda 6 `CREATE TABLE
   IF NOT EXISTS` + 6 `SHOW COLUMNS` icra edirdi — sorğu başına ~12 əlavə
   round-trip. İndi yalnız versiya sətri oxunur (1 sorğu); uyğundursa
   dərhal qayıdır. Miqrasiya yalnız versiya fərqli olanda işləyir.
   Davranış eynidir, sadəcə boş yerə təkrarlanmır. */
function ensureTables(): void {
    static $checked = false;
    if ($checked) return;                     /* eyni sorğuda ikinci çağırış: 0 sorğu */

    $db = getDB();
    try {
        $v = $db->query("SELECT meta_value FROM schema_meta WHERE meta_key = 'version' LIMIT 1")
                ->fetchColumn();
        if ($v !== false && (int) $v === SCHEMA_VERSION) {
            $checked = true;
            return;                           /* steady state: cəmi 1 sorğu */
        }
    } catch (Throwable $e) {
        /* schema_meta hələ yoxdur (ilk işə salma) → tam miqrasiya */
    }

    runMigrations($db);
    $checked = true;
}

/* Tam miqrasiya — yalnız sxem versiyası fərqli olanda çağırılır.
   Bütün addımlar idempotentdir, ona görə paralel iki sorğu təhlükəsizdir. */
function runMigrations(PDO $db): void {
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
    /* ── Phase 36: invitations.is_active — dəvətnamə linkinin açar/bağlar düyməsi ──
       NƏ ÜÇÜN: təsdiqlənmiş link ömürlük açıq qalırdı. Ödəniş geri alınanda və ya
       xidmət dayandırılanda admin-in linki bağlamaq imkanı yox idi.

       NƏ ÜÇÜN SÜTUN, form_data DEYİL: statusu dəyişmək üçün bütün form_data
       JSON blob-unu oxu-dəyiş-yaz etmək lazım gələrdi — paralel saxlamada
       dəvətnamə məzmununu itirmək riski var. Sütun atomikdir.

       ADDITIVE və IDEMPOTENT: DEFAULT 1, yəni MÖVCUD BÜTÜN dəvətnamələr
       avtomatik AKTİVdir. Slug, URL, QR, qalereya — heç birinə toxunmur.
       ROLLBACK: `ALTER TABLE invitations DROP COLUMN is_active;` — məlumat itmir. */
    $iaCols = $db->query("SHOW COLUMNS FROM invitations LIKE 'is_active'")->fetchAll();
    if (empty($iaCols)) {
        $db->exec("ALTER TABLE invitations ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1");
    }

    $dcCols = $db->query("SHOW COLUMNS FROM invitations LIKE 'draft_code'")->fetchAll();
    if (empty($dcCols)) {
        $db->exec("ALTER TABLE invitations ADD COLUMN draft_code VARCHAR(20) DEFAULT NULL");
        /* UNIQUE: bir sifariş → bir dəvətnamə. NULL-lar MySQL-də unikallığa
           daxil deyil, ona görə köhnə sətirlərin hamısı NULL qala bilər. */
        $db->exec("ALTER TABLE invitations ADD UNIQUE KEY uq_inv_draft_code (draft_code)");
    }

    /* ── Phase 39: admin əməliyyat jurnalı ──
       Dağıdıcı əməliyyatların izi. Tamamilə additivdir: heç bir mövcud
       cədvələ və ya axına toxunmur, yalnız yazılır.
       ROLLBACK: `DROP TABLE admin_audit;` */
    $db->exec("
        CREATE TABLE IF NOT EXISTS admin_audit (
            id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            action     VARCHAR(60)  NOT NULL,
            slug       VARCHAR(120) DEFAULT NULL,
            actor      VARCHAR(64)  NOT NULL DEFAULT 'unknown',
            ip         VARCHAR(45)  DEFAULT NULL,
            detail     VARCHAR(500) DEFAULT NULL,
            created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_audit_created (created_at),
            INDEX idx_audit_action  (action)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    /* ── Phase 39: sıralama indeksləri ──
       NƏ ÜÇÜN: admin siyahıları `ORDER BY created_at DESC` / `submitted_at DESC`
       işlədir, amma bu sütunlarda indeks yox idi → hər səhifə açılışında
       filesort. Yalnız indeksdir: sorğu nəticələri EYNİ qalır.
       ROLLBACK: `ALTER TABLE invitations DROP INDEX idx_inv_created;` və s. */
    $idx = [
        ['invitations',       'idx_inv_created',   'created_at'],
        ['draft_invitations', 'idx_draft_submitted','submitted_at'],
        ['photos',            'idx_photos_slug_at','slug, uploaded_at'],
    ];
    foreach ($idx as [$tbl, $name, $cols]) {
        try {
            $has = $db->query("SHOW INDEX FROM `$tbl` WHERE Key_name = '$name'")->fetchAll();
            if (empty($has)) $db->exec("ALTER TABLE `$tbl` ADD INDEX `$name` ($cols)");
        } catch (Throwable $e) {
            /* indeks əlavə edilə bilməsə sorğular işləməyə davam edir */
        }
    }

    /* ── Sxem versiyasını qeyd et ──
       Bu sətir olmasa ensureTables() hər sorğuda tam miqrasiya işlədər. */
    $db->exec("
        CREATE TABLE IF NOT EXISTS schema_meta (
            meta_key   VARCHAR(40) NOT NULL PRIMARY KEY,
            meta_value VARCHAR(80) NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    $st = $db->prepare(
        "INSERT INTO schema_meta (meta_key, meta_value) VALUES ('version', :v)
         ON DUPLICATE KEY UPDATE meta_value = VALUES(meta_value)"
    );
    $st->execute([':v' => (string) SCHEMA_VERSION]);
}

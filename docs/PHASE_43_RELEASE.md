# PHASE 43 — Qalereya və Təcrübə Yeniləməsi

**Buraxılış qeydləri və risk analizi**
Tarix: 2026-09-25 · Sxem versiyası: **39 → 43** · Deploy statusu: **hazırdır, deploy edilməyib**

---

## 1. Qısa xülasə

Doqquz xüsusiyyət əlavə olundu. Hamısı **additivdir**: mövcud dəvətnamələr,
qalereyalar, linklər və QR kodlar üçün **heç bir miqrasiya, heç bir dəyişiklik
tələb olunmur**. Yeni cədvəllərin hamısı boş olsa belə sistem əvvəlki kimi işləyir.

| # | Xüsusiyyət | Harada görünür |
|---|-----------|----------------|
| 1 | QR stend dizayneri (A5, 300 DPI PDF) | Admin → **QR Stend** |
| 2 | Qalereya üz qapağı | `/invite/:slug/qalereya-idare` |
| 3 | Canlı foto/video sayğacları | Qapaq, `/foto`, admin dashboard |
| 4 | Foto reaksiyaları ❤️ 😍 👏 🎉 | Qalereya lightbox-u |
| 5 | Seçilmiş media | Qalereya (idarəetmə linki ilə) |
| 6 | Slayd şou (TV/proyektor) | `/invite/:slug/slayd` *(yeni marşrut)* |
| 7 | Qalereya analitikası | Qalereya → «Statistika», Admin dashboard |
| 8 | Excel/CSV qonaq idxalı | Admin → Sifariş → Oturma Planı |
| 9 | «Bizim Hekayəmiz» bölməsi | Builder addım 10 + dəvətnamə |

---

## 2. Verilənlər bazası dəyişiklikləri

### Miqrasiya mexanizmi
Mövcud `ensureTables()` / `runMigrations()` axını işlədilir.
`SCHEMA_VERSION` **39 → 43**; ilk sorğuda miqrasiya bir dəfə işləyir, sonra
sxem yoxlaması yenə bir sorğuya (`schema_meta`) düşür.

### Yeni cədvəllər (4)

| Cədvəl | Məqsəd | Açar |
|--------|--------|------|
| `media_reactions` | qonaq reaksiyaları | `UNIQUE(slug, filename, visitor_id)` |
| `media_flags` | seçilmiş media | `UNIQUE(slug, filename)` |
| `gallery_events` | baxış / QR skan / yükləmə jurnalı | `INDEX(slug, created_at)` |
| `gallery_config` | qapaq + stend ayarları (JSON) | `PRIMARY KEY(slug)` |

### Yeni sütun (1)
`guests.phone VARCHAR(40) DEFAULT NULL` — Excel idxalında telefon sütunu.

### MÖVCUD sxemə toxunulmayanlar
`invitations`, `photos`, `guest_responses`, `draft_invitations`, `guests`
(yalnız yeni sütun), `attendance`, `admin_audit`, `schema_meta` — **heç bir
sütun silinmir, adı dəyişmir, tipi dəyişmir**.

### `schema_meta` — sxem versiyası necə idarə olunur
- Hər sorğuda `ensureTables()` yalnız `schema_meta.version`-u oxuyur (1 sorğu).
  Dəyər koddakı `SCHEMA_VERSION` ilə eynidirsə heç nə etmir, fərqlidirsə
  `runMigrations()`-u işə salır.
- `runMigrations()` versiyanı **ən sonda** yazır. Hər hansı addım xəta versə versiya
  yazılmır və növbəti sorğu miqrasiyanı yenidən sınayır. Bütün addımlar təkrar
  işləməyə davamlıdır; `guests.phone` ALTER-i eyni anda gələn iki sorğuya da davamlıdır.
- Phase 43 kodu `43`, Phase 42.1 kodu `39` yazır. **Kod rollback-ında versiyanı əl ilə
  dəyişmə** — köhnə kod ilk sorğuda onu özü `39`-a yazır.
- Deploy zamanı köhnə və yeni fayllar qısa müddət birlikdə işləsə versiya `39 ↔ 43`
  arasında dəyişə bilər. Hər dəyişiklik miqrasiyanı təkrar işlədir — xəta yox, yalnız
  əlavə yük. Bütün fayllar yenilənəndə dayanır.
- ⚠ Versiyanı əl ilə `43` yazma: yeni cədvəllər yoxdursa miqrasiya bir daha işləməz və
  yeni xüsusiyyətlər səssizcə sönər.

### Rollback

**Əsas yol — yalnız kodu geri qaytar, sxemə toxunma.**
Əvvəlki paketi (`digitoy-deploy-phase42-1-live-20260917.zip`) yenidən yüklə. SQL lazım
deyil və **heç bir məlumat itmir**:
- Phase 42.1 kodu yeni cədvəllərə baxmır, `guests`-ə həmişə sütun siyahısı ilə yazır —
  əlavə `phone` sütunu ona mane olmur.
- `schema_meta.version`-u köhnə kod ilk sorğuda özü `39`-a yazır (yuxarıya bax).
- Phase 43 məlumatı bazada qalır və Phase 43 yenidən deploy olunanda olduğu kimi qayıdır.
- MySQL 8.4-də test edildi: P43 → P42.1 → P43 — bütün cədvəllər və sətirlər yerində.

**Sxemi də silmək — yalnız həqiqətən lazımdırsa. Ardıcıllıq MƏCBURİDİR:**
1. Əvvəlcə kodu geri qaytar (yuxarıdakı addım) və saytın Phase 42.1 ilə işlədiyini yoxla.
2. Silinəcək məlumatın ehtiyat nüsxəsini al:
   ```bash
   mysqldump <db> media_reactions media_flags gallery_events gallery_config > p43_tables.sql
   mysql <db> -e "SELECT id, invitation_id, full_name, phone FROM guests WHERE phone IS NOT NULL" > p43_guest_phones.tsv
   ```
3. Yalnız bundan sonra:
   ```sql
   DROP TABLE media_reactions, media_flags, gallery_events, gallery_config;
   ALTER TABLE guests DROP COLUMN phone;
   UPDATE schema_meta SET meta_value = '39' WHERE meta_key = 'version';
   ```
   Son sətir versiyanı sxemin real vəziyyəti ilə uyğunlaşdırır: Phase 43 sonra yenidən
   deploy olunanda miqrasiya işləyir və cədvəllər yenidən yaranır.

⚠ **SQL-i Phase 43 kodu hələ canlıda ikən icra ETMƏ.** Versiya `39` olduğu üçün növbəti
adi sorğu Phase 43 miqrasiyasını yenidən işə salır və cədvəlləri **boş** halda yenidən
yaradır — rollback səssizcə ləğv olur, silinən məlumat isə geri gəlmir.

**Sxem rollback-ı ilə QALICI itən məlumat** (yalnız Phase 43-də yaranan):

| Silinən | İtən məlumat |
|---------|--------------|
| `media_reactions` | qonaqların bütün foto/video reaksiyaları |
| `media_flags` | «seçilmiş» media işarələri |
| `gallery_events` | qalereya analitikası: baxış, QR skan, yükləmə, slayd şou tarixçəsi |
| `gallery_config` | qalereya üz qapağı ayarları (data URI kimi saxlanan qapaq şəkli daxil) və QR stend dizaynları |
| `guests.phone` | Excel/CSV ilə idxal olunmuş telefon nömrələri |

**İTMİR:** dəvətnamələr (`invitations`), qalereya faylları (`uploads/`) və `photos`
indeksi, RSVP (`attendance`, `guest_responses`), qonaq sətirləri — Excel ilə idxal
olunanlar da qalır, yalnız telefonları silinir. «Bizim Hekayəmiz» blokları
`invitations.form_data`-dadır: SQL onlara toxunmur, Phase 42.1 isə onları sadəcə
göstərmir. Phase 42.1 redaktoru `form_data`-nı bütöv yükləyib bütöv saxladığı üçün
(`{...state, ...form_data}`) bloklar rollback müddətində redaktədə də qalır.

### ⚠ Sxem qeydi: ASCII charset
Yeni cədvəllərdə `slug`/`filename` sütunları `CHARACTER SET ascii COLLATE ascii_bin`-dir.
Səbəb: utf8mb4-də `(120 + 255) × 4 bayt` unikal açar köhnə InnoDB-nin 767 baytlıq
limitini aşır və miqrasiya köhnə MySQL-də sınardı. Slug (`[a-zA-Z0-9-]`) və fayl
adı (`[a-zA-Z0-9_\-.]`) onsuz da ASCII-dir.
`ascii_bin` Linux fayl sistemi ilə uyğundur (`IMG_1.jpg` ≠ `img_1.jpg`).

### ⚠ Sxem qeydi: `emoji` — `utf8mb4_bin`
`media_reactions.emoji` sütunu `CHARACTER SET utf8mb4 COLLATE utf8mb4_bin`-dir.
Səbəb: collation yazılmasa sütun serverin utf8mb4 default-unu alır.
`utf8mb4_general_ci` / `utf8mb4_unicode_ci`-də (MariaDB, MySQL 5.7) 😍 👏 🎉 bir-birinə
**bərabər** sayılır və `GROUP BY emoji` onları bir qrupa yığır — qalereyada, lightbox-da
və analitikada səhv say görünərdi. Production DB versiyası repoda qeyd olunmayıb, ona görə
sütun serverdən asılı olmamalıdır.

---

## 3. API dəyişiklikləri

### Yeni endpointlər (8)
| Endpoint | Metod | İcazə |
|----------|-------|-------|
| `gallery_meta.php` | GET | publik (deaktiv dəvətnamədə adlar verilmir) |
| `gallery_settings.php` | POST | admin **və ya** qalereya tokeni |
| `media_react.php` | POST | publik + IP limit (60 s / 40) |
| `media_feature.php` | POST | admin **və ya** qalereya tokeni |
| `gallery_track.php` | POST | publik + IP limit (60 s / 30) |
| `gallery_analytics.php` | GET | slug varsa qalereya/admin; slugsuz yalnız admin |
| `import_guests.php` | POST | **admin** |
| `gallery_media.php` | — | yalnız `include` (`.htaccess`-də bağlıdır) |

### Dəyişdirilən endpointlər (geriyə uyğun)

**`get_photos.php`** — parametrsiz sorğu **eyni cavabı** verir.
- Yeni **könüllü** parametrlər: `sort=newest|oldest|featured` (default `newest`, yəni Phase 39 davranışı), `visitor=<hex>`
- Elementlərə **əlavə** açarlar: `featured`, `reactions`, `reactionTotal`, `myReaction`
- Cavaba **əlavə**: `counts: {photos, videos, total}`, `sort`
- Mövcud açarların **heç biri dəyişmir/silinmir**

**`get_guests.php`** — cavaba `phone` sahəsi əlavə olundu.
Sütun yoxdursa sorğu köhnə variantına düşür (FAIL-OPEN) və `phone: null` qayıdır.

**`upload_photo.php` / `media_store.php`** — yükləmədən sonra
`galleryEvent($slug, 'upload')` çağırılır (heç vaxt istisna atmır).
Çağırış `function_exists('galleryEvent')` ilə qorunur (`gallery_track.php`-də də):
deploy zamanı köhnə `config.php` ilə qarşılaşsa fatal vermir, hadisə sadəcə yazılmır.
⚠ `upload` hadisəsini **yalnız server** yazır — client onu uydura bilmir.

**`delete_photo.php`** — media ilə birlikdə onun `media_reactions` /
`media_flags` sətirləri də silinir (orfan qalmasın).

**`config.php`** — `galleryEvent()` köməkçisi, yeni DDL, `SCHEMA_VERSION = 43`
və CORS düzəlişi (aşağıya bax).

### ⚠ CORS düzəlişi (əvvəldən mövcud qüsur)
`Access-Control-Allow-Headers`-ə `If-None-Match, If-Modified-Since`,
`Access-Control-Expose-Headers`-ə `ETag, Last-Modified` əlavə olundu.

Bu başlıqlar Phase 39-dan bəri `getPhotos` tərəfindən göndərilirdi, amma CORS
«safelist»də deyil. **Canlıda təsiri yox idi** (frontend və API eyni origin-dədir),
lakin cross-origin rejimdə (lokal dev, gələcəkdə ayrı API domeni) qalereyanın
30 saniyəlik avtomatik yenilənməsi tamamilə dayanırdı. Production davranışı
**dəyişmir**.

---

## 4. Marşrutlar

| Marşrut | Vəziyyət |
|---------|----------|
| `/invite/:slug` | **dəyişmir** |
| `/invite/:slug/foto` | **dəyişmir** (üstünə canlı sayğac + toy adı əlavə olundu) |
| `/invite/:slug/qalereya-idare` | **dəyişmir** (üstünə qapaq, sıralama, reaksiya, statistika) |
| `/invite/:slug/slayd` | **YENİ** — slayd şou, `noindex, nofollow` |
| `/admin/qrstand` | **YENİ** — QR stend dizayneri |

Mövcud QR kodlar `/foto`-ya gedir və **toxunulmayıb**.
Qalereya idarəetmə linkləri (`?k=…`) **əvvəlki kimi işləyir**.

---

## 5. Geriyə uyğunluq qaydaları

1. **«Bizim Hekayəmiz» DEFAULT BAĞLIDIR.** Ümumi bölmə qaydası «açar yoxdursa
   AÇIQ»-dır; bu bölmə üçün tərsinədir (`data/sections.js › DEFAULT_OFF`).
   Əks halda minlərlə köhnə dəvətnamədə **boş blok** peyda olardı.
2. **Bölmə fonlarının ritmi qorunur.** `TemplateShell`-də `lsShift` yalnız
   hekayə açıq olanda 1-dir → köhnə dəvətnamələrdə ton indeksləri **eynidir**.
3. **Qalereya sıralaması.** Server defaultu `newest` olaraq **qalır**; yalnız
   qalereya səhifəsi özü `featured` istəyir və istifadəçi menyudan köhnə
   sıralamaya qayıda bilər.
4. **Yeni cədvəllərin hər oxunuşu `try/catch` içindədir.** Cədvəl yoxdursa
   (miqrasiya hələ işləməyib) xüsusiyyət sadəcə görünmür, səhifə sınmır.
5. **`getPhotos(slug)`** imzası dəyişmir — ikinci arqument könüllüdür.

---

## 6. Yeni asılılıq: **YOXDUR**

| Ehtiyac | Həll | Niyə yeni kitabxana yox |
|---------|------|-------------------------|
| XLSX oxumaq | `jszip` (artıq var) + brauzerin `DOMParser`-i | XLSX bir ZIP arxividir |
| PDF yaratmaq | 300 DPI canvas → JPEG → əl ilə qurulmuş 1 səhifəlik PDF | `jspdf`+`html2canvas` ≈ 350 KB; həm də standart PDF şriftlərində **`Ə` hərfi yoxdur** |
| Qrafiklər | CSS flex + height (`ui/GalleryCharts.jsx`) | chart kitabxanası 50–150 KB |
| QR | `qrcode.react` (artıq var) — `QRCodeCanvas` | — |

**Bundle təsiri:** `GalleryPage` 16.4 KB → 49.5 KB (gzip 5.2 → 13.0 KB),
`AdminApp` 123 KB → 167 KB (gzip 28.6 → 41.6 KB, yalnız admin üçün),
`SlideshowPage` 10.1 KB (yeni, ayrı chunk).
**Landing və dəvətnamə marşrutlarına təsir praktiki olaraq sıfırdır.**

---

## 7. Risk analizi

### 🔴 YÜKSƏK — diqqət tələb edir

**R1. Miqrasiya canlı bazada ilk sorğuda işləyir**
`ALTER TABLE guests ADD COLUMN phone` böyük `guests` cədvəlində qısa müddət
kilid yarada bilər.
→ *Azaldılma:* sütun `NULL` qəbul edir və default dəyəri yoxdur (MySQL 8-də
instant DDL). Yenə də **deploy az trafikli saatda** edilməlidir.
→ *Yoxlama:* MySQL 8.4-də test edildi — 8 → 12 cədvəl, 325 ms, ikinci keçid
80 ms (idempotent).

**R2. «Bizim Hekayəmiz» şəkilləri `form_data` JSON-unun içindədir**
Builder anında slug hələ yoxdur, ona görə şəkil fayl kimi yüklənə bilmir.
Şəkillər data URI kimi saxlanılır → dəvətnamə JSON-u ağırlaşır.
→ *Azaldılma:* blok sayı **8-lə** məhdudlanıb, hər şəkil **≤ 260 KB**-a
kiçildilir (1000px, JPEG q≈0.72), ümumi yük builder-də **canlı göstərilir** və
900 KB-ı keçəndə istifadəçiyə xəbərdarlıq çıxır.
→ *Qalan risk:* 8 şəkilli hekayə dəvətnaməyə ~1.5 MB əlavə edir. Bölmə default
bağlı olduğu üçün bu **yalnız onu açan cütlüklərə** aiddir.
→ *Tövsiyə:* canlıda ilk aylarda `form_data` ölçüsünə nəzarət edin
(`SELECT slug, LENGTH(form_data) FROM invitations ORDER BY 2 DESC LIMIT 20`).

### 🟡 ORTA

**R3. Reaksiyalarda qonaq kimliyi brauzerdəndir**
`localStorage`-dəki təsadüfi hex. Yeni id yaradıb təkrar səs vermək mümkündür.
→ *Azaldılma:* IP üzrə sürüşən limit (60 s / 40 reaksiya), fayl mövcudluğu
yoxlanışı, emoji ağ siyahısı, DB-də `UNIQUE` açar.
→ *Qəbul edilən:* toy qalereyasında giriş tələb etmək reaksiyaları tamamilə
öldürür — bu tarazlıq qəsdəndir.

**R4. `get_photos.php` ETag-ə iki yeni aqreqat sorğusu əlavə olundu**
`galleryMetaVersion()` hər sorğuda `COUNT(*) + MAX(updated_at)` oxuyur.
→ *Azaldılma:* hər ikisi indekslənmiş `slug` üzrədir və cədvəllər kiçikdir.
Cədvəl yoxdursa `try/catch` sabit dəyər qaytarır.
→ *Qalan risk:* reaksiya verilən kimi ETag dəyişir → açıq tabların növbəti
sorğusu 304 yox, 200 alır. Manifest kiçikdir, amma çox aktiv qalereyada
(yüzlərlə reaksiya) trafik artır.

**R5. Slayd şou saatlarla açıq qalır**
→ *Azaldılma:* interval **yalnız tab görünəndə** işləyir, ETag sayəsində
dəyişiklik olmayanda cavab 304-dür, `wakeLock` dəstəklənən brauzerlərdə alınır.

**R6. Qapaq şəkli data URI ola bilər (≤ 1.5 MB)**
`gallery_config.config` MEDIUMTEXT-dir, limit serverdə yoxlanılır.
→ *Qalan risk:* qapaq hər qalereya açılışında yüklənir (keşlənmir, çünki JSON
içindədir). Alternativ: mövcud qalereya şəklini seçmək (URL) — UI hər ikisini
təklif edir və **default avtomatik seçimdir** (seçilmiş/ən yeni foto).

### 🟢 AŞAĞI

**R7. Excel idxalı brauzerdə parse olunur** — server yalnız JSON alır.
Serverə yeni fayl qəbul yolu **açılmır**. Limit: 2000 sətir, tək tranzaksiya.

**R8. `_p43` cədvəlləri boşdursa** — bütün yeni xüsusiyyətlər səssizcə sönür.

**R9. QR stend PDF-i canvas əsaslıdır** — mətn vektor deyil, 300 DPI rastrdır.
Çap evi üçün kifayətdir; əvəzində `Ə Ğ İ Ş Ö Ü Ç` hərfləri **zəmanətlə** düzgün
çıxır (standart PDF şriftlərində `Ə` ümumiyyətlə yoxdur).

---

## 8. Test nəticələri

### Verilənlər bazası (MySQL 8.4.3, real server)
- ✅ 39 → 43 miqrasiyası: 8 → 12 cədvəl, **silinən yoxdur**, 325 ms
- ✅ İdempotentlik: ikinci keçid xətasız (80 ms)
- ✅ `UNIQUE(slug, filename, visitor_id)`: eyni qonaq ikinci dəfə reaksiya
  verəndə **yeni sətir yaranmır**, emoji dəyişir
- ✅ utf8mb4 emoji roundtrip: `❤️` 6 bayt, tam bərpa
- ✅ `ascii_bin` registr həssaslığı: `a.jpg` ≠ `A.JPG`
- ✅ `guests.phone` insert/select
- ✅ Mövcud 8 sorğu (invitations, photos, guest_responses, draft_invitations,
  guests+attendance join, admin_audit, dashboard sayğacı) — **hamısı işləyir**

### HTTP (PHP 8.3.30 daxili server)
- ✅ `get_photos.php` parametrsiz → **əvvəlki cavab** + yeni açarlar
- ✅ ETag → 304 şərti GET
- ✅ `sort=featured` seçilmişi önə çıxarır; `sort` verilməyəndə sıra **dəyişmir**
- ✅ Reaksiya: ver / dəyiş / geri al; ağ siyahıdan kənar emoji → 422;
  olmayan fayl → 404; path traversal (`../../config.php`) → 400
- ✅ `media_feature`: tokensiz → 401; **başqa toyun tokeni → 401 (IDOR bağlı)**
- ✅ `gallery_track`: `visit` gündə bir dəfə sayılır; client `upload` yaza bilmir
- ✅ `gallery_analytics`: tokensiz → 401; qalereya tokeni ilə → tam hesabat
- ✅ `gallery_settings`: qismi yeniləmə — cütlük qapağı saxlayanda **adminin
  stend ayarları itmir**; naməlum maket → `classic`; `../../config.php` → rədd
- ✅ `import_guests`: dry-run hesabatı, təkrar müdafiəsi (registr + boşluq +
  AZ translit: `ƏLİ MƏMMƏDOV` = `əli  məmmədov`), boş ad, rəqəm-ad, telefon
  təmizləmə, 2001 sətir → 413, tokensiz → 401
- ✅ **Yükləmə (hər iki yol)**: `upload_photo.php` və `upload_chunk.php` →
  fayl + thumbnail + `photos` indeksi + `upload` hadisəsi
- ✅ **Silmə**: fayl silinir, orfan reaksiya/seçim sətirləri təmizlənir

### Brauzer (Chromium, real DOM)
- ✅ Qalereya qapağı — masaüstü (1280) və mobil (390), **üfüqi sürüşmə yoxdur**
- ✅ Statistika paneli — 8 göstərici, tarix/saat qrafikləri, reaksiya bölgüsü
- ✅ İdarəetmə linki (`?k=…`): token saxlanılır, URL təmizlənir, idarəetmə
  düymələri görünür
- ✅ Slayd şou: seçilmiş foto birinci, bulanıq fon, Ken Burns, idarəetmə
  4 saniyədən sonra gizlənir
- ✅ **Yeni yükləmə avtomatik gəlir**: qalereyaya 2 foto əlavə edildi →
  20 saniyə sonra «+2 yeni» nişanı (**bir dəfə**, ikiqat sayılmadan),
  sayğac 9 → 11
- ✅ Reaksiya: lightbox-da toxunuş → UI dəyişir → **serverdə saxlanılır**
- ✅ QR stend: 4 maket, A5 (419.53 × 595.28 pt), 1748 × 2480 px,
  **xref cədvəli düzgün**, `%PDF-1.4` … `%%EOF`
- ✅ XLSX parsing: başlıq 3-cü sətirdə, sütunlar tərs sırada
  (masa | ad | telefon), vərəq adı `sheet1.xml` **deyil** — hamısı düzgün
- ✅ CSV: BOM, `;` ayırıcı, dırnaq içində vergül, sətirdaxili yeni sətir, `""`
- ✅ «Bizim Hekayəmiz»: 4 blok, zaman xətti, hər blokda şəkil,
  **AZ/EN/RU tam tərcümə** (ay adları daxil)

### Build və lint
- ✅ `npm run build` — uğurlu
- ✅ Yeni fayllar layihənin mövcud lint profilindən **kənara çıxmır**
  (yalnız `react-hooks/set-state-in-effect` və
  `react-refresh/only-export-components` — hər ikisi kod bazasında onsuz da
  25+ və 7 dəfə mövcuddur)

---

## 9. Testdə tapılıb düzəldilən qüsurlar

| # | Qüsur | Səbəb | Düzəliş |
|---|-------|-------|---------|
| 1 | Slayd şou **yeni yükləmələri göstərmirdi** | `knownRef` mutasiyası `setItems` updater-inin İÇİNDƏ idi; React updater-i iki dəfə çağırır və ikinci çağırış yeniləri «məlum» sayırdı | bütün hesablama updater-dən kənara çıxarıldı |
| 2 | Cross-origin rejimdə qalereya **yenilənmirdi** | `If-None-Match` / `If-Modified-Since` CORS preflight-də icazəli deyildi (Phase 39-dan bəri) | `Allow-Headers` + `Expose-Headers` |
| 3 | XLSX-də **bəzək başlığı** başlıq sətri sayılırdı | hissəvi uyğunluq uzun mətnə də tətbiq olunurdu, ilk namizəd dərhal qəbul edilirdi | bal sistemi + qısa xana həddi + `ad` **və** başqa sütun tələbi |
| 4 | Stend maketində **QR səhifədən çıxırdı** | tək istiqamətli `y` axını, sabit şəkil ölçüsü | «ölç → böl → çiz» quruluşu, alt blok dibə lövbərlənir |
| 5 | Stend mətni **QR üzərinə düşürdü** | mətn hündürlüyü əvvəlcədən bilinmirdi | mətn bloku əvvəlcə ölçülür, şəkil qalan yerə görə kiçilir |
| 6 | İzah sonunda **artıq «…»** | `wrapText` ellipsis-i şərtsiz əlavə edirdi | yalnız həqiqətən kəsiləndə |
| 7 | Stend şəkli **görünmürdü** (dev) | `crossOrigin` bütün ünvanlara qoyulurdu | yalnız xarici origin üçün |
| 8 | Qapaq ayarları **stend ayarlarını sıfırlayırdı** | endpoint konfiqurasiyanı sıfırdan qururdu | server tərəfi merge |
| 9 | «Hamısını aç» **hekayəni açmırdı**; switch **səhv vəziyyət göstərirdi** | `sections?.[id] !== false` DEFAULT_OFF bölməsini görmür | hər iki yerdə `isSectionOn` |
| 10 | Hekayə masaüstündə **böyük ölü boşluq** | növbələşən iki sütun + dəyişkən şəkil hündürlüyü | hər ölçüdə tək sütun |
| 11 | *(audit)* Deploydan sonrakı ilk **paralel** sorğularda miqrasiya 500 verirdi | `guests.phone`: `SHOW COLUMNS` → `ALTER` arasında iki sorğu da sütunu görmürdü, ikincisi `1060 Duplicate column` atırdı (testdə 6 prosesdən 5-i) | ALTER `try/catch`-də, **yalnız 1060** udulur; başqa hər xəta əvvəlki kimi yuxarı ötürülür |
| 12 | *(audit)* MariaDB / MySQL 5.7-də 😍 👏 🎉 **sayları birləşirdi** | `emoji` sütunu serverin utf8mb4 default-unu alırdı | `emoji … COLLATE utf8mb4_bin` |
| 13 | *(audit)* Deploy zamanı yükləmə faylı **saxlayıb 500 qaytarırdı** | `upload_photo.php` və `gallery_track.php` `galleryEvent()`-i qorumasız çağırırdı; köhnə `config.php` ilə fatal | `function_exists('galleryEvent')` — `media_store.php`-dəki kimi |

---

## 10. Deploy addımları

1. **Backup**: `mysqldump` + `uploads/` qovluğu.
2. Paketi **yalnız skriptlə** qur və yüklə:
   ```bash
   npm run build
   python scripts/make-deploy-zip.py phase43    # → ../digitoy-deploy-phase43.zip
   ```
   ZIP `public_html/`-in içinə açılır.
   ⚠ **`config.production.php` ZIP-ə DÜŞMƏMƏLİDİR.** `npm run build` `public/api/`-ni
   bütöv `dist/api/`-yə kopyalayır, yəni `dist/api/`-də `config.production.php` və
   `config.local.php` də olur. Skript bu iki faylı atır, sızma olarsa ZIP-i silib
   dayanır — çıxışda `✓ sirr faylı yoxdur` görünməlidir. `public/api/*` və ya `dist/*`-u
   **əl ilə yükləmə**: serverdəki `config.production.php` (production DB girişi,
   `ADMIN_KEY`) lokal nüsxə ilə əvəz olunar. Yükləmədən əvvəl yoxla:
   ```bash
   unzip -l ../digitoy-deploy-phase43.zip | grep config   # yalnız api/config.php və api/config.example.php
   ```
   ⚠ `api/.htaccess` **mütləq** yenilənməlidir (ZIP-dədir) — `gallery_media.php`
   birbaşa HTTP girişindən bağlanır.
3. İlk sorğu miqrasiyanı işə salır. Yoxlama:
   ```sql
   SELECT meta_value FROM schema_meta WHERE meta_key = 'version';  -- 43
   SHOW TABLES LIKE 'media_%';                                     -- 2 sətir
   SHOW COLUMNS FROM guests LIKE 'phone';                          -- 1 sətir
   SELECT COLLATION_NAME FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'media_reactions'
      AND COLUMN_NAME = 'emoji';                                   -- utf8mb4_bin
   ```
4. Duman testi:
   - mövcud bir dəvətnamə açılır (dizayn dəyişməyib),
   - mövcud bir qalereya açılır (şəkillər yerində, qapaq görünür),
   - `/invite/<slug>/foto` işləyir, bir şəkil yüklənir,
   - `/invite/<slug>/slayd` açılır,
   - Admin → QR Stend → bir toy seçilir → PDF endirilir.
5. Problem olarsa: **§2 «Rollback»**. Əvvəlcə yalnız kodu geri qaytar (əvvəlki ZIP) —
   bu, tam rollback-dır və məlumat itmir. Sxemi silmək yalnız lazım olsa və yalnız
   ondan SONRA; ardıcıllıq, ehtiyat nüsxə və itən məlumat §2-dədir.

---

## 11. Deploy-dan sonra nəzarət

- `gallery_events` cədvəlinin böyüməsi (çox aktiv qalereyalarda sürətlə artır;
  gələcəkdə 90 gündən köhnə sətirlərin təmizlənməsi planlaşdırıla bilər)
- `form_data` ölçüsü (bax R2)
- `admin_audit`-də `gallery_settings`, `media_feature`, `guest_import` qeydləri
- Qalereya səhifəsinin yüklənmə vaxtı (manifest indi bir qədər böyükdür)

---

## 12. Bilinən məhdudiyyətlər (qəsdən)

- **Qonaq idxalı UI-si** yalnız sifariş detalındaki oturma planındadır —
  ayrıca «Qonaqlar» bölməsi yaradılmadı (mövcud naviqasiya dəyişməsin deyə).
- **QR stend PDF-i tək səhifədir** — bir faylda çoxlu stend yoxdur.
- **Slayd şou video-nu 30 saniyədə kəsir** — uzun video slayd şounu dayandırmasın.
- **Reaksiyalar anonimdir** — kimin nə verdiyi göstərilmir (yalnız sayğac).
- **«Bizim Hekayəmiz» şəkilləri `form_data`-dadır** — bax R2.

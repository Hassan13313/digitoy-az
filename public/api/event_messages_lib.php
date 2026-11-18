<?php
/* ══════════════════════════════════════════════════════════════════════════
   DIGITOY.AZ — Toy günü təbriki və rəy mesajları (2026-11-18), YARI-AVTOMATİK

   WhatsApp-ın rəsmi API-si (Meta təsdiqi, ödənişli şablonlar) olmadan və
   qeyri-rəsmi botlarla nömrəni riskə atmadan: admin panelində hər gün
   «Bu gün tədbiri olanlar» (təbrik) və «2 gün əvvəl tədbiri olanlar» (rəy)
   siyahısı çıxır; düymə WhatsApp-ı hazır mətnlə açır, admin «Göndər» basır.
   Bu fayl saf funksiyalardır (DB-siz test: tests/event_messages_test.php).
   ══════════════════════════════════════════════════════════════════════════ */

const EVENT_MSG_TZ = 'Asia/Baku';
const EVENT_MSG_REVIEW_AFTER_DAYS = 2;   /* tədbirdən 2 gün sonra rəy */
const EVENT_MSG_REVIEW_WINDOW     = 7;   /* buraxılsa 7 günə qədər siyahıda qalır */

/** Müraciət adı: cütlükdə «Bəy və Gəlin», digərlərində ad / tədbir adı */
function eventMsgNames(array $fd): string {
    $type  = (string) ($fd['eventType'] ?? 'toy');
    $groom = trim((string) ($fd['groomName'] ?? ''));
    $bride = trim((string) ($fd['brideName'] ?? ''));
    if (in_array($type, ['toy', 'nishan'], true) && $groom !== '' && $bride !== '') return "$groom və $bride";
    if (in_array($type, ['corporate', 'other'], true)) return trim((string) ($fd['eventName'] ?? '')) ?: $bride;
    return $bride !== '' ? $bride : $groom;
}

/** [təbrik üçün «…-nüzü», rəy üçün «…-nüz»] */
function eventMsgPhrases(string $type): array {
    return match ($type) {
        'toy'          => ['toy gününüzü', 'toyunuz'],
        'nishan'       => ['nişan gününüzü', 'nişanınız'],
        'xina'         => ['xına gecənizi', 'xına gecəniz'],
        'birthday'     => ['ad gününüzü', 'ad gününüz'],
        'sunnet'       => ['sünnət toyunuzu', 'sünnət toyunuz'],
        'anniversary'  => ['ildönümünüzü', 'ildönümünüz'],
        'graduation'   => ['məzuniyyət gününüzü', 'məzuniyyət gecəniz'],
        'bachelorette' => ['qız gecənizi', 'qız gecəniz'],
        default        => ['bu xoş gününüzü', 'tədbiriniz'],
    };
}

function buildCongratsText(array $fd, ?string $photoUrl = null): string {
    $names = eventMsgNames($fd);
    [$day] = eventMsgPhrases((string) ($fd['eventType'] ?? 'toy'));
    $hi    = $names !== '' ? "Hörmətli $names!" : 'Hörmətli müştərimiz!';
    $text  = "$hi 💐\nDigiToy ailəsi olaraq $day ürəkdən təbrik edirik. Bir ömür sevgi, xoşbəxtlik və bərəkət arzulayırıq!";
    if ($photoUrl) $text .= "\n\nQonaqlarınız bu günün şəkil və videolarını bu linkdən paylaşa bilər: $photoUrl";
    return $text;
}

function buildReviewText(array $fd): string {
    $names = eventMsgNames($fd);
    $first = $names !== '' ? explode(' və ', $names)[0] : '';
    [, $past] = eventMsgPhrases((string) ($fd['eventType'] ?? 'toy'));
    $hi = $first !== '' ? "Salam, $first!" : 'Salam!';
    return "$hi 🤍\nÜmid edirik ki, $past unudulmaz keçdi. DigiToy dəvətnaməsi haqqında fikriniz bizim üçün çox dəyərlidir: "
         . "nəyi bəyəndiniz, nəyi daha yaxşı edə bilərik? Bir-iki cümlə yazsanız, çox sevinərik. Təşəkkür edirik! — DigiToy";
}

/**
 * Hansı sifarişə bu gün hansı mesaj düşür.
 * @param array  $rows  [['code','slug','phone','fd'=>array,'gallery'=>bool,'sent'=>['congrats'=>?string,'review'=>?string]]]
 * @param string $today Y-m-d (Bakı vaxtı)
 * @return array ['congrats' => [...], 'review' => [...]]
 */
function eventMessagesDue(array $rows, string $today, string $site = 'https://digitoy.az'): array {
    $out = ['congrats' => [], 'review' => []];
    $t0  = strtotime($today . ' 00:00:00 UTC');
    foreach ($rows as $r) {
        $fd   = is_array($r['fd'] ?? null) ? $r['fd'] : [];
        $date = (string) ($fd['date'] ?? '');
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || empty($r['phone'])) continue;
        $days = (int) round(($t0 - strtotime($date . ' 00:00:00 UTC')) / 86400);   /* tədbirdən keçən gün */
        $base = [
            'code'  => $r['code'], 'slug' => $r['slug'], 'phone' => $r['phone'],
            'names' => eventMsgNames($fd), 'eventType' => (string) ($fd['eventType'] ?? 'toy'), 'date' => $date,
        ];
        if ($days === 0) {
            $photo = !empty($r['gallery']) && !empty($r['slug']) ? "$site/invite/{$r['slug']}/foto" : null;
            $out['congrats'][] = $base + ['text' => buildCongratsText($fd, $photo), 'sentAt' => $r['sent']['congrats'] ?? null];
        }
        if ($days >= EVENT_MSG_REVIEW_AFTER_DAYS && $days <= EVENT_MSG_REVIEW_WINDOW
            && ($days === EVENT_MSG_REVIEW_AFTER_DAYS || empty($r['sent']['review']))) {
            $out['review'][] = $base + ['text' => buildReviewText($fd), 'sentAt' => $r['sent']['review'] ?? null, 'late' => $days > EVENT_MSG_REVIEW_AFTER_DAYS];
        }
    }
    return $out;
}

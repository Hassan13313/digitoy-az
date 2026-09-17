# Cihaz matrisi fixture-ları

`tests/device_matrix_test.mjs` üçün media faylları.

⚠ **Bu fayllar repo-da SAXLANILMIR** (`.gitignore`): `vid_100mb.mp4` ~97 MB-dır
və git tarixini şişirdərdi. Lazım olanda aşağıdakı əmrlərlə yenidən qurulur.

| Fayl | Ölçü | Nə üçün |
|---|---|---|
| `phone_photo_12mp.jpg` | 4000×3000, ~2.5 MB | telefon şəkli — client sıxılması, EXIF, orientasiya |
| `real_video.mp4` | 1280×720 H.264, ~0.13 MB | video posteri (`<video>` + canvas) |
| `vid_100mb.mp4` | 854×480 H.264, ~97 MB | hissəli yükləmə: yarıda kəsmə + davam + offline |

## Yenidən yaratmaq

```bash
mkdir -p tests/fixtures
```

**12MP şəkil** (PHP GD ilə — düz rəng DEYİL, yoxsa qeyri-real sıxılır):

```bash
php -r '$w=4000;$h=3000;$im=imagecreatetruecolor($w,$h);
for($y=0;$y<$h;$y+=4)for($x=0;$x<$w;$x+=4){
  $c=imagecolorallocate($im,
    max(0,min(255,(int)(120+100*sin($x/300)+mt_rand(-18,18)))),
    max(0,min(255,(int)(130+90*cos($y/260)+mt_rand(-18,18)))),
    max(0,min(255,(int)(140+80*sin(($x+$y)/400)+mt_rand(-18,18)))));
  imagefilledrectangle($im,$x,$y,$x+3,$y+3,$c);}
imagejpeg($im,"tests/fixtures/phone_photo_12mp.jpg",88);'
```

**Qısa video:**

```bash
ffmpeg -y -f lavfi -i "testsrc=size=1280x720:rate=30:duration=6" \
       -f lavfi -i "sine=frequency=440:duration=6" \
       -c:v libx264 -preset veryfast -pix_fmt yuv420p -c:a aac \
       -movflags +faststart -shortest tests/fixtures/real_video.mp4
```

**~100 MB video** — ⚠ `testsrc` İŞLƏMİR (çox yaxşı sıxılır, 12 MB çıxır);
küy + CBR lazımdır. CRF ilə isə əksinə 1.3 GB olur:

```bash
ffmpeg -y -f lavfi -i "nullsrc=size=854x480:rate=25:duration=60,geq=random(1)*255:128:128" \
       -c:v libx264 -preset ultrafast -pix_fmt yuv420p \
       -b:v 13500k -minrate 13500k -maxrate 13500k -bufsize 27000k \
       -nal-hrd cbr -movflags +faststart tests/fixtures/vid_100mb.mp4
```

⚠ Ölçü **100 MB-dan AŞAĞI** qalmalıdır: serverdə `upload_max_filesize=100M`.
Test faylın rədd edilməsini yox, **hissə-hissə keçib davam etməsini** yoxlayır.

⚠ Playwright-in öz ffmpeg-i (`ms-playwright/ffmpeg-*`) BU İŞƏ YARAMIR —
orada yalnız VP8/PNG var, mp4 muxer-i yoxdur. Sistem ffmpeg-i lazımdır.

## İşlətmək

```bash
BASE=https://digitoy.az MEDIA=tests/fixtures node tests/device_matrix_test.mjs
```

⚠ Test **REAL yükləmə** edir. Serverdə bu sluglar mövcud və qalereyası açıq
olmalıdır: `zz-dev-ios`, `zz-dev-android`, `zz-dev-desktop`, `zz-dev-resume`,
`zz-dev-offline`. Testdən sonra həmin qalereyalar təmizlənməlidir.

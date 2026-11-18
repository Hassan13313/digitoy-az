#!/usr/bin/env python3
"""
DigiToy — albom videolarının çeviricisi (VPS üçün, 2026-11-18)

Qonaqların telefondan yüklədiyi videolar (4K / HEVC, 50–400 MB) albomda gec
açılır. Bu işçi hostinqdəki növbəni (api/video_worker.php) oxuyur, hər videonu
endirir, ffmpeg ilə yüngül baxış nüsxəsinə çevirir və geri yükləyir:
    <ad>_web.mp4  — H.264, uzun tərəf ≤1920 / qısa ≤1080, ~3–4 Mbit/s, faststart
    <ad>_poster.jpg — poster yoxdursa (ilk saniyədən kadr)
Orijinal hostinqdə olduğu kimi qalır (endirmə / ZIP). Yalnız Python stdlib + ffmpeg.

Mühit dəyişənləri (/etc/digitoy-worker.env):
    DT_API_BASE   https://digitoy.az/api
    DT_TOKEN      hostinqdəki api/config.worker.php › VIDEO_WORKER_TOKEN (≥32 simvol)
Bir dəfə işləyir və çıxır — systemd timer hər 2 dəqiqədən bir işə salır (install.sh).
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.parse
import urllib.request
import uuid

API = os.environ.get('DT_API_BASE', '').rstrip('/')
TOKEN = os.environ.get('DT_TOKEN', '')
MAX_UPLOAD = 100 * 1024 * 1024          # hostinq limiti (VW_MAX_BYTES)
SKIP_IF_SMALL_H264 = 25 * 1024 * 1024   # artıq yüngül H.264 → çevirməyə dəyməz
UA = 'DigiToy-VideoWorker/1.0'


def log(*a):
    print(time.strftime('%H:%M:%S'), *a, flush=True)


def api_get(action):
    req = urllib.request.Request(f'{API}/video_worker.php?action={action}',
                                 headers={'X-Worker-Token': TOKEN, 'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def api_post(action, fields, file_path=None, file_mime=None):
    boundary = uuid.uuid4().hex
    parts = []
    for k, v in fields.items():
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
    if file_path:
        with open(file_path, 'rb') as f:
            data = f.read()
        parts.append((f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{os.path.basename(file_path)}"\r\n'
                      f'Content-Type: {file_mime}\r\n\r\n').encode() + data + b'\r\n')
    parts.append(f'--{boundary}--\r\n'.encode())
    body = b''.join(parts)
    req = urllib.request.Request(f'{API}/video_worker.php?action={action}', data=body, method='POST',
                                 headers={'X-Worker-Token': TOKEN, 'User-Agent': UA,
                                          'Content-Type': f'multipart/form-data; boundary={boundary}'})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.load(r)


def probe(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                          'stream=codec_name,width,height:format=duration', '-of', 'json', path],
                         capture_output=True, text=True, timeout=60)
    info = json.loads(out.stdout or '{}')
    st = (info.get('streams') or [{}])[0]
    return st.get('codec_name'), int(st.get('width') or 0), int(st.get('height') or 0), float((info.get('format') or {}).get('duration') or 0)


def transcode(src, dst):
    # Uzun tərəf ≤1920, qısa tərəf uyğun (cüt piksel); telefonun fırlanma metadatası ffmpeg-də avtomatik tətbiq olunur
    vf = "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1920,ih))',format=yuv420p"
    cmd = ['ffmpeg', '-y', '-v', 'error', '-i', src, '-vf', vf,
           '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '26', '-maxrate', '4M', '-bufsize', '8M',
           '-profile:v', 'high', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-movflags', '+faststart', dst]
    subprocess.run(cmd, check=True, timeout=3600)


def poster(src, dst):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', '1', '-i', src, '-frames:v', '1',
                    '-vf', 'scale=480:-2', '-q:v', '4', dst], check=True, timeout=120)


def handle(item, work):
    name, slug = item['name'], item['slug']
    src = os.path.join(work, 'src_' + name)
    log('endirilir', slug, name, f"{item.get('size', 0) / 1048576:.1f} MB")
    urllib.request.urlretrieve(item['url'], src)
    codec, w, h, dur = probe(src)
    if not item.get('poster'):
        try:
            p = os.path.join(work, 'poster.jpg')
            poster(src, p)
            api_post('upload', {'slug': slug, 'name': name, 'kind': 'poster'}, p, 'image/jpeg')
        except Exception as e:  # poster vacib deyil
            log('poster alınmadı', e)
    if codec == 'h264' and max(w, h) <= 1920 and os.path.getsize(src) <= SKIP_IF_SMALL_H264:
        api_post('skip', {'slug': slug, 'name': name, 'reason': 'already-light h264'})
        log('ötürüldü (artıq yüngüldür)', name)
        return
    dst = os.path.join(work, 'web.mp4')
    transcode(src, dst)
    size = os.path.getsize(dst)
    if size > MAX_UPLOAD:
        api_post('skip', {'slug': slug, 'name': name, 'reason': f'web copy too big {size}'})
        log('ötürüldü (nüsxə çox böyük)', name, size)
        return
    api_post('upload', {'slug': slug, 'name': name, 'kind': 'web'}, dst, 'video/mp4')
    log('hazır', name, f'{os.path.getsize(src) / 1048576:.1f} → {size / 1048576:.1f} MB')


def main():
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')   # jurnal hər konsolda oxunsun
    except Exception:
        pass
    if not API or len(TOKEN) < 32:
        sys.exit('DT_API_BASE və DT_TOKEN (≥32 simvol) lazımdır')
    if not shutil.which('ffmpeg'):
        sys.exit('ffmpeg tapılmadı (apt install ffmpeg)')
    queue = api_get('queue').get('items', [])
    if not queue:
        return
    log('növbədə', len(queue), 'video')
    for item in queue:
        with tempfile.TemporaryDirectory(prefix='dtw_') as work:
            try:
                handle(item, work)
            except subprocess.CalledProcessError as e:
                log('çevirmə alınmadı', item['name'], e)
                try:
                    api_post('skip', {'slug': item['slug'], 'name': item['name'], 'reason': 'ffmpeg failed'})
                except Exception:
                    pass
            except Exception as e:  # şəbəkə və s. — növbəti dəfə yenidən cəhd
                log('xəta', item['name'], e)


if __name__ == '__main__':
    main()

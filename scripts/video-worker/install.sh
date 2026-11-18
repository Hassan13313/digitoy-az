#!/usr/bin/env bash
# DigiToy video çeviricisinin VPS-də quraşdırılması (Ubuntu 22.04/24.04) — 2026-11-18
#   sudo bash install.sh <TOKEN>
# TOKEN = hostinqdə api/config.worker.php faylındakı VIDEO_WORKER_TOKEN (≥32 simvol).
# Nəticə: hər 2 dəqiqədən bir işləyən systemd timer (digitoy-worker.timer),
# ayrıca istifadəçi (dtworker), firewall yalnız SSH.
set -euo pipefail
TOKEN="${1:-}"
if [ "${#TOKEN}" -lt 32 ]; then echo "İstifadə: sudo bash install.sh <TOKEN (≥32 simvol)>"; exit 1; fi

apt-get update -y
apt-get install -y ffmpeg python3 ufw unattended-upgrades
id dtworker >/dev/null 2>&1 || useradd --system --create-home --shell /usr/sbin/nologin dtworker

install -d -o dtworker -g dtworker /opt/digitoy-worker
install -m 0755 -o dtworker -g dtworker "$(dirname "$0")/worker.py" /opt/digitoy-worker/worker.py

umask 077
cat > /etc/digitoy-worker.env <<EOF
DT_API_BASE=https://digitoy.az/api
DT_TOKEN=${TOKEN}
EOF
chown root:dtworker /etc/digitoy-worker.env
chmod 0640 /etc/digitoy-worker.env

cat > /etc/systemd/system/digitoy-worker.service <<'EOF'
[Unit]
Description=DigiToy album video converter (one run)
After=network-online.target
[Service]
Type=oneshot
User=dtworker
EnvironmentFile=/etc/digitoy-worker.env
ExecStart=/usr/bin/flock -n /tmp/digitoy-worker.lock /usr/bin/python3 /opt/digitoy-worker/worker.py
Nice=10
TimeoutStartSec=3h
EOF

cat > /etc/systemd/system/digitoy-worker.timer <<'EOF'
[Unit]
Description=Run DigiToy video converter every 2 minutes
[Timer]
OnBootSec=1min
OnUnitActiveSec=2min
[Install]
WantedBy=timers.target
EOF

ufw allow OpenSSH
ufw --force enable
systemctl daemon-reload
systemctl enable --now digitoy-worker.timer
systemctl start digitoy-worker.service || true
echo "Hazırdır. Jurnal: journalctl -u digitoy-worker.service -f"

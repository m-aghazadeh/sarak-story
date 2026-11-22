#!/usr/bin/env bash
# Read-only snapshot of the server, run before any deploy so nothing that
# already lives there gets touched by accident. Changes nothing.
set -u
DOMAIN="${DOMAIN:-sarak.zarazoqi.ir}"

section() { printf '\n== %s\n' "$1"; }

section "os"
head -n 4 /etc/os-release 2>/dev/null; uname -m

section "listening tcp ports"
ss -ltnp 2>/dev/null | awk 'NR==1 || /LISTEN/'

section "services"
for s in nginx apache2 httpd caddy traefik haproxy docker sarak-story; do
  printf '%-12s %s\n' "$s" "$(systemctl is-active "$s" 2>/dev/null || true)"
done

section "binaries"
for b in nginx apache2 caddy docker certbot node npm pm2 curl tar; do
  printf '%-8s %s\n' "$b" "$(command -v "$b" || echo -)"
done
nginx -v 2>&1 || true
node -v 2>/dev/null || true
certbot --version 2>/dev/null || true

section "nginx layout"
ls -d /etc/nginx/sites-available /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null
nginx -t 2>&1 | tail -n 2 || true

section "nginx server blocks (server_name / listen only)"
nginx -T 2>/dev/null | grep -E '^# configuration file|^\s*(server_name|listen)\s' | sed 's/^\s*/  /' | head -n 200

section "anything already mentioning ${DOMAIN}"
nginx -T 2>/dev/null | grep -n "${DOMAIN}" || echo "  (none)"

section "tls certificates (names only)"
ls /etc/letsencrypt/live 2>/dev/null || echo "  (no /etc/letsencrypt/live)"
systemctl list-timers 2>/dev/null | grep -i certbot || true

section "firewall"
(command -v ufw >/dev/null && ufw status 2>/dev/null | head -n 20) || echo "  ufw not installed"

section "docker containers (name + ports)"
(command -v docker >/dev/null && docker ps --format '  {{.Names}}  {{.Ports}}' 2>/dev/null) || echo "  docker not installed"

section "pm2 processes"
(command -v pm2 >/dev/null && pm2 ls 2>/dev/null | head -n 30) || echo "  pm2 not installed"

section "sarak-story (previous deploy)"
ls -la /opt/sarak-story 2>/dev/null || echo "  (none)"
cat /etc/sarak-story.env 2>/dev/null || true

section "resources"
df -h / | tail -n 1
free -m | head -n 2

#!/usr/bin/env bash
# Install or update sarak-story on the VPS and serve it at https://$DOMAIN.
#
#   bash release.sh <bundle.tgz> <revision>
#
# Isolation from other projects on the same server:
# - app files live only in /opt/sarak-story, run by the system user "sarak";
# - the Node server listens on 127.0.0.1 on a free port (never 80/443);
# - nginx gets one extra site file for $DOMAIN only; every change is checked
#   with `nginx -t` and rolled back if the check fails; nginx is reloaded,
#   never restarted;
# - the certificate is issued with `certbot certonly --webroot`, so certbot
#   never edits any nginx file.
set -euo pipefail

BUNDLE="$1"
REV="${2:-manual}"
DOMAIN="${DOMAIN:-sarak.zarazoqi.ir}"
APP=/opt/sarak-story
SERVICE=sarak-story
RUN_USER=sarak
ENV_FILE=/etc/sarak-story.env
WEBROOT=/var/www/certbot
NODE_VERSION=v22.21.1

log() { printf '\n[release] %s\n' "$*"; }
die() { printf '\n[release] ERROR: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" = 0 ] || die "run as root"
[ -f "$BUNDLE" ] || die "bundle not found: $BUNDLE"

# --------------------------------------------------------------- web server
port_owner() { ss -ltnpH "sport = :$1" 2>/dev/null | grep -o 'users:(("[^"]*' | head -n1 | cut -d'"' -f2; }
OWNER80="$(port_owner 80 || true)"
OWNER443="$(port_owner 443 || true)"
log "port 80: ${OWNER80:-free} · port 443: ${OWNER443:-free}"
for o in "$OWNER80" "$OWNER443"; do
  if [ -n "$o" ] && [ "$o" != "nginx" ]; then
    die "ports 80/443 are served by '$o', not nginx. Stopping so the other projects are not touched."
  fi
done
if ! command -v nginx >/dev/null; then
  [ -z "$OWNER80$OWNER443" ] || die "nginx binary missing but ports are in use"
  log "installing nginx"
  apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx
fi
nginx -t >/dev/null 2>&1 || die "nginx config is already failing 'nginx -t' before any change; not touching it"

# --------------------------------------------------------------- node
NODE_BIN=""
if command -v node >/dev/null; then
  major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
  minor="$(node -p 'process.versions.node.split(".")[1]' 2>/dev/null || echo 0)"
  if [ "$major" -gt 20 ] || { [ "$major" -eq 20 ] && [ "$minor" -ge 9 ]; }; then
    NODE_BIN="$(command -v node)"
  fi
fi
if [ -z "$NODE_BIN" ]; then
  # Private Node runtime for this app only; the system Node (if any) is left alone.
  case "$(uname -m)" in
    x86_64) arch=x64 ;;
    aarch64) arch=arm64 ;;
    *) die "unsupported architecture $(uname -m)" ;;
  esac
  if [ ! -x "$APP/node/bin/node" ]; then
    log "installing private Node $NODE_VERSION into $APP/node"
    mkdir -p "$APP/node"
    curl -fsSL "https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-$arch.tar.xz" \
      | tar -xJ --strip-components=1 -C "$APP/node"
  fi
  NODE_BIN="$APP/node/bin/node"
fi
log "node: $NODE_BIN ($("$NODE_BIN" -v))"

# --------------------------------------------------------------- port
if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  . "$ENV_FILE"
fi
if [ -z "${PORT:-}" ]; then
  for p in $(seq 3107 3199); do
    if ! ss -ltnH "sport = :$p" | grep -q .; then PORT=$p; break; fi
  done
  [ -n "${PORT:-}" ] || die "no free port in 3107-3199"
  printf 'PORT=%s\nHOSTNAME=127.0.0.1\nNODE_ENV=production\n' "$PORT" > "$ENV_FILE"
fi
log "app port: 127.0.0.1:$PORT"

# --------------------------------------------------------------- release
id -u "$RUN_USER" >/dev/null 2>&1 || useradd --system --no-create-home --shell /usr/sbin/nologin "$RUN_USER"
REL="$APP/releases/$REV-$(date +%Y%m%d%H%M%S)"
mkdir -p "$REL"
tar -xzf "$BUNDLE" -C "$REL"
[ -f "$REL/server.js" ] || die "bundle has no server.js"
chown -R "$RUN_USER":"$RUN_USER" "$REL"
PREV="$(readlink -f "$APP/current" 2>/dev/null || true)"
ln -sfn "$REL" "$APP/current"

cat > /etc/systemd/system/$SERVICE.service <<UNIT
[Unit]
Description=sarak-story (Next.js) for $DOMAIN
After=network.target

[Service]
Type=simple
User=$RUN_USER
WorkingDirectory=$APP/current
EnvironmentFile=$ENV_FILE
ExecStart=$NODE_BIN $APP/current/server.js
Restart=always
RestartSec=3
NoNewPrivileges=true
ProtectSystem=full
PrivateTmp=true

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable --quiet "$SERVICE"
systemctl restart "$SERVICE"

ok=""
for _ in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/"; then ok=1; break; fi
  sleep 1
done
if [ -z "$ok" ]; then
  journalctl -u "$SERVICE" -n 40 --no-pager || true
  if [ -n "$PREV" ]; then ln -sfn "$PREV" "$APP/current"; systemctl restart "$SERVICE"; fi
  die "app did not answer on 127.0.0.1:$PORT (rolled back to previous release)"
fi
log "app is up"

# keep the three newest releases
ls -1dt "$APP"/releases/* 2>/dev/null | tail -n +4 | xargs -r rm -rf

# --------------------------------------------------------------- nginx site
if [ -d /etc/nginx/sites-available ] && [ -d /etc/nginx/sites-enabled ]; then
  SITE=/etc/nginx/sites-available/$DOMAIN.conf
  LINK=/etc/nginx/sites-enabled/$DOMAIN.conf
else
  SITE=/etc/nginx/conf.d/$DOMAIN.conf
  LINK=""
fi

# Refuse if another file already claims this domain.
if nginx -T 2>/dev/null \
   | awk -v a="$SITE:" -v b="${LINK:-none}:" '/^# configuration file/{cur=$4} /server_name/ && cur!=a && cur!=b {print}' \
   | grep -qw "$DOMAIN"; then
  die "another nginx file already has server_name $DOMAIN; not overriding it"
fi

IPV6=""
if nginx -T 2>/dev/null | grep -qE '^\s*listen\s+\[::\]'; then IPV6=1; fi
NGINX_VER="$(nginx -v 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo 0.0.0)"
http2_directive=""
listen443="listen 443 ssl;"
if printf '%s\n1.25.1\n' "$NGINX_VER" | sort -V -C 2>/dev/null; then
  : # older than 1.25.1
  listen443="listen 443 ssl http2;"
else
  http2_directive="http2 on;"
fi

proxy_block() {
  cat <<BLOCK
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
BLOCK
}

write_site() { # $1 = http-only | https
  {
    echo "# Managed by sarak-story/deploy/release.sh — only $DOMAIN."
    echo "server {"
    echo "    listen 80;"
    [ -n "$IPV6" ] && echo "    listen [::]:80;"
    echo "    server_name $DOMAIN;"
    echo "    location ^~ /.well-known/acme-challenge/ { root $WEBROOT; default_type text/plain; }"
    if [ "$1" = https ]; then
      echo "    location / { return 301 https://\$host\$request_uri; }"
    else
      proxy_block
    fi
    echo "}"
    if [ "$1" = https ]; then
      echo "server {"
      echo "    $listen443"
      [ -n "$IPV6" ] && echo "    ${listen443/443/[::]:443}"
      [ -n "$http2_directive" ] && echo "    $http2_directive"
      echo "    server_name $DOMAIN;"
      echo "    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;"
      echo "    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;"
      echo "    ssl_protocols TLSv1.2 TLSv1.3;"
      echo "    ssl_session_cache shared:sarak_ssl:5m;"
      echo "    add_header Strict-Transport-Security \"max-age=31536000\" always;"
      echo "    client_max_body_size 5m;"
      proxy_block
      echo "}"
    fi
  } > "$SITE.new"
}

apply_site() {
  local backup=""
  if [ -f "$SITE" ]; then backup="$SITE.bak"; cp -p "$SITE" "$backup"; fi
  mv "$SITE.new" "$SITE"
  [ -n "$LINK" ] && ln -sfn "$SITE" "$LINK"
  if ! nginx -t 2>/tmp/sarak-nginx-test.log; then
    cat /tmp/sarak-nginx-test.log >&2
    if [ -n "$backup" ]; then mv "$backup" "$SITE"; else rm -f "$SITE"; [ -n "$LINK" ] && rm -f "$LINK"; fi
    die "nginx -t failed; the sarak site file was rolled back and nginx was not reloaded"
  fi
  rm -f "$backup"
  systemctl reload nginx
}

mkdir -p "$WEBROOT"
CERT=/etc/letsencrypt/live/$DOMAIN/fullchain.pem
if [ ! -f "$CERT" ]; then
  log "nginx: serving $DOMAIN over http for the ACME challenge"
  write_site http-only
  apply_site

  if ! command -v certbot >/dev/null; then
    log "installing certbot"
    apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq certbot
  fi
  log "requesting Let's Encrypt certificate for $DOMAIN"
  certbot certonly --webroot -w "$WEBROOT" -d "$DOMAIN" \
    --non-interactive --agree-tos --register-unsafely-without-email \
    --deploy-hook "systemctl reload nginx"
fi

log "nginx: https site for $DOMAIN"
write_site https
apply_site

# --------------------------------------------------------------- verify
code="$(curl -sS -o /dev/null -w '%{http_code}' --resolve "$DOMAIN:443:127.0.0.1" "https://$DOMAIN/" || true)"
log "https://$DOMAIN/ via local nginx -> HTTP $code"
[ "$code" = 200 ] || die "unexpected status $code"
echo "[release] certificate: $(openssl x509 -in "$CERT" -noout -subject -enddate | tr '\n' ' ')"
log "done: $REL"

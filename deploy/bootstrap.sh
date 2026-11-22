#!/usr/bin/env bash
# One-command install/update on the VPS, for when GitHub Actions secrets are
# not set. Run as root on the server:
#
#   curl -fsSL https://raw.githubusercontent.com/m-aghazadeh/sarak-story/claude/dreamy-knuth-fhidkc/deploy/bootstrap.sh | bash
#
# It prints the read-only server snapshot (inspect.sh), clones/updates the
# public repo into /opt/sarak-story/src, builds with a private Node runtime
# (the system Node, if any, is not touched), then hands the bundle to
# release.sh, which does the isolated install + nginx site + certificate.
set -euo pipefail

REPO="${REPO:-https://github.com/m-aghazadeh/sarak-story.git}"
BRANCH="${BRANCH:-claude/dreamy-knuth-fhidkc}"
APP=/opt/sarak-story
SRC="$APP/src"
BUILD_NODE="$APP/build-node"
NODE_VERSION=v22.21.1
export DOMAIN="${DOMAIN:-sarak.zarazoqi.ir}"

log() { printf '\n[bootstrap] %s\n' "$*"; }
die() { printf '\n[bootstrap] ERROR: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" = 0 ] || die "run as root"
command -v curl >/dev/null || die "curl is required"

if ! command -v git >/dev/null; then
  log "installing git"
  apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq git
fi

mkdir -p "$APP"
if [ -d "$SRC/.git" ]; then
  log "updating $SRC"
  git -C "$SRC" fetch -q --depth 1 origin "$BRANCH"
  git -C "$SRC" reset -q --hard FETCH_HEAD
else
  log "cloning $REPO ($BRANCH)"
  git clone -q --depth 1 -b "$BRANCH" "$REPO" "$SRC"
fi
REV="$(git -C "$SRC" rev-parse --short HEAD)"

log "server snapshot (read-only)"
bash "$SRC/deploy/inspect.sh" || true

# Private Node used only for building.
if [ ! -x "$BUILD_NODE/bin/node" ]; then
  case "$(uname -m)" in
    x86_64) arch=x64 ;;
    aarch64) arch=arm64 ;;
    *) die "unsupported architecture $(uname -m)" ;;
  esac
  log "installing build Node $NODE_VERSION into $BUILD_NODE"
  mkdir -p "$BUILD_NODE"
  curl -fsSL "https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-$arch.tar.xz" \
    | tar -xJ --strip-components=1 -C "$BUILD_NODE"
fi
export PATH="$BUILD_NODE/bin:$PATH"
export NEXT_TELEMETRY_DISABLED=1

log "building (node $(node -v))"
cd "$SRC"
npm exec --yes pnpm@10.28.0 -- install --frozen-lockfile
npm exec --yes pnpm@10.28.0 -- build

BUNDLE_DIR="$(mktemp -d)"
cp -r .next/standalone/. "$BUNDLE_DIR/"
mkdir -p "$BUNDLE_DIR/.next"
cp -r .next/static "$BUNDLE_DIR/.next/static"
cp -r public "$BUNDLE_DIR/public"
tar -czf /tmp/sarak-story.tgz -C "$BUNDLE_DIR" .
rm -rf "$BUNDLE_DIR"

log "releasing $REV"
bash "$SRC/deploy/release.sh" /tmp/sarak-story.tgz "$REV"
rm -f /tmp/sarak-story.tgz
log "open https://$DOMAIN"

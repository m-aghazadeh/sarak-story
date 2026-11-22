# sarak-story

«سارک از نگاه داده» — an online presentation for the Sarak interview.

- Engine, kit and design system: from narian-story (see `Design.md`).
- Content: `content/decks/sarak.tsx`, built only from `content/decks/sarak-data.ts`.
- `/` opens the deck; it is also at `/decks/sarak`.

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build
```

Keys: ↓ ↑ Space PageUp PageDown Home End, ← → (RTL), `m` mutes.

## Deploy (VPS, https://sarak.zarazoqi.ir)

GitHub Actions → "Deploy to VPS" → Run workflow. Needs repository secrets
`SSH_HOST`, `SSH_USER`, `SSH_PASSWORD`.

- `inspect`: read-only snapshot of the server (`deploy/inspect.sh`).
- `deploy`: builds the standalone bundle and runs `deploy/release.sh` on the
  server. The app runs as its own systemd service (`sarak-story`) on
  127.0.0.1; nginx gets one site file for this domain only (checked with
  `nginx -t`, rolled back on failure); TLS via `certbot certonly --webroot`.

Without Actions secrets, run on the server as root (public repo):

```bash
curl -fsSL https://raw.githubusercontent.com/m-aghazadeh/sarak-story/claude/dreamy-knuth-fhidkc/deploy/bootstrap.sh | bash
```

It prints the read-only snapshot, builds with a private Node in
/opt/sarak-story, then runs the same `release.sh`.
